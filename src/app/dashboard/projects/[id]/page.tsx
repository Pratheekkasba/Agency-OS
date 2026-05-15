"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { getTasksByProject } from "@/lib/firebase/firestore";
import {
  ArrowLeft, Calendar, Users, CheckSquare, Layers,
  ExternalLink, Globe, Monitor, Megaphone, Zap,
  Check, Clock, AlertCircle, Plus, Loader2
} from "lucide-react";
import type { Project, Task } from "@/types";

const PROJECT_TYPE_ICONS: Record<string, any> = {
  website: Globe, app: Monitor, brand: Layers,
  campaign: Megaphone, other: Zap,
};

const STATUS_COLORS: Record<string, string> = {
  active: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  paused: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  completed: "text-[#5B5CF6] bg-[#5B5CF6]/10 border-[#5B5CF6]/20",
  archived: "text-[#6B7280] bg-[#6B7280]/10 border-[#6B7280]/20",
};

const PRIORITY_DOTS: Record<string, string> = {
  urgent: "bg-red-400", medium: "bg-amber-400", low: "bg-emerald-400",
};

const STATUS_TASK_LABELS: Record<string, string> = {
  todo: "To Do", inprogress: "In Progress", review: "In Review", done: "Done",
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { userData } = useAuth();
  const orgId = userData?.organization_id;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!id) return;
    async function load() {
      setIsLoading(true);
      try {
        const docRef = doc(db, "projects", id);
        const snap = await getDoc(docRef);
        if (!snap.exists()) {
          setNotFound(true);
          return;
        }
        const projectData = { id: snap.id, ...snap.data() } as Project;
        setProject(projectData);

        // Load tasks for this project
        if (orgId) {
          const projectTasks = await getTasksByProject(orgId, id);
          setTasks(projectTasks);
        }
      } catch (err) {
        console.error("Error loading project:", err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id, orgId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#5B5CF6] animate-spin" />
          <p className="text-sm text-[#6B7280]">Loading project…</p>
        </div>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-[#131317] border border-[#1F1F2B] flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-[#374151]" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Project not found</h2>
        <p className="text-sm text-[#9CA3AF] mb-6">This project may have been deleted or doesn't exist.</p>
        <button
          onClick={() => router.push("/dashboard/projects")}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#5B5CF6] hover:bg-[#4F50DB] text-white text-sm font-bold rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </button>
      </div>
    );
  }

  const Icon = PROJECT_TYPE_ICONS[project.type] || Globe;
  const completedMilestones = project.milestones?.filter(m => m.completed).length ?? 0;
  const totalMilestones = project.milestones?.length ?? 0;
  const completedTasks = tasks.filter(t => t.status === "done").length;
  const openTasks = tasks.filter(t => t.status !== "done").length;
  const currentMilestoneIdx = project.milestones?.findIndex(m => !m.completed) ?? -1;

  return (
    <div className="min-h-full animate-fade-in">
      {/* Header */}
      <div className="border-b border-[#1F1F2B] bg-[#0B0B0F] px-6 lg:px-8 pt-5 pb-0">
        <button
          onClick={() => router.push("/dashboard/projects")}
          className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-white transition-colors mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          All Projects
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#131317] border border-[#1F1F2B] flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-[#5B5CF6]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {project.clientName && (
                  <span className="text-xs text-[#6B7280] font-medium">{project.clientName}</span>
                )}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${STATUS_COLORS[project.status]}`}>
                  {project.status}
                </span>
              </div>
              <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {project.name}
              </h1>
              {project.description && (
                <p className="text-sm text-[#9CA3AF] mt-1 max-w-2xl">{project.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => router.push("/dashboard/tasks")}
              className="flex items-center gap-2 px-4 py-2 bg-[#5B5CF6] hover:bg-[#4F50DB] text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(91,92,246,0.2)]"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-5 mb-4 flex-wrap text-sm">
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-[#1F1F2B] rounded-full overflow-hidden">
              <div className="h-full bg-[#5B5CF6] rounded-full" style={{ width: `${project.progress}%` }} />
            </div>
            <span className="text-white font-bold">{project.progress}%</span>
            <span className="text-[#6B7280] text-xs">complete</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#9CA3AF]">
            <CheckSquare className="w-3.5 h-3.5" />
            <span className="text-xs">{completedTasks}/{tasks.length} tasks</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#9CA3AF]">
            <Layers className="w-3.5 h-3.5" />
            <span className="text-xs">{completedMilestones}/{totalMilestones} milestones</span>
          </div>
          {project.dueDate && (
            <div className="flex items-center gap-1.5 text-[#9CA3AF]">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs">Due {new Date(project.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[#9CA3AF]">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs">{project.teamMemberIds?.length ?? 0} members</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex">
          {["overview", "tasks", "updates"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-semibold capitalize transition-all border-b-2 ${activeTab === tab
                ? "text-[#5B5CF6] border-[#5B5CF6]"
                : "text-[#6B7280] border-transparent hover:text-white"
                }`}
            >
              {tab}
              {tab === "tasks" && tasks.length > 0 && (
                <span className="ml-1.5 text-[10px] bg-[#1F1F2B] text-[#9CA3AF] px-1.5 py-0.5 rounded-full">{tasks.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6 lg:px-8 py-6 max-w-6xl">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Milestone Timeline</h3>
              <div className="bg-[#0D0D13] border border-[#1F1F2B] rounded-2xl p-5">
                {project.milestones && project.milestones.length > 0 ? (
                  <div className="relative">
                    <div className="absolute left-4 top-4 bottom-4 w-px bg-[#1F1F2B]" />
                    <div className="space-y-5">
                      {project.milestones.map((m, i) => (
                        <div key={m.id} className="flex items-start gap-4 relative">
                          <div className={`w-8 h-8 rounded-full shrink-0 z-10 flex items-center justify-center border-2 transition-all ${m.completed
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                            : i === currentMilestoneIdx
                              ? "bg-[#5B5CF6]/20 border-[#5B5CF6] text-[#5B5CF6]"
                              : "bg-[#131317] border-[#2D2D3D] text-[#6B7280]"
                            }`}>
                            {m.completed ? <Check className="w-3.5 h-3.5" /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                          </div>
                          <div className="flex-1 pt-0.5">
                            <p className={`text-sm font-semibold ${m.completed ? "text-[#9CA3AF] line-through" : "text-white"}`}>{m.name}</p>
                            {!m.completed && i === currentMilestoneIdx && (
                              <p className="text-xs text-[#5B5CF6] font-semibold mt-0.5">Currently in progress</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Layers className="w-8 h-8 text-[#374151] mx-auto mb-2" />
                    <p className="text-sm text-[#9CA3AF]">No milestones added yet.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Quick Stats</h3>
              {[
                { label: "Open Tasks", value: openTasks, color: "text-amber-400" },
                { label: "Completed Tasks", value: completedTasks, color: "text-emerald-400" },
                { label: "Milestones Done", value: `${completedMilestones}/${totalMilestones}`, color: "text-[#5B5CF6]" },
                { label: "Team Members", value: project.teamMemberIds?.length ?? 0, color: "text-white" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-[#0D0D13] border border-[#1F1F2B] rounded-xl p-4 flex items-center justify-between">
                  <span className="text-sm text-[#9CA3AF]">{label}</span>
                  <span className={`text-lg font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Tasks ({tasks.length})
              </h3>
              <button
                onClick={() => router.push("/dashboard/tasks")}
                className="flex items-center gap-2 px-4 py-2 bg-[#5B5CF6] hover:bg-[#4F50DB] text-white text-sm font-bold rounded-xl transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open Kanban Board
              </button>
            </div>
            {tasks.length === 0 ? (
              <div className="bg-[#0D0D13] border border-[#1F1F2B] rounded-2xl p-8 text-center">
                <CheckSquare className="w-10 h-10 text-[#374151] mx-auto mb-3" />
                <p className="text-sm text-[#9CA3AF]">No tasks yet for this project.</p>
                <p className="text-xs text-[#6B7280] mt-1">Create tasks from the Kanban board and assign them to this project.</p>
              </div>
            ) : (
              <div className="bg-[#0D0D13] border border-[#1F1F2B] rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1F1F2B] bg-[#131317]/50">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Task</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Assignee</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Priority</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F1F2B]">
                    {tasks.map(task => (
                      <tr key={task.id} className="hover:bg-[#131317] transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${PRIORITY_DOTS[task.priority]}`} />
                            <span className={`text-sm font-medium ${task.status === "done" ? "text-[#6B7280] line-through" : "text-white"}`}>
                              {task.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          {task.assigneeName ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#5B5CF6] to-[#8183FF] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                                {task.assigneeInitials || task.assigneeName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                              </div>
                              <span className="text-xs text-[#9CA3AF]">{task.assigneeName}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-[#4B5563]">Unassigned</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOTS[task.priority]}`} />
                            <span className="text-xs text-[#9CA3AF] capitalize">{task.priority}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded border ${task.status === "done" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                            : task.status === "inprogress" ? "text-[#5B5CF6] bg-[#5B5CF6]/10 border-[#5B5CF6]/20"
                              : task.status === "review" ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
                                : "text-[#6B7280] bg-[#1F1F2B] border-[#2D2D3D]"
                            }`}>
                            {STATUS_TASK_LABELS[task.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Updates Tab */}
        {activeTab === "updates" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Client Updates</h3>
              <button
                onClick={() => router.push("/dashboard/updates")}
                className="flex items-center gap-2 px-4 py-2 bg-[#5B5CF6] hover:bg-[#4F50DB] text-white text-sm font-bold rounded-xl transition-all"
              >
                <Plus className="w-4 h-4" /> Create Update
              </button>
            </div>
            <div className="bg-[#0D0D13] border border-[#1F1F2B] rounded-2xl p-8 text-center">
              <Clock className="w-10 h-10 text-[#374151] mx-auto mb-3" />
              <p className="text-sm text-[#9CA3AF]">No updates sent for this project yet.</p>
              <p className="text-xs text-[#6B7280] mt-1">Create an update to keep the client in the loop.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
