import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const { identity, login, clear, loginStatus, isInitializing } =
    useInternetIdentity();

  const isAuthenticated = !!identity;

  const principal = identity
    ? (() => {
        const full = identity.getPrincipal().toText();
        if (full === "2vxsx-fae") return "Anonymous";
        // Show first 5 + ... + last 3 chars
        return full.length > 12
          ? `${full.slice(0, 5)}...${full.slice(-3)}`
          : full;
      })()
    : null;

  return {
    isAuthenticated,
    isInitializing,
    principal,
    loginStatus,
    login,
    logout: clear,
    identity,
  };
}
