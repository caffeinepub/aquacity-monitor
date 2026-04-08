import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle,
  Droplets,
  Gauge,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useDashboardStats, useRunAggregation } from "../api/backend";
import { StatusBadge } from "../components/StatusBadge";
import type { DashboardStats } from "../types";

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  accentClass: string;
  footer?: React.ReactNode;
  loading?: boolean;
}

function KpiCard({
  title,
  value,
  icon,
  accentClass,
  footer,
  loading,
}: KpiCardProps) {
  if (loading) {
    return (
      <div className="kpi-card flex flex-col gap-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>
    );
  }

  return (
    <div className={cn("kpi-card flex flex-col gap-2", accentClass)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        <span className="opacity-70">{icon}</span>
      </div>
      <p className="text-3xl font-display font-bold text-foreground leading-none">
        {value}
      </p>
      {footer && <div className="mt-1">{footer}</div>}
    </div>
  );
}

// ─── Shortage Risk Badge ───────────────────────────────────────────────────────

function ShortageRiskBadge({ risk }: { risk: boolean }) {
  if (risk) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border bg-red-100 text-red-800 border-red-300 animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
        YES — HIGH RISK
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border bg-emerald-100 text-emerald-800 border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
      NO — SAFE
    </span>
  );
}

// ─── System Status Banner ─────────────────────────────────────────────────────

function SystemStatusBanner({ stats }: { stats: DashboardStats }) {
  const isCritical = stats.shortage_risk || stats.active_leaks > 5n;
  const leakCount = Number(stats.active_leaks);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border px-5 py-4",
        isCritical
          ? "bg-red-50 border-red-200"
          : "bg-emerald-50 border-emerald-200",
      )}
      data-ocid="system-status-banner"
    >
      <div className="flex items-center gap-3">
        {isCritical ? (
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
        ) : (
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        )}
        <div>
          <p className="text-sm font-semibold text-foreground">
            Overall System Status
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {leakCount > 0
              ? `${leakCount} active leak${leakCount !== 1 ? "s" : ""} detected`
              : "System operating normally"}
          </p>
        </div>
      </div>
      <StatusBadge
        status={isCritical ? "Critical" : "Normal"}
        className="self-start sm:self-auto"
      />
    </div>
  );
}

// ─── ETL Aggregation Button ───────────────────────────────────────────────────

function AggregationButton() {
  const { mutate, isPending } = useRunAggregation();

  function handleAggregation() {
    mutate(undefined, {
      onSuccess: (result) => {
        const count = typeof result === "bigint" ? Number(result) : 0;
        toast.success(
          `Daily aggregation complete — ${count} area${count !== 1 ? "s" : ""} processed`,
        );
      },
      onError: (err) => {
        toast.error(
          `Aggregation failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      },
    });
  }

  return (
    <Button
      type="button"
      onClick={handleAggregation}
      disabled={isPending}
      className="flex items-center gap-2"
      data-ocid="run-aggregation-btn"
    >
      <RefreshCw className={cn("w-4 h-4", isPending && "animate-spin")} />
      {isPending ? "Running…" : "Run Daily Aggregation"}
    </Button>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  const leaksBigint = stats?.active_leaks ?? 0n;

  const todayUsage = stats
    ? `${stats.today_usage.toLocaleString("en-IN")} L`
    : "—";
  const avgPressure = stats ? `${stats.avg_pressure.toFixed(1)} bar` : "—";
  const activeLeaksStr = stats ? String(stats.active_leaks) : "—";

  return (
    <div className="space-y-6 px-1">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Live water distribution overview · auto-refreshes every 30 s
          </p>
        </div>
        <AggregationButton />
      </div>

      {/* KPI Cards Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        data-ocid="kpi-grid"
      >
        {/* Card 1: Today's Usage */}
        <KpiCard
          loading={isLoading}
          title="Today's Total Usage"
          value={todayUsage}
          icon={<Droplets className="w-5 h-5 text-cyan-500" />}
          accentClass="border-l-4 border-l-cyan-400"
          footer={
            <span className="text-xs text-muted-foreground">
              Liters consumed today
            </span>
          }
        />

        {/* Card 2: Avg Pressure */}
        <KpiCard
          loading={isLoading}
          title="Average Pressure"
          value={avgPressure}
          icon={<Gauge className="w-5 h-5 text-blue-500" />}
          accentClass="border-l-4 border-l-blue-400"
          footer={
            <span className="text-xs text-muted-foreground">
              Across all active pipes
            </span>
          }
        />

        {/* Card 3: Active Leaks */}
        <KpiCard
          loading={isLoading}
          title="Active Leaks"
          value={activeLeaksStr}
          icon={
            <AlertTriangle
              className={cn(
                "w-5 h-5",
                leaksBigint > 0n ? "text-red-500" : "text-emerald-500",
              )}
            />
          }
          accentClass={
            leaksBigint > 0n
              ? "border-l-4 border-l-red-400"
              : "border-l-4 border-l-emerald-400"
          }
          footer={
            stats && (
              <StatusBadge status={leaksBigint > 0n ? "Critical" : "Normal"} />
            )
          }
        />

        {/* Card 4: Shortage Risk */}
        <KpiCard
          loading={isLoading}
          title="Shortage Risk"
          value={stats ? (stats.shortage_risk ? "HIGH" : "SAFE") : "—"}
          icon={
            <ShieldAlert
              className={cn(
                "w-5 h-5",
                stats?.shortage_risk ? "text-red-500" : "text-emerald-500",
              )}
            />
          }
          accentClass={
            stats?.shortage_risk
              ? "border-l-4 border-l-red-400"
              : "border-l-4 border-l-emerald-400"
          }
          footer={stats && <ShortageRiskBadge risk={stats.shortage_risk} />}
        />
      </div>

      {/* System Status Section */}
      {isLoading ? (
        <Skeleton className="h-[76px] w-full rounded-lg" />
      ) : (
        stats && <SystemStatusBanner stats={stats} />
      )}

      {/* Quick Reference Footer */}
      <div className="rounded-lg border border-border bg-muted/40 px-5 py-4">
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3">
          Quick Reference
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">
              Status threshold
            </span>
            <span className="text-foreground font-medium">
              Active leaks &gt; 5 → Critical
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">
              Safe pressure range
            </span>
            <span className="text-foreground font-medium">2.0 – 6.0 bar</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">
              Daily aggregation
            </span>
            <span className="text-foreground font-medium">
              Run manually before generating reports
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
