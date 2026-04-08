import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, b as useComposedRefs, a as cn, B as Button, u as ue, D as Droplets } from "./index-CHPH9FnK.js";
import { u as usePrevious, e as useSize, C as Check, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, B as Badge } from "./select-CD_7Sz1Q.js";
import { e as Presence, f as Primitive, u as useControllableState, g as composeEventHandlers, h as createContextScope, L as Label, P as Pencil, T as Trash2, C as ConfirmDialog, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, I as Input, d as DialogFooter } from "./ConfirmDialog-aAlOXWHy.js";
import { S as Skeleton } from "./skeleton-DFKPQCXb.js";
import { o as useLeakIncidents, b as useAreas, p as useToggleLeakResolved, q as useDeleteLeakIncident, k as usePipes, r as useAddLeakIncident, s as useUpdateLeakIncident } from "./backend-D4bDWURE.js";
import { T as TriangleAlert, S as StatusBadge } from "./StatusBadge-C-yymLtK.js";
import { P as Plus } from "./plus-DjMOAp7k.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode);
var CHECKBOX_NAME = "Checkbox";
var [createCheckboxContext] = createContextScope(CHECKBOX_NAME);
var [CheckboxProviderImpl, useCheckboxContext] = createCheckboxContext(CHECKBOX_NAME);
function CheckboxProvider(props) {
  const {
    __scopeCheckbox,
    checked: checkedProp,
    children,
    defaultChecked,
    disabled,
    form,
    name,
    onCheckedChange,
    required,
    value = "on",
    // @ts-expect-error
    internal_do_not_use_render
  } = props;
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: CHECKBOX_NAME
  });
  const [control, setControl] = reactExports.useState(null);
  const [bubbleInput, setBubbleInput] = reactExports.useState(null);
  const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
  const isFormControl = control ? !!form || !!control.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    true
  );
  const context = {
    checked,
    disabled,
    setChecked,
    control,
    setControl,
    name,
    form,
    value,
    hasConsumerStoppedPropagationRef,
    required,
    defaultChecked: isIndeterminate(defaultChecked) ? false : defaultChecked,
    isFormControl,
    bubbleInput,
    setBubbleInput
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CheckboxProviderImpl,
    {
      scope: __scopeCheckbox,
      ...context,
      children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
    }
  );
}
var TRIGGER_NAME = "CheckboxTrigger";
var CheckboxTrigger = reactExports.forwardRef(
  ({ __scopeCheckbox, onKeyDown, onClick, ...checkboxProps }, forwardedRef) => {
    const {
      control,
      value,
      disabled,
      checked,
      required,
      setControl,
      setChecked,
      hasConsumerStoppedPropagationRef,
      isFormControl,
      bubbleInput
    } = useCheckboxContext(TRIGGER_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setControl);
    const initialCheckedStateRef = reactExports.useRef(checked);
    reactExports.useEffect(() => {
      const form = control == null ? void 0 : control.form;
      if (form) {
        const reset = () => setChecked(initialCheckedStateRef.current);
        form.addEventListener("reset", reset);
        return () => form.removeEventListener("reset", reset);
      }
    }, [control, setChecked]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        role: "checkbox",
        "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
        "aria-required": required,
        "data-state": getState(checked),
        "data-disabled": disabled ? "" : void 0,
        disabled,
        value,
        ...checkboxProps,
        ref: composedRefs,
        onKeyDown: composeEventHandlers(onKeyDown, (event) => {
          if (event.key === "Enter") event.preventDefault();
        }),
        onClick: composeEventHandlers(onClick, (event) => {
          setChecked((prevChecked) => isIndeterminate(prevChecked) ? true : !prevChecked);
          if (bubbleInput && isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })
      }
    );
  }
);
CheckboxTrigger.displayName = TRIGGER_NAME;
var Checkbox$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCheckbox,
      name,
      checked,
      defaultChecked,
      required,
      disabled,
      value,
      onCheckedChange,
      form,
      ...checkboxProps
    } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CheckboxProvider,
      {
        __scopeCheckbox,
        checked,
        defaultChecked,
        disabled,
        required,
        onCheckedChange,
        name,
        form,
        value,
        internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxTrigger,
            {
              ...checkboxProps,
              ref: forwardedRef,
              __scopeCheckbox
            }
          ),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxBubbleInput,
            {
              __scopeCheckbox
            }
          )
        ] })
      }
    );
  }
);
Checkbox$1.displayName = CHECKBOX_NAME;
var INDICATOR_NAME = "CheckboxIndicator";
var CheckboxIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCheckbox, forceMount, ...indicatorProps } = props;
    const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Presence,
      {
        present: forceMount || isIndeterminate(context.checked) || context.checked === true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            "data-state": getState(context.checked),
            "data-disabled": context.disabled ? "" : void 0,
            ...indicatorProps,
            ref: forwardedRef,
            style: { pointerEvents: "none", ...props.style }
          }
        )
      }
    );
  }
);
CheckboxIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "CheckboxBubbleInput";
var CheckboxBubbleInput = reactExports.forwardRef(
  ({ __scopeCheckbox, ...props }, forwardedRef) => {
    const {
      control,
      hasConsumerStoppedPropagationRef,
      checked,
      defaultChecked,
      required,
      disabled,
      name,
      value,
      form,
      bubbleInput,
      setBubbleInput
    } = useCheckboxContext(BUBBLE_INPUT_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = bubbleInput;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      const bubbles = !hasConsumerStoppedPropagationRef.current;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        input.indeterminate = isIndeterminate(checked);
        setChecked.call(input, isIndeterminate(checked) ? false : checked);
        input.dispatchEvent(event);
      }
    }, [bubbleInput, prevChecked, checked, hasConsumerStoppedPropagationRef]);
    const defaultCheckedRef = reactExports.useRef(isIndeterminate(checked) ? false : checked);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: defaultChecked ?? defaultCheckedRef.current,
        required,
        disabled,
        name,
        value,
        form,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
