import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Gauge, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useAddPressureLog,
  useDeletePressureLog,
  usePipes,
  usePressureLogs,
  useUpdatePressureLog,
} from "../api/backend";
import { ConfirmDialog } from "../components/ConfirmDialog";
import type { PressureLog } from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDatetimeLocal(iso: string): string {
  if (!iso) return "";
  // Accept "YYYY-MM-DDTHH:MM" or full ISO
  return iso.length > 16 ? iso.slice(0, 16) : iso;
}

function defaultDateFrom(): string {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  // Use template literal to build ISO date string
  return `${d.toISOString().slice(0, 10)}`;
}

function defaultDateTo(): string {
  return new Date().toISOString().slice(0, 10);
}

function nowDatetimeLocal(): string {
  return new Date().toISOString().slice(0, 16);
}

function pressureColor(val: number): string {
  if (val < 2.0) return "text-destructive font-semibold";
  if (val <= 4.0) return "text-chart-3 font-semibold";
  return "text-chart-4 font-semibold";
}

function pressureLabel(val: number): string {
  if (val < 2.0) return "Low";
  if (val <= 4.0) return "Normal";
  return "High";
}

function pressureBadgeVariant(
  val: number,
): "destructive" | "secondary" | "outline" {
  if (val < 2.0) return "destructive";
  if (val <= 4.0) return "secondary";
  return "outline";
}

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  pipe_id: string;
  pressure_value: string;
  recorded_at: string;
}

