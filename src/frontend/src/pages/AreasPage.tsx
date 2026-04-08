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
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Pencil, PlusCircle, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useAddArea,
  useAreas,
  useDeleteArea,
  useUpdateArea,
} from "../api/backend";
import { ConfirmDialog } from "../components/ConfirmDialog";
import type { Area } from "../types";

// ─── Area Form ────────────────────────────────────────────────────────────────

interface AreaFormValues {
  area_name: string;
  population: string;
  latitude: string;
  longitude: string;
}

const EMPTY_FORM: AreaFormValues = {
  area_name: "",
  population: "",
  latitude: "",
  longitude: "",
};

interface AreaModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editArea: Area | null;
}

function AreaModal({ open, onOpenChange, editArea }: AreaModalProps) {
  const [form, setForm] = useState<AreaFormValues>(
    editArea
      ? {
          area_name: editArea.area_name,
          population: editArea.population.toString(),
          latitude: editArea.latitude.toString(),
          longitude: editArea.longitude.toString(),
        }
      : EMPTY_FORM,
  );

  const addArea = useAddArea();
  const updateArea = useUpdateArea();

  const isEditing = !!editArea;
  const isPending = addArea.isPending || updateArea.isPending;

  function handleOpen(v: boolean) {
    if (!v) setForm(EMPTY_FORM);
    onOpenChange(v);
  }

  // Sync form when editArea changes
  useEffect(() => {
    if (editArea) {
      setForm({
        area_name: editArea.area_name,
        population: editArea.population.toString(),
        latitude: editArea.latitude.toString(),
        longitude: editArea.longitude.toString(),
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editArea]);

  function setField(key: keyof AreaFormValues, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): string | null {
    if (!form.area_name.trim()) return "Area name is required.";
    const pop = Number(form.population);
    if (!form.population || Number.isNaN(pop) || pop < 0)
      return "Population must be a non-negative number.";
    const lat = Number(form.latitude);
    if (!form.latitude || Number.isNaN(lat) || lat < -90 || lat > 90)
      return "Latitude must be between -90 and 90.";
    const lng = Number(form.longitude);
    if (!form.longitude || Number.isNaN(lng) || lng < -180 || lng > 180)
      return "Longitude must be between -180 and 180.";
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    const payload = {
      name: form.area_name.trim(),
      population: BigInt(Math.round(Number(form.population))),
      lat: Number(form.latitude),
      lng: Number(form.longitude),
    };

    if (isEditing && editArea) {
      updateArea.mutate(
        { id: editArea.area_id, ...payload },
        {
          onSuccess: () => {
            toast.success("Area updated successfully.");
            handleOpen(false);
          },
          onError: () => toast.error("Failed to update area."),
        },
      );
    } else {
      addArea.mutate(payload, {
        onSuccess: () => {
          toast.success("Area added successfully.");
          handleOpen(false);
        },
        onError: () => toast.error("Failed to add area."),
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="bg-primary/10 -mx-6 -mt-6 px-6 py-4 rounded-t-lg border-b border-primary/20">
          <DialogTitle className="text-primary font-display font-bold text-lg">
            {isEditing ? "Edit Area" : "Add New Area"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="pt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="area-name">
              Area Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="area-name"
              data-ocid="area-name-input"
              value={form.area_name}
              onChange={(e) => setField("area_name", e.target.value)}
              placeholder="e.g. North Zone"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="area-population">
              Population <span className="text-destructive">*</span>
            </Label>
            <Input
              id="area-population"
              data-ocid="area-population-input"
              type="number"
              min={0}
              value={form.population}
              onChange={(e) => setField("population", e.target.value)}
              placeholder="e.g. 45000"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="area-lat">
                Latitude <span className="text-destructive">*</span>
              </Label>
              <Input
                id="area-lat"
                data-ocid="area-lat-input"
                type="number"
                step="any"
                min={-90}
                max={90}
                value={form.latitude}
                onChange={(e) => setField("latitude", e.target.value)}
                placeholder="e.g. 18.52"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="area-lng">
                Longitude <span className="text-destructive">*</span>
              </Label>
              <Input
                id="area-lng"
                data-ocid="area-lng-input"
                type="number"
                step="any"
                min={-180}
                max={180}
                value={form.longitude}
                onChange={(e) => setField("longitude", e.target.value)}
                placeholder="e.g. 73.85"
                required
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="area-submit-btn"
              disabled={isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {isPending ? "Saving…" : isEditing ? "Save Changes" : "Add Area"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Skeleton Rows ────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <>
      {["r1", "r2", "r3", "r4", "r5"].map((rk) => (
        <tr key={rk} className="border-b border-border">
          {["c1", "c2", "c3", "c4", "c5", "c6"].map((ck) => (
            <td key={ck} className="px-4 py-3">
              <Skeleton className="h-4 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Areas Page ───────────────────────────────────────────────────────────────

type SortKey = keyof Area;
type SortDir = "asc" | "desc";

export default function AreasPage() {
  const { data: areas = [], isLoading } = useAreas();
  const deleteArea = useDeleteArea();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Area | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Area | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("area_id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function openAdd() {
    setEditTarget(null);
    setModalOpen(true);
  }

  function openEdit(area: Area) {
    setEditTarget(area);
    setModalOpen(true);
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteArea.mutate(deleteTarget.area_id, {
      onSuccess: () =>
        toast.success(`Area "${deleteTarget.area_name}" deleted.`),
      onError: () => toast.error("Failed to delete area."),
    });
    setDeleteTarget(null);
  }

  const filtered = areas.filter(
    (a) =>
      a.area_name.toLowerCase().includes(search.toLowerCase()) ||
      a.area_id.toString().includes(search),
  );

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp =
      typeof av === "bigint" && typeof bv === "bigint"
        ? av < bv
          ? -1
          : av > bv
            ? 1
            : 0
        : typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
    return sortDir === "asc" ? cmp : -cmp;
  });

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="ml-1 opacity-30">↕</span>;
    return (
      <span className="ml-1 text-primary">{sortDir === "asc" ? "↑" : "↓"}</span>
    );
  }

  const thClass =
    "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground cursor-pointer select-none whitespace-nowrap hover:text-primary transition-colors duration-150";

  function makeThHandlers(col: SortKey) {
    return {
      onClick: () => handleSort(col),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSort(col);
        }
      },
      tabIndex: 0,
    };
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            Areas Management
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage city distribution zones and their geographic data.
          </p>
        </div>
        <Button
          type="button"
          data-ocid="add-area-btn"
          onClick={openAdd}
          className="bg-primary hover:bg-primary/90 gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Add Area
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <Input
          data-ocid="area-search-input"
          placeholder="Search by name or ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        {!isLoading && (
          <p className="text-sm text-muted-foreground">
            {sorted.length} {sorted.length === 1 ? "area" : "areas"}
          </p>
        )}
      </div>

      {/* Table card */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-primary/8 border-b border-border">
              <tr>
                <th className={thClass} {...makeThHandlers("area_id")}>
                  Area ID <SortIcon col="area_id" />
                </th>
                <th className={thClass} {...makeThHandlers("area_name")}>
                  Area Name <SortIcon col="area_name" />
                </th>
                <th className={thClass} {...makeThHandlers("population")}>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Population
                  </span>
                  <SortIcon col="population" />
                </th>
                <th className={thClass} {...makeThHandlers("latitude")}>
                  Latitude <SortIcon col="latitude" />
                </th>
                <th className={thClass} {...makeThHandlers("longitude")}>
                  Longitude <SortIcon col="longitude" />
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableSkeleton />
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div
                      data-ocid="areas-empty-state"
                      className="flex flex-col items-center justify-center py-16 gap-4 text-center"
                    >
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <p className="text-foreground font-semibold text-base">
                          No areas found.
                        </p>
                        <p className="text-muted-foreground text-sm mt-1">
                          {search
                            ? "Try a different search."
                            : "Add your first area to get started."}
                        </p>
                      </div>
                      {!search && (
                        <Button
                          type="button"
                          onClick={openAdd}
                          data-ocid="empty-add-area-btn"
                          className="bg-primary hover:bg-primary/90 gap-2"
                        >
                          <PlusCircle className="w-4 h-4" />
                          Add First Area
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                sorted.map((area) => (
                  <tr
                    key={area.area_id.toString()}
                    data-ocid="area-row"
                    className="border-b border-border last:border-0 hover:bg-primary/5 transition-colors duration-150 group"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      #{area.area_id.toString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {area.area_name}
                    </td>
                    <td className="px-4 py-3 text-foreground tabular-nums">
                      {Number(area.population).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-foreground tabular-nums">
                      {area.latitude.toFixed(4)}
                    </td>
                    <td className="px-4 py-3 text-foreground tabular-nums">
                      {area.longitude.toFixed(4)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          data-ocid="area-edit-btn"
                          onClick={() => openEdit(area)}
                          className="h-8 px-3 border-primary/40 text-primary hover:bg-primary/10 hover:border-primary gap-1.5"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          data-ocid="area-delete-btn"
                          onClick={() => setDeleteTarget(area)}
                          className="h-8 px-3 border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AreaModal
        open={modalOpen}
        onOpenChange={(v) => {
          setModalOpen(v);
          if (!v) setEditTarget(null);
        }}
        editArea={editTarget}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => {
          if (!v) setDeleteTarget(null);
        }}
        title="Delete Area"
        description={`Are you sure you want to delete "${deleteTarget?.area_name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}
