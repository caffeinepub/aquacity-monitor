import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  AlertTriangle,
  Droplets,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useAddLeakIncident,
  useAreas,
  useDeleteLeakIncident,
  useLeakIncidents,
  usePipes,
  useToggleLeakResolved,
  useUpdateLeakIncident,
} from "../api/backend";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { StatusBadge } from "../components/StatusBadge";
import type { LeakIncident } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

type SeverityFilter = "All" | "Critical" | "Moderate" | "Low";
type StatusFilter = "All" | "Unresolved" | "Resolved";

interface FormState {
  pipe_id: string;
  area_id: string;
  severity: string;
  reported_time: string;
  latitude: string;
  longitude: string;
  resolved: boolean;
}

const DEFAULT_FORM: FormState = {
  pipe_id: "",
  area_id: "",
  severity: "",
  reported_time: new Date().toISOString().slice(0, 16),
  latitude: "",
  longitude: "",
  resolved: false,
};

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar({ leaks }: { leaks: LeakIncident[] }) {
  const total = leaks.length;
  const critical = leaks.filter((l) => l.leak_severity === "Critical").length;
  const unresolved = leaks.filter((l) => !l.resolved_status).length;

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
        <Droplets className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">
          <span className="font-bold text-primary">{total}</span> total
        </span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-red-200">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-sm font-medium text-foreground">
          <span className="font-bold text-red-600">{critical}</span> critical
        </span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-orange-200">
        <AlertTriangle className="w-4 h-4 text-orange-500" />
        <span className="text-sm font-medium text-foreground">
          <span className="font-bold text-orange-600">{unresolved}</span>{" "}
          unresolved
        </span>
      </div>
    </div>
  );
}

// ─── Leak Form Modal ──────────────────────────────────────────────────────────

interface LeakModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: LeakIncident | null;
  onClose: () => void;
}

