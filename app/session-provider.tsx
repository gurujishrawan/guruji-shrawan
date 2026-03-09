"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Session = {
  user: {
    id: string;
    name: string;
    username: string;
    role: "admin" | "user";
  };
} | null;

type SessionContextValue = {
  data: Session;
  status: "loading" | "authenticated" | "unauthenticated";
};

const SessionContext = createContext<SessionContextValue>({
  data: null,
  status: "loading",
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Session>(null);
  const [status, setStatus] = useState<SessionContextValue["status"]>("loading");

  useEffect(() => {
    let active = true;

    fetch("/api/auth/session", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          return null;
        }
        return (await res.json()) as Session;
      })
      .then((session) => {
        if (!active) return;
        setData(session);
        setStatus(session ? "authenticated" : "unauthenticated");
      })
      .catch(() => {
        if (!active) return;
        setData(null);
        setStatus("unauthenticated");
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => ({ data, status }), [data, status]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  return useContext(SessionContext);
}
