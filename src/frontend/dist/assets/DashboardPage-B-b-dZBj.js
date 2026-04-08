import { c as createLucideIcon, j as jsxRuntimeExports, D as Droplets, G as Gauge, a as cn, B as Button, u as ue } from "./index-CHPH9FnK.js";
import { S as Skeleton } from "./skeleton-DFKPQCXb.js";
import { u as useDashboardStats, a as useRunAggregation } from "./backend-D4bDWURE.js";
import { S as StatusBadge, T as TriangleAlert } from "./StatusBadge-C-yymLtK.js";
import { R as RefreshCw } from "./refresh-cw-DZeS1QOJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
];
const ShieldAlert = createLucideIcon("shield-alert", __iconNode);
function KpiCard({
  title,
  value,
  icon,
  accentClass,
  footer,
  loading
}) {
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kpi-card flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("kpi-card flex flex-col gap-2", accentClass), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-70", children: icon })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-display font-bold text-foreground leading-none", children: value }),
    footer && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: footer })
  ] });
}
function ShortageRiskBadge({ risk }) {
  if (risk) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border bg-red-100 text-red-800 border-red-300 animate-pulse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" }),
      "YES — HIGH RISK"
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border bg-emerald-100 text-emerald-800 border-emerald-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" }),
    "NO — SAFE"
  ] });
}
function SystemStatusBanner({ stats }) {
  const isCritical = stats.shortage_risk || stats.active_leaks > 5n;
  const leakCount = Number(stats.active_leaks);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border px-5 py-4",
        isCritical ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"
      ),
      "data-ocid": "system-status-banner",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          isCritical ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-red-600 flex-shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-5 h-5 text-emerald-600 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Overall System Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: leakCount > 0 ? `${leakCount} active leak${leakCount !== 1 ? "s" : ""} detected` : "System operating normally" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatusBadge,
          {
            status: isCritical ? "Critical" : "Normal",
            className: "self-start sm:self-auto"
          }
        )
      ]
    }
  );
}
function AggregationButton() {
  const { mutate, isPending } = useRunAggregation();
  function handleAggregation() {
    mutate(void 0, {
      onSuccess: (result) => {
        const count = typeof result === "bigint" ? Number(result) : 0;
        ue.success(
          `Daily aggregation complete — ${count} area${count !== 1 ? "s" : ""} processed`
        );
      },
      onError: (err) => {
        ue.error(
          `Aggregation failed: ${err instanceof Error ? err.message : "Unknown error"}`
        );
      }
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      type: "button",
      onClick: handleAggregation,
      disabled: isPending,
      className: "flex items-center gap-2",
      "data-ocid": "run-aggregation-btn",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("w-4 h-4", isPending && "animate-spin") }),
        isPending ? "Running…" : "Run Daily Aggregation"
      ]
    }
  );
}
function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();
  const leaksBigint = (stats == null ? void 0 : stats.active_leaks) ?? 0n;
  const todayUsage = stats ? `${stats.today_usage.toLocaleString("en-IN")} L` : "—";
  const avgPressure = stats ? `${stats.avg_pressure.toFixed(1)} bar` : "—";
  const activeLeaksStr = stats ? String(stats.active_leaks) : "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 px-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Live water distribution overview · auto-refreshes every 30 s" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AggregationButton, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
        "data-ocid": "kpi-grid",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            KpiCard,
            {
              loading: isLoading,
              title: "Today's Total Usage",
              value: todayUsage,
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Droplets, { className: "w-5 h-5 text-cyan-500" }),
              accentClass: "border-l-4 border-l-cyan-400",
              footer: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Liters consumed today" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            KpiCard,
            {
              loading: isLoading,
              title: "Average Pressure",
              value: avgPressure,
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "w-5 h-5 text-blue-500" }),
              accentClass: "border-l-4 border-l-blue-400",
              footer: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Across all active pipes" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            KpiCard,
            {
              loading: isLoading,
              title: "Active Leaks",
              value: activeLeaksStr,
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(
                TriangleAlert,
                {
                  className: cn(
                    "w-5 h-5",
                    leaksBigint > 0n ? "text-red-500" : "text-emerald-500"
                  )
                }
              ),
              accentClass: leaksBigint > 0n ? "border-l-4 border-l-red-400" : "border-l-4 border-l-emerald-400",
              footer: stats && /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: leaksBigint > 0n ? "Critical" : "Normal" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            KpiCard,
            {
              loading: isLoading,
              title: "Shortage Risk",
              value: stats ? stats.shortage_risk ? "HIGH" : "SAFE" : "—",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ShieldAlert,
                {
                  className: cn(
                    "w-5 h-5",
                    (stats == null ? void 0 : stats.shortage_risk) ? "text-red-500" : "text-emerald-500"
                  )
                }
              ),
              accentClass: (stats == null ? void 0 : stats.shortage_risk) ? "border-l-4 border-l-red-400" : "border-l-4 border-l-emerald-400",
              footer: stats && /* @__PURE__ */ jsxRuntimeExports.jsx(ShortageRiskBadge, { risk: stats.shortage_risk })
            }
          )
        ]
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[76px] w-full rounded-lg" }) : stats && /* @__PURE__ */ jsxRuntimeExports.jsx(SystemStatusBanner, { stats }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/40 px-5 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3", children: "Quick Reference" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Status threshold" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "Active leaks > 5 → Critical" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Safe pressure range" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "2.0 – 6.0 bar" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Daily aggregation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "Run manually before generating reports" })
        ] })
      ] })
    ] })
  ] });
}
export {
  DashboardPage as default
};
