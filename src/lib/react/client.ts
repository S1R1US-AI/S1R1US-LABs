import { useSyncExternalStore } from "react";

/** No-op subscribe — snapshot is read once per client render tree. */
function subscribeNoop() {
  return () => {};
}

/** True after hydration on the client; false during SSR. */
export function useIsClient() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

/** `window.location.hostname` on the client; empty string on the server. */
export function useWindowHostname() {
  return useSyncExternalStore(
    subscribeNoop,
    () => window.location.hostname,
    () => "",
  );
}

/** Full `window.location.search` on the client; empty string on the server. */
export function useWindowSearch() {
  return useSyncExternalStore(
    subscribeNoop,
    () => window.location.search,
    () => "",
  );
}

/** `window.location.hash` (without leading #) on the client; empty on the server. */
export function useWindowHash() {
  return useSyncExternalStore(
    subscribeNoop,
    () => window.location.hash.replace(/^#/, ""),
    () => "",
  );
}
