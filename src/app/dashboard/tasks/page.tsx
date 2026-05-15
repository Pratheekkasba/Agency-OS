"use client";

import { useState, useCallback, useEffect } from "react";
import {
  DndContext, DragOverlay, closestCorners, KeyboardSensor,
  PointerSensor, useSensor, useSensors, useDroppable,
  type DragEndEvent, type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus, Search, Calendar, MoreHorizontal, X,
  CheckCircle2, Circle, Timer, Eye, ChevronLeft, ChevronRight,
  LayoutGrid, CalendarDays, Edit3, Trash2, Check, AlertCircle,
  User, Flag, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { EmptyState } from "@/components/ui/empty-state";
import {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
  getAllClients,
  getAllProjects,
  resolveOrganizationId,
  updateDenormalizedClientName,
  subscribeToTasks,
  subscribeToClients,
  subscribeToProjects
} from "@/lib/firebase/firestore";
import type { Task, TaskStatus, TaskPriority, Client, Project } from "@/types";

// --- Types & Config ---
type Column = { id: TaskStatus; label: string; icon: any; color: string; accent: string };

const COLUMNS: Column[] = [
  { id: "todo", label: "To Do", icon: Circle, color: "text-[#6B7280]", accent: "#6B7280" },
  { id: "inprogress", label: "In Progress", icon: Timer, color: "text-[#5B5CF6]", accent: "#5B5CF6" },
  { id: "review", label: "In Review", icon: Eye, color: "text-amber-400", accent: "#F59E0B" },
  { id: "done", label: "Done", icon: CheckCircle2, color: "text-emerald-400", accent: "#10B981" },
];

const PRIORITY_CONFIG: Record<TaskPriority, { dot: string; label: string; bg: string }> = {
  urgent: { dot: "bg-red-400", label: "Urgent", bg: "bg-red-400/10 text-red-400 border-red-400/20" },
  medium: { dot: "bg-amber-400", label: "Medium", bg: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
  low: { dot: "bg-emerald-400", label: "Low", bg: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" },
};

const AVATAR_COLORS = [
  "from-violet-500 to-indigo-500", "from-emerald-500 to-teal-500",
  "from-orange-500 to-red-500", "from-pink-500 to-rose-500", "from-cyan-500 to-blue-500",
];

const today = new Date();
const fmtDate = (d: Date) => d.toISOString().split("T")[0];
const addDays = (base: Date, days: number) => {
  const r = new Date(base);
  r.setDate(r.getDate() + days);
  return fmtDate(r);
};

// --- Task Card ---
function TaskCard({ task, isDragging = false, onClick }: { task: Task; isDragging?: boolean; onClick?: () => void }) {
  const priorityConf = PRIORITY_CONFIG[task.priority];
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";
  const initials = task.assigneeInitials || (task.assigneeName?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() ?? "");
  const colorIdx = initials ? initials.charCodeAt(0) % AVATAR_COLORS.length : 0;

  return (
    <div
      onClick={onClick}
      className={`group bg-[#0D0D13] border rounded-xl p-3.5 cursor-pointer transition-all duration-150 relative overflow-hidden
        ${isDragging
          ? "border-[#5B5CF6] shadow-[0_15px_40px_rgba(91,92,246,0.3)] rotate-2 scale-105 opacity-100 z-50 ring-2 ring-[#5B5CF6]/50"
          : "border-[#1F1F2B] hover:border-[#5B5CF6]/30 hover:shadow-[0_4px_20px_rgba(91,92,246,0.08)] hover:-translate-y-0.5"
        }`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5B5CF6]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between gap-2 mb-2.5">
        <p className={`text-sm font-semibold leading-snug flex-1 ${isOverdue ? "text-red-300" : "text-white"}`}>
          {task.title}
        </p>
        <button
          onClick={e => { e.stopPropagation(); onClick?.(); }}
          className="p-1 rounded-md text-[#4B5563] hover:text-white hover:bg-[#1F1F2B] transition-colors opacity-0 group-hover:opacity-100 shrink-0"
        >
          <Edit3 className="w-3 h-3" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${priorityConf.dot}`} />
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${priorityConf.bg}`}>
            {priorityConf.label}
          </span>
          {isOverdue && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-red-400/10 text-red-400 border-red-400/20 flex items-center gap-0.5">
              <AlertCircle className="w-2.5 h-2.5" />Overdue
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {task.dueDate && (
            <div className={`flex items-center gap-1 text-[10px] font-medium ${isOverdue ? "text-red-400" : "text-[#6B7280]"}`}>
              <Calendar className="w-3 h-3" />
              {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          )}
          {initials && (
            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${AVATAR_COLORS[colorIdx]} flex items-center justify-center text-[9px] font-bold text-white`}>
              {initials}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Sortable Task Card ---
function SortableTaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0 : 1 };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={onClick} />
    </div>
  );
}

// --- Kanban Column ---
function KanbanColumn({ column, tasks, onAddTask, onClickTask }: {
  column: Column; tasks: Task[]; onAddTask: (s: TaskStatus) => void; onClickTask: (t: Task) => void;
}) {
  const Icon = column.icon;
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex flex-col w-72 shrink-0 h-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${column.color}`} />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">{column.label}</h3>
          <span className="text-[11px] font-bold text-[#6B7280] bg-[#131317] border border-[#1F1F2B] px-1.5 py-0.5 rounded-full min-w-[22px] text-center">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          className="p-1 rounded-md text-[#4B5563] hover:text-[#5B5CF6] hover:bg-[#5B5CF6]/10 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 rounded-xl border p-2 overflow-y-auto transition-all duration-200 ${
          isOver ? "bg-[#131317] border-[#5B5CF6]/50 shadow-[inset_0_0_30px_rgba(91,92,246,0.15)]" : "bg-[#0B0B0F]/50 border-[#1F1F2B]"
        }`}
        style={{ borderTop: `2px solid ${column.accent}30` }}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {tasks.map(task => (
              <SortableTaskCard key={task.id} task={task} onClick={() => onClickTask(task)} />
            ))}
          </div>
        </SortableContext>

        {tasks.length === 0 && (
          <div className="mt-4 opacity-50 hover:opacity-100 transition-opacity">
            <EmptyState
              icon={Plus}
              title="No Tasks"
              description="Drop tasks here"
              action={{ label: "Add Task", onClick: () => onAddTask(column.id) }}
              variant="default"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// --- Task Edit Panel ---
function TaskEditPanel({
  task, onClose, onSave, onDelete
}: {
  task: Task;
  onClose: () => void;
  onSave: (t: Task) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) { toast.error("Task title is required"); return; }
    setSaving(true);
    await onSave({ ...task, title: title.trim(), priority, status, dueDate });
    setSaving(false);
    onClose();
  };

  const handleDelete = async () => {
    await onDelete(task.id);
    onClose();
  };

  const isOverdue = dueDate && new Date(dueDate) < new Date() && status !== "done";

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-sm bg-[#0D0D13] border-l border-[#1F1F2B] flex flex-col animate-slide-in-right overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F1F2B] sticky top-0 bg-[#0D0D13] z-10">
          <h2 className="text-sm font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Edit Task</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-[#6B7280] hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-[#6B7280] hover:text-white hover:bg-[#1A1A24] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5 flex-1">
          <div>
            <label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">Title</label>
            <textarea
              value={title}
              onChange={e => setTitle(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 bg-[#131317] border border-[#1F1F2B] focus:border-[#5B5CF6]/50 focus:ring-1 focus:ring-[#5B5CF6]/30 rounded-xl text-sm text-white placeholder-[#6B7280] outline-none resize-none transition-all"
            />
          </div>

          {isOverdue && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-400/10 border border-red-400/20 rounded-lg text-xs text-red-400 font-semibold">
              <AlertCircle className="w-3.5 h-3.5" /> This task is overdue
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">Status</label>
            <div className="grid grid-cols-2 gap-1.5">
              {COLUMNS.map(c => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.id}
                    onClick={() => setStatus(c.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${status === c.id ? "bg-[#1F1F2B] border-[#5B5CF6]/30 text-white" : "bg-[#131317] border-[#1F1F2B] text-[#6B7280] hover:text-white"}`}
                  >
                    <Icon className={`w-3 h-3 ${c.color}`} />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">Priority</label>
            <div className="flex gap-1.5">
              {(["urgent", "medium", "low"] as TaskPriority[]).map(p => (
                <button key={p} onClick={() => setPriority(p)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border capitalize transition-all ${priority === p ? PRIORITY_CONFIG[p].bg : "bg-[#131317] border-[#1F1F2B] text-[#6B7280] hover:text-white"}`}
                >{p}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">Due Date</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-[#131317] border border-[#1F1F2B] focus:border-[#5B5CF6]/50 rounded-lg text-sm text-white outline-none transition-all" />
          </div>

          {task.clientName && (
            <div className="px-3 py-2.5 bg-[#131317] border border-[#1F1F2B] rounded-lg">
              <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-0.5">Client</p>
              <p className="text-sm font-medium text-white">{task.clientName}</p>
            </div>
          )}
          {task.projectName && (
            <div className="px-3 py-2.5 bg-[#131317] border border-[#1F1F2B] rounded-lg">
              <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-0.5">Project</p>
              <p className="text-sm font-medium text-white">{task.projectName}</p>
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-[#1F1F2B] flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-sm font-semibold text-[#9CA3AF] hover:text-white bg-[#131317] border border-[#1F1F2B] rounded-xl transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2 bg-[#5B5CF6] hover:bg-[#4F50DB] disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving…</> : <>
              <Check className="w-3.5 h-3.5" />Save Changes
            </>}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Calendar View ---
function CalendarView({ tasks, onClickTask }: { tasks: Task[]; onClickTask: (t: Task) => void }) {
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const totalCells = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7;

  const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const getTasksForDate = (date: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    return tasks.filter(t => t.dueDate === dateStr && t.status !== "done");
  };

  const todayStr = fmtDate(today);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {MONTHS[month]} {year}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1.5 rounded-lg text-[#6B7280] hover:text-white hover:bg-[#1F1F2B] transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); }}
            className="text-xs font-bold px-3 py-1 rounded-lg bg-[#1F1F2B] text-[#9CA3AF] hover:text-white transition-colors"
          >Today</button>
          <button onClick={nextMonth} className="p-1.5 rounded-lg text-[#6B7280] hover:text-white hover:bg-[#1F1F2B] transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[11px] font-bold text-[#6B7280] uppercase tracking-wider py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1 border-l border-t border-[#1F1F2B] rounded-l-xl rounded-t-xl overflow-hidden">
        {Array.from({ length: totalCells }).map((_, i) => {
          const dayNum = i - startOffset + 1;
          const isValid = dayNum >= 1 && dayNum <= lastDay.getDate();
          const dateStr = isValid
            ? `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`
            : null;
          const dayTasks = isValid ? getTasksForDate(dayNum) : [];
          const isToday = dateStr === todayStr;
          const isPast = isValid && dateStr !== null && dateStr < todayStr;

          return (
            <div
              key={i}
              className={`min-h-[100px] border-r border-b border-[#1F1F2B] p-1.5 ${!isValid ? "bg-[#0B0B0F]" : isPast ? "bg-[#0D0D13]/50" : "bg-[#0D0D13]"}`}
            >
              {isValid && (
                <>
                  <div className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mb-1 ${isToday ? "bg-[#5B5CF6] text-white" : "text-[#6B7280]"}`}>
                    {dayNum}
                  </div>
                  <div className="space-y-0.5">
                    {dayTasks.slice(0, 3).map(task => {
                      const isOverdue = dateStr! < todayStr;
                      return (
                        <button
                          key={task.id}
                          onClick={() => onClickTask(task)}
                          className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] font-semibold truncate transition-all hover:opacity-80 ${isOverdue
                            ? "bg-red-400/15 text-red-300 border border-red-400/20"
                            : task.priority === "urgent"
                              ? "bg-red-400/10 text-red-300 border border-red-400/15"
                              : task.priority === "medium"
                                ? "bg-amber-400/10 text-amber-300 border border-amber-400/15"
                                : "bg-[#5B5CF6]/10 text-[#A4A6FF] border border-[#5B5CF6]/15"
                            }`}
                        >
                          {task.title}
                        </button>
                      );
                    })}
                    {dayTasks.length > 3 && (
                      <p className="text-[10px] text-[#6B7280] px-1">+{dayTasks.length - 3} more</p>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- New Task Modal ---
function NewTaskModal({ defaultStatus, onClose, onSave, clients, projects }: {
  defaultStatus: TaskStatus;
  onClose: () => void;
  onSave: (task: Partial<Task>) => Promise<void>;
  clients: Client[];
  projects: Project[];
}) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredProjects = clientId
    ? projects.filter(p => p.clientId === clientId)
    : projects;

  const selectedClient = clients.find(c => c.id === clientId);
  const selectedProject = projects.find(p => p.id === projectId);

  const handleSave = async () => {
    if (!title.trim()) { toast.error("Enter a task title"); return; }
    setSaving(true);
    await onSave({
      title: title.trim(),
      status,
      priority,
      dueDate,
      clientId: clientId || undefined,
      clientName: selectedClient?.name,
      projectId: projectId || undefined,
      projectName: selectedProject?.name,
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0D0D13] border border-[#1F1F2B] rounded-2xl shadow-2xl animate-modal overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5B5CF6]/40 to-transparent" />
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F1F2B]">
          <h2 className="text-sm font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>New Task</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#6B7280] hover:text-white hover:bg-[#1A1A24] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && title.trim()) handleSave(); }}
            placeholder="Task title… (Press Enter to save)"
            className="w-full px-4 py-2.5 bg-[#131317] border border-[#1F1F2B] focus:border-[#5B5CF6]/50 focus:ring-1 focus:ring-[#5B5CF6]/30 rounded-xl text-sm text-white placeholder-[#6B7280] outline-none transition-all"
          />

          {/* Client + Project selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">Client</label>
              <select
                value={clientId}
                onChange={e => { setClientId(e.target.value); setProjectId(""); }}
                className="w-full px-3 py-1.5 bg-[#131317] border border-[#1F1F2B] rounded-lg text-[11px] text-white outline-none cursor-pointer"
              >
                <option value="">No client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">Project</label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#131317] border border-[#1F1F2B] rounded-lg text-[11px] text-white outline-none cursor-pointer"
              >
                <option value="">No project</option>
                {filteredProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">Priority</label>
              <div className="flex gap-1">
                {(["urgent", "medium", "low"] as TaskPriority[]).map(p => (
                  <button key={p} onClick={() => setPriority(p)}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border capitalize transition-all ${priority === p ? PRIORITY_CONFIG[p].bg : "bg-[#131317] border-[#1F1F2B] text-[#6B7280]"}`}
                  >{p}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-1.5 bg-[#131317] border border-[#1F1F2B] rounded-lg text-[11px] text-white outline-none">
                {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">Due Date</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#131317] border border-[#1F1F2B] rounded-lg text-[11px] text-white outline-none" />
          </div>
        </div>
        <div className="px-5 py-4 border-t border-[#1F1F2B] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-[#9CA3AF] hover:text-white transition-colors">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-[#5B5CF6] hover:bg-[#4F50DB] disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2"
          >
            {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Creating…</> : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---
type ViewMode = "board" | "calendar";

export default function TasksPage() {
  const { userData } = useAuth();
  const orgId = resolveOrganizationId(userData);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>("todo");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!orgId) return;

    setIsLoading(true);

    // Subscribe to Tasks
    const unsubTasks = subscribeToTasks(orgId, (fetchedTasks) => {
      setTasks(fetchedTasks);
      setIsLoading(false);
    }, (err) => {
      console.error("Tasks subscription error:", err);
      setIsLoading(false);
    });

    // Subscribe to Clients
    const unsubClients = subscribeToClients(orgId, (fetchedClients) => {
      setClients(fetchedClients);
    }, (err) => {
      console.error("Clients subscription error:", err);
    });

    // Subscribe to Projects
    const unsubProjects = subscribeToProjects(orgId, (fetchedProjects) => {
      setProjects(fetchedProjects);
    }, (err) => {
      console.error("Projects subscription error:", err);
    });

    return () => {
      unsubTasks();
      unsubClients();
      unsubProjects();
    };
  }, [orgId]);

  const filteredTasks = tasks.filter(t =>
    (priorityFilter === "all" || t.priority === priorityFilter) &&
    (!search || t.title.toLowerCase().includes(search.toLowerCase()) || t.assigneeName?.toLowerCase().includes(search.toLowerCase()) || t.clientName?.toLowerCase().includes(search.toLowerCase()))
  );

  const getTasksByColumn = useCallback((status: TaskStatus) => {
    return filteredTasks.filter(t => t.status === status);
  }, [filteredTasks]);

  // --- Drag & Drop ---
  const handleDragStart = (e: DragStartEvent) => setActiveTask(tasks.find(t => t.id === e.active.id) ?? null);
  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveTask(null);
    if (!over) return;
    const draggedId = active.id as string;
    const overId = over.id as string;
    const targetColumn = COLUMNS.find(c => c.id === overId);
    const targetTask = tasks.find(t => t.id === overId);
    const targetStatus: TaskStatus = targetColumn?.id ?? targetTask?.status ?? "todo";
    const draggedTask = tasks.find(t => t.id === draggedId);
    if (!draggedTask || draggedTask.status === targetStatus) return;

    // Optimistic update
    setTasks(prev => prev.map(t => t.id === draggedId ? { ...t, status: targetStatus } : t));
    try {
      await updateTask(draggedId, { status: targetStatus });
    } catch (err) {
      // Revert on failure
      setTasks(prev => prev.map(t => t.id === draggedId ? { ...t, status: draggedTask.status } : t));
      toast.error("Failed to update task status");
    }
  };

  // --- CRUD ---
  const handleAddTask = (status: TaskStatus) => { setNewTaskStatus(status); setShowNewTask(true); };

  const handleSaveNewTask = async (data: Partial<Task>) => {
    if (!orgId) { toast.error("Not authenticated"); return; }
    try {
      await addTask(orgId, data as any);
      toast.success("Task created!");
      setShowNewTask(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create task");
    }
  };

  const handleSaveEdit = async (updated: Task) => {
    try {
      await updateTask(updated.id, {
        title: updated.title,
        status: updated.status,
        priority: updated.priority,
        dueDate: updated.dueDate,
        clientId: updated.clientId,
        projectId: updated.projectId,
      });
      toast.success("Task updated!");
    } catch (err) {
      toast.error("Failed to update task");
    }
  };


  const handleDeleteTask = async (id: string) => {
    // Optimistic delete
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await deleteTask(id);
      toast.success("Task deleted");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === "done").length;
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done").length;

  return (
    <div className="h-full flex flex-col overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="px-6 lg:px-8 pt-5 pb-4 border-b border-[#1F1F2B] shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Tasks</h1>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              {isLoading ? "Loading…" : <>{doneTasks}/{totalTasks} complete{overdueTasks > 0 && <span className="text-red-400 ml-2 font-semibold">· {overdueTasks} overdue</span>}</>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5 bg-[#131317] border border-[#1F1F2B] rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("board")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${viewMode === "board" ? "bg-[#1F1F2B] text-white" : "text-[#6B7280] hover:text-white"}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Board
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${viewMode === "calendar" ? "bg-[#1F1F2B] text-white" : "text-[#6B7280] hover:text-white"}`}
              >
                <CalendarDays className="w-3.5 h-3.5" /> Calendar
              </button>
            </div>
            <button
              onClick={() => handleAddTask("todo")}
              className="flex items-center gap-2 px-4 py-2 bg-[#5B5CF6] hover:bg-[#4F50DB] text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(91,92,246,0.2)]"
            >
              <Plus className="w-4 h-4" /> New Task
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="pl-8 pr-4 py-1.5 bg-[#131317] border border-[#1F1F2B] hover:border-[#2D2D3D] focus:border-[#5B5CF6]/50 rounded-lg text-sm text-white placeholder-[#6B7280] outline-none transition-all w-44"
            />
          </div>
          <div className="flex gap-1">
            {["all", "urgent", "medium", "low"].map(p => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all capitalize ${priorityFilter === p
                  ? "bg-[#5B5CF6]/15 text-[#5B5CF6] border border-[#5B5CF6]/30"
                  : "text-[#9CA3AF] hover:text-white bg-[#131317] border border-[#1F1F2B] hover:border-[#2D2D3D]"
                  }`}
              >{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#5B5CF6] animate-spin" />
            <p className="text-sm text-[#6B7280]">Loading tasks…</p>
          </div>
        </div>
      ) : (
        <>
          {/* Board View */}
          {viewMode === "board" && (
            <div className="flex-1 overflow-x-auto overflow-y-hidden px-6 lg:px-8 py-5">
              <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="flex gap-4 h-full">
                  {COLUMNS.map(column => (
                    <KanbanColumn
                      key={column.id}
                      column={column}
                      tasks={getTasksByColumn(column.id)}
                      onAddTask={handleAddTask}
                      onClickTask={task => setEditingTask(task)}
                    />
                  ))}
                </div>
                <DragOverlay>
                  {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
                </DragOverlay>
              </DndContext>
            </div>
          )}

          {/* Calendar View */}
          {viewMode === "calendar" && (
            <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-5">
              <CalendarView tasks={filteredTasks} onClickTask={task => setEditingTask(task)} />
            </div>
          )}
        </>
      )}

      {/* Modals & Panels */}
      {showNewTask && (
        <NewTaskModal
          defaultStatus={newTaskStatus}
          onClose={() => setShowNewTask(false)}
          onSave={handleSaveNewTask}
          clients={clients}
          projects={projects}
        />
      )}

      {editingTask && (
        <TaskEditPanel
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleSaveEdit}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}

