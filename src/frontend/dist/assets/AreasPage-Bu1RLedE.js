import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, M as MapPin, B as Button, u as ue } from "./index-CHPH9FnK.js";
import { I as Input, P as Pencil, T as Trash2, C as ConfirmDialog, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, L as Label, d as DialogFooter } from "./ConfirmDialog-aAlOXWHy.js";
import { S as Skeleton } from "./skeleton-DFKPQCXb.js";
import { b as useAreas, c as useDeleteArea, d as useAddArea, e as useUpdateArea } from "./backend-D4bDWURE.js";
import { C as CirclePlus } from "./circle-plus-BhCTASo-.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
const EMPTY_FORM = {
  area_name: "",
  population: "",
  latitude: "",
  longitude: ""
};
function AreaModal({ open, onOpenChange, editArea }) {
  const [form, setForm] = reactExports.useState(
    editArea ? {
      area_name: editArea.area_name,
      population: editArea.population.toString(),
      latitude: editArea.latitude.toString(),
      longitude: editArea.longitude.toString()
    } : EMPTY_FORM
  );
  const addArea = useAddArea();
  const updateArea = useUpdateArea();
  const isEditing = !!editArea;
  const isPending = addArea.isPending || updateArea.isPending;
  function handleOpen(v) {
    if (!v) setForm(EMPTY_FORM);
    onOpenChange(v);
  }
  reactExports.useEffect(() => {
    if (editArea) {
      setForm({
        area_name: editArea.area_name,
        population: editArea.population.toString(),
        latitude: editArea.latitude.toString(),
        longitude: editArea.longitude.toString()
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editArea]);
  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function validate() {
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
  function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) {
      ue.error(err);
      return;
    }
    const payload = {
      name: form.area_name.trim(),
      population: BigInt(Math.round(Number(form.population))),
      lat: Number(form.latitude),
      lng: Number(form.longitude)
    };
    if (isEditing && editArea) {
      updateArea.mutate(
        { id: editArea.area_id, ...payload },
        {
          onSuccess: () => {
            ue.success("Area updated successfully.");
            handleOpen(false);
          },
          onError: () => ue.error("Failed to update area.")
        }
      );
    } else {
      addArea.mutate(payload, {
        onSuccess: () => {
          ue.success("Area added successfully.");
          handleOpen(false);
        },
        onError: () => ue.error("Failed to add area.")
      });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "bg-primary/10 -mx-6 -mt-6 px-6 py-4 rounded-t-lg border-b border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-primary font-display font-bold text-lg", children: isEditing ? "Edit Area" : "Add New Area" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "pt-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "area-name", children: [
          "Area Name ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "area-name",
            "data-ocid": "area-name-input",
            value: form.area_name,
            onChange: (e) => setField("area_name", e.target.value),
            placeholder: "e.g. North Zone",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "area-population", children: [
          "Population ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "area-population",
            "data-ocid": "area-population-input",
            type: "number",
            min: 0,
            value: form.population,
            onChange: (e) => setField("population", e.target.value),
            placeholder: "e.g. 45000",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "area-lat", children: [
            "Latitude ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "area-lat",
              "data-ocid": "area-lat-input",
              type: "number",
              step: "any",
              min: -90,
              max: 90,
              value: form.latitude,
              onChange: (e) => setField("latitude", e.target.value),
              placeholder: "e.g. 18.52",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "area-lng", children: [
            "Longitude ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "area-lng",
              "data-ocid": "area-lng-input",
              type: "number",
              step: "any",
              min: -180,
              max: 180,
              value: form.longitude,
              onChange: (e) => setField("longitude", e.target.value),
              placeholder: "e.g. 73.85",
              required: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => handleOpen(false),
            disabled: isPending,
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            "data-ocid": "area-submit-btn",
            disabled: isPending,
            className: "bg-primary hover:bg-primary/90",
            children: isPending ? "Saving…" : isEditing ? "Save Changes" : "Add Area"
          }
        )
      ] })
    ] })
  ] }) });
}
function TableSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: ["r1", "r2", "r3", "r4", "r5"].map((rk) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: ["c1", "c2", "c3", "c4", "c5", "c6"].map((ck) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, ck)) }, rk)) });
}
function AreasPage() {
  const { data: areas = [], isLoading } = useAreas();
  const deleteArea = useDeleteArea();
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const [sortKey, setSortKey] = reactExports.useState("area_id");
  const [sortDir, setSortDir] = reactExports.useState("asc");
  function openAdd() {
    setEditTarget(null);
    setModalOpen(true);
  }
  function openEdit(area) {
    setEditTarget(area);
    setModalOpen(true);
  }
  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }
  function handleDelete() {
    if (!deleteTarget) return;
    deleteArea.mutate(deleteTarget.area_id, {
      onSuccess: () => ue.success(`Area "${deleteTarget.area_name}" deleted.`),
      onError: () => ue.error("Failed to delete area.")
    });
    setDeleteTarget(null);
  }
  const filtered = areas.filter(
    (a) => a.area_name.toLowerCase().includes(search.toLowerCase()) || a.area_id.toString().includes(search)
  );
  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = typeof av === "bigint" && typeof bv === "bigint" ? av < bv ? -1 : av > bv ? 1 : 0 : typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
    return sortDir === "asc" ? cmp : -cmp;
  });
  function SortIcon({ col }) {
    if (sortKey !== col) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 opacity-30", children: "↕" });
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-primary", children: sortDir === "asc" ? "↑" : "↓" });
  }
  const thClass = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground cursor-pointer select-none whitespace-nowrap hover:text-primary transition-colors duration-150";
  function makeThHandlers(col) {
    return {
      onClick: () => handleSort(col),
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSort(col);
        }
      },
      tabIndex: 0
    };
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-display font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-6 h-6 text-primary" }),
          "Areas Management"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "Manage city distribution zones and their geographic data." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          "data-ocid": "add-area-btn",
          onClick: openAdd,
          className: "bg-primary hover:bg-primary/90 gap-2 self-start sm:self-auto",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "w-4 h-4" }),
            "Add Area"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          "data-ocid": "area-search-input",
          placeholder: "Search by name or ID…",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "max-w-xs"
        }
      ),
      !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        sorted.length,
        " ",
        sorted.length === 1 ? "area" : "areas"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-primary/8 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { className: thClass, ...makeThHandlers("area_id"), children: [
          "Area ID ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "area_id" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { className: thClass, ...makeThHandlers("area_name"), children: [
          "Area Name ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "area_name" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { className: thClass, ...makeThHandlers("population"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
            " Population"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "population" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { className: thClass, ...makeThHandlers("latitude"), children: [
          "Latitude ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "latitude" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { className: thClass, ...makeThHandlers("longitude"), children: [
          "Longitude ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "longitude" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, {}) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "areas-empty-state",
          className: "flex flex-col items-center justify-center py-16 gap-4 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-7 h-7 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-semibold text-base", children: "No areas found." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: search ? "Try a different search." : "Add your first area to get started." })
            ] }),
            !search && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                onClick: openAdd,
                "data-ocid": "empty-add-area-btn",
                className: "bg-primary hover:bg-primary/90 gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "w-4 h-4" }),
                  "Add First Area"
                ]
              }
            )
          ]
        }
      ) }) }) : sorted.map((area) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-ocid": "area-row",
          className: "border-b border-border last:border-0 hover:bg-primary/5 transition-colors duration-150 group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: [
              "#",
              area.area_id.toString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: area.area_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground tabular-nums", children: Number(area.population).toLocaleString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground tabular-nums", children: area.latitude.toFixed(4) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground tabular-nums", children: area.longitude.toFixed(4) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  "data-ocid": "area-edit-btn",
                  onClick: () => openEdit(area),
                  className: "h-8 px-3 border-primary/40 text-primary hover:bg-primary/10 hover:border-primary gap-1.5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" }),
                    "Edit"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  "data-ocid": "area-delete-btn",
                  onClick: () => setDeleteTarget(area),
                  className: "h-8 px-3 border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive gap-1.5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }),
                    "Delete"
                  ]
                }
              )
            ] }) })
          ]
        },
        area.area_id.toString()
      )) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AreaModal,
      {
        open: modalOpen,
        onOpenChange: (v) => {
          setModalOpen(v);
          if (!v) setEditTarget(null);
        },
        editArea: editTarget
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: !!deleteTarget,
        onOpenChange: (v) => {
          if (!v) setDeleteTarget(null);
        },
        title: "Delete Area",
        description: `Are you sure you want to delete "${deleteTarget == null ? void 0 : deleteTarget.area_name}"? This action cannot be undone.`,
        confirmLabel: "Delete",
        onConfirm: handleDelete
      }
    )
  ] });
}
export {
  AreasPage as default
};
