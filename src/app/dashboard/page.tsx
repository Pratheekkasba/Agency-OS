"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MoreHorizontal,
  Download,
  TrendingUp,
  Clock,
  FileText,
  Check,
  Copy,
  Users,
  Sparkles,
  Zap,
  ChevronRight,
  Send,
} from "lucide-react";
import { AddClientModal } from "@/components/dashboard/add-client-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/context/AuthContext";
import { getAllClients, resolveOrganizationId } from "@/lib/firebase/firestore";
import { toast } from "sonner";

// --- helpers ---

function getDaysSinceUpdate(dateString: string) {
  if (!dateString) return Infinity;
  const diffTime = Math.abs(new Date().getTime() - new Date(dateString).getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function isNeedsUpdate(dateString: string) {
  return getDaysSinceUpdate(dateString) > 2;
}

function getTimeAgo(dateString: string) {
  if (!dateString) return "Never";
  const diffHours = Math.floor(
    Math.abs(new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60)
  );
  const diffDays = Math.floor(diffHours / 24);
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

/** Next update due: 7-day cycle from last update */
function getNextDue(dateString: string) {
  if (!dateString) return "Overdue";
  const last = new Date(dateString);
  const next = new Date(last.getTime() + 7 * 24 * 60 * 60 * 1000);
  const now = new Date();
  if (next < now) return "Overdue";
  const daysLeft = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return `In ${daysLeft}d`;
}

// Urgency tier based on days since last update
function getUrgencyColor(days: number) {
  if (days >= 3) return { dot: "bg-[#EF4444]", text: "text-[#EF4444]", label: "🔴" };
  if (days >= 1) return { dot: "bg-[#F59E0B]", text: "text-[#F59E0B]", label: "🟡" };
  return { dot: "bg-[#10B981]", text: "text-[#10B981]", label: "🟢" };
}

// Status badge colors
function statusBadge(status: string) {
  if (status === "Active")
    return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20";
  if (status === "At Risk")
    return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20";
  if (status === "Delayed")
    return "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20";
  if (status === "Paused")
    return "bg-[#6B7280]/10 text-[#9CA3AF] border-[#6B7280]/20";
  return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20";
}

// --- Component ---

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  const { userData } = useAuth();
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<any[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success("Access ID copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fetchData = useCallback(async () => {
    const orgId = resolveOrganizationId(userData);
    if (!orgId) return;
    setIsLoading(true);
    try {
      const fetchedClients = await getAllClients(orgId);
      setClients(fetchedClients);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Derived data ---

  const pendingClients = clients.filter(
    (c) => isNeedsUpdate(c.lastUpdateDate) && c.status !== "Paused"
  );
  const pendingUpdatesCount = pendingClients.length;

  // Avg delay for "Needs Update" card
  const avgDelay =
    pendingUpdatesCount > 0
      ? Math.round(
          pendingClients.reduce((s, c) => s + getDaysSinceUpdate(c.lastUpdateDate), 0) /
            pendingUpdatesCount
        )
      : 0;

  const displayClients = clients
    .filter((c) => {
      if (searchQuery && !c.name?.toLowerCase().includes(searchQuery)) return false;
      const needsUpdate = isNeedsUpdate(c.lastUpdateDate) && c.status !== "Paused";
      if (filter === "Active" && c.status !== "Active") return false;
      if (filter === "Needs Update" && !needsUpdate) return false;
      return true;
    })
    .sort((a, b) => {
      const aNeeds = isNeedsUpdate(a.lastUpdateDate) && a.status !== "Paused";
      const bNeeds = isNeedsUpdate(b.lastUpdateDate) && b.status !== "Paused";
      if (aNeeds && !bNeeds) return -1;
      if (!aNeeds && bNeeds) return 1;
      const dateA = a.lastUpdateDate ? new Date(a.lastUpdateDate).getTime() : 0;
      const dateB = b.lastUpdateDate ? new Date(b.lastUpdateDate).getTime() : 0;
      return dateA - dateB;
    });

  // --- Render ---

  return (
    <div className="h-full overflow-y-auto p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">


      {/* --- Header & Quick Actions --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="hidden md:block text-2xl font-bold text-white font-headline">Overview</h1>
          <p className="text-sm text-[#9CA3AF] mt-1 md:mt-1">
            Manage your clients and send weekly updates.
          </p>
        </div>

        {/* Hierarchy: Primary → Onboard | Secondary → Send Update | Hidden → New Project */}
        <div className="flex items-center gap-2">
          {/* Tertiary – ghost */}
          <button
            onClick={() => router.push("/dashboard/projects")}
            className="px-3 py-2 bg-transparent hover:bg-[#1A1A24] text-[#6B7280] hover:text-[#A1A1B5] text-sm font-medium rounded-lg transition-all duration-200"
          >
            New Project
          </button>

          {/* Secondary */}
          <button
            onClick={() => router.push("/dashboard/updates")}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A24] hover:bg-[#25252F] border border-[#2D2D3D] hover:border-[#5B5CF6]/40 text-[#E5E7EB] hover:text-white text-sm font-semibold rounded-xl transition-all duration-200"
          >
            <Send className="w-4 h-4" />
            Send Update
          </button>

          <div className="w-[1px] h-6 bg-[#2D2D3D] mx-1" />

          {/* Primary CTA */}
          <button
            onClick={() => setIsAddClientOpen(true)}
            className="px-5 py-2.5 bg-[#5B5CF6] hover:bg-[#4F50DB] border border-[#5B5CF6] text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-[0_0_15px_rgba(91,92,246,0.15)] hover:shadow-[0_0_25px_rgba(91,92,246,0.3)] flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Onboard Client
          </button>
        </div>
      </div>

      {/* --- 3. Metrics Row --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Active Clients – with MRR hint */}
        <div className="bg-[#131317] border border-[#1F1F2B] rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-[#9CA3AF]">Active Clients</h3>
            <span className="p-1.5 bg-[#5B5CF6]/10 text-[#5B5CF6] rounded-md">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-white font-headline">
            {clients.filter((c) => c.status === "Active").length}
          </p>
          <p className="text-xs text-[#9CA3AF] mt-2">
            {clients.filter((c) => c.status === "Active").length} of {clients.length} in portfolio
          </p>
        </div>

        {/* Needs Update – with avg delay */}
        <div className="bg-[#131317] border border-[#1F1F2B] rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-[#9CA3AF]">Needs Update</h3>
            <span className="p-1.5 bg-[#EF4444]/10 text-[#EF4444] rounded-md">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-white font-headline">{pendingUpdatesCount}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-[#EF4444] flex items-center gap-1">
              Waiting &gt;2 days
            </p>
            {avgDelay > 0 && (
              <span className="text-[10px] font-semibold text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20 px-2 py-0.5 rounded-full">
                Avg {avgDelay}d delay
              </span>
            )}
          </div>
        </div>

        {/* Total Clients */}
        <div className="bg-[#131317] border border-[#1F1F2B] rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-[#9CA3AF]">Total Clients</h3>
            <span className="p-1.5 bg-[#F59E0B]/10 text-[#F59E0B] rounded-md">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-white font-headline">{clients.length}</p>
          <p className="text-xs text-[#9CA3AF] mt-2">
            {clients.filter((c) => c.status === "Paused").length} paused
          </p>
        </div>
      </div>

      {/* --- 4. Client Portfolio Table --- */}
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-6">
          <div className="bg-[#131317] border border-[#1F1F2B] rounded-xl overflow-hidden shadow-sm">
            {/* Table header */}
            <div className="p-5 border-b border-[#1F1F2B] flex items-center justify-between">
              <h2 className="text-lg font-bold text-white font-headline">Client Portfolio</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-[#1A1A24] border border-[#2D2D3D] text-[#E5E7EB] text-sm font-medium rounded-lg px-3 py-2 outline-none focus:border-[#5B5CF6]/50 focus:ring-1 focus:ring-[#5B5CF6]/50 cursor-pointer shadow-sm"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Needs Update">Needs Update</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0D0D13]">
                    <th className="py-3 px-5 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Client
                    </th>
                    <th className="py-3 px-5 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-5 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="py-3 px-5 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden md:table-cell">
                      Last Updated
                    </th>
                    <th className="py-3 px-5 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden lg:table-cell">
                      Next Due
                    </th>
                    <th className="py-3 px-5 text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1F2B]">
                  {isLoading ? (
                    Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <tr key={i} className="animate-pulse border-b border-[#1F1F2B]">
                          <td className="py-4 px-5">
                            <div className="w-32 h-5 bg-[#2D2D3D] rounded" />
                          </td>
                          <td className="py-4 px-5">
                            <div className="w-16 h-5 bg-[#2D2D3D] rounded" />
                          </td>
                          <td className="py-4 px-5">
                            <div className="w-24 h-5 bg-[#2D2D3D] rounded" />
                          </td>
                          <td className="py-4 px-5 hidden md:table-cell">
                            <div className="w-20 h-5 bg-[#2D2D3D] rounded" />
                          </td>
                          <td className="py-4 px-5 hidden lg:table-cell">
                            <div className="w-16 h-5 bg-[#2D2D3D] rounded" />
                          </td>
                          <td className="py-4 px-5 text-right">
                            <div className="w-24 h-8 bg-[#2D2D3D] rounded-md ml-auto" />
                          </td>
                        </tr>
                      ))
                  ) : displayClients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8">
                        <EmptyState
                          icon={Users}
                          title={clients.length === 0 ? "No clients yet" : "No results found"}
                          description={
                            clients.length === 0
                              ? "Add your first client to start creating projects and sending updates."
                              : "Try adjusting your filters or search query."
                          }
                          variant={clients.length === 0 ? "default" : "no-results"}
                          action={
                            clients.length === 0
                              ? { label: "Onboard Client", onClick: () => setIsAddClientOpen(true) }
                              : undefined
                          }
                        />
                      </td>
                    </tr>
                  ) : (
                    displayClients.map((client) => {
                      const days = getDaysSinceUpdate(client.lastUpdateDate);
                      const urgency = getUrgencyColor(days);
                      const needsUpdate = isNeedsUpdate(client.lastUpdateDate) && client.status !== "Paused";
                      const progress = client.progress || 0;

                      return (
                        <tr
                          key={client.id}
                          className="hover:bg-[#1A1A24] hover:shadow-[inset_2px_0_0_0_#5B5CF6] transition-all group cursor-pointer duration-200"
                          onClick={() => router.push(`/dashboard/clients/${client.id}`)}
                        >
                          {/* Client name */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="relative flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-[#25252B] flex items-center justify-center text-[#9CA3AF] text-xs font-bold border border-[#2D2D3D] group-hover:bg-[#5B5CF6]/10 group-hover:text-[#5B5CF6] group-hover:border-[#5B5CF6]/30 transition-colors">
                                  {client.name.substring(0, 2).toUpperCase()}
                                </div>
                                {needsUpdate && (
                                  <span
                                    className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#131317] ${urgency.dot}`}
                                  />
                                )}
                              </div>
                              <div className="font-medium text-white group-hover:translate-x-1 transition-transform">
                                {client.name}
                              </div>
                            </div>
                          </td>

                          {/* Status badge – colored */}
                          <td className="py-4 px-5">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusBadge(
                                client.status || "Active"
                              )}`}
                            >
                              {client.status || "Active"}
                            </span>
                          </td>

                          {/* Progress bar + % label */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-[#1F1F2B] rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${progress}%`,
                                    background:
                                      progress >= 75
                                        ? "#10B981"
                                        : progress >= 40
                                        ? "#5B5CF6"
                                        : "#F59E0B",
                                  }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-[#9CA3AF] w-8 tabular-nums">
                                {progress}%
                              </span>
                            </div>
                          </td>

                          {/* Last Updated */}
                          <td className="py-4 px-5 hidden md:table-cell">
                            <div className="flex flex-col gap-1">
                              <span
                                className={`text-xs font-semibold ${
                                  needsUpdate ? urgency.text : "text-[#10B981]"
                                }`}
                              >
                                {getTimeAgo(client.lastUpdateDate)}
                              </span>
                              {needsUpdate ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#EF4444]">
                                  <span className="w-1 h-1 rounded-full bg-[#EF4444]" />
                                  Overdue
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#10B981]">
                                  <span className="w-1 h-1 rounded-full bg-[#10B981]" />
                                  Up to date
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Next Due */}
                          <td className="py-4 px-5 hidden lg:table-cell">
                            <span
                              className={`text-xs font-semibold ${
                                getNextDue(client.lastUpdateDate) === "Overdue"
                                  ? "text-[#EF4444]"
                                  : "text-[#9CA3AF]"
                              }`}
                            >
                              {getNextDue(client.lastUpdateDate)}
                            </span>
                          </td>

                          {/* Quick Update inline button */}
                          <td className="py-4 px-5 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/dashboard/updates?client=${client.id}`);
                              }}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-200 ${
                                needsUpdate
                                  ? "text-white bg-[#EF4444]/80 hover:bg-[#EF4444] border border-[#EF4444]/60 hover:shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                                  : "text-white bg-[#1F1F2B] hover:bg-[#5B5CF6] border border-[#2D2D3D] hover:border-[#5B5CF6] hover:shadow-[0_0_12px_rgba(91,92,246,0.25)]"
                              }`}
                            >
                              <Zap className="w-3 h-3" />
                              Quick Update
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onClientAdded={fetchData}
      />
    </div>
  );
}

