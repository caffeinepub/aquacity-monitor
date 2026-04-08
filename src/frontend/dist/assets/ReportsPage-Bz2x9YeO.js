import { j as jsxRuntimeExports, B as Button, a as cn, F as FileText, u as ue } from "./index-CHPH9FnK.js";
import { S as Skeleton } from "./skeleton-DFKPQCXb.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Ca8HfIOI.js";
import { t as useDailyReports, a as useRunAggregation } from "./backend-D4bDWURE.js";
import { R as RefreshCw } from "./refresh-cw-DZeS1QOJ.js";
function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit"
    });
  } catch {
    return dateStr;
  }
}
function ReportRow({ report }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    TableRow,
    {
      "data-ocid": `report-row-${report.report_id}`,
      className: "hover:bg-muted/40 transition-colors",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-mono text-sm text-muted-foreground", children: [
          "#",
          String(report.report_id)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-sm", children: String(report.area_id) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatDate(report.report_date) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right font-semibold tabular-nums", children: [
          report.total_usage.toLocaleString("en-IN"),
          " L"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right tabular-nums", children: String(report.reading_count) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground text-sm", children: formatDate(report.generated_at) })
      ]
    }
  );
}
function LoadingRows() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: Array.from({ length: 6 }).map((_, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: Array.from({ length: 6 }).map((__, j) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton cells
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, j)
    )) }, i)
  )) });
}
function RunAggregationButton() {
  const { mutate, isPending } = useRunAggregation();
  function handleRun() {
    mutate(void 0, {
      onSuccess: (result) => {
        const count = typeof result === "bigint" ? Number(result) : 0;
        ue.success(
          `Aggregation complete — ${count} area${count !== 1 ? "s" : ""} processed`
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
      onClick: handleRun,
      disabled: isPending,
      className: "flex items-center gap-2",
      "data-ocid": "run-aggregation-btn-reports",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("w-4 h-4", isPending && "animate-spin") }),
        isPending ? "Running…" : "Run Daily Aggregation"
      ]
    }
  );
}
function EmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    TableCell,
    {
      colSpan: 6,
      className: "h-48 text-center",
      "data-ocid": "reports-empty-state",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-6 h-6 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "No reports yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Run Daily Aggregation from the Dashboard or use the button above" })
        ] })
      ] })
    }
  ) });
}
function ReportsPage() {
  var _a;
  const { data: reports, isLoading } = useDailyReports();
  const sorted = reports ? [...reports].sort((a, b) => b.report_date.localeCompare(a.report_date)) : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 px-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Daily Reports" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Aggregated daily water usage summaries per area" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RunAggregationButton, {})
    ] }),
    !isLoading && reports && reports.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card px-5 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1", children: "Total Reports" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-display font-bold text-foreground", children: reports.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card px-5 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1", children: "Total Usage (All)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-display font-bold text-foreground", children: [
          reports.reduce((sum, r) => sum + r.total_usage, 0).toLocaleString("en-IN"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-normal text-muted-foreground", children: "L" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card px-5 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1", children: "Latest Report" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-display font-bold text-foreground", children: formatDate(((_a = sorted[0]) == null ? void 0 : _a.report_date) ?? "") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/40 hover:bg-muted/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-24", children: "Report ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-24", children: "Area ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Report Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Total Usage (L)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Reading Count" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Generated At" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingRows, {}) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {}) : sorted.map((report) => /* @__PURE__ */ jsxRuntimeExports.jsx(ReportRow, { report }, String(report.report_id))) })
    ] }) }) }),
    !isLoading && sorted.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [
      "Showing ",
      sorted.length,
      " report",
      sorted.length !== 1 ? "s" : "",
      " · sorted by most recent"
    ] })
  ] });
}
export {
  ReportsPage as default
};
