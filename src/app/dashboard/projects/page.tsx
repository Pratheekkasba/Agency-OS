"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getAllProjects,
  getAllClients,
  addProject,
  resolveOrganizationId,
  subscribeToProjects,
  subscribeToClients
} from "@/lib/firebase/firestore";
import type { Project, Client } from "@/types";
import {
  Plus, Folder, Search, LayoutGrid, List,
  ChevronRight, Calendar, Users, CheckSquare,
  Zap, Globe, Monitor, Megaphone, Layers, MoreHorizontal,
  X, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/empty-state";

const PROJECT_TYPES = [
  { value: "website", label: "Website", icon: Globe },
  { value: "app", label: "App", icon: Monitor },
  { value: "brand", label: "Brand", icon: Layers },
  { value: "campaign", label: "Campaign", icon: Megaphone },
  { value: "other", label: "Other", icon: Zap },
];

const DEFAULT_MILESTONES = [
  "Discovery & Brief",
  "Design & Wireframes",
  "Development",
  "QA & Testing",
  "Launch",
];

const STATUS_CONFIG = {
  active: { label: "Active", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  paused: { label: "Paused", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  completed: { label: "Completed", color: "text-[#5B5CF6] bg-[#5B5CF6]/10 border-[#5B5CF6]/20" },
  archived: { label: "Archived", color: "text-[#6B7280] bg-[#6B7280]/10 border-[#6B7280]/20" },
};

function ProgressRing({ progress, size = 44 }: { progress: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#1F1F2B" strokeWidth={4} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke="#5B5CF6" strokeWidth={4} fill="none"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
    </svg>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const { userData } = useAuth();
  const orgId = resolveOrganizationId(userData);

  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showModal, setShowModal] = useState(false);

  // New Project Form State
  const [formName, setFormName] = useState("");
  const [formClient, setFormClient] = useState("");
  const [formType, setFormType] = useState<Project["type"]>("website");
  const [formDesc, setFormDesc] = useState("");
  const [formDue, setFormDue] = useState("");
  const [formMilestones, setFormMilestones] = useState<string[]>(DEFAULT_MILESTONES);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!orgId) return;

    setIsLoading(true);
    
    // Subscribe to Projects
    const unsubProjects = subscribeToProjects(orgId, (fetchedProjects) => {
      setProjects(fetchedProjects);
      setIsLoading(false);
    }, (err) => {
      console.error("Projects subscription error:", err);
      setIsLoading(false);
    });

    // Subscribe to Clients (needed for project creation modal)
    const unsubClients = subscribeToClients(orgId, (fetchedClients) => {
      setClients(fetchedClients);
    }, (err) => {
      console.error("Clients subscription error:", err);
    });

    return () => {
      unsubProjects();
      unsubClients();
    };
  }, [orgId]);

  const filtered = projects
    .filter(p => statusFilter === "all" || p.status === statusFilter)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.clientName?.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = async () => {
    if (!formName.trim() || !formClient) {
      toast.error("Project name and client are required.");
      return;
    }
    setIsSaving(true);
    try {
      if (!orgId) throw new Error("No organization ID found");
      const selectedClient = clients.find(c => c.id === formClient);
      await addProject(orgId, {
        name: formName.trim(),
        clientId: formClient,
        clientName: selectedClient?.name ?? "",
        type: formType,
        status: "active",
        progress: 0,
        milestones: formMilestones.filter(Boolean).map((m, i) => ({
          id: `m${i}`,
          name: m,
          completed: false,
          order: i,
        })),
        teamMemberIds: [],
        description: formDesc,
        dueDate: formDue,
      });
      toast.success("Project created!");
      setShowModal(false);
      resetForm();
    } catch (err) {
      toast.error("Failed to create project.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormName(""); setFormClient(""); setFormType("website");
    setFormDesc(""); setFormDue(""); setFormMilestones(DEFAULT_MILESTONES);
  };

  const TypeIcon = PROJECT_TYPES.find(t => t.value === "website")?.icon || Folder;

  const displayProjects = filtered;

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-8 space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="hidden md:block text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Projects
          </h1>
          <p className="text-sm text-[#9CA3AF] mt-0.5">
            {displayProjects.length} project{displayProjects.length !== 1 ? "s" : ""} across all clients
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#5B5CF6] hover:bg-[#4F50DB] text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(91,92,246,0.25)] hover:shadow-[0_0_30px_rgba(91,92,246,0.4)] shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2 bg-[#131317] border border-[#1F1F2B] hover:border-[#2D2D3D] focus:border-[#5B5CF6]/50 focus:ring-1 focus:ring-[#5B5CF6]/30 rounded-lg text-sm text-white placeholder-[#6B7280] outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          {["all", "active", "paused", "completed"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === s
                  ? "bg-[#5B5CF6]/15 text-[#5B5CF6] border border-[#5B5CF6]/30"
                  : "text-[#9CA3AF] hover:text-white bg-[#131317] border border-[#1F1F2B] hover:border-[#2D2D3D]"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-[#1F1F2B] text-white" : "text-[#6B7280] hover:text-white"}`}
          ><LayoutGrid className="w-4 h-4" /></button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-[#1F1F2B] text-white" : "text-[#6B7280] hover:text-white"}`}
          ><List className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#131317] border border-[#1F1F2B] rounded-2xl p-5 animate-pulse space-y-4">
              <div className="h-4 w-3/4 bg-[#1F1F2B] rounded" />
              <div className="h-3 w-1/2 bg-[#1F1F2B] rounded" />
              <div className="h-8 w-full bg-[#1F1F2B] rounded-lg" />
            </div>
          ))}
        </div>
      ) : displayProjects.length === 0 ? null : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayProjects.map(project => {
            const TypeConf = PROJECT_TYPES.find(t => t.value === project.type) || PROJECT_TYPES[0];
            const Icon = TypeConf.icon;
            const statusConf = STATUS_CONFIG[project.status] || STATUS_CONFIG.active;
            const completedMilestones = project.milestones?.filter(m => m.completed).length ?? 0;
            const totalMilestones = project.milestones?.length ?? 0;
            
            return (
              <div
                key={project.id}
                onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                className="group bg-[#0D0D13] border border-[#1F1F2B] hover:border-[#5B5CF6]/30 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-[0_0_25px_rgba(91,92,246,0.08)] hover:-translate-y-0.5 relative overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5B5CF6]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1A1A24] border border-[#2D2D3D] flex items-center justify-center group-hover:bg-[#5B5CF6]/10 group-hover:border-[#5B5CF6]/30 transition-colors">
                      <Icon className="w-5 h-5 text-[#6B7280] group-hover:text-[#5B5CF6] transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#6B7280]">{project.clientName}</p>
                      <h3 className="text-sm font-bold text-white group-hover:text-[#A4A6FF] transition-colors leading-tight">{project.name}</h3>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusConf.color}`}>
                    {statusConf.label}
                  </span>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-3 mb-4">
                  <ProgressRing progress={project.progress} size={40} />
                  <div>
                    <p className="text-xl font-bold text-white">{project.progress}%</p>
                    <p className="text-xs text-[#6B7280]">{completedMilestones}/{totalMilestones} milestones</p>
                  </div>
                </div>

                {/* Milestone Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.milestones?.slice(0, 4).map(m => (
                    <span
                      key={m.id}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-colors ${
                        m.completed
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-[#1F1F2B] text-[#6B7280] border-[#2D2D3D]"
                      }`}
                    >
                      {m.completed ? "✓ " : ""}{m.name}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-[#6B7280] pt-3 border-t border-[#1F1F2B]">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{project.teamMemberIds?.length ?? 0} members</span>
                  </div>
                  {project.dueDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </div>
                  )}
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#5B5CF6]" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-[#0D0D13] border border-[#1F1F2B] rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1F1F2B] bg-[#131317]/50">
                <th className="px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Project</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Client</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Progress</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Due</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F2B]">
              {displayProjects.map(project => {
                const TypeConf = PROJECT_TYPES.find(t => t.value === project.type) || PROJECT_TYPES[0];
                const Icon = TypeConf.icon;
                const statusConf = STATUS_CONFIG[project.status] || STATUS_CONFIG.active;
                return (
                  <tr
                    key={project.id}
                    onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                    className="hover:bg-[#131317] hover:shadow-[inset_2px_0_0_0_#5B5CF6] cursor-pointer transition-all group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#1A1A24] border border-[#2D2D3D] flex items-center justify-center">
                          <Icon className="w-4 h-4 text-[#6B7280]" />
                        </div>
                        <span className="text-sm font-semibold text-white group-hover:text-[#A4A6FF] transition-colors">{project.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#9CA3AF]">{project.clientName}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusConf.color}`}>
                        {statusConf.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-[#1F1F2B] rounded-full overflow-hidden">
                          <div className="h-full bg-[#5B5CF6] rounded-full transition-all" style={{ width: `${project.progress}%` }} />
                        </div>
                        <span className="text-xs text-white font-semibold w-8">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#9CA3AF]">
                      {project.dueDate ? new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={e => { e.stopPropagation(); }}
                        className="p-1.5 rounded-lg text-[#6B7280] hover:text-white hover:bg-[#1F1F2B] transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && displayProjects.length === 0 && (
        <div className="py-10">
          <EmptyState
            icon={Folder}
            title={projects.length === 0 ? "No projects yet" : "No results found"}
            description={projects.length === 0 ? "Create your first project to start tracking work for your clients." : "Try adjusting your filters or search query."}
            variant={projects.length === 0 ? "default" : "no-results"}
            action={projects.length === 0 ? {
              label: "+ New Project",
              onClick: () => setShowModal(true)
            } : undefined}
          />
        </div>
      )}

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg bg-[#0D0D13] border border-[#1F1F2B] rounded-2xl shadow-2xl animate-modal overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5B5CF6]/40 to-transparent" />
            
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1F1F2B]">
              <div>
                <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>New Project</h2>
                <p className="text-xs text-[#6B7280] mt-0.5">Attach to a client to start tracking</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-[#6B7280] hover:text-white hover:bg-[#1A1A24] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Project Name */}
              <div>
                <label className="block text-xs font-semibold text-[#9CA3AF] mb-2 uppercase tracking-wider">Project Name *</label>
                <input
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Website Redesign 2026"
                  className="w-full px-4 py-2.5 bg-[#131317] border border-[#1F1F2B] focus:border-[#5B5CF6]/50 focus:ring-1 focus:ring-[#5B5CF6]/30 rounded-xl text-sm text-white placeholder-[#6B7280] outline-none transition-all"
                />
              </div>

              {/* Client */}
              <div>
                <label className="block text-xs font-semibold text-[#9CA3AF] mb-2 uppercase tracking-wider">Client *</label>
                <select
                  value={formClient}
                  onChange={e => setFormClient(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#131317] border border-[#1F1F2B] focus:border-[#5B5CF6]/50 rounded-xl text-sm text-white outline-none transition-all cursor-pointer"
                >
                  <option value="">Select a client…</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                  {clients.length === 0 && (
                    <option disabled>No clients yet --- add one first</option>
                  )}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-semibold text-[#9CA3AF] mb-2 uppercase tracking-wider">Project Type</label>
                <div className="grid grid-cols-5 gap-2">
                  {PROJECT_TYPES.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setFormType(value as Project["type"])}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        formType === value
                          ? "bg-[#5B5CF6]/15 border-[#5B5CF6]/40 text-[#5B5CF6]"
                          : "bg-[#131317] border-[#1F1F2B] text-[#6B7280] hover:border-[#2D2D3D] hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#9CA3AF] mb-2 uppercase tracking-wider">Description</label>
                <textarea
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  placeholder="What is this project about?"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[#131317] border border-[#1F1F2B] focus:border-[#5B5CF6]/50 focus:ring-1 focus:ring-[#5B5CF6]/30 rounded-xl text-sm text-white placeholder-[#6B7280] outline-none transition-all resize-none"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs font-semibold text-[#9CA3AF] mb-2 uppercase tracking-wider">Target Due Date</label>
                <input
                  type="date"
                  value={formDue}
                  onChange={e => setFormDue(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#131317] border border-[#1F1F2B] focus:border-[#5B5CF6]/50 rounded-xl text-sm text-white outline-none transition-all"
                />
              </div>

              {/* Milestones */}
              <div>
                <label className="block text-xs font-semibold text-[#9CA3AF] mb-2 uppercase tracking-wider">Milestones</label>
                <div className="space-y-2">
                  {formMilestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1F1F2B] text-[#6B7280] text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <input
                        value={m}
                        onChange={e => {
                          const updated = [...formMilestones];
                          updated[i] = e.target.value;
                          setFormMilestones(updated);
                        }}
                        className="flex-1 px-3 py-1.5 bg-[#131317] border border-[#1F1F2B] focus:border-[#5B5CF6]/50 rounded-lg text-sm text-white placeholder-[#6B7280] outline-none transition-all"
                      />
                      <button
                        onClick={() => setFormMilestones(prev => prev.filter((_, idx) => idx !== i))}
                        className="p-1 text-[#6B7280] hover:text-[#EF4444] transition-colors"
                      ><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                  <button
                    onClick={() => setFormMilestones(prev => [...prev, ""])}
                    className="text-xs text-[#5B5CF6] hover:text-[#A4A6FF] font-semibold transition-colors flex items-center gap-1 mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add milestone
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#1F1F2B] flex items-center justify-end gap-3">
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="px-4 py-2 text-sm font-semibold text-[#9CA3AF] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={isSaving}
                className="px-5 py-2 bg-[#5B5CF6] hover:bg-[#4F50DB] disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(91,92,246,0.2)]"
              >
                {isSaving ? "Creating…" : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

