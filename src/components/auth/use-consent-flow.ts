"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

const LS_KEY = "dm_terms_accepted";

/** Returns true if this browser has already gone through the consent flow. */
function hasAcceptedBefore(): boolean {
  try {
    return localStorage.getItem(LS_KEY) === "1";
  } catch {
    return false;
  }
}

export function markAccepted() {
  try {
    localStorage.setItem(LS_KEY, "1");
  } catch {}
}

export function useConsentFlow() {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingCallbackUrl, setPendingCallbackUrl] = useState("/dashboard");

  function openLogin(callbackUrl: string) {
    if (hasAcceptedBefore()) {
      // Already accepted terms — go straight to Google
      signIn("google", { callbackUrl });
    } else {
      setPendingCallbackUrl(callbackUrl);
      setModalOpen(true);
    }
  }

  function closeModal() {
    setModalOpen(false);
  }

  return { modalOpen, pendingCallbackUrl, openLogin, closeModal };
}
