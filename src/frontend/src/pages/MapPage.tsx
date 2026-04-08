import { useCallback, useEffect, useRef, useState } from "react";
import { useAreas, useLeakIncidents, usePipes } from "../api/backend";
import type { Area, LeakIncident, PipeNetwork } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

interface CanvasPoint {
  x: number;
  y: number;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  leak: LeakIncident | null;
}

// ─── Coordinate projection helpers ───────────────────────────────────────────

function computeBBox(
  areas: Area[],
  pipes: PipeNetwork[],
  leaks: LeakIncident[],
): BBox {
  const lats: number[] = [
    ...areas.map((a) => a.latitude),
    ...pipes.flatMap((p) => [p.start_lat, p.end_lat]),
    ...leaks.map((l) => l.latitude),
  ];
  const lngs: number[] = [
    ...areas.map((a) => a.longitude),
    ...pipes.flatMap((p) => [p.start_lng, p.end_lng]),
    ...leaks.map((l) => l.longitude),
  ];

  if (lats.length === 0) {
    return { minLat: 18.5, maxLat: 19.5, minLng: 72.5, maxLng: 73.5 };
  }

  const pad = 0.08;
  return {
    minLat: Math.min(...lats) - pad,
    maxLat: Math.max(...lats) + pad,
    minLng: Math.min(...lngs) - pad,
    maxLng: Math.max(...lngs) + pad,
  };
}

function project(
  lat: number,
  lng: number,
  bbox: BBox,
  w: number,
  h: number,
): CanvasPoint {
  const x = ((lng - bbox.minLng) / (bbox.maxLng - bbox.minLng)) * w;
  const y = h - ((lat - bbox.minLat) / (bbox.maxLat - bbox.minLat)) * h;
  return { x, y };
}

// ─── Color helpers ────────────────────────────────────────────────────────────

function pipeColor(status: string): string {
  if (status === "Broken") return "#ef4444";
  if (status === "Maintenance") return "#f97316";
  return "#22c55e";
}

function leakColor(severity: string): string {
  if (severity === "Critical") return "#ef4444";
  if (severity === "Moderate") return "#f97316";
  return "#eab308";
}

// ─── Draw functions ───────────────────────────────────────────────────────────

function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(0,150,200,0.1)";
  ctx.lineWidth = 1;
  const cols = 12;
  const rows = 8;
  for (let i = 0; i <= cols; i++) {
    const x = (w / cols) * i;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let j = 0; j <= rows; j++) {
    const y = (h / rows) * j;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#e8f4f8");
  grad.addColorStop(1, "#d0eaf5");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

function drawAreas(
  ctx: CanvasRenderingContext2D,
  areas: Area[],
  bbox: BBox,
  w: number,
  h: number,
  scale: number,
) {
  const latSpan = bbox.maxLat - bbox.minLat;
  const pxPerDeg = h / latSpan;

  for (const area of areas) {
    const pt = project(area.latitude, area.longitude, bbox, w, h);
    const pop = Number(area.population);
    const radius = Math.max(20, (Math.sqrt(pop) / 50) * pxPerDeg * scale * 0.4);

    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,150,200,0.15)";
    ctx.fill();
    ctx.strokeStyle = "#0891b2";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Label
    ctx.save();
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.fillStyle = "#0e7490";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(area.area_name, pt.x, pt.y + radius + 4);
    ctx.restore();
  }
}

function drawPipes(
  ctx: CanvasRenderingContext2D,
  pipes: PipeNetwork[],
  bbox: BBox,
  w: number,
  h: number,
) {
  for (const pipe of pipes) {
    const start = project(pipe.start_lat, pipe.start_lng, bbox, w, h);
    const end = project(pipe.end_lat, pipe.end_lng, bbox, w, h);
    const color = pipeColor(pipe.status);
    const lineW = Math.max(2, Math.min(8, pipe.diameter * 0.4));

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineW;
    ctx.lineCap = "round";
    // Shadow glow
    ctx.shadowColor = color;
    ctx.shadowBlur = 4;
    ctx.stroke();
    ctx.restore();

    // Midpoint label
    const mx = (start.x + end.x) / 2;
    const my = (start.y + end.y) / 2;
    ctx.save();
    ctx.font = "10px system-ui, sans-serif";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`P#${Number(pipe.pipe_id)}`, mx, my - 8);
    ctx.restore();
  }
}

