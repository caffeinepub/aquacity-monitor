import { cn } from "@/lib/utils";
import type { StatusType } from "../types";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; classes: string; dot: string }
> = {
  Normal: {
    label: "Normal",
    classes: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
  },
  Critical: {
    label: "Critical",
    classes: "bg-red-100 text-red-800 border-red-200",
    dot: "bg-red-500",
  },
  Low: {
    label: "Low",
    classes: "bg-yellow-100 text-yellow-800 border-yellow-200",
    dot: "bg-yellow-500",
  },
  Moderate: {
    label: "Moderate",
    classes: "bg-orange-100 text-orange-800 border-orange-200",
    dot: "bg-orange-500",
  },
  Broken: {
    label: "Broken",
    classes: "bg-red-100 text-red-800 border-red-200",
    dot: "bg-red-500",
  },
  Maintenance: {
    label: "Maintenance",
    classes: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
  true: {
    label: "Resolved",
    classes: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
  },
  false: {
    label: "Active",
    classes: "bg-red-100 text-red-800 border-red-200",
    dot: "bg-red-500",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = String(status);
  const config = STATUS_CONFIG[key] ?? STATUS_CONFIG.Maintenance;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border",
        config.classes,
        className,
      )}
    >
      <span
        className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", config.dot)}
      />
      {config.label}
    </span>
  );
}
