"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div suppressHydrationWarning className="flex min-h-screen items-center justify-center bg-zinc-950">
                <div suppressHydrationWarning className="w-8 h-8 border-4 border-zinc-700 border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div suppressHydrationWarning className="min-h-screen bg-zinc-950 flex flex-col text-white pb-10">
            <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold shadow-lg shadow-blue-500/20">
                        A
                    </div>
                    <span className="font-semibold text-lg tracking-tight">Agency OS</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-medium text-zinc-300">{user.email}</span>
                    </div>
                    <button
                        onClick={signOut}
                        className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8">
                {children}
            </main>
        </div>
    );
}
