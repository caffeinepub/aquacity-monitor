import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, D as Droplets, B as Button, u as ue } from "./index-CHPH9FnK.js";
import { L as Label, I as Input, P as Pencil, T as Trash2, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter, C as ConfirmDialog } from "./ConfirmDialog-aAlOXWHy.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, B as Badge } from "./select-CD_7Sz1Q.js";
import { S as Skeleton } from "./skeleton-DFKPQCXb.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Ca8HfIOI.js";
import { f as useMeterReadings, b as useAreas, g as useAddMeterReading, h as useUpdateMeterReading, i as useDeleteMeterReading } from "./backend-D4bDWURE.js";
import { P as Plus } from "./plus-DjMOAp7k.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M12.531 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l.427-.473",
      key: "ol2ft2"
    }
  ],
  ["path", { d: "m16.5 3.5 5 5", key: "15e6fa" }],
  ["path", { d: "m21.5 3.5-5 5", key: "m0lwru" }]
];
const FunnelX = createLucideIcon("funnel-x", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode);
function formatLiters(val) {
  return `${val.toLocaleString("en-IN")} L`;
}
function todayStr() {
  return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
function daysAgoStr(days) {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}
const emptyForm = () => ({
  meter_id: "",
  area_id: "",
  reading_value: "",
  reading_date: todayStr()
});
function ReadingsPage() {
  const [filterAreaId, setFilterAreaId] = reactExports.useState("all");
  const [dateFrom, setDateFrom] = reactExports.useState(daysAgoStr(30));
  const [dateTo, setDateTo] = reactExports.useState(todayStr());
  const [search, setSearch] = reactExports.useState("");
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyForm());
  const [formErrors, setFormErrors] = reactExports.useState({});
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const areaId = filterAreaId === "all" ? void 0 : BigInt(filterAreaId);
  const { data: readings = [], isLoading: loadingReadings } = useMeterReadings(areaId);
  const { data: areas = [], isLoading: loadingAreas } = useAreas();
  const addMutation = useAddMeterReading();
  const updateMutation = useUpdateMeterReading();
  const deleteMutation = useDeleteMeterReading();
  const filtered = reactExports.useMemo(() => {
    return readings.filter((r) => {
      const inDate = r.reading_date >= dateFrom && r.reading_date <= dateTo;
      const inSearch = !search || r.meter_id.toLowerCase().includes(search.toLowerCase()) || String(r.reading_id).includes(search);
      return inDate && inSearch;
    });
  }, [readings, dateFrom, dateTo, search]);
  const [sortKey, setSortKey] = reactExports.useState("reading_date");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const sorted = reactExports.useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);
  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }
  function SortIcon({ col }) {
    if (sortKey !== col) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-30 ml-1", children: "↕" });
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1", children: sortDir === "asc" ? "↑" : "↓" });
  }
  function openAdd() {
    setEditTarget(null);
    setForm(emptyForm());
    setFormErrors({});
    setModalOpen(true);
  }
  function openEdit(r) {
    setEditTarget(r);
    setForm({
      meter_id: r.meter_id,
      area_id: r.area_id.toString(),
      reading_value: r.reading_value.toString(),
      reading_date: r.reading_date
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
  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: void 0 }));
  }
  function validate() {
    const errors = {};
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
      date: form.reading_date
    };
    if (editTarget) {
      updateMutation.mutate(
        { id: editTarget.reading_id, ...payload },
        {
          onSuccess: () => {
            ue.success("Reading updated successfully");
            closeModal();
          },
          onError: () => ue.error("Failed to update reading")
        }
      );
    } else {
      addMutation.mutate(payload, {
        onSuccess: () => {
          ue.success("Reading added successfully");
          closeModal();
        },
        onError: () => ue.error("Failed to add reading")
      });
    }
  }
  function handleDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.reading_id, {
      onSuccess: () => {
        ue.success("Reading deleted");
        setDeleteTarget(null);
      },
      onError: () => ue.error("Failed to delete reading")
    });
  }
  function resetFilters() {
    setFilterAreaId("all");
    setDateFrom(daysAgoStr(30));
    setDateTo(todayStr());
    setSearch("");
  }
  const areaName = (id) => {
    var _a;
    return ((_a = areas.find((a) => a.area_id === id)) == null ? void 0 : _a.area_name) ?? `Area ${id}`;
  };
  const isSubmitting = addMutation.isPending || updateMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-primary/10 border border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Droplets, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Meter Readings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Manage water meter readings across all areas" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: openAdd,
          className: "shrink-0 gap-2",
          "data-ocid": "readings-add-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "Add Reading"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-1 flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "Search" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Meter ID or Reading ID",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: "pl-8 h-9 text-sm",
                "data-ocid": "readings-search"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "Filter by Area" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: filterAreaId,
              onValueChange: setFilterAreaId,
              disabled: loadingAreas,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "h-9 text-sm",
                    "data-ocid": "readings-filter-area",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Areas" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Areas" }),
                  areas.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectItem,
                    {
                      value: a.area_id.toString(),
                      children: a.area_name
                    },
                    a.area_id.toString()
                  ))
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "Date From" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              value: dateFrom,
              onChange: (e) => setDateFrom(e.target.value),
              className: "h-9 text-sm",
              "data-ocid": "readings-filter-from"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "Date To" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              value: dateTo,
              onChange: (e) => setDateTo(e.target.value),
              className: "h-9 text-sm",
              "data-ocid": "readings-filter-to"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: resetFilters,
            className: "h-9 gap-1.5 w-full text-sm",
            "data-ocid": "readings-reset-filter",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FunnelX, { className: "w-3.5 h-3.5" }),
              "Reset"
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "font-mono text-xs", children: sorted.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          sorted.length === 1 ? "reading" : "readings",
          " found",
          filterAreaId !== "all" && ` in ${areaName(BigInt(filterAreaId))}`
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/40 hover:bg-muted/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableHead,
          {
            className: "cursor-pointer select-none w-24 text-xs font-semibold uppercase tracking-wide",
            onClick: () => toggleSort("reading_id"),
            children: [
              "Reading ID ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "reading_id" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableHead,
          {
            className: "cursor-pointer select-none text-xs font-semibold uppercase tracking-wide",
            onClick: () => toggleSort("meter_id"),
            children: [
              "Meter ID ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "meter_id" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold uppercase tracking-wide", children: "Area" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableHead,
          {
            className: "cursor-pointer select-none text-right text-xs font-semibold uppercase tracking-wide",
            onClick: () => toggleSort("reading_value"),
            children: [
              "Reading Value ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "reading_value" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableHead,
          {
            className: "cursor-pointer select-none text-xs font-semibold uppercase tracking-wide",
            onClick: () => toggleSort("reading_date"),
            children: [
              "Reading Date ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "reading_date" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right text-xs font-semibold uppercase tracking-wide pr-4", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: loadingReadings ? Array.from({ length: 6 }, (_, i) => `skel-${i}`).map((key) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-12" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20 ml-auto" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16 ml-auto" }) })
      ] }, key)) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center gap-3 py-12 text-center",
          "data-ocid": "readings-empty",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 rounded-full bg-muted/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Droplets, { className: "w-8 h-8 text-muted-foreground/50" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "No readings found" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: filterAreaId !== "all" || search ? "Try adjusting your filters" : "Add your first meter reading to get started" })
            ] }),
            !search && filterAreaId === "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                onClick: openAdd,
                className: "gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                  "Add Reading"
                ]
              }
            )
          ]
        }
      ) }) }) : sorted.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TableRow,
        {
          className: "hover:bg-muted/30 transition-colors border-l-2 border-l-primary/20",
          "data-ocid": `reading-row-${r.reading_id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-mono text-xs text-muted-foreground", children: [
              "#",
              r.reading_id.toString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-sm", children: r.meter_id }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: "text-xs font-normal",
                children: areaName(r.area_id)
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono font-semibold text-primary", children: formatLiters(r.reading_value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground", children: new Date(r.reading_date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right pr-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "icon",
                  className: "h-7 w-7 text-muted-foreground hover:text-foreground",
                  onClick: () => openEdit(r),
                  "aria-label": "Edit reading",
                  "data-ocid": `reading-edit-${r.reading_id}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "icon",
                  className: "h-7 w-7 text-muted-foreground hover:text-destructive",
                  onClick: () => setDeleteTarget(r),
                  "aria-label": "Delete reading",
                  "data-ocid": `reading-delete-${r.reading_id}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              )
            ] }) })
          ]
        },
        r.reading_id.toString()
      )) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: modalOpen, onOpenChange: (open) => !open && closeModal(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", "data-ocid": "readings-modal", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-lg", children: editTarget ? "Edit Meter Reading" : "Add Meter Reading" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "meter_id", className: "text-sm font-medium", children: [
            "Meter ID ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "meter_id",
              placeholder: "e.g. MTR-001",
              value: form.meter_id,
              onChange: (e) => setField("meter_id", e.target.value),
              className: formErrors.meter_id ? "border-destructive" : "",
              "data-ocid": "readings-input-meterid"
            }
          ),
          formErrors.meter_id && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: formErrors.meter_id })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "area_id", className: "text-sm font-medium", children: [
            "Area ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.area_id,
              onValueChange: (v) => setField("area_id", v),
              disabled: loadingAreas,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    id: "area_id",
                    className: formErrors.area_id ? "border-destructive" : "",
                    "data-ocid": "readings-input-area",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select area" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: areas.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectItem,
                  {
                    value: a.area_id.toString(),
                    children: a.area_name
                  },
                  a.area_id.toString()
                )) })
              ]
            }
          ),
          formErrors.area_id && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: formErrors.area_id })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "reading_value", className: "text-sm font-medium", children: [
            "Reading Value (Liters)",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "reading_value",
              type: "number",
              min: "0",
              step: "1",
              placeholder: "e.g. 12500",
              value: form.reading_value,
              onChange: (e) => setField("reading_value", e.target.value),
              className: formErrors.reading_value ? "border-destructive" : "",
              "data-ocid": "readings-input-value"
            }
          ),
          formErrors.reading_value ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: formErrors.reading_value }) : form.reading_value && Number(form.reading_value) >= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "= ",
            formatLiters(Number(form.reading_value))
          ] }) : null
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "reading_date", className: "text-sm font-medium", children: [
            "Reading Date ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "reading_date",
              type: "date",
              value: form.reading_date,
              onChange: (e) => setField("reading_date", e.target.value),
              className: formErrors.reading_date ? "border-destructive" : "",
              "data-ocid": "readings-input-date"
            }
          ),
          formErrors.reading_date && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: formErrors.reading_date })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: closeModal,
            disabled: isSubmitting,
            "data-ocid": "readings-modal-cancel",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            onClick: handleSubmit,
            disabled: isSubmitting,
            "data-ocid": "readings-modal-submit",
            children: isSubmitting ? "Saving…" : editTarget ? "Update Reading" : "Add Reading"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: !!deleteTarget,
        onOpenChange: (open) => !open && setDeleteTarget(null),
        title: "Delete Meter Reading?",
        description: deleteTarget ? `This will permanently delete reading #${deleteTarget.reading_id} for meter "${deleteTarget.meter_id}". This action cannot be undone.` : "This action cannot be undone.",
        confirmLabel: "Delete",
        onConfirm: handleDelete
      }
    )
  ] });
}
export {
  ReadingsPage as default
};
