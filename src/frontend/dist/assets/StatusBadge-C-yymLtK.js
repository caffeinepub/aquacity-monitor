import { c as createLucideIcon, j as jsxRuntimeExports, a as cn } from "./index-CHPH9FnK.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode);
const STATUS_CONFIG = {
  Normal: {
    label: "Normal",
    classes: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500"
  },
  Critical: {
    label: "Critical",
    classes: "bg-red-100 text-red-800 border-red-200",
    dot: "bg-red-500"
  },
  Low: {
    label: "Low",
    classes: "bg-yellow-100 text-yellow-800 border-yellow-200",
    dot: "bg-yellow-500"
  },
  Moderate: {
    label: "Moderate",
    classes: "bg-orange-100 text-orange-800 border-orange-200",
    dot: "bg-orange-500"
  },
  Broken: {
    label: "Broken",
    classes: "bg-red-100 text-red-800 border-red-200",
    dot: "bg-red-500"
  },
  Maintenance: {
    label: "Maintenance",
    classes: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground"
  },
  true: {
    label: "Resolved",
    classes: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500"
  },
  false: {
    label: "Active",
    classes: "bg-red-100 text-red-800 border-red-200",
    dot: "bg-red-500"
  }
};
function StatusBadge({ status, className }) {
  const key = String(status);
  const config = STATUS_CONFIG[key] ?? STATUS_CONFIG.Maintenance;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border",
        config.classes,
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: cn("w-1.5 h-1.5 rounded-full flex-shrink-0", config.dot)
          }
        ),
        config.label
      ]
    }
  );
}
export {
  StatusBadge as S,
  TriangleAlert as T
};