function drawLeaks(
  ctx: CanvasRenderingContext2D,
  leaks: LeakIncident[],
  bbox: BBox,
  w: number,
  h: number,
) {
  for (const leak of leaks) {
    const pt = project(leak.latitude, leak.longitude, bbox, w, h);
    const color = leakColor(leak.leak_severity);
    const alpha = leak.resolved_status ? 0.45 : 1;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Outer glow ring
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = `${color}30`;
    ctx.fill();

    // Inner circle
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pulse ring for unresolved critical
    if (!leak.resolved_status && leak.leak_severity === "Critical") {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 18, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MapPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: areas = [], isLoading: areasLoading } = useAreas();
  const { data: pipes = [], isLoading: pipesLoading } = usePipes();
  const { data: leaks = [], isLoading: leaksLoading } = useLeakIncidents();

  const isLoading = areasLoading || pipesLoading || leaksLoading;

  const [scale, setScale] = useState(1);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    leak: null,
  });

  // ─── Redraw canvas ──────────────────────────────────────────────────────────
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(scale, scale);
    ctx.translate(-w / 2, -h / 2);

    drawBackground(ctx, w, h);
    drawGrid(ctx, w, h);

    if (
      !isLoading &&
      (areas.length > 0 || pipes.length > 0 || leaks.length > 0)
    ) {
      const bbox = computeBBox(areas, pipes, leaks);
      drawAreas(ctx, areas, bbox, w, h, scale);
      drawPipes(ctx, pipes, bbox, w, h);
      drawLeaks(ctx, leaks, bbox, w, h);
    }

    ctx.restore();
  }, [areas, pipes, leaks, scale, isLoading]);

  // ─── Resize observer ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const obs = new ResizeObserver(() => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      redraw();
    });
    obs.observe(container);
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    return () => obs.disconnect();
  }, [redraw]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  // ─── Click handler for leak tooltips ────────────────────────────────────────
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || isLoading) return;

      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
      const my = (e.clientY - rect.top) * (canvas.height / rect.height);

      // Adjust for scale transform
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const canvasX = (mx - cx) / scale + cx;
      const canvasY = (my - cy) / scale + cy;

      const bbox = computeBBox(areas, pipes, leaks);
      const w = canvas.width;
      const h = canvas.height;

      let hit: LeakIncident | null = null;
      for (const leak of leaks) {
        const pt = project(leak.latitude, leak.longitude, bbox, w, h);
        const dist = Math.hypot(canvasX - pt.x, canvasY - pt.y);
        if (dist <= 15) {
          hit = leak;
          break;
        }
      }

      if (hit) {
        setTooltip({
          visible: true,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          leak: hit,
        });
      } else {
        setTooltip((t) => ({ ...t, visible: false }));
      }
    },
    [areas, pipes, leaks, scale, isLoading],
  );

  // ─── Zoom helpers ────────────────────────────────────────────────────────────
  const zoomIn = () => setScale((s) => Math.min(s * 1.25, 5));
  const zoomOut = () => setScale((s) => Math.max(s / 1.25, 0.4));
  const resetZoom = () => {
    setScale(1);
    setTooltip((t) => ({ ...t, visible: false }));
  };

  // ─── Stats ───────────────────────────────────────────────────────────────────
  const activeLeaks = leaks.filter((l) => !l.resolved_status).length;
  const brokenPipes = pipes.filter((p) => p.status === "Broken").length;

  return (
    <div
      className="flex flex-col h-full min-h-0"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      {/* Page header */}
      <div className="flex items-center justify-between px-6 py-3 bg-card border-b border-border flex-shrink-0">
        <div>
          <h1 className="text-xl font-display font-bold text-foreground">
            Network Map
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Interactive canvas map · pipes, areas &amp; leak incidents
          </p>
        </div>

        {/* Quick stats */}
        <div className="hidden sm:flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-chart-3 inline-block" />
            <span className="text-muted-foreground">{pipes.length} Pipes</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-primary inline-block" />
            <span className="text-muted-foreground">{areas.length} Areas</span>
          </span>
          {activeLeaks > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-destructive inline-block" />
              <span className="text-destructive font-semibold">
                {activeLeaks} Active Leaks
              </span>
            </span>
          )}
          {brokenPipes > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-destructive inline-block" />
              <span className="text-destructive font-semibold">
                {brokenPipes} Broken Pipes
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Canvas container */}
      <div
        className="relative flex-1 min-h-0 overflow-hidden"
        ref={containerRef}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onClick={handleCanvasClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setTooltip((t) => ({ ...t, visible: false }));
            }
          }}
          tabIndex={0}
          role="img"
          aria-label="Water network map showing pipes, areas, and leak incidents"
          data-ocid="map-canvas"
        />

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/80 backdrop-blur-sm">
            <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-3" />
            <p className="text-muted-foreground text-sm font-medium">
              Loading map data…
            </p>
          </div>
        )}

        {/* Zoom controls */}
        <div
          className="absolute left-4 bottom-6 flex flex-col gap-1"
          data-ocid="map-zoom-controls"
        >
          <button
            type="button"
            onClick={zoomIn}
            className="w-9 h-9 rounded-lg bg-card border border-border shadow-md flex items-center justify-center text-foreground hover:bg-muted transition-smooth font-bold text-lg"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={zoomOut}
            className="w-9 h-9 rounded-lg bg-card border border-border shadow-md flex items-center justify-center text-foreground hover:bg-muted transition-smooth font-bold text-lg"
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            type="button"
            onClick={resetZoom}
            className="w-9 h-9 rounded-lg bg-primary border border-primary/70 shadow-md flex items-center justify-center text-primary-foreground hover:opacity-90 transition-smooth text-xs font-semibold"
            aria-label="Center map"
            data-ocid="map-center-btn"
          >
            ⌖
          </button>
        </div>

        {/* Legend */}
        <div
          className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-md p-4 w-44 text-xs"
          data-ocid="map-legend"
        >
          <p className="font-semibold text-foreground mb-2 font-display">
            Legend
          </p>

          <p className="text-muted-foreground font-medium mb-1">Pipe Status</p>
          <div className="flex flex-col gap-1 mb-3">
            <LegendRow color="#22c55e" label="Normal" />
            <LegendRow color="#f97316" label="Maintenance" />
            <LegendRow color="#ef4444" label="Broken" shape="line" />
          </div>

          <p className="text-muted-foreground font-medium mb-1">
            Leak Severity
          </p>
          <div className="flex flex-col gap-1 mb-3">
            <LegendRow color="#ef4444" label="Critical" />
            <LegendRow color="#f97316" label="Moderate" />
            <LegendRow color="#eab308" label="Low" />
          </div>

          <p className="text-muted-foreground font-medium mb-1">Other</p>
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-5 h-5 rounded-full border-2 flex-shrink-0"
              style={{
                borderColor: "#0891b2",
                background: "rgba(0,150,200,0.15)",
              }}
            />
            <span className="text-foreground">Area boundary</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="inline-block w-5 h-2 rounded flex-shrink-0 opacity-40"
              style={{ background: "#ef4444" }}
            />
            <span className="text-foreground">Resolved leak</span>
          </div>
        </div>

        {/* Tooltip */}
        {tooltip.visible && tooltip.leak && (
          <div
            className="absolute z-10 pointer-events-none"
            style={{ left: tooltip.x + 16, top: tooltip.y - 16 }}
          >
            <LeakTooltip leak={tooltip.leak} />
          </div>
        )}

        {/* Click-to-dismiss tooltip */}
        {tooltip.visible && (
          <button
            type="button"
            className="absolute inset-0 w-full h-full cursor-crosshair bg-transparent border-0 p-0"
            style={{ zIndex: 5 }}
            onClick={() => setTooltip((t) => ({ ...t, visible: false }))}
            aria-label="Close tooltip"
          />
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LegendRow({
  color,
  label,
  shape = "dot",
}: {
  color: string;
  label: string;
  shape?: "dot" | "line";
}) {
  return (
    <div className="flex items-center gap-2">
      {shape === "line" ? (
        <span
          className="inline-block w-5 h-0.5 rounded flex-shrink-0"
          style={{ background: color }}
        />
      ) : (
        <span
          className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: color }}
        />
      )}
      <span className="text-foreground">{label}</span>
    </div>
  );
}

