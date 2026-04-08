import { r as reactExports, j as jsxRuntimeExports, G as Gauge, B as Button, u as ue } from "./index-CHPH9FnK.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, B as Badge } from "./select-CD_7Sz1Q.js";
import { L as Label, I as Input, P as Pencil, T as Trash2, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter, C as ConfirmDialog } from "./ConfirmDialog-aAlOXWHy.js";
import { S as Skeleton } from "./skeleton-DFKPQCXb.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Ca8HfIOI.js";
import { j as usePressureLogs, k as usePipes, l as useAddPressureLog, m as useUpdatePressureLog, n as useDeletePressureLog } from "./backend-D4bDWURE.js";
import { C as CirclePlus } from "./circle-plus-BhCTASo-.js";
function toDatetimeLocal(iso) {
  if (!iso) return "";
  return iso.length > 16 ? iso.slice(0, 16) : iso;
}
function defaultDateFrom() {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - 30);
  return `${d.toISOString().slice(0, 10)}`;
}
function defaultDateTo() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function nowDatetimeLocal() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 16);
}
function pressureColor(val) {
  if (val < 2) return "text-destructive font-semibold";
  if (val <= 4) return "text-chart-3 font-semibold";
  return "text-chart-4 font-semibold";
}
function pressureLabel(val) {
  if (val < 2) return "Low";
  if (val <= 4) return "Normal";
  return "High";
}
function pressureBadgeVariant(val) {
  if (val < 2) return "destructive";
  if (val <= 4) return "secondary";
  return "outline";
}
const emptyForm = () => ({
  pipe_id: "",
  pressure_value: "",
  recorded_at: nowDatetimeLocal()
});
function PressurePage() {
  const [filterPipeId, setFilterPipeId] = reactExports.useState("all");
  const [dateFrom, setDateFrom] = reactExports.useState(defaultDateFrom());
  const [dateTo, setDateTo] = reactExports.useState(defaultDateTo());
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyForm());
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const pipeQueryId = filterPipeId === "all" ? void 0 : BigInt(filterPipeId);
  const { data: logs = [], isLoading: logsLoading } = usePressureLogs(pipeQueryId);
  const { data: pipes = [] } = usePipes();
  const addLog = useAddPressureLog();
  const updateLog = useUpdatePressureLog();
  const deleteLog = useDeletePressureLog();
  const filteredLogs = reactExports.useMemo(() => {
    const from = dateFrom ? /* @__PURE__ */ new Date(`${dateFrom}T00:00:00`) : null;
    const to = dateTo ? /* @__PURE__ */ new Date(`${dateTo}T23:59:59`) : null;
    return logs.filter((log) => {
      const recorded = new Date(log.recorded_at);
      if (from && recorded < from) return false;
      if (to && recorded > to) return false;
      return true;
    });
  }, [logs, dateFrom, dateTo]);
  const sortedLogs = reactExports.useMemo(
    () => [...filteredLogs].sort(
      (a, b) => a.recorded_at < b.recorded_at ? 1 : -1
    ),
    [filteredLogs]
  );
  function openAdd() {
    setEditTarget(null);
    setForm(emptyForm());
    setModalOpen(true);
  }
  function openEdit(log) {
    setEditTarget(log);
    setForm({
      pipe_id: log.pipe_id.toString(),
      pressure_value: log.pressure_value.toString(),
      recorded_at: toDatetimeLocal(log.recorded_at)
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
      ue.error("Please fill in all required fields.");
      return;
    }
    if (editTarget) {
      updateLog.mutate(
        {
          id: editTarget.pressure_id,
          pipe_id: pipeId,
          value,
          recorded_at: form.recorded_at
        },
        {
          onSuccess: () => {
            ue.success("Pressure log updated.");
            closeModal();
          },
          onError: () => ue.error("Failed to update pressure log.")
        }
      );
    } else {
      addLog.mutate(
        { pipe_id: pipeId, value, recorded_at: form.recorded_at },
        {
          onSuccess: () => {
            ue.success("Pressure log added.");
            closeModal();
          },
          onError: () => ue.error("Failed to add pressure log.")
        }
      );
    }
  }
  function handleDelete() {
    if (deleteId === null) return;
    deleteLog.mutate(deleteId, {
      onSuccess: () => {
        ue.success("Pressure log deleted.");
        setDeleteId(null);
      },
      onError: () => ue.error("Failed to delete pressure log.")
    });
  }
  const isBusy = addLog.isPending || updateLog.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "h-5 w-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Pressure Logs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Monitor pipe pressure readings across the network" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: openAdd,
          className: "gap-2",
          "data-ocid": "pressure-add-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "h-4 w-4" }),
            "Add Pressure Log"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border bg-card p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "filter-pipe",
            className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
            children: "Filter by Pipe"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: filterPipeId,
            onValueChange: (v) => setFilterPipeId(v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "filter-pipe", "data-ocid": "pressure-filter-pipe", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Pipes" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Pipes" }),
                pipes.map((pipe) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  SelectItem,
                  {
                    value: pipe.pipe_id.toString(),
                    children: [
                      "Pipe #",
                      pipe.pipe_id.toString()
                    ]
                  },
                  pipe.pipe_id.toString()
                ))
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "date-from",
            className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
            children: "Date From"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "date-from",
            type: "date",
            value: dateFrom,
            onChange: (e) => setDateFrom(e.target.value),
            "data-ocid": "pressure-filter-from"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "date-to",
            className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
            children: "Date To"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "date-to",
            type: "date",
            value: dateTo,
            onChange: (e) => setDateTo(e.target.value),
            "data-ocid": "pressure-filter-to"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border px-4 py-3 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: logsLoading ? "Loading…" : `${sortedLogs.length} record${sortedLogs.length !== 1 ? "s" : ""}` }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-24", children: "Log ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-28", children: "Pipe ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Pressure (bar)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Recorded At" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-28 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: logsLoading ? ["s1", "s2", "s3", "s4", "s5"].map((sk) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: ["c1", "c2", "c3", "c4", "c5", "c6"].map((ck) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, `${sk}-${ck}`)) }, sk)) : sortedLogs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "py-12 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center gap-3",
            "data-ocid": "pressure-empty-state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "h-10 w-10 text-muted-foreground/40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-medium", children: "No pressure logs found" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground/70", children: "Adjust the filters or add a new pressure log." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: openAdd,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "h-4 w-4 mr-1.5" }),
                    "Add Pressure Log"
                  ]
                }
              )
            ]
          }
        ) }) }) : sortedLogs.map((log) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableRow,
          {
            className: "hover:bg-muted/30 transition-colors",
            "data-ocid": `pressure-row-${log.pressure_id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-mono text-xs text-muted-foreground", children: [
                "#",
                log.pressure_id.toString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary", children: [
                "Pipe #",
                log.pipe_id.toString()
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: pressureColor(log.pressure_value), children: log.pressure_value.toFixed(2) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: pressureBadgeVariant(log.pressure_value), children: pressureLabel(log.pressure_value) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground", children: new Date(log.recorded_at).toLocaleString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8 text-muted-foreground hover:text-foreground",
                    onClick: () => openEdit(log),
                    "aria-label": "Edit pressure log",
                    "data-ocid": `pressure-edit-${log.pressure_id}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8 text-muted-foreground hover:text-destructive",
                    onClick: () => setDeleteId(log.pressure_id),
                    "aria-label": "Delete pressure log",
                    "data-ocid": `pressure-delete-${log.pressure_id}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                  }
                )
              ] }) })
            ]
          },
          log.pressure_id.toString()
        )) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: modalOpen,
        onOpenChange: (o) => {
          if (!o) closeModal();
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", "data-ocid": "pressure-modal", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: editTarget ? "Edit Pressure Log" : "Add Pressure Log" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "modal-pipe", children: [
                "Pipe ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.pipe_id,
                  onValueChange: (v) => setForm((f) => ({ ...f, pipe_id: v })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "modal-pipe", "data-ocid": "pressure-modal-pipe", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a pipe…" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: pipes.map((pipe) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      SelectItem,
                      {
                        value: pipe.pipe_id.toString(),
                        children: [
                          "Pipe #",
                          pipe.pipe_id.toString(),
                          " — ⌀",
                          pipe.diameter,
                          " mm (",
                          pipe.status,
                          ")"
                        ]
                      },
                      pipe.pipe_id.toString()
                    )) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "modal-pressure", children: [
                "Pressure Value (bar) ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "modal-pressure",
                  type: "number",
                  step: "0.1",
                  min: "0",
                  placeholder: "e.g. 3.5",
                  value: form.pressure_value,
                  onChange: (e) => setForm((f) => ({ ...f, pressure_value: e.target.value })),
                  "data-ocid": "pressure-modal-value"
                }
              ),
              form.pressure_value && !Number.isNaN(Number.parseFloat(form.pressure_value)) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: `text-xs ${pressureColor(Number.parseFloat(form.pressure_value))}`,
                  children: [
                    pressureLabel(Number.parseFloat(form.pressure_value)),
                    " ",
                    "pressure",
                    Number.parseFloat(form.pressure_value) < 2 && " — may indicate a leak or supply issue",
                    Number.parseFloat(form.pressure_value) > 4 && " — may cause pipe stress"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "modal-recorded", children: [
                "Recorded At ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "modal-recorded",
                  type: "datetime-local",
                  value: form.recorded_at,
                  onChange: (e) => setForm((f) => ({ ...f, recorded_at: e.target.value })),
                  "data-ocid": "pressure-modal-recorded-at"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: closeModal,
                disabled: isBusy,
                "data-ocid": "pressure-modal-cancel",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                onClick: handleSubmit,
                disabled: isBusy || !form.pipe_id || !form.pressure_value || !form.recorded_at,
                "data-ocid": "pressure-modal-submit",
                children: isBusy ? "Saving…" : editTarget ? "Update Log" : "Add Log"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: deleteId !== null,
        onOpenChange: (o) => {
          if (!o) setDeleteId(null);
        },
        title: "Delete Pressure Log",
        description: "This will permanently remove the pressure log entry. This action cannot be undone.",
        confirmLabel: deleteLog.isPending ? "Deleting…" : "Delete",
        onConfirm: handleDelete,
        "data-ocid": "pressure-confirm-dialog"
      }
    )
  ] });
}
export {
  PressurePage as default
};