CheckboxBubbleInput.displayName = BUBBLE_INPUT_NAME;
function isFunction(value) {
  return typeof value === "function";
}
function isIndeterminate(checked) {
  return checked === "indeterminate";
}
function getState(checked) {
  return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Checkbox$1,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckboxIndicator,
        {
          "data-slot": "checkbox-indicator",
          className: "flex items-center justify-center text-current transition-none",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" })
        }
      )
    }
  );
}
const DEFAULT_FORM = {
  pipe_id: "",
  area_id: "",
  severity: "",
  reported_time: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16),
  latitude: "",
  longitude: "",
  resolved: false
};
function StatsBar({ leaks }) {
  const total = leaks.length;
  const critical = leaks.filter((l) => l.leak_severity === "Critical").length;
  const unresolved = leaks.filter((l) => !l.resolved_status).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Droplets, { className: "w-4 h-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-primary", children: total }),
        " total"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-red-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-red-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-red-600", children: critical }),
        " critical"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-orange-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-orange-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-orange-600", children: unresolved }),
        " ",
        "unresolved"
      ] })
    ] })
  ] });
}
function LeakModal({ open, onOpenChange, editing, onClose }) {
  const { data: areas = [] } = useAreas();
  const { data: pipes = [] } = usePipes();
  const addMutation = useAddLeakIncident();
  const updateMutation = useUpdateLeakIncident();
  const [form, setForm] = reactExports.useState(
    () => editing ? {
      pipe_id: editing.pipe_id.toString(),
      area_id: editing.area_id.toString(),
      severity: editing.leak_severity,
      reported_time: editing.reported_time.slice(0, 16),
      latitude: editing.latitude.toString(),
      longitude: editing.longitude.toString(),
      resolved: editing.resolved_status
    } : DEFAULT_FORM
  );
  reactExports.useMemo(() => {
    if (editing) {
      setForm({
        pipe_id: editing.pipe_id.toString(),
        area_id: editing.area_id.toString(),
        severity: editing.leak_severity,
        reported_time: editing.reported_time.slice(0, 16),
        latitude: editing.latitude.toString(),
        longitude: editing.longitude.toString(),
        resolved: editing.resolved_status
      });
    } else {
      setForm(DEFAULT_FORM);
    }
  }, [editing]);
  const isLoading = addMutation.isPending || updateMutation.isPending;
  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  async function handleSubmit() {
    if (!form.pipe_id || !form.area_id || !form.severity || !form.reported_time || !form.latitude || !form.longitude) {
      ue.error("Please fill in all required fields.");
      return;
    }
    const payload = {
      pipe_id: BigInt(form.pipe_id),
      area_id: BigInt(form.area_id),
      severity: form.severity,
      reported_time: form.reported_time,
      resolved: form.resolved,
      lat: Number.parseFloat(form.latitude),
      lng: Number.parseFloat(form.longitude)
    };
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.leak_id, ...payload });
        ue.success("Leak incident updated.");
      } else {
        await addMutation.mutateAsync(payload);
        ue.success("Leak incident added.");
      }
      onClose();
    } catch {
      ue.error("Failed to save incident. Please try again.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit Leak Incident" : "Add Leak Incident" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "leak-pipe", children: "Pipe *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: form.pipe_id,
            onValueChange: (v) => set("pipe_id", v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "leak-pipe", "data-ocid": "leak-form-pipe", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select pipe…" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: pipes.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                SelectItem,
                {
                  value: p.pipe_id.toString(),
                  children: [
                    "Pipe #",
                    p.pipe_id.toString(),
                    " — Ø",
                    p.diameter,
                    "mm (",
                    p.status,
                    ")"
                  ]
                },
                p.pipe_id.toString()
              )) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "leak-area", children: "Area *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: form.area_id,
            onValueChange: (v) => set("area_id", v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "leak-area", "data-ocid": "leak-form-area", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select area…" }) }),
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
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "leak-severity", children: "Severity *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: form.severity,
            onValueChange: (v) => set("severity", v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "leak-severity", "data-ocid": "leak-form-severity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select severity…" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Critical", children: "Critical" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Moderate", children: "Moderate" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Low", children: "Low" })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "leak-time", children: "Reported Time *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "leak-time",
            type: "datetime-local",
            value: form.reported_time,
            onChange: (e) => set("reported_time", e.target.value),
            "data-ocid": "leak-form-time"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "leak-lat", children: "Latitude *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "leak-lat",
            type: "number",
            step: "any",
            placeholder: "e.g. 18.5204",
            value: form.latitude,
            onChange: (e) => set("latitude", e.target.value),
            "data-ocid": "leak-form-lat"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "leak-lng", children: "Longitude *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "leak-lng",
            type: "number",
            step: "any",
            placeholder: "e.g. 73.8567",
            value: form.longitude,
            onChange: (e) => set("longitude", e.target.value),
            "data-ocid": "leak-form-lng"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Checkbox,
          {
            id: "leak-resolved",
            checked: form.resolved,
            onCheckedChange: (v) => set("resolved", Boolean(v)),
            "data-ocid": "leak-form-resolved"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "leak-resolved", className: "cursor-pointer", children: "Mark as resolved" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: onClose,
          disabled: isLoading,
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: handleSubmit,
          disabled: isLoading,
          "data-ocid": "leak-form-submit",
          children: [
            isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
            editing ? "Update Incident" : "Add Incident"
          ]
        }
      )
    ] })
  ] }) });
}
function LeaksPage() {
  const { data: leaks = [], isLoading } = useLeakIncidents();
  const { data: areas = [] } = useAreas();
  const toggleMutation = useToggleLeakResolved();
  const deleteMutation = useDeleteLeakIncident();
  const [severityFilter, setSeverityFilter] = reactExports.useState("All");
  const [statusFilter, setStatusFilter] = reactExports.useState("All");
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [editingLeak, setEditingLeak] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [togglingId, setTogglingId] = reactExports.useState(null);
  const areaMap = reactExports.useMemo(
    () => new Map(areas.map((a) => [a.area_id.toString(), a.area_name])),
    [areas]
  );
  const filtered = reactExports.useMemo(() => {
    return leaks.filter((l) => {
      const sevOk = severityFilter === "All" || l.leak_severity === severityFilter;
      const statOk = statusFilter === "All" || statusFilter === "Resolved" && l.resolved_status || statusFilter === "Unresolved" && !l.resolved_status;
      return sevOk && statOk;
    });
  }, [leaks, severityFilter, statusFilter]);
  const sorted = reactExports.useMemo(() => {
    const order = { Critical: 0, Moderate: 1, Low: 2 };
    return [...filtered].sort((a, b) => {
      const sevDiff = (order[a.leak_severity] ?? 3) - (order[b.leak_severity] ?? 3);
      if (sevDiff !== 0) return sevDiff;
      return b.reported_time.localeCompare(a.reported_time);
    });
  }, [filtered]);
  async function handleToggle(leak) {
    setTogglingId(leak.leak_id);
    try {
      await toggleMutation.mutateAsync(leak.leak_id);
      ue.success(
        leak.resolved_status ? "Incident reopened." : "Incident marked as resolved."
      );
    } catch {
      ue.error("Failed to update status.");
    } finally {
      setTogglingId(null);
    }
  }
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.leak_id);
      ue.success("Leak incident deleted.");
      setDeleteTarget(null);
    } catch {
      ue.error("Failed to delete incident.");
    }
  }
  function openAdd() {
    setEditingLeak(null);
    setModalOpen(true);
  }
  function openEdit(leak) {
    setEditingLeak(leak);
    setModalOpen(true);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-display font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-6 h-6 text-destructive" }),
          "Leak Incidents"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Monitor, manage, and resolve water leak incidents across the distribution network." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: openAdd,
          className: "shrink-0",
          "data-ocid": "leak-add-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
            "Add Incident"
          ]
        }
      )
    ] }),
    !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(StatsBar, { leaks }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 p-4 rounded-lg bg-card border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-[180px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground whitespace-nowrap", children: "Severity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: severityFilter,
            onValueChange: (v) => setSeverityFilter(v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "filter-severity", className: "h-8 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All", children: "All Severities" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Critical", children: "Critical" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Moderate", children: "Moderate" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Low", children: "Low" })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-[180px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground whitespace-nowrap", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: statusFilter,
            onValueChange: (v) => setStatusFilter(v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "filter-status", className: "h-8 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All", children: "All Statuses" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Unresolved", children: "Unresolved" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Resolved", children: "Resolved" })
              ] })
            ]
          }
        )
      ] }),
      (severityFilter !== "All" || statusFilter !== "All") && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "self-center text-xs", children: [
        sorted.length,
        " result",
        sorted.length !== 1 ? "s" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border bg-card overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-muted-foreground", children: "Leak ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-muted-foreground", children: "Pipe ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-muted-foreground", children: "Area" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-muted-foreground", children: "Severity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-muted-foreground", children: "Reported Time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-muted-foreground", children: "Resolved" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-semibold text-muted-foreground", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? ["r0", "r1", "r2", "r3", "r4"].map((rk) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border last:border-0", children: ["c0", "c1", "c2", "c3", "c4", "c5", "c6"].map((ck) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-full" }) }, `${rk}-${ck}`)) }, rk)) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "td",
        {
          colSpan: 7,
          className: "px-4 py-16 text-center",
          "data-ocid": "leak-empty-state",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-10 h-10 text-muted-foreground/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-medium", children: "No leak incidents found" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs", children: severityFilter !== "All" || statusFilter !== "All" ? "Try adjusting your filters." : "Add your first incident to get started." }),
            severityFilter === "All" && statusFilter === "All" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                onClick: openAdd,
                className: "mt-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5 mr-1" }),
                  " Add Incident"
                ]
              }
            )
          ] })
        }
      ) }) : sorted.map((leak) => {
        const isToggling = togglingId === leak.leak_id;
        const rowClass = leak.leak_severity === "Critical" ? "data-table-row-critical" : leak.leak_severity === "Moderate" ? "border-l-4 border-l-orange-400" : "border-l-4 border-l-yellow-400";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: `border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${rowClass}`,
            "data-ocid": "leak-row",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: [
                "#",
                leak.leak_id.toString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: [
                "#",
                leak.pipe_id.toString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: areaMap.get(leak.area_id.toString()) ?? `Area #${leak.area_id}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatusBadge,
                {
                  status: leak.leak_severity
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground tabular-nums", children: new Date(leak.reported_time).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short"
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: leak.resolved_status }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: leak.resolved_status ? "outline" : "default",
                    className: "h-7 text-xs px-2.5",
                    onClick: () => handleToggle(leak),
                    disabled: isToggling,
                    "data-ocid": `leak-toggle-${leak.leak_id}`,
                    children: isToggling ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin" }) : leak.resolved_status ? "Reopen" : "Mark Resolved"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "ghost",
                    className: "h-7 w-7 p-0",
                    onClick: () => openEdit(leak),
                    "aria-label": "Edit incident",
                    "data-ocid": `leak-edit-${leak.leak_id}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "ghost",
                    className: "h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10",
                    onClick: () => setDeleteTarget(leak),
                    "aria-label": "Delete incident",
                    "data-ocid": `leak-delete-${leak.leak_id}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                  }
                )
              ] }) })
            ]
          },
          leak.leak_id.toString()
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      LeakModal,
      {
        open: modalOpen,
        onOpenChange: setModalOpen,
        editing: editingLeak,
        onClose: () => {
          setModalOpen(false);
          setEditingLeak(null);
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: !!deleteTarget,
        onOpenChange: (open) => {
          if (!open) setDeleteTarget(null);
        },
        title: "Delete Leak Incident",
        description: "This will permanently remove the leak incident and all associated data. This action cannot be undone.",
        confirmLabel: "Delete",
        variant: "destructive",
        onConfirm: handleDelete
      }
    )
  ] });
}
export {
  LeaksPage as default
};
