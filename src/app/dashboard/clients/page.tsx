"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Plus, MoreVertical, LayoutGrid, Eye,
  Copy, Sparkles, Send, TrendingUp, Users,
  Clock, ChevronRight, List,
} from "lucide-react";
import { AddClientModal } from "@/components/dashboard/add-client-modal";
import { useAuth } from "@/context/AuthContext";
import { subscribeToClients, resolveOrganizationId } from "@/lib/firebase/firestore";
import { toast } from "sonner";

// --- helpers ---

const getDaysSince = (d: string) => {
  if (!d) return Infinity;
  return Math.floor(Math.abs(Date.now() - new Date(d).getTime()) / 86400000);
};

const isNeedsUpdate = (d: string) => getDaysSince(d) > 2;

const getTimeAgo = (d: string) => {
  if (!d) return "Never";
  const h = Math.floor(Math.abs(Date.now() - new Date(d).getTime()) / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
};

function progressColor(p: number) {
  if (p >= 75) return "from-[#10B981] to-[#34D399]";
  if (p >= 40) return "from-[#5B5CF6] to-[#8183FF]";
  return "from-[#F59E0B] to-[#FCD34D]";
}

function statusStyle(s?: string) {
  if (s === "Active")  return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20";
  if (s === "Paused")  return "bg-[#6B7280]/10 text-[#9CA3AF] border-[#6B7280]/20";
  if (s === "At Risk") return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20";
  return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20";
}

// Stable avatar color from name
const PALETTE = [
  "bg-[#5B5CF6]", "bg-[#0EA5E9]", "bg-[#10B981]",
  "bg-[#F59E0B]", "bg-[#8B5CF6]", "bg-[#EC4899]",
  "bg-[#14B8A6]", "bg-[#EF4444]",
];
const avatarBg = (name: string) => PALETTE[name.charCodeAt(0) % PALETTE.length];

// --- Grid Card ---

function ClientCard({ client }: { client: any }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const progress = client.progress || 0;

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    const t = setTimeout(() => document.addEventListener("click", close), 0);
    return () => { clearTimeout(t); document.removeEventListener("click", close); };
  }, [menuOpen]);

  return (
    <div
      onClick={() => router.push(`/dashboard/clients/${client.id}`)}
      className="bg-[#131317] border border-[#1F1F2B] hover:border-[#2D2D3D] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer flex flex-col"
    >
      {/* Top bar */}
      <div className={`h-[2px] w-full bg-gradient-to-r ${progressColor(progress)}`} />

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-11 h-11 rounded-xl ${avatarBg(client.name)} flex items-center justify-center flex-shrink-0`}>
              <span className="text-white font-black text-sm uppercase">
                {client.name.substring(0, 2)}
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-bold text-white truncate leading-snug">
                {client.name}
              </h3>
              <p className="text-[11px] text-[#6B7280] truncate mt-0.5">
                {client.email || "No email"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${statusStyle(client.status)}`}>
              {client.status ?? "Active"}
            </span>
            <div className="relative">
              <button
                onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                className="text-[#3D3D4D] hover:text-white p-1.5 rounded-lg hover:bg-[#1A1A24] transition-colors"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-44 bg-[#1A1A24] border border-[#2D2D3D] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden z-20 py-1"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => { setMenuOpen(false); router.push(`/dashboard/clients/${client.id}`); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#E5E7EB] hover:bg-[#252533] transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#6B7280]" /> View Details
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); router.push(`/dashboard/updates?client=${client.id}`); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#E5E7EB] hover:bg-[#252533] transition-colors flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5 text-[#6B7280]" /> Send Update
                  </button>
                  <div className="h-px bg-[#2D2D3D] my-1" />
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(client.accessId || "");
                      toast.success("Access ID copied!");
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#E5E7EB] hover:bg-[#252533] transition-colors flex items-center gap-2"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#6B7280]" /> Copy Access ID
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-widest">Progress</span>
            <span className="text-[11px] font-bold text-white tabular-nums">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-[#1A1A24] rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${progressColor(progress)} rounded-full transition-all duration-700`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Update preview */}
        <div className="bg-[#0D0D13] border border-[#1F1F2B] rounded-xl p-3.5 flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-bold text-[#3D3D4D] uppercase tracking-widest">Latest Update</span>
            <span className="text-[10px] text-[#6B7280]">{getTimeAgo(client.lastUpdateDate)}</span>
          </div>
          <p className="text-[12px] text-[#6B7280] italic line-clamp-2 leading-relaxed">
            {client.lastUpdateText || "No updates yet."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 pt-1 border-t border-[#1A1A24]">
          <button
            onClick={e => { e.stopPropagation(); router.push(`/dashboard/clients/${client.id}`); }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-transparent hover:bg-[#1A1A24] border border-[#1F1F2B] hover:border-[#2D2D3D] text-[#6B7280] hover:text-white text-[11px] font-semibold rounded-xl py-2.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5" /> View
          </button>
          <button
            onClick={e => { e.stopPropagation(); router.push(`/dashboard/updates?client=${client.id}`); }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#5B5CF6]/10 hover:bg-[#5B5CF6] border border-[#5B5CF6]/25 hover:border-[#5B5CF6] text-[#A4A6FF] hover:text-white text-[11px] font-semibold rounded-xl py-2.5 transition-all hover:shadow-[0_4px_15px_rgba(91,92,246,0.25)]"
          >
            <Send className="w-3.5 h-3.5" /> Send Update
          </button>
        </div>
      </div>
    </div>
  );
}

// --- List Row ---

function ClientRow({ client }: { client: any }) {
  const router = useRouter();
  const progress = client.progress || 0;

  return (
    <tr
      onClick={() => router.push(`/dashboard/clients/${client.id}`)}
      className="hover:bg-[#1A1A24] hover:shadow-[inset_2px_0_0_0_#5B5CF6] transition-all cursor-pointer group"
    >
      <td className="py-3.5 px-5">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${avatarBg(client.name)} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-bold text-xs uppercase">{client.name.substring(0, 2)}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white group-hover:text-[#A4A6FF] transition-colors">
              {client.name}
            </p>
            <p className="text-[11px] text-[#6B7280]">{client.email || "---"}</p>
          </div>
        </div>
      </td>
      <td className="py-3.5 px-5">
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${statusStyle(client.status)}`}>
          {client.status ?? "Active"}
        </span>
      </td>
      <td className="py-3.5 px-5">
        <div className="flex items-center gap-2.5">
          <div className="w-20 h-1.5 bg-[#1A1A24] rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${progressColor(progress)} rounded-full`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-bold text-white tabular-nums w-8">{progress}%</span>
        </div>
      </td>
      <td className="py-3.5 px-5 hidden md:table-cell">
        <span className="text-sm text-[#6B7280]">{getTimeAgo(client.lastUpdateDate)}</span>
      </td>
      <td className="py-3.5 px-5 text-right">
        <button
          onClick={e => { e.stopPropagation(); router.push(`/dashboard/updates?client=${client.id}`); }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-[#A4A6FF] hover:text-white bg-[#5B5CF6]/10 hover:bg-[#5B5CF6] border border-[#5B5CF6]/25 hover:border-[#5B5CF6] rounded-lg transition-all"
        >
          <Send className="w-3 h-3" /> Update
        </button>
      </td>
    </tr>
  );
}

// --- Page ---

export default function ClientsPage() {
  const router = useRouter();
  const { userData } = useAuth();

  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    const orgId = resolveOrganizationId(userData);
    if (!orgId) return;

    setIsLoading(true);
    const unsubscribe = subscribeToClients(
      orgId,
      (updatedClients) => {
        setClients(updatedClients);
        setIsLoading(false);
      },
      (err) => {
        console.error("Failed to sync clients:", err);
        toast.error("Real-time sync failed.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userData]);

  const displayClients = clients
    .filter(c => {
      if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filter === "Active" && c.status !== "Active") return false;
      if (filter === "Needs Update" && !(c.status !== "Paused" && isNeedsUpdate(c.lastUpdateDate))) return false;
      return true;
    })
    .sort((a, b) => new Date(a.lastUpdateDate || 0).getTime() - new Date(b.lastUpdateDate || 0).getTime());

  return (
    <div className="h-full overflow-y-auto p-8 max-w-7xl mx-auto space-y-6 animate-fade-in pb-20">

      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Clients
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            {isLoading ? "Loading…" : `${clients.length} client${clients.length !== 1 ? "s" : ""} · ${clients.filter(c => c.status === "Active").length} active`}
          </p>
        </div>
        <button
          onClick={() => setIsAddClientOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#5B5CF6] hover:bg-[#4F50DB] text-white text-sm font-bold rounded-xl transition-all shadow-[0_4px_15px_rgba(91,92,246,0.2)] hover:shadow-[0_4px_25px_rgba(91,92,246,0.35)]"
        >
          <Sparkles className="w-4 h-4" /> Onboard Client
        </button>
      </div>

      {/* --- Toolbar --- */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        {/* Search */}
        <div className="relative w-full sm:w-72 group">
          <Search className="w-4 h-4 text-[#4B5563] absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-[#5B5CF6] transition-colors pointer-events-none" />
          <input
            type="text"
            placeholder="Search clients…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#131317] border border-[#1F1F2B] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#4B5563] focus:outline-none focus:border-[#5B5CF6]/50 focus:ring-1 focus:ring-[#5B5CF6]/30 transition-all"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2">
          {["All", "Active", "Needs Update"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all border ${
                filter === f
                  ? "bg-[#5B5CF6]/15 border-[#5B5CF6]/35 text-[#A4A6FF]"
                  : "bg-[#131317] border-[#1F1F2B] text-[#6B7280] hover:border-[#2D2D3D] hover:text-[#9CA3AF]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="ml-auto flex items-center bg-[#131317] border border-[#1F1F2B] rounded-xl p-1 gap-1">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-[#1F1F2B] text-white" : "text-[#4B5563] hover:text-[#9CA3AF]"}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-[#1F1F2B] text-white" : "text-[#4B5563] hover:text-[#9CA3AF]"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* --- Content --- */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-[#131317] border border-[#1F1F2B] rounded-2xl overflow-hidden animate-pulse">
              <div className="h-[2px] bg-[#1F1F2B]" />
              <div className="p-5 space-y-4">
                <div className="flex gap-3 items-center">
                  <div className="w-11 h-11 rounded-xl bg-[#1F1F2B]" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-28 bg-[#1F1F2B] rounded" />
                    <div className="h-3 w-20 bg-[#1F1F2B] rounded" />
                  </div>
                </div>
                <div className="h-1.5 w-full bg-[#1F1F2B] rounded-full" />
                <div className="h-16 bg-[#1F1F2B] rounded-xl" />
                <div className="flex gap-2">
                  <div className="flex-1 h-9 bg-[#1F1F2B] rounded-xl" />
                  <div className="flex-1 h-9 bg-[#1F1F2B] rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

      ) : displayClients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#131317] border border-[#1F1F2B] flex items-center justify-center mb-5">
            <Users className="w-8 h-8 text-[#2D2D3D]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {clients.length === 0 ? "No clients yet" : "No results found"}
          </h3>
          <p className="text-sm text-[#6B7280] max-w-xs mb-8">
            {clients.length === 0
              ? "Onboard your first client to start managing projects and sending updates."
              : "Try adjusting your search or filter."}
          </p>
          {clients.length === 0 && (
            <button
              onClick={() => setIsAddClientOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#5B5CF6] hover:bg-[#4F50DB] text-white font-bold rounded-xl transition-all"
            >
              <Plus className="w-4 h-4" /> Add First Client
            </button>
          )}
        </div>

      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayClients.map(c => <ClientCard key={c.id} client={c} />)}
        </div>

      ) : (
        <div className="bg-[#131317] border border-[#1F1F2B] rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0D0D13] border-b border-[#1F1F2B]">
                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Client</th>
                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Progress</th>
                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider hidden md:table-cell">Last Update</th>
                <th className="py-3 px-5 text-right text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A24]">
              {displayClients.map(c => <ClientRow key={c.id} client={c} />)}
            </tbody>
          </table>
        </div>
      )}

      <AddClientModal isOpen={isAddClientOpen} onClose={() => setIsAddClientOpen(false)} />
    </div>
  );
}

