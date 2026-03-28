"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { toast } from "@/components/Toast";

const STORAGE_KEY = "tradeinvoice_active_timer";
const MAX_TIMER_HOURS = 12;
const MAX_TIMER_MS = MAX_TIMER_HOURS * 60 * 60 * 1000;

interface TimerState {
  startTime: string; // ISO string
  description: string;
  clientId: string;
  clientName: string;
  hourlyRate: string;
}

interface TimerContextValue {
  timerRunning: boolean;
  timerStart: Date | null;
  timerElapsed: number;
  timerDescription: string;
  timerClientId: string;
  timerClientName: string;
  timerRate: string;
  setTimerDescription: (v: string) => void;
  setTimerClientId: (id: string, name?: string) => void;
  setTimerRate: (v: string) => void;
  startTimer: () => void;
  stopTimer: () => Promise<boolean>;
}

const TimerContext = createContext<TimerContextValue>({
  timerRunning: false,
  timerStart: null,
  timerElapsed: 0,
  timerDescription: "",
  timerClientId: "",
  timerClientName: "",
  timerRate: "50",
  setTimerDescription: () => {},
  setTimerClientId: () => {},
  setTimerRate: () => {},
  startTimer: () => {},
  stopTimer: async () => false,
});

export function useTimer() {
  return useContext(TimerContext);
}

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerStart, setTimerStart] = useState<Date | null>(null);
  const [timerElapsed, setTimerElapsed] = useState(0);
  const [timerDescription, setTimerDescription] = useState("");
  const [timerClientId, setTimerClientIdState] = useState("");
  const [timerClientName, setTimerClientName] = useState("");
  const [timerRate, setTimerRate] = useState("50");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);

  const saveToLocalStorage = useCallback((state: TimerState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* quota exceeded or private browsing */ }
  }, []);

  const clearLocalStorage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
  }, []);

  const saveToDb = useCallback(async (state: TimerState) => {
    try {
      await fetch("/api/active-timer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime: state.startTime,
          description: state.description,
          clientId: state.clientId || null,
          hourlyRate: state.hourlyRate,
        }),
      });
    } catch { /* offline or not logged in */ }
  }, []);

  const clearDb = useCallback(async () => {
    try {
      await fetch("/api/active-timer", { method: "DELETE" });
    } catch { /* ignore */ }
  }, []);

  const autoStopTimer = useCallback(async (startDate: Date, desc: string, clientId: string, rate: string) => {
    const endTime = new Date(startDate.getTime() + MAX_TIMER_MS);
    const hours = MAX_TIMER_HOURS;

    try {
      const res = await fetch("/api/time-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: desc || "Untitled task",
          date: startDate.toISOString(),
          startTime: startDate.toISOString(),
          endTime: endTime.toISOString(),
          hours,
          hourlyRate: parseFloat(rate) || 50,
          billable: true,
          clientId: clientId || null,
        }),
      });
      if (res.ok) {
        toast(`Timer auto-stopped after ${MAX_TIMER_HOURS}h. Entry saved.`, "info");
      } else {
        toast(`Timer auto-stopped after ${MAX_TIMER_HOURS}h but failed to save.`, "error");
      }
    } catch {
      toast(`Timer auto-stopped after ${MAX_TIMER_HOURS}h but failed to save.`, "error");
    }

    setTimerRunning(false);
    setTimerStart(null);
    setTimerElapsed(0);
    setTimerDescription("");
    setTimerClientIdState("");
    setTimerClientName("");
    clearLocalStorage();
    clearDb();
  }, [clearLocalStorage, clearDb]);

  // Restore timer on mount - check localStorage first, then DB
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    async function restore() {
      let restored = false;

      // Try localStorage first
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const state: TimerState = JSON.parse(stored);
          const start = new Date(state.startTime);
          const elapsed = Date.now() - start.getTime();

          if (elapsed >= MAX_TIMER_MS) {
            // Auto-stop: timer exceeded max hours
            clearLocalStorage();
            await autoStopTimer(start, state.description, state.clientId, state.hourlyRate);
            return;
          }

          setTimerStart(start);
          setTimerRunning(true);
          setTimerElapsed(Math.floor(elapsed / 1000));
          setTimerDescription(state.description);
          setTimerClientIdState(state.clientId);
          setTimerClientName(state.clientName || "");
          setTimerRate(state.hourlyRate);
          restored = true;
        }
      } catch { /* ignore localStorage errors */ }

      // If localStorage had nothing, check DB
      if (!restored) {
        try {
          const res = await fetch("/api/active-timer");
          if (res.ok) {
            const timer = await res.json();
            if (timer && timer.startTime) {
              const start = new Date(timer.startTime);
              const elapsed = Date.now() - start.getTime();

              if (elapsed >= MAX_TIMER_MS) {
                await autoStopTimer(start, timer.description, timer.clientId || "", String(timer.hourlyRate));
                return;
              }

              setTimerStart(start);
              setTimerRunning(true);
              setTimerElapsed(Math.floor(elapsed / 1000));
              setTimerDescription(timer.description || "");
              setTimerClientIdState(timer.clientId || "");
              setTimerClientName(timer.client?.name || "");
              setTimerRate(String(timer.hourlyRate));

              // Sync to localStorage
              saveToLocalStorage({
                startTime: start.toISOString(),
                description: timer.description || "",
                clientId: timer.clientId || "",
                clientName: timer.client?.name || "",
                hourlyRate: String(timer.hourlyRate),
              });
            }
          }
        } catch { /* not logged in or offline */ }
      }
    }

    restore();
  }, [autoStopTimer, clearLocalStorage, saveToLocalStorage]);

  // Tick interval
  useEffect(() => {
    if (timerRunning && timerStart) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - timerStart.getTime()) / 1000);
        setTimerElapsed(elapsed);

        // Check auto-stop
        if (elapsed * 1000 >= MAX_TIMER_MS) {
          if (timerRef.current) clearInterval(timerRef.current);
          autoStopTimer(timerStart, timerDescription, timerClientId, timerRate);
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, timerStart, timerDescription, timerClientId, timerRate, autoStopTimer]);

  const startTimer = useCallback(() => {
    const now = new Date();
    setTimerStart(now);
    setTimerRunning(true);
    setTimerElapsed(0);

    const state: TimerState = {
      startTime: now.toISOString(),
      description: timerDescription,
      clientId: timerClientId,
      clientName: timerClientName,
      hourlyRate: timerRate,
    };
    saveToLocalStorage(state);
    saveToDb(state);
  }, [timerDescription, timerClientId, timerClientName, timerRate, saveToLocalStorage, saveToDb]);

  const stopTimer = useCallback(async (): Promise<boolean> => {
    if (!timerStart) return false;
    setTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const endTime = new Date();
    const hours = Math.round(((endTime.getTime() - timerStart.getTime()) / (1000 * 60 * 60)) * 100) / 100;

    if (hours < 0.01) {
      toast("Timer too short to record", "error");
      setTimerStart(null);
      setTimerElapsed(0);
      clearLocalStorage();
      clearDb();
      return false;
    }

    try {
      const res = await fetch("/api/time-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: timerDescription || "Untitled task",
          date: new Date().toISOString(),
          startTime: timerStart.toISOString(),
          endTime: endTime.toISOString(),
          hours,
          hourlyRate: parseFloat(timerRate) || 50,
          billable: true,
          clientId: timerClientId || null,
        }),
      });

      if (res.status === 403) {
        toast("Time tracking requires a Pro plan", "error");
        return false;
      }
      if (!res.ok) throw new Error();

      toast("Time entry saved", "success");
      setTimerDescription("");
      setTimerElapsed(0);
      setTimerStart(null);
      setTimerClientIdState("");
      setTimerClientName("");
      clearLocalStorage();
      clearDb();
      return true;
    } catch {
      toast("Failed to save time entry", "error");
      return false;
    }
  }, [timerStart, timerDescription, timerClientId, timerRate, clearLocalStorage, clearDb]);

  const setTimerClientId = useCallback((id: string, name?: string) => {
    setTimerClientIdState(id);
    if (name !== undefined) setTimerClientName(name);
  }, []);

  return (
    <TimerContext.Provider
      value={{
        timerRunning,
        timerStart,
        timerElapsed,
        timerDescription,
        timerClientId,
        timerClientName,
        timerRate,
        setTimerDescription,
        setTimerClientId,
        setTimerRate,
        startTimer,
        stopTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}
