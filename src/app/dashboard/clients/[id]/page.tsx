"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { getUpdates, getProjectsByClient, updateClient, getTasksByClient, resolveOrganizationId } from "@/lib/firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import {
  Copy, ArrowLeft, Edit2, FileText, CheckCircle2,
  Clock, ArrowRightCircle, Globe, Loader2, AlertCircle,
  Layers, CheckSquare, Send, MoreHorizontal, Zap,
  TrendingUp, Calendar, Mail, Phone, ExternalLink,
  ChevronRight, Check,
} from "lucide-react";
import { toast } from "sonner";
import type { Client, Update, Project, Task } from "@/types";

// --- helpers ---

function timeAgo(date?: any): string {
  if (!date) return "Never";
  const d = date?.toDate?.() ?? new Date(date);
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return "Just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

function formatDate(date?: any): string {
  if (!date) return "---";
  const d = date?.toDate?.() ?? new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function progressColor(p: number) {
  if (p >= 75) return { bar: "from-[#10B981] to-[#34D399]", text: "text-[#10B981]" };
  if (p >= 40) return { bar: "from-[#5B5CF6] to-[#8183FF]", text: "text-[#A4A6FF]" };
  return { bar: "from-[#F59E0B] to-[#FCD34D]", text: "text-[#F59E0B]" };
}

function statusStyle(status?: string) {
  if (status === "Active") return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/25";
  if (status === "At Risk") return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/25";
  if (status === "Delayed") return "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/25";
  return "bg-[#6B7280]/10 text-[#9CA3AF] border-[#6B7280]/25";
}

// --- Component ---

export default function ClientDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { userData } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const orgId = resolveOrganizationId(userData);

  const [client, setClient] = useState<Client | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [tempProgress, setTempProgress] = useState(0);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState("");
  const [savingProgress, setSavingProgress] = useState(false);
  const [savingDescription, setSavingDescription] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function load() {
      setIsLoading(true);
      setNotFound(false);
      try {
        const snap = await getDoc(doc(db, "clients", id));
        if (!snap.exists()) {
          setNotFound(true);
          return;
        }
        const clientData = { id: snap.id, ...snap.data() } as Client;

        if (orgId && clientData.organization_id && clientData.organization_id !== orgId) {
          setNotFound(true);
          return;
        }

        setClient(clientData);
        setTempProgress(clientData.progress ?? 0);
        setTempDescription((clientData as any).projectDescription ?? "");

        const effectiveOrgId = orgId ?? clientData.organization_id;
        if (effectiveOrgId) {
          try {
            const [u, p, t] = await Promise.all([
              getUpdates(effectiveOrgId, id, 10),
              getProjectsByClient(effectiveOrgId, id),
              getTasksByClient(effectiveOrgId, id),
            ]);
            setUpdates(u);
            setProjects(p);
            setTasks(t);
          } catch (relatedErr) {
            console.error("Failed to load client related data:", relatedErr);
          }
        }
      } catch (err) {
        console.error("Failed to load client:", err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id, orgId]);

  const handleCopyId = () => {
    if (!client?.accessId) return;
    navigator.clipboard.writeText(client.accessId);
    setCopied(true);
    toast.success("Access ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProgress = async () => {
    if (!client) return;
    setSavingProgress(true);
    try {
      await updateClient(client.id, { progress: tempProgress });
      setClient(prev => prev ? { ...prev, progress: tempProgress } : prev);
      setIsEditingProgress(false);
      toast.success("Progress updated!");
    } catch { toast.error("Failed to update progress"); }
    finally { setSavingProgress(false); }
  };

  const handleSaveDescription = async () => {
    if (!client) return;
    setSavingDescription(true);
    try {
      await updateClient(client.id, { projectDescription: tempDescription } as any);
      setClient(prev => prev ? { ...prev, projectDescription: tempDescription } as any : prev);
      setIsEditingDescription(false);
      toast.success("Description updated!");
    } catch { toast.error("Failed to update description"); }
    finally { setSavingDescription(false); }
  };

  // --- Loading ---

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-[#5B5CF6] animate-spin" />
        <p className="text-sm text-[#6B7280]">Loading client…</p>
      </div>
    </div>
  );

  if (notFound || !client) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-[#131317] border border-[#1F1F2B] flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-[#374151]" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Client not found</h2>
      <p className="text-sm text-[#9CA3AF] mb-6">This client may have been deleted or doesn&apos;t exist.</p>
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#5B5CF6] hover:bg-[#4F50DB] text-white text-sm font-bold rounded-xl transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
    </div>
  );

  const latestUpdate = updates[0] ?? null;
  const history = updates.slice(1);
  const projectDescription = (client as any).projectDescription ?? "";
  const progress = client.progress ?? 0;
  const pColor = progressColor(progress);

  // --- Render ---

  return (
    <div className="h-full overflow-y-auto animate-fade-in">

      {/* --- Hero Header --- */}
      <div className="relative overflow-hidden border-b border-[#1F1F2B] bg-[#0A0A10]">
        {/* ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5B5CF6]/8 rounded-full blur-[120px]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C3AED]/6 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 pt-6 pb-8">
          {/* Back */}
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-1.5 text-[#6B7280] hover:text-white transition-colors text-sm font-medium mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Dashboard
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            {/* Avatar + meta */}
            <div className="flex items-center gap-5">
              {/* Big avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#5B5CF6]/25 to-[#7C3AED]/25 border border-[#5B5CF6]/30 flex items-center justify-center shadow-[0_0_30px_rgba(91,92,246,0.15)]">
                  <span className="text-[#A4A6FF] font-black text-2xl uppercase tracking-tight">
                    {client.name.substring(0, 2)}
                  </span>
                </div>
                {/* Status dot */}
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0A0A10] ${
                  client.status === "Active" ? "bg-[#10B981]" :
                  client.status === "Paused" ? "bg-[#6B7280]" : "bg-[#EF4444]"
                }`} />
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {client.name}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyle(client.status ?? "Active")}`}>
                    {client.status ?? "Active"}
                  </span>
                </div>

                {/* Contact row */}
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  {client.email && (
                    <span className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                      <Mail className="w-3.5 h-3.5" /> {client.email}
                    </span>
                  )}
                  {(client as any).clientPhone && (
                    <span className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                      <Phone className="w-3.5 h-3.5" /> {(client as any).clientPhone}
                    </span>
                  )}
                  {client.accessId && (
                    <button
                      onClick={handleCopyId}
                      className="flex items-center gap-2 px-2.5 py-1 bg-[#131317] border border-[#1F1F2B] hover:border-[#5B5CF6]/40 rounded-lg text-xs font-mono text-[#9CA3AF] hover:text-white transition-all group"
                    >
                      <span className="text-[#6B7280] group-hover:text-[#9CA3AF]">ID:</span>
                      {client.accessId}
                      {copied
                        ? <Check className="w-3 h-3 text-[#10B981]" />
                        : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/dashboard/updates?client=${client.id}`)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#5B5CF6] hover:bg-[#4F50DB] text-white text-sm font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(91,92,246,0.25)] hover:shadow-[0_4px_30px_rgba(91,92,246,0.4)]"
              >
                <Send className="w-4 h-4" /> Send Update
              </button>
            </div>
          </div>

          {/* --- Stats strip --- */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {[
              {
                label: "Progress",
                value: `${progress}%`,
                sub: progress >= 75 ? "On track" : progress >= 40 ? "In progress" : "Early stage",
                color: pColor.text,
              },
              {
                label: "Projects",
                value: projects.length,
                sub: `${projects.filter(p => p.status === "active").length} active`,
                color: "text-[#A4A6FF]",
              },
              {
                label: "Updates",
                value: updates.length,
                sub: latestUpdate ? `Last: ${timeAgo(latestUpdate.createdAt)}` : "None yet",
                color: "text-[#F59E0B]",
              },
              {
                label: "Tasks",
                value: tasks.length,
                sub: `${tasks.filter(t => t.status === "inprogress").length} in progress`,
                color: "text-[#10B981]",
              },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className="bg-[#131317]/80 border border-[#1F1F2B] rounded-xl px-4 py-3.5 backdrop-blur-sm">
                <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1">{label}</p>
                <p className={`text-2xl font-black tracking-tight ${color}`}>{value}</p>
                <p className="text-[11px] text-[#6B7280] mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Body --- */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">

          {/* --- LEFT SIDEBAR --- */}
          <div className="space-y-5">

            {/* Progress editor */}
            <div className="bg-[#131317] border border-[#1F1F2B] rounded-2xl p-5 group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Overall Progress</h3>
                {!isEditingProgress && (
                  <button
                    onClick={() => setIsEditingProgress(true)}
                    className="text-[#6B7280] hover:text-[#A4A6FF] transition-colors p-1 opacity-0 group-hover:opacity-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {isEditingProgress ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-4">
                    <input
                      type="range" min="0" max="100" value={tempProgress}
                      onChange={e => setTempProgress(Number(e.target.value))}
                      className="w-full h-1.5 bg-[#1F1F2B] rounded-lg appearance-none cursor-pointer accent-[#5B5CF6]"
                    />
                    <span className="text-xl font-black text-white w-12 text-right tabular-nums">{tempProgress}%</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSaveProgress} disabled={savingProgress}
                      className="flex-1 bg-[#5B5CF6]/10 hover:bg-[#5B5CF6]/20 disabled:opacity-50 text-[#A4A6FF] text-xs font-bold py-2 rounded-lg transition-colors border border-[#5B5CF6]/30">
                      {savingProgress ? "Saving…" : "Save"}
                    </button>
                    <button onClick={() => { setTempProgress(progress); setIsEditingProgress(false); }}
                      className="flex-1 bg-[#1A1A24] hover:bg-[#252533] text-white text-xs font-bold py-2 rounded-lg transition-colors border border-[#2D2D3D]">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <div className="flex items-end justify-between mb-3">
                    <span className={`text-4xl font-black tracking-tight leading-none ${pColor.text}`}>{progress}%</span>
                    <span className="text-xs text-[#6B7280]">
                      {progress >= 75 ? "🟢 On track" : progress >= 40 ? "🟡 In progress" : "🔴 Early"}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#1F1F2B] rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${pColor.bar} rounded-full transition-all duration-700`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Project Description */}
            <div className="bg-[#131317] border border-[#1F1F2B] rounded-2xl p-5 group">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Project Overview</h3>
                {!isEditingDescription && (
                  <button onClick={() => setIsEditingDescription(true)}
                    className="text-[#6B7280] hover:text-[#A4A6FF] transition-colors p-1 opacity-0 group-hover:opacity-100">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {isEditingDescription ? (
                <div className="space-y-3 animate-fade-in">
                  <textarea
                    value={tempDescription}
                    onChange={e => setTempDescription(e.target.value)}
                    className="w-full bg-[#0D0D13] border border-[#5B5CF6]/50 rounded-xl p-3 text-sm text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#5B5CF6]/50 min-h-[100px] resize-none"
                    placeholder="Describe the current project..."
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveDescription} disabled={savingDescription}
                      className="flex-1 bg-[#5B5CF6]/10 hover:bg-[#5B5CF6]/20 disabled:opacity-50 text-[#A4A6FF] text-xs font-bold py-2 rounded-lg transition-colors border border-[#5B5CF6]/30">
                      {savingDescription ? "Saving…" : "Save"}
                    </button>
                    <button onClick={() => { setTempDescription(projectDescription); setIsEditingDescription(false); }}
                      className="flex-1 bg-[#1A1A24] text-white text-xs font-bold py-2 rounded-lg border border-[#2D2D3D]">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[13px] text-[#D1D5DB] leading-relaxed whitespace-pre-wrap animate-fade-in">
                  {projectDescription || <span className="text-[#6B7280] italic">No description yet. Hover &amp; click edit.</span>}
                </p>
              )}
            </div>

            {/* Projects */}
            <div className="bg-[#131317] border border-[#1F1F2B] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">
                  Projects
                </h3>
                <span className="text-[10px] font-bold text-[#6B7280] bg-[#1A1A24] border border-[#2D2D3D] px-2 py-0.5 rounded-full">
                  {projects.length}
                </span>
              </div>
              {projects.length === 0 ? (
                <p className="text-sm text-[#6B7280] italic">No projects linked yet.</p>
              ) : (
                <div className="space-y-2">
                  {projects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => router.push(`/dashboard/projects/${p.id}`)}
                      className="w-full flex items-center justify-between px-3 py-2.5 bg-[#0D0D13] border border-[#1F1F2B] hover:border-[#5B5CF6]/30 rounded-xl transition-all text-left group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Layers className="w-3.5 h-3.5 text-[#5B5CF6] flex-shrink-0" />
                        <span className="text-sm font-medium text-white truncate group-hover:text-[#A4A6FF] transition-colors">
                          {p.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          p.status === "active" ? "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20" :
                          p.status === "completed" ? "text-[#5B5CF6] bg-[#5B5CF6]/10 border-[#5B5CF6]/20" :
                          "text-[#6B7280] bg-[#1F1F2B] border-[#2D2D3D]"
                        }`}>
                          {p.status}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#3D3D4D] group-hover:text-[#5B5CF6] transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tasks */}
            <div className="bg-[#131317] border border-[#1F1F2B] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5" /> Tasks
                </h3>
                <span className="text-[10px] font-bold text-[#6B7280] bg-[#1A1A24] border border-[#2D2D3D] px-2 py-0.5 rounded-full">
                  {tasks.length}
                </span>
              </div>
              {tasks.length === 0 ? (
                <p className="text-sm text-[#6B7280] italic">No active tasks.</p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {tasks.map(task => (
                    <div key={task.id} className="flex items-start gap-3 px-3 py-2.5 bg-[#0D0D13] border border-[#1F1F2B] rounded-xl">
                      <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        task.status === "todo" ? "bg-[#374151]" :
                        task.status === "inprogress" ? "bg-[#F59E0B]" :
                        task.status === "review" ? "bg-[#A4A6FF]" : "bg-[#10B981]"
                      }`} />
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-[#E5E7EB] leading-snug truncate">{task.title}</p>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] mt-0.5">{task.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* --- RIGHT MAIN --- */}
          <div className="space-y-6">

            {/* Latest Update */}
            <div className="bg-[#131317] border border-[#1F1F2B] rounded-2xl overflow-hidden">
              {/* Card header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F1F2B]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#5B5CF6]/10 border border-[#5B5CF6]/20 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5B5CF6] shadow-[0_0_10px_rgba(91,92,246,0.8)] animate-pulse" />
                  </div>
                  <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Latest Update
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  {latestUpdate && (
                    <span className="text-xs font-medium text-[#6B7280] bg-[#1A1A24] border border-[#2D2D3D] px-3 py-1 rounded-full">
                      {formatDate(latestUpdate.createdAt)}
                    </span>
                  )}
                  <button
                    onClick={() => router.push(`/dashboard/updates?client=${client.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5B5CF6]/10 hover:bg-[#5B5CF6]/20 border border-[#5B5CF6]/25 hover:border-[#5B5CF6]/50 text-[#A4A6FF] text-xs font-bold rounded-lg transition-all"
                  >
                    <Send className="w-3 h-3" /> Send Update
                  </button>
                </div>
              </div>

              {/* Update body */}
              {latestUpdate ? (
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#1F1F2B]">
                  {/* Done */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                      </div>
                      <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider">Completed</span>
                    </div>
                    {latestUpdate.done?.length > 0 ? (
                      <ul className="space-y-2.5">
                        {latestUpdate.done.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-[13px] text-[#D1D5DB] leading-snug">
                            <Check className="w-3.5 h-3.5 text-[#10B981] mt-0.5 flex-shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    ) : <p className="text-xs text-[#6B7280] italic">Nothing yet.</p>}
                  </div>

                  {/* In Progress */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                      </div>
                      <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider">In Progress</span>
                    </div>
                    {latestUpdate.inProgress?.length > 0 ? (
                      <ul className="space-y-2.5">
                        {latestUpdate.inProgress.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-[13px] text-[#D1D5DB] leading-snug">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mt-1.5 flex-shrink-0 animate-pulse" /> {item}
                          </li>
                        ))}
                      </ul>
                    ) : <p className="text-xs text-[#6B7280] italic">Nothing active.</p>}
                  </div>

                  {/* Next */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-lg bg-[#A4A6FF]/10 border border-[#A4A6FF]/20 flex items-center justify-center">
                        <ArrowRightCircle className="w-3.5 h-3.5 text-[#A4A6FF]" />
                      </div>
                      <span className="text-xs font-bold text-[#A4A6FF] uppercase tracking-wider">Up Next</span>
                    </div>
                    {latestUpdate.next?.length > 0 ? (
                      <ul className="space-y-2.5">
                        {latestUpdate.next.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-[13px] text-[#D1D5DB] leading-snug">
                            <ChevronRight className="w-3.5 h-3.5 text-[#A4A6FF] mt-0.5 flex-shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    ) : <p className="text-xs text-[#6B7280] italic">Nothing planned.</p>}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#1A1A24] border border-[#2D2D3D] flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-[#374151]" />
                  </div>
                  <p className="text-sm text-[#6B7280] mb-4">No updates created for this client yet.</p>
                  <button
                    onClick={() => router.push(`/dashboard/updates?client=${client.id}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#5B5CF6]/10 hover:bg-[#5B5CF6] text-[#A4A6FF] hover:text-white border border-[#5B5CF6]/30 hover:border-[#5B5CF6] text-sm font-bold rounded-lg transition-all"
                  >
                    <Send className="w-3.5 h-3.5" /> Create First Update
                  </button>
                </div>
              )}
            </div>

            {/* Update History timeline */}
            {history.length > 0 && (
              <div className="bg-[#131317] border border-[#1F1F2B] rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-6 py-4 border-b border-[#1F1F2B]">
                  <Clock className="w-4 h-4 text-[#6B7280]" />
                  <h3 className="text-sm font-bold text-white">Update History</h3>
                  <span className="ml-auto text-[10px] font-bold text-[#6B7280] bg-[#1A1A24] border border-[#2D2D3D] px-2 py-0.5 rounded-full">
                    {history.length}
                  </span>
                </div>

                <div className="divide-y divide-[#1F1F2B]">
                  {history.map((update, idx) => (
                    <div key={update.id} className="px-6 py-4 hover:bg-[#0D0D13] transition-colors group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-[#1A1A24] border border-[#2D2D3D] flex items-center justify-center">
                            <FileText className="w-3 h-3 text-[#6B7280]" />
                          </div>
                          <span className="text-sm font-bold text-[#E5E7EB] group-hover:text-white transition-colors">
                            Update #{history.length - idx}
                          </span>
                        </div>
                        <span className="text-xs text-[#6B7280] bg-[#1A1A24] border border-[#2D2D3D] px-2.5 py-1 rounded-full">
                          {formatDate(update.createdAt)}
                        </span>
                      </div>
                      <div className="space-y-1.5 pl-8">
                        {update.done && update.done.length > 0 && (
                          <p className="text-xs text-[#9CA3AF] line-clamp-1">
                            <span className="font-bold text-[#10B981] mr-1.5">✓</span>
                            {update.done.join(", ")}
                          </p>
                        )}
                        {update.inProgress && update.inProgress.length > 0 && (
                          <p className="text-xs text-[#9CA3AF] line-clamp-1">
                            <span className="font-bold text-[#F59E0B] mr-1.5">⚡</span>
                            {update.inProgress.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

