import { ConfirmDialog } from "@/components/ConfirmDialog";
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
import { Droplets, FilterX, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useAddMeterReading,
  useAreas,
  useDeleteMeterReading,
  useMeterReadings,
  useUpdateMeterReading,
} from "../api/backend";
import type { Area, MeterReading } from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatLiters(val: number): string {
  return `${val.toLocaleString("en-IN")} L`;
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function daysAgoStr(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

// ─── Form State ───────────────────────────────────────────────────────────────

interface FormState {
  meter_id: string;
  area_id: string;
  reading_value: string;
  reading_date: string;
}

const emptyForm = (): FormState => ({
  meter_id: "",
  area_id: "",
  reading_value: "",
  reading_date: todayStr(),
});

// ─── ReadingsPage ─────────────────────────────────────────────────────────────

export default function ReadingsPage() {
  // Filter state
  const [filterAreaId, setFilterAreaId] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>(daysAgoStr(30));
  const [dateTo, setDateTo] = useState<string>(todayStr());
  const [search, setSearch] = useState<string>("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MeterReading | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [formErrors, setFormErrors] = useState<Partial<FormState>>({});

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<MeterReading | null>(null);

  // Data hooks
  const areaId = filterAreaId === "all" ? undefined : BigInt(filterAreaId);
  const { data: readings = [], isLoading: loadingReadings } =
    useMeterReadings(areaId);
  const { data: areas = [], isLoading: loadingAreas } = useAreas();
  const addMutation = useAddMeterReading();
  const updateMutation = useUpdateMeterReading();
  const deleteMutation = useDeleteMeterReading();

  // Client-side date + search filter
  const filtered = useMemo(() => {
    return readings.filter((r) => {
      const inDate = r.reading_date >= dateFrom && r.reading_date <= dateTo;
      const inSearch =
        !search ||
        r.meter_id.toLowerCase().includes(search.toLowerCase()) ||
        String(r.reading_id).includes(search);
      return inDate && inSearch;
    });
  }, [readings, dateFrom, dateTo, search]);

  // Sorting state
  const [sortKey, setSortKey] = useState<keyof MeterReading>("reading_date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  function toggleSort(key: keyof MeterReading) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function SortIcon({ col }: { col: keyof MeterReading }) {
    if (sortKey !== col) return <span className="opacity-30 ml-1">↕</span>;
    return <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  // ─── Modal helpers ───────────────────────────────────────────────────────────

  function openAdd() {
    setEditTarget(null);
    setForm(emptyForm());
    setFormErrors({});
    setModalOpen(true);
  }

  function openEdit(r: MeterReading) {
    setEditTarget(r);
    setForm({
      meter_id: r.meter_id,
      area_id: r.area_id.toString(),
      reading_value: r.reading_value.toString(),
      reading_date: r.reading_date,
    });
    setFormErrors({});
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
    setForm(emptyForm());
    setFormErrors({});
  }

  function setField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const errors: Partial<FormState> = {};
    if (!form.meter_id.trim()) errors.meter_id = "Meter ID is required";
    if (!form.area_id) errors.area_id = "Area is required";
    if (!form.reading_value || Number(form.reading_value) < 0)
      errors.reading_value = "Enter a valid reading value (≥ 0)";
    if (!form.reading_date) errors.reading_date = "Date is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    const payload = {
      meter_id: form.meter_id.trim(),
      area_id: BigInt(form.area_id),
      value: Number(form.reading_value),
      date: form.reading_date,
    };

    if (editTarget) {
      updateMutation.mutate(
        { id: editTarget.reading_id, ...payload },
        {
          onSuccess: () => {
            toast.success("Reading updated successfully");
            closeModal();
          },
          onError: () => toast.error("Failed to update reading"),
        },
      );
    } else {
      addMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Reading added successfully");
          closeModal();
        },
        onError: () => toast.error("Failed to add reading"),
      });
    }
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.reading_id, {
      onSuccess: () => {
        toast.success("Reading deleted");
        setDeleteTarget(null);
      },
      onError: () => toast.error("Failed to delete reading"),
    });
  }

  function resetFilters() {
    setFilterAreaId("all");
    setDateFrom(daysAgoStr(30));
    setDateTo(todayStr());
    setSearch("");
  }

  const areaName = (id: bigint) =>
    areas.find((a: Area) => a.area_id === id)?.area_name ?? `Area ${id}`;

  const isSubmitting = addMutation.isPending || updateMutation.isPending;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* ─── Page Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Droplets className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Meter Readings
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage water meter readings across all areas
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={openAdd}
          className="shrink-0 gap-2"
          data-ocid="readings-add-btn"
        >
          <Plus className="w-4 h-4" />
          Add Reading
        </Button>
      </div>

      {/* ─── Filter Bar ────────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          {/* Search */}
          <div className="lg:col-span-1 flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Meter ID or Reading ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 text-sm"
                data-ocid="readings-search"
              />
            </div>
          </div>

          {/* Area filter */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Filter by Area
            </Label>
            <Select
              value={filterAreaId}
              onValueChange={setFilterAreaId}
              disabled={loadingAreas}
            >
              <SelectTrigger
                className="h-9 text-sm"
                data-ocid="readings-filter-area"
              >
                <SelectValue placeholder="All Areas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {areas.map((a: Area) => (
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

          {/* Date From */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Date From
            </Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-9 text-sm"
              data-ocid="readings-filter-from"
            />
          </div>

          {/* Date To */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Date To
            </Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-9 text-sm"
              data-ocid="readings-filter-to"
            />
          </div>

          {/* Reset */}
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="h-9 gap-1.5 w-full text-sm"
              data-ocid="readings-reset-filter"
            >
              <FilterX className="w-3.5 h-3.5" />
              Reset
            </Button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="font-mono text-xs">
            {sorted.length}
          </Badge>
          <span>
            {sorted.length === 1 ? "reading" : "readings"} found
            {filterAreaId !== "all" && ` in ${areaName(BigInt(filterAreaId))}`}
          </span>
        </div>
      </div>

      {/* ─── Data Table ────────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead
                  className="cursor-pointer select-none w-24 text-xs font-semibold uppercase tracking-wide"
                  onClick={() => toggleSort("reading_id")}
                >
                  Reading ID <SortIcon col="reading_id" />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wide"
                  onClick={() => toggleSort("meter_id")}
                >
                  Meter ID <SortIcon col="meter_id" />
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide">
                  Area
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none text-right text-xs font-semibold uppercase tracking-wide"
                  onClick={() => toggleSort("reading_value")}
                >
                  Reading Value <SortIcon col="reading_value" />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wide"
                  onClick={() => toggleSort("reading_date")}
                >
                  Reading Date <SortIcon col="reading_date" />
                </TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-wide pr-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingReadings ? (
                Array.from({ length: 6 }, (_, i) => `skel-${i}`).map((key) => (
                  <TableRow key={key}>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : sorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div
                      className="flex flex-col items-center gap-3 py-12 text-center"
                      data-ocid="readings-empty"
                    >
                      <div className="p-4 rounded-full bg-muted/60">
                        <Droplets className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          No readings found
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {filterAreaId !== "all" || search
                            ? "Try adjusting your filters"
                            : "Add your first meter reading to get started"}
                        </p>
                      </div>
                      {!search && filterAreaId === "all" && (
                        <Button
                          type="button"
                          size="sm"
                          onClick={openAdd}
                          className="gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Reading
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sorted.map((r) => (
                  <TableRow
                    key={r.reading_id.toString()}
                    className="hover:bg-muted/30 transition-colors border-l-2 border-l-primary/20"
                    data-ocid={`reading-row-${r.reading_id}`}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{r.reading_id.toString()}
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {r.meter_id}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {areaName(r.area_id)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-primary">
                      {formatLiters(r.reading_value)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(r.reading_date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={() => openEdit(r)}
                          aria-label="Edit reading"
                          data-ocid={`reading-edit-${r.reading_id}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteTarget(r)}
                          aria-label="Delete reading"
                          data-ocid={`reading-delete-${r.reading_id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* ─── Add / Edit Modal ──────────────────────────────────────────────── */}
      <Dialog open={modalOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-md" data-ocid="readings-modal">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {editTarget ? "Edit Meter Reading" : "Add Meter Reading"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            {/* Meter ID */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="meter_id" className="text-sm font-medium">
                Meter ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="meter_id"
                placeholder="e.g. MTR-001"
                value={form.meter_id}
                onChange={(e) => setField("meter_id", e.target.value)}
                className={formErrors.meter_id ? "border-destructive" : ""}
                data-ocid="readings-input-meterid"
              />
              {formErrors.meter_id && (
                <p className="text-xs text-destructive">
                  {formErrors.meter_id}
                </p>
              )}
            </div>

            {/* Area */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="area_id" className="text-sm font-medium">
                Area <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.area_id}
                onValueChange={(v) => setField("area_id", v)}
                disabled={loadingAreas}
              >
                <SelectTrigger
                  id="area_id"
                  className={formErrors.area_id ? "border-destructive" : ""}
                  data-ocid="readings-input-area"
                >
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((a: Area) => (
                    <SelectItem
                      key={a.area_id.toString()}
                      value={a.area_id.toString()}
                    >
                      {a.area_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.area_id && (
                <p className="text-xs text-destructive">{formErrors.area_id}</p>
              )}
            </div>

            {/* Reading Value */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reading_value" className="text-sm font-medium">
                Reading Value (Liters){" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="reading_value"
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 12500"
                value={form.reading_value}
                onChange={(e) => setField("reading_value", e.target.value)}
                className={formErrors.reading_value ? "border-destructive" : ""}
                data-ocid="readings-input-value"
              />
              {formErrors.reading_value ? (
                <p className="text-xs text-destructive">
                  {formErrors.reading_value}
                </p>
              ) : form.reading_value && Number(form.reading_value) >= 0 ? (
                <p className="text-xs text-muted-foreground">
                  = {formatLiters(Number(form.reading_value))}
                </p>
              ) : null}
            </div>

            {/* Reading Date */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reading_date" className="text-sm font-medium">
                Reading Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="reading_date"
                type="date"
                value={form.reading_date}
                onChange={(e) => setField("reading_date", e.target.value)}
                className={formErrors.reading_date ? "border-destructive" : ""}
                data-ocid="readings-input-date"
              />
              {formErrors.reading_date && (
                <p className="text-xs text-destructive">
                  {formErrors.reading_date}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              disabled={isSubmitting}
              data-ocid="readings-modal-cancel"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              data-ocid="readings-modal-submit"
            >
              {isSubmitting
                ? "Saving…"
                : editTarget
                  ? "Update Reading"
                  : "Add Reading"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirm ─────────────────────────────────────────────────── */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Meter Reading?"
        description={
          deleteTarget
            ? `This will permanently delete reading #${deleteTarget.reading_id} for meter "${deleteTarget.meter_id}". This action cannot be undone.`
            : "This action cannot be undone."
        }
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}
