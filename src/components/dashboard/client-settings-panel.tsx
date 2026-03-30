"use client";

import { useState } from "react";
import { X, Copy, Mail, ExternalLink, Settings2, Trash2, Power, ChevronRight } from "lucide-react";

export function ClientSettingsPanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [autoSend, setAutoSend] = useState(false);
  
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" 
        onClick={onClose}
      />
      <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0e0e12] border-l border-[#25252b] shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out font-body flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 bg-[#0e0e12]/90 backdrop-blur-xl border-b border-[#25252b] px-6 py-5 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white font-headline tracking-tight">Client Settings</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#19191e] border border-[#25252b] flex items-center justify-center text-[#acaab0] hover:text-white hover:border-[#48474c] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-6 space-y-8 flex-1">
          
          {/* Identity Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#a4a6ff] to-[#5f60fa] flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-[#1200a3] font-headline">VD</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white leading-tight">Velvet Digital</h3>
                <p className="text-[#acaab0] text-sm font-medium mt-0.5">Brand Identity & Web</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                  <span className="text-[10px] uppercase tracking-wider text-[#10b981] font-bold">Active</span>
                </div>
              </div>
            </div>
          </section>

          {/* Portal Access */}
          <section className="bg-[#131317] border border-[#1f1f25] rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-[#fcf8fe]">
              <ExternalLink className="w-4 h-4 text-[#a4a6ff]" />
              <h4 className="font-semibold text-sm">Portal Link</h4>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                value="agencyos.com/portal/vd-x7y9" 
                readOnly
                className="flex-1 bg-[#0e0e12] border border-[#25252b] rounded-lg px-3 py-2 text-sm text-[#acaab0] focus:outline-none"
              />
              <button className="px-3 py-2 bg-[#19191e] border border-[#25252b] rounded-lg text-[#fcf8fe] hover:bg-[#25252b] hover:border-[#48474c] transition-colors shadow-sm flex items-center justify-center">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-[#76757a] leading-relaxed">
              This is a magic link. Anyone with this link can view the read-only portal.
            </p>
          </section>

          {/* Preferences */}
          <section className="bg-[#131317] border border-[#1f1f25] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm text-[#fcf8fe]">Auto-send weekly updates</h4>
                <p className="text-[11px] text-[#76757a] mt-1 pr-4">Automatically draft and send a summary of completed tasks every Friday at 5 PM.</p>
              </div>
              <button 
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent focus:outline-none transition-colors duration-200 ${autoSend ? 'bg-[#5f60fa]' : 'bg-[#25252b]'}`}
                onClick={() => setAutoSend(!autoSend)}
              >
                <span className="sr-only">Use setting</span>
                <span aria-hidden="true" className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${autoSend ? 'translate-x-4' : 'translate-x-0'}`}></span>
              </button>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="space-y-3">
            <h4 className="text-xs font-semibold text-[#76757a] uppercase tracking-wider ml-1">Actions</h4>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-[#131317] border border-transparent hover:border-[#25252b] hover:bg-[#19191e] transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#a4a6ff]/10 flex items-center justify-center text-[#a4a6ff]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-[#fcf8fe]">Resend Welcome Email</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#48474c] group-hover:text-[#acaab0] transition-colors" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-[#131317] border border-transparent hover:border-[#25252b] hover:bg-[#19191e] transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ec7ec0]/10 flex items-center justify-center text-[#ec7ec0]">
                    <Settings2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-[#fcf8fe]">Edit Project Scope</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#48474c] group-hover:text-[#acaab0] transition-colors" />
              </button>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="space-y-3 pt-6 border-t border-[#1f1f25]">
            <h4 className="text-xs font-semibold text-[#ff6e84] uppercase tracking-wider ml-1">Danger Zone</h4>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#ff6e84]/10 transition-colors text-left group border border-transparent hover:border-[#ff6e84]/20">
                <Power className="w-5 h-5 text-[#ff6e84] group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-sm font-medium text-[#ff6e84]">Pause Project</div>
                  <div className="text-[11px] text-[#76757a] mt-0.5">Temporarily hide portal from client</div>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#ff6e84]/10 transition-colors text-left group border border-transparent hover:border-[#ff6e84]/20">
                <Trash2 className="w-5 h-5 text-[#ff6e84] group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-sm font-medium text-[#ff6e84]">Delete Client</div>
                  <div className="text-[11px] text-[#76757a] mt-0.5">Permanently remove all data</div>
                </div>
              </button>
            </div>
          </section>
          
        </div>
      </aside>
    </>
  );
}
