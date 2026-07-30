// app/components/ToastContainer.tsx
"use client";
import { useState, useEffect } from "react";

export type ToastMessage = {
  id: string;
  type: "success" | "info" | "error";
  message: string;
};

let toastListener: ((toast: ToastMessage) => void) | null = null;

export const showToast = (message: string, type: "success" | "info" | "error" = "info") => {
  if (toastListener) {
    toastListener({
      id: Math.random().toString(36).substring(2, 9),
      type,
      message,
    });
  }
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    toastListener = (newToast: ToastMessage) => {
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3500);
    };

    return () => {
      toastListener = null;
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-lg shadow-2xl text-white text-xs sm:text-sm font-medium border animate-slideUp backdrop-blur-md ${
            toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
              : toast.type === "error"
                ? "bg-red-950/90 border-red-500/50 text-red-200"
                : "bg-[#222222]/95 border-white/20 text-white"
          }`}
        >
          {toast.type === "success" && (
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {toast.type === "info" && (
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