function LeakModal({ open, onOpenChange, editing, onClose }: LeakModalProps) {
  const { data: areas = [] } = useAreas();
  const { data: pipes = [] } = usePipes();
  const addMutation = useAddLeakIncident();
  const updateMutation = useUpdateLeakIncident();

  const [form, setForm] = useState<FormState>(() =>
    editing
      ? {
          pipe_id: editing.pipe_id.toString(),
          area_id: editing.area_id.toString(),
          severity: editing.leak_severity,
          reported_time: editing.reported_time.slice(0, 16),
          latitude: editing.latitude.toString(),
          longitude: editing.longitude.toString(),
          resolved: editing.resolved_status,
        }
      : DEFAULT_FORM,
  );

  // Reset form when editing changes
  useMemo(() => {
    if (editing) {
      setForm({
        pipe_id: editing.pipe_id.toString(),
        area_id: editing.area_id.toString(),
        severity: editing.leak_severity,
        reported_time: editing.reported_time.slice(0, 16),
        latitude: editing.latitude.toString(),
        longitude: editing.longitude.toString(),
        resolved: editing.resolved_status,
      });
    } else {
      setForm(DEFAULT_FORM);
    }
  }, [editing]);

  const isLoading = addMutation.isPending || updateMutation.isPending;

  function set(field: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (
      !form.pipe_id ||
      !form.area_id ||
      !form.severity ||
      !form.reported_time ||
      !form.latitude ||
      !form.longitude
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const payload = {
      pipe_id: BigInt(form.pipe_id),
      area_id: BigInt(form.area_id),
      severity: form.severity,
      reported_time: form.reported_time,
      resolved: form.resolved,
      lat: Number.parseFloat(form.latitude),
      lng: Number.parseFloat(form.longitude),
    };
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.leak_id, ...payload });
        toast.success("Leak incident updated.");
      } else {
        await addMutation.mutateAsync(payload);
        toast.success("Leak incident added.");
      }
      onClose();
    } catch {
      toast.error("Failed to save incident. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Leak Incident" : "Add Leak Incident"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          {/* Pipe */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label htmlFor="leak-pipe">Pipe *</Label>
            <Select
              value={form.pipe_id}
              onValueChange={(v) => set("pipe_id", v)}
            >
              <SelectTrigger id="leak-pipe" data-ocid="leak-form-pipe">
                <SelectValue placeholder="Select pipe…" />
              </SelectTrigger>
              <SelectContent>
                {pipes.map((p) => (
                  <SelectItem
                    key={p.pipe_id.toString()}
                    value={p.pipe_id.toString()}
                  >
                    Pipe #{p.pipe_id.toString()} — Ø{p.diameter}mm ({p.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Area */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label htmlFor="leak-area">Area *</Label>
            <Select
              value={form.area_id}
              onValueChange={(v) => set("area_id", v)}
            >
              <SelectTrigger id="leak-area" data-ocid="leak-form-area">
                <SelectValue placeholder="Select area…" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((a) => (
                  <SelectItem
                    key={a.area_id.toString()}
                    value={a.area_id.toString()}
                  >
                    {a.area_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Severity */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label htmlFor="leak-severity">Severity *</Label>
            <Select
              value={form.severity}
              onValueChange={(v) => set("severity", v)}
            >
              <SelectTrigger id="leak-severity" data-ocid="leak-form-severity">
                <SelectValue placeholder="Select severity…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reported Time */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label htmlFor="leak-time">Reported Time *</Label>
            <Input
              id="leak-time"
              type="datetime-local"
              value={form.reported_time}
              onChange={(e) => set("reported_time", e.target.value)}
              data-ocid="leak-form-time"
            />
          </div>

          {/* Latitude */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="leak-lat">Latitude *</Label>
            <Input
              id="leak-lat"
              type="number"
              step="any"
              placeholder="e.g. 18.5204"
              value={form.latitude}
              onChange={(e) => set("latitude", e.target.value)}
              data-ocid="leak-form-lat"
            />
          </div>

          {/* Longitude */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="leak-lng">Longitude *</Label>
            <Input
              id="leak-lng"
              type="number"
              step="any"
              placeholder="e.g. 73.8567"
              value={form.longitude}
              onChange={(e) => set("longitude", e.target.value)}
              data-ocid="leak-form-lng"
            />
          </div>

          {/* Resolved */}
          <div className="col-span-2 flex items-center gap-2">
            <Checkbox
              id="leak-resolved"
              checked={form.resolved}
              onCheckedChange={(v) => set("resolved", Boolean(v))}
              data-ocid="leak-form-resolved"
            />
            <Label htmlFor="leak-resolved" className="cursor-pointer">
              Mark as resolved
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            data-ocid="leak-form-submit"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {editing ? "Update Incident" : "Add Incident"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LeaksPage() {
  const { data: leaks = [], isLoading } = useLeakIncidents();
  const { data: areas = [] } = useAreas();
  const toggleMutation = useToggleLeakResolved();
  const deleteMutation = useDeleteLeakIncident();

  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLeak, setEditingLeak] = useState<LeakIncident | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LeakIncident | null>(null);
  const [togglingId, setTogglingId] = useState<bigint | null>(null);

  // Build area name lookup
  const areaMap = useMemo(
    () => new Map(areas.map((a) => [a.area_id.toString(), a.area_name])),
    [areas],
  );

  // Client-side filtering
  const filtered = useMemo(() => {
    return leaks.filter((l) => {
      const sevOk =
        severityFilter === "All" || l.leak_severity === severityFilter;
      const statOk =
        statusFilter === "All" ||
        (statusFilter === "Resolved" && l.resolved_status) ||
        (statusFilter === "Unresolved" && !l.resolved_status);
      return sevOk && statOk;
    });
  }, [leaks, severityFilter, statusFilter]);

  // Sort: critical first, then by reported time desc
  const sorted = useMemo(() => {
    const order: Record<string, number> = { Critical: 0, Moderate: 1, Low: 2 };
    return [...filtered].sort((a, b) => {
      const sevDiff =
        (order[a.leak_severity] ?? 3) - (order[b.leak_severity] ?? 3);
      if (sevDiff !== 0) return sevDiff;
      return b.reported_time.localeCompare(a.reported_time);
    });
  }, [filtered]);

  async function handleToggle(leak: LeakIncident) {
    setTogglingId(leak.leak_id);
    try {
      await toggleMutation.mutateAsync(leak.leak_id);
      toast.success(
        leak.resolved_status
          ? "Incident reopened."
          : "Incident marked as resolved.",
      );
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.leak_id);
      toast.success("Leak incident deleted.");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete incident.");
    }
  }

  function openAdd() {
    setEditingLeak(null);
    setModalOpen(true);
  }

  function openEdit(leak: LeakIncident) {
    setEditingLeak(leak);
    setModalOpen(true);
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-destructive" />
            Leak Incidents
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Monitor, manage, and resolve water leak incidents across the
            distribution network.
          </p>
        </div>
        <Button
          type="button"
          onClick={openAdd}
          className="shrink-0"
          data-ocid="leak-add-btn"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Incident
        </Button>
      </div>

      {/* Stats Summary */}
      {!isLoading && <StatsBar leaks={leaks} />}

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 p-4 rounded-lg bg-card border border-border">
        <div className="flex items-center gap-2 min-w-[180px]">
          <Label className="text-xs text-muted-foreground whitespace-nowrap">
            Severity
          </Label>
          <Select
            value={severityFilter}
            onValueChange={(v) => setSeverityFilter(v as SeverityFilter)}
          >
            <SelectTrigger data-ocid="filter-severity" className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Severities</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="Moderate">Moderate</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 min-w-[180px]">
          <Label className="text-xs text-muted-foreground whitespace-nowrap">
            Status
          </Label>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <SelectTrigger data-ocid="filter-status" className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Unresolved">Unresolved</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(severityFilter !== "All" || statusFilter !== "All") && (
          <Badge variant="secondary" className="self-center text-xs">
            {sorted.length} result{sorted.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                Leak ID
              </th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                Pipe ID
              </th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                Area
              </th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                Severity
              </th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                Reported Time
              </th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                Resolved
              </th>
              <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              ["r0", "r1", "r2", "r3", "r4"].map((rk) => (
                <tr key={rk} className="border-b border-border last:border-0">
                  {["c0", "c1", "c2", "c3", "c4", "c5", "c6"].map((ck) => (
                    <td key={`${rk}-${ck}`} className="px-4 py-3">
                      <Skeleton className="h-5 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-16 text-center"
                  data-ocid="leak-empty-state"
                >
                  <div className="flex flex-col items-center gap-3">
                    <AlertTriangle className="w-10 h-10 text-muted-foreground/40" />
                    <p className="text-muted-foreground font-medium">
                      No leak incidents found
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {severityFilter !== "All" || statusFilter !== "All"
                        ? "Try adjusting your filters."
                        : "Add your first incident to get started."}
                    </p>
                    {severityFilter === "All" && statusFilter === "All" && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={openAdd}
                        className="mt-1"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Incident
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              sorted.map((leak) => {
                const isToggling = togglingId === leak.leak_id;
                const rowClass =
                  leak.leak_severity === "Critical"
                    ? "data-table-row-critical"
                    : leak.leak_severity === "Moderate"
                      ? "border-l-4 border-l-orange-400"
                      : "border-l-4 border-l-yellow-400";

                return (
                  <tr
                    key={leak.leak_id.toString()}
                    className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${rowClass}`}
                    data-ocid="leak-row"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      #{leak.leak_id.toString()}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      #{leak.pipe_id.toString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {areaMap.get(leak.area_id.toString()) ??
                        `Area #${leak.area_id}`}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={
                          leak.leak_severity as "Critical" | "Moderate" | "Low"
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground tabular-nums">
                      {new Date(leak.reported_time).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={leak.resolved_status} />
                        <Button
                          type="button"
                          size="sm"
                          variant={leak.resolved_status ? "outline" : "default"}
                          className="h-7 text-xs px-2.5"
                          onClick={() => handleToggle(leak)}
                          disabled={isToggling}
                          data-ocid={`leak-toggle-${leak.leak_id}`}
                        >
                          {isToggling ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : leak.resolved_status ? (
                            "Reopen"
                          ) : (
                            "Mark Resolved"
                          )}
                        </Button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => openEdit(leak)}
                          aria-label="Edit incident"
                          data-ocid={`leak-edit-${leak.leak_id}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteTarget(leak)}
                          aria-label="Delete incident"
                          data-ocid={`leak-delete-${leak.leak_id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <LeakModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editing={editingLeak}
        onClose={() => {
          setModalOpen(false);
          setEditingLeak(null);
        }}
      />

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Leak Incident"
        description="This will permanently remove the leak incident and all associated data. This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
