"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import {
  User, Building2, CreditCard, Bell, Shield, LogOut,
  Check, ChevronRight, Sparkles, Globe, Clock, Mail
} from "lucide-react";
import { toast } from "sonner";

const PLAN_FEATURES = {
  Starter: ["3 clients", "1 user", "Basic updates", "Client portal"],
  Growth: ["15 clients", "5 users", "AI message drafts", "Priority support", "Client portal"],
  Scale: ["Unlimited clients", "15 users", "All AI features", "White-label portal", "API access"],
};

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0D0D13] border border-[#1F1F2B] rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#1F1F2B] bg-[#131317]/40">
        <h2 className="text-sm font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h2>
      </div>
      <div className="divide-y divide-[#1F1F2B]">{children}</div>
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{label}</p>
        {description && <p className="text-xs text-[#6B7280] mt-0.5">{description}</p>}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

export default function SettingsPage() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [agencyName, setAgencyName] = useState("My Agency");
  const [savedName, setSavedName] = useState(false);
  const [notifUpdates, setNotifUpdates] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifOverdue, setNotifOverdue] = useState(true);
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleSaveName = () => {
    setSavedName(true);
    toast.success("Agency name updated!");
    setTimeout(() => setSavedName(false), 2000);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-10 h-5.5 rounded-full transition-all duration-200 ${value ? "bg-[#5B5CF6]" : "bg-[#2D2D3D]"}`}
      style={{ height: "22px", width: "40px" }}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${value ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-8 max-w-3xl mx-auto space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Settings</h1>
        <p className="text-sm text-[#9CA3AF] mt-0.5">Manage your agency workspace and preferences</p>
      </div>

      {/* Profile */}
      <SettingSection title="Profile">
        <div className="px-6 py-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5B5CF6] to-[#4F50DB] flex items-center justify-center text-xl font-black text-white shadow-lg shrink-0">
            {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-base font-bold text-white">{user?.displayName || "Agency Owner"}</p>
            <p className="text-sm text-[#6B7280]">{user?.email}</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-[#5B5CF6]/10 text-[#5B5CF6] border border-[#5B5CF6]/20 mt-1.5">
              <Sparkles className="w-2.5 h-2.5" /> Agency Pro
            </span>
          </div>
        </div>
        <SettingRow label="Display Name" description="How your name appears to team members">
          <span className="text-sm text-[#9CA3AF]">{user?.displayName || "Not set"}</span>
        </SettingRow>
        <SettingRow label="Email Address" description="Your login email">
          <span className="text-sm text-[#9CA3AF]">{user?.email}</span>
        </SettingRow>
      </SettingSection>

      {/* Agency */}
      <SettingSection title="Agency Workspace">
        <div className="px-6 py-4">
          <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Agency Name</label>
          <div className="flex gap-2">
            <input
              value={agencyName}
              onChange={e => setAgencyName(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-[#131317] border border-[#1F1F2B] focus:border-[#5B5CF6]/50 focus:ring-1 focus:ring-[#5B5CF6]/30 rounded-xl text-sm text-white outline-none transition-all"
            />
            <button
              onClick={handleSaveName}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${savedName ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" : "bg-[#5B5CF6] hover:bg-[#4F50DB] text-white"}`}
            >
              {savedName ? <><Check className="w-4 h-4 inline mr-1" />Saved</> : "Save"}
            </button>
          </div>
        </div>
        <div className="px-6 py-4">
          <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Timezone</label>
          <select
            value={timezone}
            onChange={e => setTimezone(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#131317] border border-[#1F1F2B] rounded-xl text-sm text-white outline-none"
          >
            <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</option>
            <option value="America/New_York">America/New_York (EST, UTC-5)</option>
            <option value="Europe/London">Europe/London (GMT, UTC+0)</option>
            <option value="America/Los_Angeles">America/Los_Angeles (PST, UTC-8)</option>
            <option value="Europe/Berlin">Europe/Berlin (CET, UTC+1)</option>
            <option value="Asia/Singapore">Asia/Singapore (SGT, UTC+8)</option>
          </select>
        </div>
        <SettingRow label="Workspace ID" description="Your unique agency identifier">
          <code className="text-xs text-[#9CA3AF] bg-[#131317] border border-[#1F1F2B] px-2.5 py-1 rounded-lg font-mono">
            {userData?.organization_id || "Not set"}
          </code>
        </SettingRow>
      </SettingSection>

      {/* Plan */}
      <SettingSection title="Plan & Billing">
        <div className="px-6 py-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#5B5CF6] bg-[#5B5CF6]/10 border border-[#5B5CF6]/20 px-2 py-0.5 rounded uppercase tracking-wider">Current Plan</span>
              </div>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Growth</h3>
              <p className="text-sm text-[#9CA3AF] mt-0.5">$49/month · Renews May 10, 2026</p>
            </div>
            <button className="px-4 py-2 bg-[#131317] hover:bg-[#1A1A24] border border-[#1F1F2B] text-[#9CA3AF] hover:text-white text-xs font-bold rounded-xl transition-all">
              Manage Billing
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {PLAN_FEATURES.Growth.map(f => (
              <span key={f} className="flex items-center gap-1.5 text-[11px] font-medium text-[#9CA3AF] bg-[#131317] border border-[#1F1F2B] px-2.5 py-1 rounded-lg">
                <Check className="w-3 h-3 text-emerald-400" />{f}
              </span>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 bg-gradient-to-r from-[#5B5CF6]/5 to-transparent border-t border-[#1F1F2B]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Upgrade to Scale</p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">Unlimited clients, 15 users, white-label portal</p>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#5B5CF6] hover:bg-[#4F50DB] text-white text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(91,92,246,0.2)]">
              <Sparkles className="w-3.5 h-3.5" />
              Upgrade — $99/mo
            </button>
          </div>
        </div>
      </SettingSection>

      {/* Notifications */}
      <SettingSection title="Notifications">
        <SettingRow label="Client update reminders" description="Alert when a client hasn't received an update in 3+ days">
          <Toggle value={notifUpdates} onChange={() => setNotifUpdates(v => !v)} />
        </SettingRow>
        <SettingRow label="New inbox messages" description="Notify when a client sends a message">
          <Toggle value={notifMessages} onChange={() => setNotifMessages(v => !v)} />
        </SettingRow>
        <SettingRow label="Overdue task alerts" description="Notify when tasks pass their due date">
          <Toggle value={notifOverdue} onChange={() => setNotifOverdue(v => !v)} />
        </SettingRow>
      </SettingSection>

      {/* Danger Zone */}
      <SettingSection title="Session">
        <div className="px-6 py-4">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/30 text-red-400 text-sm font-semibold rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out of Agency OS
          </button>
          <p className="text-xs text-[#4B5563] mt-2">You'll be redirected to the login page.</p>
        </div>
      </SettingSection>
    </div>
  );
}
