import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Droplets,
  FileText,
  Gauge,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Navigation,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/areas", label: "Areas", icon: MapPin },
  { to: "/readings", label: "Meter Readings", icon: BarChart3 },
  { to: "/pressure", label: "Pressure Logs", icon: Gauge },
  { to: "/leaks", label: "Leak Incidents", icon: Droplets },
  { to: "/map", label: "Network Map", icon: Navigation },
  { to: "/reports", label: "Daily Reports", icon: FileText },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { principal, logout } = useAuth();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-5 border-b border-white/10",
          collapsed && "justify-center px-2",
        )}
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow-sm">
          <Droplets className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white font-display font-bold text-sm leading-tight truncate">
              AquaCity
            </p>
            <p className="text-white/60 text-xs truncate">Monitor</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const isActive =
            to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              data-ocid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
              className={cn(
                "flex items-center gap-3 mx-2 mb-0.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth",
                collapsed && "justify-center px-2 mx-2",
                isActive
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="border-t border-white/10 p-3">
        {!collapsed ? (
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-white/50 text-xs">Logged in as</p>
              <p className="text-white text-xs font-mono truncate">
                {principal}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Logout"
              data-ocid="btn-logout"
              className="flex-shrink-0 p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-smooth"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={logout}
            title="Logout"
            data-ocid="btn-logout-collapsed"
            className="w-full flex items-center justify-center p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-smooth"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col flex-shrink-0 transition-all duration-300 relative",
          collapsed ? "w-16" : "w-60",
        )}
        style={{ background: "oklch(0.28 0.08 220)" }}
      >
        {sidebarContent}
        {/* Collapse toggle */}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          data-ocid="btn-sidebar-collapse"
          className="absolute top-1/2 -translate-y-1/2 -right-3 z-10 hidden md:flex w-6 h-6 rounded-full bg-card border border-border shadow-sm items-center justify-center text-muted-foreground hover:text-foreground transition-smooth"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ background: "oklch(0.28 0.08 220)" }}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
          data-ocid="btn-sidebar-close"
        >
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-card border-b border-border shadow-sm">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-smooth"
            data-ocid="btn-sidebar-open"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-foreground font-display font-semibold text-base truncate">
              AquaCity Monitor
            </h1>
            <p className="text-muted-foreground text-xs hidden sm:block">
              Smart Water Distribution Monitoring System
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>

        {/* Footer */}
        <footer className="flex-shrink-0 bg-muted/40 border-t border-border px-4 py-2 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
