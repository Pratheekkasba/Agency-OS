"use client";

import { useState, useEffect } from "react";
import {
  Users, Plus, Search, MoreHorizontal, Crown, Shield,
  Palette, Code2, BarChart3, Lightbulb, ChevronDown,
  Mail, Link2, Copy, Check, X, UserCircle2, Activity,
  Clock, CheckSquare, Star, Loader2
} from "lucide-react";
import { toast } from "sonner";
import type { TeamMember, TeamRole } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { subscribeToTeamMembers } from "@/lib/firebase/firestore";

import { auth } from "@/lib/firebase/config";

// --- Config ---
const ROLE_CONFIG: Record<TeamRole, { label: string; icon: any; color: string; bg: string }> = {
  owner: { label: "Owner", icon: Crown, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  admin: { label: "Admin", icon: Shield, color: "text-[#5B5CF6]", bg: "bg-[#5B5CF6]/10 border-[#5B5CF6]/20" },
  designer: { label: "Designer", icon: Palette, color: "text-pink-400", bg: "bg-pink-400/10 border-pink-400/20" },
  developer: { label: "Developer", icon: Code2, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  pm: { label: "Project Manager", icon: BarChart3, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  strategist: { label: "Strategist", icon: Lightbulb, color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
  member: { label: "Member", icon: UserCircle2, color: "text-[#9CA3AF]", bg: "bg-[#374151]/20 border-[#374151]/30" },
};

const AVATAR_GRADIENTS = [
  "from-violet-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-pink-500 to-rose-600",
  "from-cyan-500 to-blue-600",
  "from-amber-500 to-yellow-600",
];

// No more demo data!

const PRIORITY_DOTS: Record<string, string> = {
  urgent: "bg-red-400", medium: "bg-amber-400", low: "bg-emerald-400",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  todo: { label: "To Do", color: "text-[#6B7280]" },
  inprogress: { label: "In Progress", color: "text-[#5B5CF6]" },
  review: { label: "In Review", color: "text-amber-400" },
  done: { label: "Done", color: "text-emerald-400" },
};

// --- Invite Modal ---
function InviteModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("member");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inviteLink = "https://agencyos.app/invite/OS-TEAM-X9F2K";

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Invite link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = async () => {
    if (!email.trim()) {
      toast.error("Enter an email address");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error("Not authenticated");

      const res = await fetch("/api/auth/invite-team-member", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to send invite");
      }
      
      toast.success(`Invite sent to ${email}`);
      onClose();
    } catch (err: any) {
      console.error("Invite error:", err);
      toast.error(err.message || "Failed to send invite");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0D0D13] border border-[#1F1F2B] rounded-2xl shadow-2xl animate-modal overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5B5CF6]/40 to-transparent" />
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1F1F2B]">
          <div>
            <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Invite Team Member</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">Send an invite or share the link</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-[#6B7280] hover:text-white hover:bg-[#1A1A24] transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Email invite */}
          <div>
            <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Email Address</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="teammate@example.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#131317] border border-[#1F1F2B] focus:border-[#5B5CF6]/50 rounded-xl text-sm text-white placeholder-[#6B7280] outline-none transition-all"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Assign Role</label>
            <div className="grid grid-cols-2 gap-2">
              {(["designer", "developer", "pm", "strategist", "admin", "member"] as TeamRole[]).map(r => {
                const conf = ROLE_CONFIG[r];
                const Icon = conf.icon;
                return (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    disabled={isSubmitting}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      role === r
                        ? `${conf.bg} ${conf.color} border-current/30`
                        : "bg-[#131317] border-[#1F1F2B] text-[#6B7280] hover:border-[#2D2D3D] hover:text-white"
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {conf.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Or share link */}
          <div>
            <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Or Share Invite Link</label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#131317] border border-[#1F1F2B] rounded-xl opacity-50 cursor-not-allowed">
              <Link2 className="w-4 h-4 text-[#6B7280] shrink-0" />
              <span className="flex-1 text-xs text-[#6B7280] font-mono truncate">Links coming soon</span>
              <button disabled className="p-1 rounded text-[#6B7280]">
                 <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#1F1F2B] flex items-center justify-end gap-3">
          <button onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-sm font-semibold text-[#9CA3AF] hover:text-white transition-colors disabled:opacity-50">Cancel</button>
          <button
            onClick={handleInvite}
            disabled={isSubmitting}
            className="px-5 py-2 bg-[#5B5CF6] hover:bg-[#4F50DB] text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Mail className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---
export default function TeamPage() {
  const { userData } = useAuth();
  const orgId = userData?.organization_id;

  const [view, setView] = useState<"roster" | "workload">("roster");
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orgId) return;
    setIsLoading(true);
    
    const unsubscribe = subscribeToTeamMembers(orgId, (fetchedMembers) => {
      setMembers(fetchedMembers);
      setIsLoading(false);
    }, (err) => {
      console.error("Team subscription error:", err);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [orgId]);

  const filtered = members.filter(m =>
    (roleFilter === "all" || m.role === roleFilter) &&
    (!search || m.name?.toLowerCase().includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="hidden md:block text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Team</h1>
          <p className="text-sm text-[#9CA3AF] mt-0.5">{members.length} active members</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#5B5CF6] hover:bg-[#4F50DB] text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(91,92,246,0.25)] shrink-0"
        >
          <Plus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Tab + Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex gap-1 bg-[#131317] border border-[#1F1F2B] rounded-xl p-1">
          <button
            onClick={() => setView("roster")}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              view === "roster" ? "bg-[#1F1F2B] text-white" : "text-[#6B7280] hover:text-white"
            }`}
          >Roster</button>
          <button
            onClick={() => setView("workload")}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              view === "workload" ? "bg-[#1F1F2B] text-white" : "text-[#6B7280] hover:text-white"
            }`}
          >Workload</button>
        </div>

        {view === "roster" && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280]" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." className="pl-8 pr-4 py-1.5 bg-[#131317] border border-[#1F1F2B] rounded-lg text-sm text-white placeholder-[#6B7280] outline-none w-44" />
            </div>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#131317] border border-[#1F1F2B] rounded-lg text-sm text-white outline-none"
            >
              <option value="all">All Roles</option>
              {Object.entries(ROLE_CONFIG).filter(([k]) => k !== "owner").map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Roster View */}
      {view === "roster" && isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#5B5CF6] animate-spin" />
        </div>
      ) : view === "roster" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((member, idx) => {
            const roleConf = ROLE_CONFIG[member.role];
            const RoleIcon = roleConf.icon;
            const gradient = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length];
            const initials = member.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
            
            return (
              <div key={member.id} className={`group bg-[#0D0D13] border rounded-2xl p-5 transition-all duration-200 hover:shadow-[0_0_25px_rgba(91,92,246,0.07)] hover:-translate-y-0.5 relative overflow-hidden ${
                member.status === "invited" ? "border-[#1F1F2B] opacity-70" : "border-[#1F1F2B] hover:border-[#5B5CF6]/20"
              }`}>
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5B5CF6]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {member.status === "invited" && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">Pending</span>
                  </div>
                )}

                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-lg`}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{member.name}</h3>
                    <p className="text-xs text-[#6B7280] truncate">{member.email}</p>
                    <div className={`inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded border ${roleConf.bg} ${roleConf.color}`}>
                      <RoleIcon className="w-2.5 h-2.5" />
                      {roleConf.label}
                    </div>
                  </div>
                </div>

                {member.status === "active" && (
                  <>
                    {/* Tags */}
                    {(member.tags?.length ?? 0) > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {member.tags!.map(tag => (
                          <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#1F1F2B] text-[#9CA3AF] border border-[#2D2D3D]">{tag}</span>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-[#6B7280] pt-3 border-t border-[#1F1F2B]">
                      <div className="flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-[#5B5CF6]" />
                        <span className="font-semibold text-white">{member.activeTaskCount || 0}</span>
                        <span>active</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold text-white">{member.completedCount || 0}</span>
                        <span>done</span>
                      </div>
                    </div>
                  </>
                )}

                <button className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#6B7280] hover:text-white hover:bg-[#1F1F2B] transition-all">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            );
          })}

          {/* Add Member Card */}
          <button
            onClick={() => setShowInvite(true)}
            className="group bg-[#0D0D13] border border-dashed border-[#1F1F2B] hover:border-[#5B5CF6]/30 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 transition-all hover:shadow-[0_0_20px_rgba(91,92,246,0.05)] min-h-[180px]"
          >
            <div className="w-12 h-12 rounded-xl bg-[#131317] border border-dashed border-[#2D2D3D] group-hover:border-[#5B5CF6]/30 flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5 text-[#374151] group-hover:text-[#5B5CF6] transition-colors" />
            </div>
            <p className="text-sm font-semibold text-[#6B7280] group-hover:text-white transition-colors">Invite Member</p>
          </button>
        </div>
      )}

      {/* Workload View */}
      {view === "workload" && (
        <div className="space-y-4">
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <h3 className="text-white font-semibold mb-2">Workload View</h3>
            <p className="text-[#9CA3AF] text-sm">Assign tasks to members to see their workload here.</p>
          </div>
        </div>
      )}


      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </div>
  );
}