const emptyForm = (): FormState => ({
  pipe_id: "",
  pressure_value: "",
  recorded_at: nowDatetimeLocal(),
});

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PressurePage() {
  // ── Filter state
  const [filterPipeId, setFilterPipeId] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>(defaultDateFrom());
  const [dateTo, setDateTo] = useState<string>(defaultDateTo());

  // ── Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PressureLog | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  // ── Data
  const pipeQueryId = filterPipeId === "all" ? undefined : BigInt(filterPipeId);
  const { data: logs = [], isLoading: logsLoading } =
    usePressureLogs(pipeQueryId);
  const { data: pipes = [] } = usePipes();

  const addLog = useAddPressureLog();
  const updateLog = useUpdatePressureLog();
  const deleteLog = useDeletePressureLog();

  // ── Client-side date filter
  const filteredLogs = useMemo(() => {
    const from = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const to = dateTo ? new Date(`${dateTo}T23:59:59`) : null;
    return logs.filter((log) => {
      const recorded = new Date(log.recorded_at);
      if (from && recorded < from) return false;
      if (to && recorded > to) return false;
      return true;
    });
  }, [logs, dateFrom, dateTo]);

  // ── Sort by recorded_at desc
  const sortedLogs = useMemo(
    () =>
      [...filteredLogs].sort((a, b) =>
        a.recorded_at < b.recorded_at ? 1 : -1,
      ),
    [filteredLogs],
  );

  // ── Modal helpers
  function openAdd() {
    setEditTarget(null);
    setForm(emptyForm());
    setModalOpen(true);
  }

  function openEdit(log: PressureLog) {
    setEditTarget(log);
    setForm({
      pipe_id: log.pipe_id.toString(),
      pressure_value: log.pressure_value.toString(),
      recorded_at: toDatetimeLocal(log.recorded_at),
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
    setForm(emptyForm());
  }

  function handleSubmit() {
    const pipeId = BigInt(form.pipe_id);
    const value = Number.parseFloat(form.pressure_value);
    if (!form.pipe_id || Number.isNaN(value) || !form.recorded_at) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (editTarget) {
      updateLog.mutate(
        {
          id: editTarget.pressure_id,
          pipe_id: pipeId,
          value,
          recorded_at: form.recorded_at,
        },
        {
          onSuccess: () => {
            toast.success("Pressure log updated.");
            closeModal();
          },
          onError: () => toast.error("Failed to update pressure log."),
        },
      );
    } else {
      addLog.mutate(
        { pipe_id: pipeId, value, recorded_at: form.recorded_at },
        {
          onSuccess: () => {
            toast.success("Pressure log added.");
            closeModal();
          },
          onError: () => toast.error("Failed to add pressure log."),
        },
      );
    }
  }

  function handleDelete() {
    if (deleteId === null) return;
    deleteLog.mutate(deleteId, {
      onSuccess: () => {
        toast.success("Pressure log deleted.");
        setDeleteId(null);
      },
      onError: () => toast.error("Failed to delete pressure log."),
    });
  }

  const isBusy = addLog.isPending || updateLog.isPending;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Gauge className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Pressure Logs
            </h1>
            <p className="text-sm text-muted-foreground">
              Monitor pipe pressure readings across the network
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={openAdd}
          className="gap-2"
          data-ocid="pressure-add-btn"
        >
          <PlusCircle className="h-4 w-4" />
          Add Pressure Log
        </Button>
      </div>

      {/* ── Filter Bar ── */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Pipe filter */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="filter-pipe"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              Filter by Pipe
            </Label>
            <Select
              value={filterPipeId}
              onValueChange={(v) => setFilterPipeId(v)}
            >
              <SelectTrigger id="filter-pipe" data-ocid="pressure-filter-pipe">
                <SelectValue placeholder="All Pipes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pipes</SelectItem>
                {pipes.map((pipe) => (
                  <SelectItem
                    key={pipe.pipe_id.toString()}
                    value={pipe.pipe_id.toString()}
                  >
                    Pipe #{pipe.pipe_id.toString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date From */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="date-from"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              Date From
            </Label>
            <Input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              data-ocid="pressure-filter-from"
            />
          </div>

          {/* Date To */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="date-to"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              Date To
            </Label>
            <Input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              data-ocid="pressure-filter-to"
            />
          </div>
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-4 py-3 flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">
            {logsLoading
              ? "Loading…"
              : `${sortedLogs.length} record${sortedLogs.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-24">Log ID</TableHead>
                <TableHead className="w-28">Pipe ID</TableHead>
                <TableHead>Pressure (bar)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recorded At</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logsLoading ? (
                ["s1", "s2", "s3", "s4", "s5"].map((sk) => (
                  <TableRow key={sk}>
                    {["c1", "c2", "c3", "c4", "c5", "c6"].map((ck) => (
                      <TableCell key={`${sk}-${ck}`}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : sortedLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center">
                    <div
                      className="flex flex-col items-center gap-3"
                      data-ocid="pressure-empty-state"
                    >
                      <Gauge className="h-10 w-10 text-muted-foreground/40" />
                      <p className="text-muted-foreground font-medium">
                        No pressure logs found
                      </p>
                      <p className="text-sm text-muted-foreground/70">
                        Adjust the filters or add a new pressure log.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={openAdd}
                      >
                        <PlusCircle className="h-4 w-4 mr-1.5" />
                        Add Pressure Log
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedLogs.map((log) => (
                  <TableRow
                    key={log.pressure_id.toString()}
                    className="hover:bg-muted/30 transition-colors"
                    data-ocid={`pressure-row-${log.pressure_id}`}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{log.pressure_id.toString()}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Pipe #{log.pipe_id.toString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={pressureColor(log.pressure_value)}>
                        {log.pressure_value.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={pressureBadgeVariant(log.pressure_value)}>
                        {pressureLabel(log.pressure_value)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(log.recorded_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => openEdit(log)}
                          aria-label="Edit pressure log"
                          data-ocid={`pressure-edit-${log.pressure_id}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteId(log.pressure_id)}
                          aria-label="Delete pressure log"
                          data-ocid={`pressure-delete-${log.pressure_id}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      <Dialog
        open={modalOpen}
        onOpenChange={(o) => {
          if (!o) closeModal();
        }}
      >
        <DialogContent className="sm:max-w-md" data-ocid="pressure-modal">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editTarget ? "Edit Pressure Log" : "Add Pressure Log"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            {/* Pipe */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="modal-pipe">
                Pipe <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.pipe_id}
                onValueChange={(v) => setForm((f) => ({ ...f, pipe_id: v }))}
              >
                <SelectTrigger id="modal-pipe" data-ocid="pressure-modal-pipe">
                  <SelectValue placeholder="Select a pipe…" />
                </SelectTrigger>
                <SelectContent>
                  {pipes.map((pipe) => (
                    <SelectItem
                      key={pipe.pipe_id.toString()}
                      value={pipe.pipe_id.toString()}
                    >
                      Pipe #{pipe.pipe_id.toString()} — ⌀{pipe.diameter} mm (
                      {pipe.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pressure Value */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="modal-pressure">
                Pressure Value (bar) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="modal-pressure"
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 3.5"
                value={form.pressure_value}
                onChange={(e) =>
                  setForm((f) => ({ ...f, pressure_value: e.target.value }))
                }
                data-ocid="pressure-modal-value"
              />
              {form.pressure_value &&
                !Number.isNaN(Number.parseFloat(form.pressure_value)) && (
                  <p
                    className={`text-xs ${pressureColor(Number.parseFloat(form.pressure_value))}`}
                  >
                    {pressureLabel(Number.parseFloat(form.pressure_value))}{" "}
                    pressure
                    {Number.parseFloat(form.pressure_value) < 2.0 &&
                      " — may indicate a leak or supply issue"}
                    {Number.parseFloat(form.pressure_value) > 4.0 &&
                      " — may cause pipe stress"}
                  </p>
                )}
            </div>

            {/* Recorded At */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="modal-recorded">
                Recorded At <span className="text-destructive">*</span>
              </Label>
              <Input
                id="modal-recorded"
                type="datetime-local"
                value={form.recorded_at}
                onChange={(e) =>
                  setForm((f) => ({ ...f, recorded_at: e.target.value }))
                }
                data-ocid="pressure-modal-recorded-at"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              disabled={isBusy}
              data-ocid="pressure-modal-cancel"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={
                isBusy ||
                !form.pipe_id ||
                !form.pressure_value ||
                !form.recorded_at
              }
              data-ocid="pressure-modal-submit"
            >
              {isBusy ? "Saving…" : editTarget ? "Update Log" : "Add Log"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm ── */}
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(o) => {
          if (!o) setDeleteId(null);
        }}
        title="Delete Pressure Log"
        description="This will permanently remove the pressure log entry. This action cannot be undone."
        confirmLabel={deleteLog.isPending ? "Deleting…" : "Delete"}
        onConfirm={handleDelete}
        data-ocid="pressure-confirm-dialog"
      />
    </div>
  );
}