function LeakTooltip({ leak }: { leak: LeakIncident }) {
  const color = leakColor(leak.leak_severity);
  return (
    <div
      className="bg-card border border-border rounded-xl shadow-xl p-3 w-56 text-xs"
      style={{ zIndex: 20 }}
      data-ocid="map-leak-tooltip"
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ background: color }}
        />
        <span className="font-semibold text-foreground font-display">
          Leak #{Number(leak.leak_id)}
        </span>
        {leak.resolved_status ? (
          <span className="ml-auto px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px]">
            Resolved
          </span>
        ) : (
          <span
            className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] text-white"
            style={{ background: color }}
          >
            Active
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 text-muted-foreground">
        <div className="flex justify-between">
          <span>Severity</span>
          <span className="font-semibold text-foreground" style={{ color }}>
            {leak.leak_severity}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Pipe ID</span>
          <span className="font-medium text-foreground">
            P#{Number(leak.pipe_id)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Area ID</span>
          <span className="font-medium text-foreground">
            A#{Number(leak.area_id)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Reported</span>
          <span className="font-medium text-foreground truncate max-w-[110px]">
            {leak.reported_time.slice(0, 10)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Location</span>
          <span className="font-medium text-foreground">
            {leak.latitude.toFixed(4)}, {leak.longitude.toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
}
