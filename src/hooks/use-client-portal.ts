"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { resolvePortalProgress, timestampMs } from "@/lib/portal/utils";
import type { Client, Project, Update } from "@/types";

function resolveClientIdFromStorage(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem("client-data");
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { id?: string };
    return parsed.id;
  } catch {
    return undefined;
  }
}

export function useClientPortal() {
  const { userData, loading: authLoading } = useAuth();
  const orgId = userData?.organization_id;
  const clientId = useMemo(
    () => userData?.clientId ?? resolveClientIdFromStorage(),
    [userData?.clientId]
  );

  const [client, setClient] = useState<Client | null>(null);
  const [latestUpdate, setLatestUpdate] = useState<Update | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!orgId || !clientId) {
      setLoading(false);
      if (userData?.role === "client" && !clientId) {
        setError(
          "Your account is not linked to a client profile. Sign out and re-enter your Access ID, or contact your agency."
        );
      }
      return;
    }

    setLoading(true);
    setError(null);

    let clientReady = false;
    let updatesReady = false;
    let projectsReady = false;

    const maybeDone = () => {
      if (clientReady && updatesReady && projectsReady) setLoading(false);
    };

    const unsubClient = onSnapshot(
      doc(db, "clients", clientId),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.organization_id === orgId && data.is_deleted !== true) {
            setClient({ id: snap.id, ...data } as Client);
          } else {
            setClient(null);
            setError("Client profile not found for your organization.");
          }
        } else {
          setClient(null);
          setError("Client profile not found.");
        }
        clientReady = true;
        maybeDone();
      },
      (err) => {
        console.error("[portal] client snapshot", err);
        setError("Failed to load your profile.");
        clientReady = true;
        maybeDone();
      }
    );

    const unsubUpdates = onSnapshot(
      query(
        collection(db, "updates"),
        where("organization_id", "==", orgId),
        where("clientId", "==", clientId)
      ),
      (snap) => {
        const updates = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }) as Update)
          .sort((a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt));
        setLatestUpdate(updates[0] ?? null);
        updatesReady = true;
        maybeDone();
      },
      (err) => {
        console.error("[portal] updates snapshot", err);
        updatesReady = true;
        maybeDone();
      }
    );

    const unsubProjects = onSnapshot(
      query(
        collection(db, "projects"),
        where("organization_id", "==", orgId),
        where("clientId", "==", clientId)
      ),
      (snap) => {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }) as Project)
          .filter((p) => p.is_deleted !== true)
          .sort((a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt));
        setProjects(list);
        projectsReady = true;
        maybeDone();
      },
      (err) => {
        console.error("[portal] projects snapshot", err);
        projectsReady = true;
        maybeDone();
      }
    );

    return () => {
      unsubClient();
      unsubUpdates();
      unsubProjects();
    };
  }, [authLoading, orgId, clientId, userData?.role]);

  const primaryProject = projects[0] ?? null;
  const progress = resolvePortalProgress(client?.progress, primaryProject?.progress);

  return {
    client,
    latestUpdate,
    projects,
    primaryProject,
    progress,
    loading: authLoading || loading,
    error,
  };
}
