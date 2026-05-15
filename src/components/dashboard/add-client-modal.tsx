"use client";

import { useState, useEffect, useRef } from "react";
import {
  X, Sparkles, User, Mail, Phone, Building2,
  Folder, Target, Calendar, Users, ChevronDown,
  CheckCircle2, ArrowRight, Loader2, Globe, Monitor,
  Megaphone, Layers, Zap, Clock, Check, DollarSign,
  MessageSquare, Brain, FileText, StickyNote, Send,
  Briefcase, Store, Bot, Star,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { addClient, addProject, addUpdate, getTeamMembers, resolveOrganizationId } from "@/lib/firebase/firestore";
import { notifyClientInviteEmail } from "@/lib/email/notify";
import { auth } from "@/lib/firebase/config";
import { toast } from "sonner";
import type { TeamMember, Project } from "@/types";

// --- Constants ---

const PROJECT_TYPES: { value: Project["type"]; label: string; icon: React.ElementType }[] = [
  { value: "website",  label: "Website",       icon: Globe },
  { value: "campaign", label: "Marketing",     icon: Megaphone },
  { value: "other",    label: "AI Automation", icon: Zap },
  { value: "app",      label: "Social Media",  icon: Monitor },
  { value: "brand",    label: "Brand",         icon: Layers },
];

const CLIENT_TYPES = [
  { value: "startup",        label: "Startup",        icon: Zap },
  { value: "local_business", label: "Local Business", icon: Store },
  { value: "agency",         label: "Agency",         icon: Briefcase },
  { value: "personal_brand", label: "Personal Brand", icon: Star },
] as const;
type ClientType = typeof CLIENT_TYPES[number]["value"];

const CONTACT_METHODS = [
  { value: "whatsapp", label: "WhatsApp", icon: MessageSquare, color: "#25D366" },
  { value: "email",    label: "Email",    icon: Mail,          color: "#5B5CF6" },
] as const;
type ContactMethod = typeof CONTACT_METHODS[number]["value"];

const UPDATE_FORMATS = [
  { value: "text",   label: "Simple text update", icon: FileText,
    desc: "Clean bullet-point rundown" },
  { value: "report", label: "Detailed report",    icon: Layers,
    desc: "Full breakdown with metrics" },
  { value: "visual", label: "Visual (links)",     icon: Monitor,
    desc: "Images, links & previews" },
] as const;
type UpdateFormat = typeof UPDATE_FORMATS[number]["value"];

const ANXIETY_LEVELS = [
  { value: "chill",  emoji: "😎", label: "Chill",  desc: "Bi-weekly updates", color: "#10B981" },
  { value: "normal", emoji: "🙂", label: "Normal", desc: "Weekly updates",    color: "#5B5CF6" },
  { value: "high",   emoji: "😬", label: "High",   desc: "Twice a week",     color: "#EF4444" },
] as const;
type AnxietyLevel = typeof ANXIETY_LEVELS[number]["value"];

const UPDATE_FREQS = ["Daily", "Weekly", "Bi-weekly"] as const;
const STATUSES = ["Active", "Paused"] as const;

const DEFAULT_MILESTONES = [
  "Discovery & Brief",
  "Design & Wireframes",
  "Development",
  "QA & Testing",
  "Launch",
];

// --- Next auto-schedule helper ---

function calcNextUpdate(startDate: string, freq: string): string {
  const base = startDate ? new Date(startDate) : new Date();
  const daysMap: Record<string, number> = {
    Daily: 1, Weekly: 7, "Bi-weekly": 14,
  };
  const next = new Date(base.getTime() + (daysMap[freq] || 7) * 24 * 60 * 60 * 1000);
  return next.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// --- Input helpers ---

function Field({
  label, required, helper, icon: Icon, error, children,
}: {
  label: string; required?: boolean; helper?: string;
  icon?: React.ElementType; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest">
          {label}
          {required && <span className="text-[#5B5CF6] ml-1">*</span>}
        </label>
        {helper && <span className="text-[10px] text-[#6B7280] italic">{helper}</span>}
      </div>
      <div className="relative group">
        {Icon && (
          <Icon className="w-4 h-4 text-[#3D3D4D] absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-[#5B5CF6] transition-colors pointer-events-none z-10" />
        )}
        {children}
      </div>
      {error && (
        <p className="text-[11px] text-red-400 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls = (hasIcon = true) =>
  `w-full bg-[#0D0D13] border border-[#1F1F2B] rounded-xl ${hasIcon ? "pl-10" : "pl-4"} pr-4 py-3 text-[13px] text-white placeholder-[#3D3D4D] focus:outline-none focus:border-[#5B5CF6] focus:ring-1 focus:ring-[#5B5CF6]/30 transition-all hover:border-[#2D2D3D]`;

const selectCls = (hasIcon = true) =>
  `w-full bg-[#0D0D13] border border-[#1F1F2B] rounded-xl ${hasIcon ? "pl-10" : "pl-4"} pr-10 py-3 text-[13px] text-white focus:outline-none focus:border-[#5B5CF6] focus:ring-1 focus:ring-[#5B5CF6]/30 transition-all hover:border-[#2D2D3D] appearance-none cursor-pointer`;

// --- Step Indicator ---

function StepDot({ label, index, current, done }: {
  label: string; index: number; current: number; done: boolean;
}) {
  const active = index === current;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
        done   ? "bg-[#10B981] text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]" :
        active ? "bg-[#5B5CF6] text-white shadow-[0_0_16px_rgba(91,92,246,0.5)] scale-110" :
                 "bg-[#1A1A24] border border-[#2D2D3D] text-[#6B7280]"
      }`}>
        {done ? <Check className="w-3.5 h-3.5" /> : index + 1}
      </div>
      <span className={`text-[9px] font-semibold uppercase tracking-wider transition-colors ${
        active ? "text-[#A4A6FF]" : done ? "text-[#10B981]" : "text-[#3D3D4D]"
      }`}>
        {label}
      </span>
    </div>
  );
}

// --- Main Component ---

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded?: () => void;
}

type Step = 0 | 1 | 2;

interface FormState {
  // Step 1 – Client
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName: string;
  clientType: ClientType;
  contactMethod: ContactMethod;
  // Step 2 – Project
  projectName: string;
  projectType: Project["type"];
  projectGoal: string;
  budget: string;
  deadline: string;
  // Step 3 – Setup
  startDate: string;
  status: "Active" | "Paused";
  updateFrequency: typeof UPDATE_FREQS[number];
  assignedTeamMemberId: string;
  updateFormat: UpdateFormat;
  anxietyLevel: AnxietyLevel;
  internalNotes: string;
}

interface FormErrors {
  clientName?: string;
  clientEmail?: string;
  projectName?: string;
}

const INITIAL: FormState = {
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  companyName: "",
  clientType: "startup",
  contactMethod: "email",
  projectName: "",
  projectType: "website",
  projectGoal: "",
  budget: "",
  deadline: "",
  startDate: new Date().toISOString().split("T")[0],
  status: "Active",
  updateFrequency: "Weekly",
  assignedTeamMemberId: "",
  updateFormat: "text",
  anxietyLevel: "normal",
  internalNotes: "",
};

export function AddClientModal({ isOpen, onClose, onClientAdded }: AddClientModalProps) {
  const { userData } = useAuth();
  const orgId = resolveOrganizationId(userData);

  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdInfo, setCreatedInfo] = useState<{ clientName: string; projectName: string } | null>(null);

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!orgId || !isOpen) return;
    getTeamMembers(orgId).then(setTeamMembers).catch(() => {});
  }, [orgId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setForm(INITIAL);
      setErrors({});
      setSuccess(false);
      setCreatedInfo(null);
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  // --- Validation ---

  const validateStep = (s: Step): boolean => {
    const errs: FormErrors = {};
    if (s === 0) {
      if (!form.clientName.trim()) errs.clientName = "Client name is required";
      if (!form.clientEmail.trim()) errs.clientEmail = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail))
        errs.clientEmail = "Please enter a valid email";
    }
    if (s === 1) {
      if (!form.projectName.trim()) errs.projectName = "Project name is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(step)) return;
    setStep(prev => (prev + 1) as Step);
  };

  // --- Submit ---

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    if (!orgId) { toast.error("Organization not found. Please sign in again."); return; }

    setSaving(true);
    try {
      // ── Ensure JWT has the organization_id custom claim before any Firestore write ──
      // Firebase issues a fresh token on login that may not yet carry the claim.
      // Force-refresh so Firestore Security Rules can validate org membership.
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("Session expired. Please sign in again.");
        setSaving(false);
        return;
      }

      // Check if the claim is already in the token; if not, re-stamp it.
      const tokenResult = await currentUser.getIdTokenResult();
      if (!tokenResult.claims.organization_id) {
        // Re-call set-claims to stamp the org id into the JWT
        const freshToken = await currentUser.getIdToken();
        await fetch("/api/auth/set-claims", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: freshToken, organization_id: orgId, role: userData?.role ?? "owner" }),
        });
      }
      // Always force-refresh so the latest claims are in the token Firestore will receive
      await currentUser.getIdToken(/* forceRefresh */ true);

      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const accessId = `OS-${Array.from({ length: 4 }, () =>
        chars[Math.floor(Math.random() * chars.length)]).join("")}`;

      const clientRef = await addClient(orgId, {
        name: form.clientName.trim(),
        email: form.clientEmail.trim(),
        phone: form.clientPhone.trim() || undefined,
        companyName: form.companyName.trim() || undefined,
        clientType: form.clientType,
        contactMethod: form.contactMethod,
        assigned_team: form.assignedTeamMemberId ? [form.assignedTeamMemberId] : [],
        projectName: form.projectName.trim() || undefined,
        status: form.status,
        progress: 0,
        nextStep: "Kickoff",
        accessId,
        updateFrequency: form.updateFrequency,
        updateFormat: form.updateFormat,
        anxietyLevel: form.anxietyLevel,
        internalNotes: form.internalNotes.trim() || undefined,
      });

      await addProject(orgId, {
        clientId: clientRef.id,
        clientName: form.companyName.trim() || form.clientName.trim(),
        name: form.projectName.trim(),
        type: form.projectType,
        status: form.status === "Active" ? "active" : "paused",
        progress: 0,
        budget: form.budget.trim() || undefined,
        deadline: form.deadline || undefined,
        milestones: DEFAULT_MILESTONES.map((name, i) => ({
          id: `m${i}`, name, completed: false, order: i,
        })),
        teamMemberIds: form.assignedTeamMemberId ? [form.assignedTeamMemberId] : [],
        description: form.projectGoal.trim() || undefined,
        startDate: form.startDate || undefined,
      });

      await addUpdate({
        organization_id: orgId,
        clientId: clientRef.id,
        done: [],
        inProgress: [form.projectName.trim()
          ? `Project kickoff: ${form.projectName.trim()}`
          : "Project kickoff"],
        next: ["Initial discovery call", "Brief & proposal review"],
      });

      const inviteSent = await notifyClientInviteEmail(clientRef.id);
      if (!inviteSent) {
        toast("Client created — invite email not sent", {
          description: "Set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local",
        });
      }

      setCreatedInfo({ clientName: form.clientName.trim(), projectName: form.projectName.trim() });
      setSuccess(true);
      onClientAdded?.();
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || "";
      if (msg.toLowerCase().includes("permission") || msg.toLowerCase().includes("missing or insufficient")) {
        toast.error("Permission denied — try signing out and back in, then onboard again.");
      } else {
        toast.error(msg || "Something went wrong. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  // --- Success Screen ---

  if (success && createdInfo) {
    const nextUpdateDate = calcNextUpdate(form.startDate, form.updateFrequency);
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-[#0A0A10] border border-[#1F1F2B] rounded-3xl w-full max-w-md shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative overflow-hidden text-center px-8 py-12">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#10B981]/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#5B5CF6]/10 rounded-full blur-[60px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#10B981]/10 border-2 border-[#10B981]/30 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.25)]">
              <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Client Onboarded! 🎉
              </h2>
              <p className="text-[#9CA3AF] text-sm leading-relaxed">
                <span className="text-white font-semibold">{createdInfo.clientName}</span> has been added
                {createdInfo.projectName && <> with project <span className="text-white font-semibold">"{createdInfo.projectName}"</span></>}.
              </p>
            </div>

            <div className="w-full bg-[#131317] border border-[#1F1F2B] rounded-2xl p-4 text-left space-y-3">
              <p className="text-[10px] font-bold text-[#3D3D4D] uppercase tracking-widest mb-3">What was set up</p>
              {[
                { icon: User,         label: "Client profile created" },
                { icon: Folder,       label: "Project workspace ready" },
                { icon: CheckCircle2, label: "First update placeholder set" },
                { icon: Calendar,     label: `Next update auto-scheduled: ${nextUpdateDate}` },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-[#10B981]" />
                  </div>
                  <span className="text-[13px] text-[#D1D5DB]">{label}</span>
                  <Check className="w-3.5 h-3.5 text-[#10B981] ml-auto" />
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full mt-2 px-6 py-3.5 bg-gradient-to-r from-[#5B5CF6] to-[#7C3AED] hover:from-[#4F50DB] hover:to-[#6D28D9] text-white font-bold text-sm rounded-xl transition-all shadow-[0_8px_30px_rgba(91,92,246,0.35)] hover:shadow-[0_8px_40px_rgba(91,92,246,0.55)] flex items-center justify-center gap-2"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Form ---

  const STEPS = ["Client", "Project", "Setup"];
  const isLast = step === 2;
  const nextUpdatePreview = calcNextUpdate(form.startDate, form.updateFrequency);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#0A0A10] border border-[#1E1E28] rounded-3xl w-full max-w-[560px] shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col max-h-[94vh]">

        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#5B5CF6]/8 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        {/* --- Header --- */}
        <div className="relative z-10 px-7 pt-7 pb-5 border-b border-[#1A1A24] flex-shrink-0">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#5B5CF6]/20 to-[#7C3AED]/20 border border-[#5B5CF6]/25 flex items-center justify-center shadow-[0_0_20px_rgba(91,92,246,0.15)]">
                <Sparkles className="w-5 h-5 text-[#A4A6FF]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Onboard Client
                </h2>
                <p className="text-[11px] text-[#6B7280] font-medium uppercase tracking-widest mt-0.5">
                  Automated Setup
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#3D3D4D] hover:text-white hover:bg-[#1A1A24] transition-all p-2 rounded-xl"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-0">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <StepDot label={label} index={i} current={step} done={i < step} />
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 transition-colors duration-500 ${i < step ? "bg-[#10B981]/40" : "bg-[#1F1F2B]"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* --- Body --- */}
        <div className="relative z-10 overflow-y-auto flex-1 px-7 py-6">

          {/* ══════════════════════════════════════════════════════
              STEP 0 – Client Info
          ══════════════════════════════════════════════════════ */}
          {step === 0 && (
            <div className="space-y-5 animate-fade-in">
              <p className="text-[13px] text-[#6B7280] leading-relaxed -mt-1 mb-1">
                Start with the basics --- who is this client, and how do you reach them?
              </p>

              <Field label="Client Name" required icon={User} error={errors.clientName}>
                <input
                  ref={firstInputRef}
                  type="text"
                  placeholder="e.g. John Doe"
                  value={form.clientName}
                  onChange={e => set("clientName", e.target.value)}
                  className={inputCls()}
                />
              </Field>

              <Field label="Client Email" required icon={Mail} error={errors.clientEmail}>
                <input
                  type="email"
                  placeholder="e.g. client@domain.com"
                  value={form.clientEmail}
                  onChange={e => set("clientEmail", e.target.value)}
                  className={inputCls()}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Phone / WhatsApp" icon={Phone}>
                  <input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={form.clientPhone}
                    onChange={e => set("clientPhone", e.target.value)}
                    className={inputCls()}
                  />
                </Field>
                <Field label="Company / Brand" icon={Building2}>
                  <input
                    type="text"
                    placeholder="Acme Inc."
                    value={form.companyName}
                    onChange={e => set("companyName", e.target.value)}
                    className={inputCls()}
                  />
                </Field>
              </div>

              {/* Client Type chips */}
              <div>
                <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-2">
                  Client Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CLIENT_TYPES.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => set("clientType", value)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-semibold border transition-all ${
                        form.clientType === value
                          ? "bg-[#5B5CF6]/15 border-[#5B5CF6]/40 text-[#A4A6FF]"
                          : "bg-[#0D0D13] border-[#1F1F2B] text-[#6B7280] hover:border-[#2D2D3D] hover:text-[#9CA3AF]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                      {form.clientType === value && (
                        <Check className="w-3 h-3 ml-auto text-[#5B5CF6]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-2">
                  Preferred Contact Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CONTACT_METHODS.map(({ value, label, icon: Icon, color }) => (
                    <button
                      key={value}
                      onClick={() => set("contactMethod", value)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-semibold border transition-all ${
                        form.contactMethod === value
                          ? "border-opacity-40 text-white"
                          : "bg-[#0D0D13] border-[#1F1F2B] text-[#6B7280] hover:border-[#2D2D3D] hover:text-[#9CA3AF]"
                      }`}
                      style={form.contactMethod === value
                        ? { background: `${color}18`, borderColor: `${color}55`, color }
                        : {}}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                      {form.contactMethod === value && <Check className="w-3 h-3 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════
              STEP 1 – Project Info
          ══════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <p className="text-[13px] text-[#6B7280] leading-relaxed -mt-1 mb-1">
                Define the scope of this engagement. What are you building for them?
              </p>

              <Field label="Project Name" required icon={Folder} error={errors.projectName}>
                <input
                  ref={firstInputRef}
                  type="text"
                  placeholder="e.g. Website Redesign"
                  value={form.projectName}
                  onChange={e => set("projectName", e.target.value)}
                  className={inputCls()}
                />
              </Field>

              {/* Project Type pills */}
              <div>
                <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-2">
                  Project Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_TYPES.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => set("projectType", value)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all ${
                        form.projectType === value
                          ? "bg-[#5B5CF6]/15 border-[#5B5CF6]/40 text-[#A4A6FF]"
                          : "bg-[#0D0D13] border-[#1F1F2B] text-[#6B7280] hover:border-[#2D2D3D] hover:text-[#9CA3AF]"
                      }`}
                    >
                      <Icon className="w-3 h-3" /> {label}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="Project Goal" helper="What outcome does the client expect?" icon={Target}>
                <textarea
                  placeholder="e.g. Increase leads by 30% in Q3"
                  value={form.projectGoal}
                  onChange={e => set("projectGoal", e.target.value)}
                  rows={3}
                  className={`${inputCls()} resize-none`}
                  style={{ paddingTop: "12px" }}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Budget" helper="Optional" icon={DollarSign}>
                  <input
                    type="text"
                    placeholder="e.g. $5,000"
                    value={form.budget}
                    onChange={e => set("budget", e.target.value)}
                    className={inputCls()}
                  />
                </Field>
                <Field label="Deadline" helper="Optional" icon={Calendar}>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={e => set("deadline", e.target.value)}
                    className={inputCls()}
                  />
                </Field>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════
              STEP 2 – Setup (the differentiator)
          ══════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <p className="text-[13px] text-[#6B7280] leading-relaxed -mt-1 mb-1">
                Configure communication rhythm and client experience.
              </p>

              {/* Start Date */}
              <Field label="Start Date" icon={Calendar}>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={e => set("startDate", e.target.value)}
                  className={inputCls()}
                />
              </Field>

              {/* Status */}
              <div>
                <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-2">
                  Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => set("status", s)}
                      className={`py-3 rounded-xl text-[13px] font-bold border transition-all ${
                        form.status === s
                          ? s === "Active"
                            ? "bg-[#5B5CF6] text-white border-[#5B5CF6] shadow-[0_4px_20px_rgba(91,92,246,0.35)]"
                            : "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30"
                          : "bg-[#0D0D13] text-[#6B7280] border-[#1F1F2B] hover:border-[#2D2D3D] hover:text-[#9CA3AF]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Update Frequency + Auto-Schedule preview */}
              <div>
                <Field label="Update Frequency" helper="Auto-schedules next update" icon={Clock}>
                  <select
                    value={form.updateFrequency}
                    onChange={e => set("updateFrequency", e.target.value as typeof UPDATE_FREQS[number])}
                    className={selectCls()}
                  >
                    {UPDATE_FREQS.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#3D3D4D] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </Field>
                {/* Auto-schedule pill */}
                <div className="mt-2 flex items-center gap-2 bg-[#5B5CF6]/8 border border-[#5B5CF6]/20 rounded-lg px-3 py-2">
                  <Calendar className="w-3.5 h-3.5 text-[#A4A6FF] flex-shrink-0" />
                  <span className="text-[11px] text-[#A4A6FF]">
                    Next update auto-scheduled for <strong>{nextUpdatePreview}</strong>
                  </span>
                </div>
              </div>

              {/* Update Format */}
              <div>
                <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-2">
                  Update Format
                </label>
                <div className="space-y-2">
                  {UPDATE_FORMATS.map(({ value, label, icon: Icon, desc }) => (
                    <button
                      key={value}
                      onClick={() => set("updateFormat", value)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                        form.updateFormat === value
                          ? "bg-[#5B5CF6]/12 border-[#5B5CF6]/40"
                          : "bg-[#0D0D13] border-[#1F1F2B] hover:border-[#2D2D3D]"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        form.updateFormat === value
                          ? "bg-[#5B5CF6]/20 text-[#A4A6FF]"
                          : "bg-[#1A1A24] text-[#6B7280]"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[12px] font-semibold ${form.updateFormat === value ? "text-[#A4A6FF]" : "text-[#9CA3AF]"}`}>
                          {label}
                        </p>
                        <p className="text-[11px] text-[#6B7280]">{desc}</p>
                      </div>
                      {form.updateFormat === value && (
                        <Check className="w-4 h-4 text-[#5B5CF6] flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Anxiety Level */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-2">
                  <Brain className="w-3.5 h-3.5" />
                  Client Anxiety Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ANXIETY_LEVELS.map(({ value, emoji, label, desc, color }) => (
                    <button
                      key={value}
                      onClick={() => set("anxietyLevel", value)}
                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-center transition-all ${
                        form.anxietyLevel === value
                          ? "border-opacity-40"
                          : "bg-[#0D0D13] border-[#1F1F2B] hover:border-[#2D2D3D]"
                      }`}
                      style={form.anxietyLevel === value
                        ? { background: `${color}12`, borderColor: `${color}44` }
                        : {}}
                    >
                      <span className="text-xl">{emoji}</span>
                      <span
                        className="text-[11px] font-bold"
                        style={form.anxietyLevel === value ? { color } : { color: "#6B7280" }}
                      >
                        {label}
                      </span>
                      <span className="text-[10px] text-[#6B7280] leading-tight">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Assign team */}
              <Field label="Assign Team Member" icon={Users}>
                <select
                  value={form.assignedTeamMemberId}
                  onChange={e => set("assignedTeamMemberId", e.target.value)}
                  className={selectCls()}
                >
                  <option value="">Unassigned</option>
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.name} --- {m.role}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#3D3D4D] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </Field>

              {/* Internal Notes (hidden from client) */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-2">
                  <StickyNote className="w-3.5 h-3.5" />
                  Internal Notes
                  <span className="ml-1 px-1.5 py-0.5 bg-[#1A1A24] border border-[#2D2D3D] rounded text-[9px] text-[#6B7280] uppercase tracking-wider normal-case font-medium">
                    Hidden from client
                  </span>
                </label>
                <textarea
                  placeholder={`e.g. "Client is very picky about fonts"\n"Prefers WhatsApp over email"\n"Has used 3 agencies before"`}
                  value={form.internalNotes}
                  onChange={e => set("internalNotes", e.target.value)}
                  rows={3}
                  className="w-full bg-[#0D0D13] border border-[#1F1F2B] rounded-xl pl-4 pr-4 py-3 text-[13px] text-white placeholder-[#3D3D4D] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/20 transition-all hover:border-[#2D2D3D] resize-none"
                  style={{ paddingTop: "12px" }}
                />
              </div>

              {/* Summary preview */}
              <div className="bg-[#0D0D13] border border-[#1F1F2B] rounded-2xl p-4 space-y-2.5">
                <p className="text-[10px] font-bold text-[#3D3D4D] uppercase tracking-widest mb-3">Summary</p>
                {[
                  { label: "Client",     value: form.clientName || "---" },
                  { label: "Type",       value: CLIENT_TYPES.find(t => t.value === form.clientType)?.label || "---" },
                  { label: "Contact",    value: CONTACT_METHODS.find(c => c.value === form.contactMethod)?.label || "---" },
                  { label: "Project",    value: form.projectName || "---" },
                  { label: "Frequency",  value: form.updateFrequency },
                  { label: "Anxiety",    value: ANXIETY_LEVELS.find(a => a.value === form.anxietyLevel)?.label || "---" },
                  { label: "Next Update", value: nextUpdatePreview },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-[12px]">
                    <span className="text-[#6B7280]">{label}</span>
                    <span className="text-[#D1D5DB] font-medium text-right max-w-[220px] truncate">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- Footer --- */}
        <div className="relative z-10 px-7 py-5 border-t border-[#1A1A24] flex items-center justify-between gap-3 flex-shrink-0 bg-[#0A0A10]">
          <button
            onClick={step === 0 ? onClose : () => setStep(prev => (prev - 1) as Step)}
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-[#6B7280] hover:text-white hover:bg-[#1A1A24] transition-all border border-transparent hover:border-[#1F1F2B]"
          >
            {step === 0 ? "Cancel" : "← Back"}
          </button>

          <div className="flex items-center gap-3">
            {/* Step dots */}
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <div key={i} className={`rounded-full transition-all duration-300 ${
                  i === step ? "w-4 h-1.5 bg-[#5B5CF6]" :
                  i < step   ? "w-1.5 h-1.5 bg-[#10B981]/60" :
                               "w-1.5 h-1.5 bg-[#1F1F2B]"
                }`} />
              ))}
            </div>

            {isLast ? (
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-[#5B5CF6] to-[#7C3AED] hover:from-[#4F50DB] hover:to-[#6D28D9] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(91,92,246,0.3)] hover:shadow-[0_4px_30px_rgba(91,92,246,0.5)] flex items-center gap-2"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Onboard Client</>
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="px-6 py-2.5 bg-[#5B5CF6] hover:bg-[#4F50DB] text-white text-[13px] font-bold rounded-xl transition-all shadow-[0_4px_15px_rgba(91,92,246,0.25)] hover:shadow-[0_4px_25px_rgba(91,92,246,0.45)] flex items-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

