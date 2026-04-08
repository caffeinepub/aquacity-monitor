import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { FileText, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useDailyReports, useRunAggregation } from "../api/backend";
import type { DailyReport } from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

// ─── Table Row ────────────────────────────────────────────────────────────────

function ReportRow({ report }: { report: DailyReport }) {
  return (
    <TableRow
      data-ocid={`report-row-${report.report_id}`}
      className="hover:bg-muted/40 transition-colors"
    >
      <TableCell className="font-mono text-sm text-muted-foreground">
        #{String(report.report_id)}
      </TableCell>
      <TableCell className="font-mono text-sm">
        {String(report.area_id)}
      </TableCell>
      <TableCell>{formatDate(report.report_date)}</TableCell>
      <TableCell className="text-right font-semibold tabular-nums">
        {report.total_usage.toLocaleString("en-IN")} L
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {String(report.reading_count)}
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {formatDate(report.generated_at)}
      </TableCell>
    </TableRow>
  );
}

// ─── Loading Skeletons ────────────────────────────────────────────────────────

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows
        <TableRow key={i}>
          {Array.from({ length: 6 }).map((__, j) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton cells
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ─── Aggregation Button ───────────────────────────────────────────────────────

function RunAggregationButton() {
  const { mutate, isPending } = useRunAggregation();

  function handleRun() {
    mutate(undefined, {
      onSuccess: (result) => {
        const count = typeof result === "bigint" ? Number(result) : 0;
        toast.success(
          `Aggregation complete — ${count} area${count !== 1 ? "s" : ""} processed`,
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
      onClick={handleRun}
      disabled={isPending}
      className="flex items-center gap-2"
      data-ocid="run-aggregation-btn-reports"
    >
      <RefreshCw className={cn("w-4 h-4", isPending && "animate-spin")} />
      {isPending ? "Running…" : "Run Daily Aggregation"}
    </Button>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <TableRow>
      <TableCell
        colSpan={6}
        className="h-48 text-center"
        data-ocid="reports-empty-state"
      >
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <FileText className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              No reports yet
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Run Daily Aggregation from the Dashboard or use the button above
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Reports Page ─────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const { data: reports, isLoading } = useDailyReports();

  const sorted = reports
    ? [...reports].sort((a, b) => b.report_date.localeCompare(a.report_date))
    : [];

  return (
    <div className="space-y-6 px-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Daily Reports
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Aggregated daily water usage summaries per area
          </p>
        </div>
        <RunAggregationButton />
      </div>

      {/* Summary Cards */}
      {!isLoading && reports && reports.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Total Reports
            </p>
            <p className="text-3xl font-display font-bold text-foreground">
              {reports.length}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Total Usage (All)
            </p>
            <p className="text-3xl font-display font-bold text-foreground">
              {reports
                .reduce((sum, r) => sum + r.total_usage, 0)
                .toLocaleString("en-IN")}{" "}
              <span className="text-base font-normal text-muted-foreground">
                L
              </span>
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Latest Report
            </p>
            <p className="text-xl font-display font-bold text-foreground">
              {formatDate(sorted[0]?.report_date ?? "")}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-24">Report ID</TableHead>
                <TableHead className="w-24">Area ID</TableHead>
                <TableHead>Report Date</TableHead>
                <TableHead className="text-right">Total Usage (L)</TableHead>
                <TableHead className="text-right">Reading Count</TableHead>
                <TableHead>Generated At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <LoadingRows />
              ) : sorted.length === 0 ? (
                <EmptyState />
              ) : (
                sorted.map((report) => (
                  <ReportRow key={String(report.report_id)} report={report} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {!isLoading && sorted.length > 0 && (
        <p className="text-xs text-muted-foreground text-right">
          Showing {sorted.length} report{sorted.length !== 1 ? "s" : ""} ·
          sorted by most recent
        </p>
      )}
    </div>
  );
}
