"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useClientPortal } from "@/hooks/use-client-portal";
import { PortalHeader } from "@/components/portal/portal-header";
import { PortalLayout } from "@/components/portal/portal-layout";
import { UpdateColumns } from "@/components/portal/update-columns";
import { formatPortalDate } from "@/lib/portal/utils";

function statusLabel(clientStatus?: string, projectStatus?: string): string {
  if (clientStatus === "Completed") return "Completed";
  if (clientStatus === "Paused") return "Paused";
  if (clientStatus === "Review") return "In review";
  if (projectStatus === "completed") return "Completed";
  if (projectStatus === "paused") return "Paused";
  return "In progress";
}

export default function ClientPortal() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const { client, latestUpdate, primaryProject, progress, loading, error } =
    useClientPortal();

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.replace("/login");
      else if (userData?.role !== "client") router.replace("/dashboard");
    }
  }, [user, userData, authLoading, router]);

  if (authLoading || (user && userData?.role !== "client")) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#a4a6ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const done = latestUpdate?.done ?? [];
  const inProgress = latestUpdate?.inProgress ?? [];
  const next = latestUpdate?.next ?? [];
  const projectName =
    primaryProject?.name || client?.projectName || client?.companyName;
  const headline =
    inProgress[0] || client?.lastUpdateText || "Your agency will share an update soon.";
  const status = statusLabel(client?.status, primaryProject?.status);
  const deadline = primaryProject?.deadline || primaryProject?.dueDate;

  return (
    <PortalLayout>
      <PortalHeader client={client} />

      <main className="pt-28 pb-16 px-6 max-w-4xl mx-auto">
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-8">
            {/* Progress + project */}
            <section className="p-6 md:p-8 rounded-2xl bg-card border border-border">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                  {projectName && (
                    <p className="text-[10px] font-label uppercase tracking-widest text-muted-foreground mb-1">
                      Project
                    </p>
                  )}
                  <h2 className="font-headline text-2xl md:text-3xl font-bold text-foreground">
                    {projectName || "Your project"}
                  </h2>
                </div>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {status}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Overall progress</span>
                  <span className="font-bold text-primary tabular-nums">{progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                  />
                </div>
              </div>

              {deadline && (
                <p className="text-sm text-muted-foreground">
                  Target date:{" "}
                  <span className="text-foreground">{formatPortalDate(deadline)}</span>
                </p>
              )}
            </section>

            {/* Latest summary */}
            <section>
              <p className="text-[10px] font-label uppercase tracking-widest text-muted-foreground font-bold mb-2">
                Latest from your agency
              </p>
              <p className="text-lg md:text-xl text-foreground leading-relaxed">{headline}</p>
            </section>

            {/* Core update board */}
            <section>
              <h3 className="text-[10px] font-label uppercase tracking-widest text-muted-foreground font-bold mb-4">
                This week&apos;s update
              </h3>
              <UpdateColumns done={done} inProgress={inProgress} next={next} />
            </section>

            {/* Single footer action */}
            <footer className="pt-6 border-t border-outline-variant/10 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Questions about your project?
              </p>
              <Link
                href="/support"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
              >
                Contact your agency
              </Link>
            </footer>
          </div>
        )}
      </main>
    </PortalLayout>
  );
}
