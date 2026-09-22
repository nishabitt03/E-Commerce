"use client";

import { useSyncExternalStore } from "react";

/**
 * Returns true only after the client has hydrated.
 * Used to avoid SSR/localStorage mismatches for Zustand-backed UI.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    subscribeToClientMount,
    getClientSnapshot,
    getServerSnapshot
  );
}

function subscribeToClientMount(onStoreChange: () => void): () => void {
  // Force a post-hydration read so consumers leave the server snapshot promptly.
  const frame = requestAnimationFrame(() => onStoreChange());
  return () => cancelAnimationFrame(frame);
}

function getClientSnapshot(): boolean {
  return true;
}

function getServerSnapshot(): boolean {
  return false;
}
