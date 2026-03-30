"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";

interface ToastMessage {
  id: number;
  text: string;
  type: "success" | "error" | "info";
}

interface ToastContextValue {
  toast: (text: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let globalToastFn: ((text: string, type?: "success" | "error" | "info") => void) | null = null;

export function toast(text: string, type: "success" | "error" | "info" = "success") {
  if (globalToastFn) globalToastFn(text, type);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  let counter = 0;

  const addToast = useCallback((text: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now() + counter++;
    setMessages((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    globalToastFn = addToast;
    return () => { globalToastFn = null; };
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`pointer-events-auto px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium animate-slide-in border backdrop-blur-xl transition-all duration-200 ${
              msg.type === "success"
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-emerald-500/10"
                : msg.type === "error"
                ? "bg-red-500/15 text-red-300 border-red-500/30 shadow-red-500/10"
                : "bg-blue-500/15 text-blue-300 border-blue-500/30 shadow-blue-500/10"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {msg.type === "success" && (
                <svg className="w-4 h-4 flex-shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {msg.type === "error" && (
                <svg className="w-4 h-4 flex-shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {msg.type === "info" && (
                <svg className="w-4 h-4 flex-shrink-0 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
