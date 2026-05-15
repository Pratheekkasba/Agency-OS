"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { formatPortalDate } from "@/lib/portal/utils";
import type { Client } from "@/types";

export function PortalHeader({ client }: { client: Client | null }) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastUpdated = client?.lastUpdateDate ?? client?.updatedAt;

  return (
    <header className="flex items-center justify-between px-6 md:px-8 py-6 fixed top-0 left-0 right-0 z-50 glass-dock border-b border-outline-variant/10">
      <Link href="/portal" className="min-w-0 group">
        <h1 className="font-headline font-bold text-xl md:text-2xl tracking-tight text-on-surface truncate group-hover:text-primary transition-colors">
          {client?.companyName || client?.name || "Your Portal"}
        </h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Updated {formatPortalDate(lastUpdated)}
        </p>
      </Link>

      <div className="flex items-center gap-3 shrink-0 relative">
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant/20"
          aria-label="Account menu"
        >
          <img
            alt=""
            className="w-full h-full object-cover"
            src={
              user?.photoURL ||
              `https://api.dicebear.com/9.x/glass/svg?seed=${user?.uid || "client"}`
            }
          />
        </button>
        {isMenuOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute top-12 right-0 w-48 bg-card border border-border rounded-xl shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-border/50">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.displayName || client?.name || "Client"}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  router.replace("/login");
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 w-full text-left"
              >
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
