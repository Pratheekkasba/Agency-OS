"use client";

import { useState } from "react";
import { X, Sparkles, Building2, User, Mail, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { addClient } from "@/lib/firebase/firestore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded?: () => void;
}

export function AddClientModal({ isOpen, onClose, onClientAdded }: AddClientModalProps) {
  const { userData } = useAuth();
  const [name, setName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [status, setStatus] = useState<"Active" | "Paused">("Active");
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setName("");
    setProjectName("");
    setStatus("Active");
  };

  const generateAccessId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomPart = "";
    for (let i = 0; i < 3; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `OS-${randomPart}`;
  };

  const handleSubmit = async () => {
    if (!name.trim() || !userData?.agencyId) return;
    setSaving(true);
    try {
      const accessId = generateAccessId();
      await addClient(userData.agencyId, {
        name: name.trim(),
        projectName: projectName.trim() || undefined,
        status,
        accessId,
        progress: 0,
        nextStep: "Setup project",
      });
      toast.success("Client added successfully");
      onClientAdded?.();
      onClose();
    } catch (err: any) {
      console.error("Error adding client:", err);
      toast.error(err.message || "Failed to add client. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 font-body p-4 animate-fade-in">
      <div className="bg-[#0e0e12] border border-[#25252b] rounded-2xl w-full max-w-lg shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden animate-modal">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#a4a6ff]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        {/* Header */}
        <div className="border-b border-[#25252b] px-6 py-5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a4a6ff]/20 to-[#5f60fa]/20 border border-[#a4a6ff]/30 flex items-center justify-center text-[#a4a6ff]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-headline tracking-tight">Onboard Client</h2>
              <p className="text-[11px] text-[#acaab0] font-medium tracking-wide uppercase mt-0.5">Automated Setup</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#76757a] hover:text-white transition-colors p-2 hover:bg-[#19191e] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 relative z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#acaab0] uppercase tracking-wide mb-2">Client Name</label>
              <div className="relative group">
                <Building2 className="w-5 h-5 text-[#48474c] absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#5B5CF6] transition-colors" />
                <input 
                  type="text" 
                  placeholder="e.g. Velvet Digital"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#131317] border border-[#25252b] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#48474c] focus:outline-none focus:border-[#5B5CF6] focus:ring-1 focus:ring-[#5B5CF6]/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#acaab0] uppercase tracking-wide mb-2">Project Name</label>
              <div className="relative group">
                <Sparkles className="w-5 h-5 text-[#48474c] absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#5B5CF6] transition-colors" />
                <input 
                  type="text" 
                  placeholder="e.g. Website Overhaul"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-[#131317] border border-[#25252b] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#48474c] focus:outline-none focus:border-[#5B5CF6] focus:ring-1 focus:ring-[#5B5CF6]/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#acaab0] uppercase tracking-wide mb-2">Status</label>
              <div className="grid grid-cols-2 gap-3">
                {(["Active", "Paused"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`rounded-lg py-2.5 text-sm font-bold transition-all ${
                      status === s
                        ? "bg-[#5B5CF6] text-white shadow-sm"
                        : "bg-[#131317] text-[#acaab0] border border-[#25252b] hover:border-[#48474c] hover:bg-[#19191e]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#25252b] px-6 py-4 bg-[#131317]/50 flex items-center justify-end gap-3 rounded-b-2xl relative z-10">
          <button 
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2.5 rounded-lg text-sm font-bold text-[#acaab0] hover:text-white transition-colors"
          >
            Cancel
          </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim() || !projectName.trim() || saving}
              className="px-5 py-2.5 bg-[#5B5CF6] hover:bg-[#4F50DB] text-white text-sm font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_4px_15px_rgba(91,92,246,0.2)] hover:shadow-[0_4px_20px_rgba(91,92,246,0.4)] flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Adding..." : "Add Client"}
            </button>
        </div>
      </div>
    </div>
  );
}
