"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useClientPortal } from "@/hooks/use-client-portal";
import { PortalHeader } from "@/components/portal/portal-header";
import { PortalLayout } from "@/components/portal/portal-layout";
import { PortalMessages } from "@/components/portal/portal-messages";

export default function PortalMessagesPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const { client, loading, error } = useClientPortal();

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.replace("/login");
      else if (userData?.role !== "client") router.replace("/dashboard");
    }
  }, [user, userData, authLoading, router]);

  if (authLoading || (user && userData?.role !== "client")) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const orgId = userData?.organization_id;
  const clientId = userData?.clientId;

  return (
    <PortalLayout>
      <PortalHeader client={client} />
      <main className="pt-28 pb-16 px-6 max-w-2xl mx-auto">
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
        {!loading && !error && orgId && clientId && client && (
          <PortalMessages
            clientId={clientId}
            clientName={client.name}
            orgId={orgId}
          />
        )}
      </main>
    </PortalLayout>
  );
}
