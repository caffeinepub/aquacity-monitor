import { Button } from "@/components/ui/button";
import { Droplets, ShieldCheck } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const FEATURES = [
  "Real-time pressure & flow monitoring",
  "Leak incident detection & management",
  "Interactive pipe network map",
  "Automated daily usage aggregation",
];

export default function LoginPage() {
  const { login, loginStatus } = useAuth();
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.22 0.09 220) 0%, oklch(0.32 0.1 195) 50%, oklch(0.28 0.08 210) 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.7 0.18 200)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.65 0.2 185)" }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo card */}
        <div className="bg-card rounded-2xl shadow-2xl overflow-hidden">
          {/* Header band */}
          <div
            className="px-8 pt-10 pb-8 text-center"
            style={{ background: "oklch(0.28 0.08 220)" }}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Droplets className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-white font-display font-bold text-2xl mb-1">
              AquaCity Monitor
            </h1>
            <p className="text-white/70 text-sm">
              Smart Water Distribution Monitoring System
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            <p className="text-muted-foreground text-sm text-center mb-6">
              Sign in with Internet Identity to access the admin dashboard and
              manage your water distribution network.
            </p>

            <ul className="space-y-2 mb-8">
              {FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="btn-login"
              className="w-full h-11 text-sm font-semibold"
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                  Connecting…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Login with Internet Identity
                </span>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Secure, decentralized authentication via Internet Computer
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/40 text-xs mt-6">
          © {new Date().getFullYear()} AquaCity Monitor — Academic Capstone
          Project
        </p>
      </div>
    </div>
  );
}
