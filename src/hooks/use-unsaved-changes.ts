"use client";

import { useEffect, useCallback, useRef } from "react";

/**
 * Protects against accidental navigation when there are unsaved changes.
 * Handles:
 * - Browser beforeunload (close tab, refresh, external navigation)
 * - Browser back/forward (popstate)
 *
 * Returns a `confirmLeave` function for programmatic navigation guards.
 */
export function useUnsavedChanges(
  isDirty: boolean,
  message = "You have unsaved changes. Leave anyway?",
) {
  const dirtyRef = useRef(isDirty);
  dirtyRef.current = isDirty;

  // ── beforeunload: close tab, refresh, external navigation ──
  useEffect(() => {
    if (!isDirty) return;

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // ── popstate: browser back/forward button ──
  useEffect(() => {
    if (!isDirty) return;

    // Push a duplicate entry so that pressing back triggers popstate instead of leaving
    window.history.pushState(null, "", window.location.href);

    function handlePopState() {
      if (dirtyRef.current) {
        if (window.confirm(message)) {
          // User confirmed — allow the navigation by going back again
          // We need to remove our guard first
          dirtyRef.current = false;
          window.history.back();
        } else {
          // User cancelled — push state again to keep them on the page
          window.history.pushState(null, "", window.location.href);
        }
      }
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isDirty, message]);

  /**
   * Call before programmatic navigation (e.g. "Back" button click).
   * Returns true if the user confirms leaving or there are no changes.
   */
  const confirmLeave = useCallback((): boolean => {
    if (!dirtyRef.current) return true;
    return window.confirm(message);
  }, [message]);

  return { confirmLeave };
}
