"use client";

import { create } from "zustand";

interface ToastState {
  message: string | null;
  show: (message: string) => void;
  dismiss: () => void;
}

let hideTimer: ReturnType<typeof setTimeout> | undefined;

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  show: (message) => {
    if (hideTimer) clearTimeout(hideTimer);
    set({ message });
    hideTimer = setTimeout(() => set({ message: null }), 2200);
  },
  dismiss: () => {
    if (hideTimer) clearTimeout(hideTimer);
    set({ message: null });
  },
}));
