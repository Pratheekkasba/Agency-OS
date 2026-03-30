"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Copy, ArrowLeft, Edit2, FileText, CheckCircle2, Clock, ArrowRightCircle } from "lucide-react";
import { toast } from "sonner";

export default function ClientDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // Dummy Client Data for now until Firestore is hooked up
  const [client, setClient] = useState<any>({
    id: id || '1', 
    name: 'Velvet Digital', 
    status: 'Active', 
    accessId: 'OS-A92', 
    progress: 40, 
    projectDescription: 'Building a modern e-commerce platform with Next.js and Shopify to increase conversion rates.',
    updates: [
       { 
         id: 1, 
         date: new Date().toISOString(), 
         done: ['Frontend integration', 'Cart component'], 
         inProgress: ['Stripe checkout API verification'], 
         next: ['QA testing styling', 'Launch preparation'] 
       },
       { 
         id: 2, 
         date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), 
         done: ['Design system', 'Routing'], 
         inProgress: ['Frontend integration', 'Cart component'], 
         next: ['Stripe testing'] 
       }
    ]
  });

  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [tempProgress, setTempProgress] = useState(client.progress);

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState(client.projectDescription);

  const handleCopyId = () => {
    navigator.clipboard.writeText(client.accessId);
    toast.success("Access ID copied!");
  };

  const handleSaveProgress = () => {
    setClient({ ...client, progress: Number(tempProgress) });
    setIsEditingProgress(false);
    toast.success("Progress updated successfully!");
  };

  const handleSaveDescription = () => {
    setClient({ ...client, projectDescription: tempDescription });
    setIsEditingDescription(false);
    toast.success("Description updated successfully!");
  };
  
  const latestUpdate = client.updates && client.updates.length > 0 ? client.updates[0] : null;
  const history = client.updates && client.updates.length > 1 ? client.updates.slice(1) : [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
       {/* Breadcrumb / Return */}
       <button 
         onClick={() => router.push('/dashboard/clients')} 
         className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#E5E7EB] transition-colors text-sm font-medium px-1"
       >
         <ArrowLeft className="w-4 h-4" /> Back to Clients
       </button>

       {/* Module 1: Header */}
       <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1A1A24] to-[#252533] border border-[#2D2D3D] flex items-center justify-center shadow-inner">
               <span className="text-[#A4A6FF] font-black text-xl uppercase">{client.name.substring(0, 2)}</span>
            </div>
            <div>
               <div className="flex items-center gap-3">
                 <h1 className="text-3xl font-bold text-white font-headline tracking-tight">{client.name}</h1>
                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  client.status === 'Active' ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' : 'bg-[#6B7280]/10 text-[#6B7280] border border-[#6B7280]/20'
                }`}>
                  {client.status}
                </span>
               </div>
               <div className="flex items-center gap-3 mt-2">
                 <div className="px-3 py-1.5 rounded-lg bg-[#0D0D13] border border-[#1F1F2B] flex items-center gap-2 text-xs font-mono text-[#9CA3AF]">
                    <span className="text-[#6B7280]">Access ID:</span> {client.accessId}
                    <button 
                      onClick={handleCopyId} 
                      className="hover:text-white transition-colors ml-1 p-0.5"
                      title="Copy Access ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                 </div>
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-4 py-2.5 bg-[#1A1A24] hover:bg-[#252533] border border-[#2D2D3D] hover:border-[#4B5563] text-white text-sm font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
              <Edit2 className="w-4 h-4" /> Edit Client
            </button>
            <button 
              onClick={() => router.push(`/dashboard/updates?client=${client.id}`)}
              className="flex-1 md:flex-none px-5 py-2.5 bg-[#5B5CF6] hover:bg-[#4F50DB] border border-[#5B5CF6] hover:border-[#4F50DB] text-white text-sm font-bold rounded-xl transition-all shadow-[0_4px_15px_rgba(91,92,246,0.2)] hover:shadow-[0_4px_25px_rgba(91,92,246,0.4)] flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" /> Create Update
            </button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* LEFT COLUMN: Overview & Progress */}
         <div className="space-y-8 lg:col-span-1">
            
            {/* Module 2: Project Overview */}
            <div className="bg-[#131317] border border-[#1F1F2B] hover:border-[#2D2D3D] rounded-2xl p-6 shadow-sm transition-colors group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-2">
                   Project Overview
                </h3>
                {!isEditingDescription ? (
                  <button 
                    onClick={() => setIsEditingDescription(true)} 
                    className="text-[#6B7280] group-hover:text-[#A4A6FF] transition-colors p-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                ) : null}
              </div>
              
              {isEditingDescription ? (
                <div className="space-y-3 animate-fade-in">
                  <textarea 
                    value={tempDescription}
                    onChange={(e) => setTempDescription(e.target.value)}
                    className="w-full bg-[#0D0D13] border border-[#5B5CF6]/50 rounded-xl p-3 text-sm text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#5B5CF6]/50 min-h-[120px] resize-none"
                    placeholder="Describe the current project..."
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSaveDescription} 
                      className="flex-1 bg-[#5B5CF6]/10 hover:bg-[#5B5CF6]/20 text-[#A4A6FF] text-xs font-bold py-2 rounded-lg transition-colors border border-[#5B5CF6]/30"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => {
                        setTempDescription(client.projectDescription);
                        setIsEditingDescription(false);
                      }} 
                      className="flex-1 bg-[#1A1A24] hover:bg-[#252533] text-white text-xs font-bold py-2 rounded-lg transition-colors border border-[#2D2D3D]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[14px] text-[#D1D5DB] leading-relaxed whitespace-pre-wrap animate-fade-in">
                  {client.projectDescription || <span className="text-[#6B7280] italic">No description provided yet. Click the edit icon to add one.</span>}
                </p>
              )}
            </div>

            {/* Module 3: Progress Section */}
            <div className="bg-[#131317] border border-[#1F1F2B] hover:border-[#2D2D3D] rounded-2xl p-6 shadow-sm transition-colors group">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[13px] font-bold text-[#9CA3AF] uppercase tracking-wider">Project Progress</h3>
                {!isEditingProgress ? (
                  <button 
                    onClick={() => setIsEditingProgress(true)} 
                    className="text-[#6B7280] group-hover:text-[#A4A6FF] transition-colors p-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                ) : null}
              </div>
              
              {isEditingProgress ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={tempProgress}
                      onChange={(e) => setTempProgress(Number(e.target.value))}
                      className="w-full h-2 bg-[#1F1F2B] rounded-lg appearance-none cursor-pointer accent-[#5B5CF6]"
                    />
                    <span className="text-xl font-bold text-white w-12 text-right tracking-tighter">{tempProgress}%</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSaveProgress} 
                      className="flex-1 bg-[#5B5CF6]/10 hover:bg-[#5B5CF6]/20 text-[#A4A6FF] text-xs font-bold py-2 rounded-lg transition-colors border border-[#5B5CF6]/30"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => {
                        setTempProgress(client.progress);
                        setIsEditingProgress(false);
                      }} 
                      className="flex-1 bg-[#1A1A24] hover:bg-[#252533] text-white text-xs font-bold py-2 rounded-lg transition-colors border border-[#2D2D3D]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <div className="flex items-end gap-1 mb-4">
                     <span className="text-5xl font-black text-white tracking-tighter leading-none">{client.progress}</span>
                     <span className="text-xl font-bold text-[#6B7280] mb-0.5">%</span>
                  </div>
                  <div className="h-2.5 w-full bg-[#1F1F2B] rounded-full overflow-hidden shadow-inner">
                    <div 
                       className="h-full bg-gradient-to-r from-[#5B5CF6] to-[#8183FF] rounded-full transition-all duration-1000 ease-out" 
                       style={{ width: `${client.progress || 0}%` }} 
                    />
                  </div>
                </div>
              )}
            </div>
         </div>

         {/* RIGHT COLUMN: Updates & History */}
         <div className="space-y-8 lg:col-span-2">
            
            {/* Module 4: Latest Update */}
            <div className="bg-gradient-to-b from-[#131317] to-[#0D0D13] border border-[#1F1F2B] rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.15)] relative overflow-hidden group">
               {/* Ambient Glow */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#5B5CF6]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none transition-opacity duration-500 opacity-30 group-hover:opacity-100" />
               
               <div className="flex items-center justify-between mb-8 relative">
                 <h2 className="text-xl font-bold text-white font-headline tracking-tight flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#5B5CF6]/10 border border-[#5B5CF6]/20 flex items-center justify-center">
                       <span className="w-2.5 h-2.5 rounded-full bg-[#5B5CF6] shadow-[0_0_10px_rgba(91,92,246,0.8)] animate-pulse" />
                    </div>
                    Latest Update
                 </h2>
                 <span className="text-sm font-medium text-[#6B7280] bg-[#1A1A24] border border-[#2D2D3D] px-3 py-1 rounded-full">
                    {latestUpdate ? new Date(latestUpdate.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'}
                 </span>
               </div>

               {latestUpdate ? (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* Done */}
                    <div className="bg-[#0D0D13]/50 border border-[#1F1F2B] rounded-xl p-5">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-[#10B981] uppercase tracking-wider mb-4 border-b border-[#1F1F2B] pb-3">
                        <CheckCircle2 className="w-4 h-4" /> Completed
                      </h4>
                      {latestUpdate.done?.length > 0 ? (
                        <ul className="space-y-3">
                           {latestUpdate.done.map((item: string, i: number) => (
                             <li key={i} className="text-sm text-[#D1D5DB] flex items-start gap-2.5 leading-snug">
                                <span className="text-[#10B981] mt-0.5 opacity-80">•</span> {item}
                             </li>
                           ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-[#6B7280] italic">Nothing marked completed.</p>
                      )}
                    </div>

                    {/* In Progress */}
                    <div className="bg-[#0D0D13]/50 border border-[#1F1F2B] rounded-xl p-5">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-[#F59E0B] uppercase tracking-wider mb-4 border-b border-[#1F1F2B] pb-3">
                        <Clock className="w-4 h-4" /> In Progress
                      </h4>
                      {latestUpdate.inProgress?.length > 0 ? (
                        <ul className="space-y-3">
                           {latestUpdate.inProgress.map((item: string, i: number) => (
                             <li key={i} className="text-sm text-[#D1D5DB] flex items-start gap-2.5 leading-snug">
                                <span className="text-[#F59E0B] mt-0.5 opacity-80">•</span> {item}
                             </li>
                           ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-[#6B7280] italic">Nothing currently in progress.</p>
                      )}
                    </div>

                    {/* Next */}
                    <div className="bg-[#0D0D13]/50 border border-[#1F1F2B] rounded-xl p-5">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-[#A4A6FF] uppercase tracking-wider mb-4 border-b border-[#1F1F2B] pb-3">
                        <ArrowRightCircle className="w-4 h-4" /> Up Next
                      </h4>
                      {latestUpdate.next?.length > 0 ? (
                        <ul className="space-y-3">
                           {latestUpdate.next.map((item: string, i: number) => (
                             <li key={i} className="text-sm text-[#D1D5DB] flex items-start gap-2.5 leading-snug">
                                <span className="text-[#A4A6FF] mt-0.5 opacity-80">•</span> {item}
                             </li>
                           ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-[#6B7280] italic">Nothing planned next.</p>
                      )}
                    </div>
                 </div>
               ) : (
                 <div className="text-center py-12 bg-[#0D0D13] rounded-xl border border-[#1F1F2B] border-dashed">
                   <p className="text-[#6B7280] mb-4">No updates have been created for this client yet.</p>
                   <button 
                     onClick={() => router.push(`/dashboard/updates?client=${client.id}`)}
                     className="px-4 py-2 bg-[#5B5CF6]/10 hover:bg-[#5B5CF6] text-[#A4A6FF] hover:text-white border border-[#5B5CF6]/30 hover:border-[#5B5CF6] text-sm font-bold rounded-lg transition-all"
                   >
                     Create First Update
                   </button>
                 </div>
               )}
            </div>

            {/* Module 5: Update History */}
            {history.length > 0 && (
              <div className="bg-[#131317] border border-[#1F1F2B] rounded-2xl p-6 sm:p-8 shadow-sm">
                 <h3 className="text-[13px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-8 flex items-center gap-2">
                   <Clock className="w-4 h-4" /> Update History
                 </h3>
                 
                 <div className="relative border-l-2 border-[#1F1F2B] ml-[9px] space-y-8 pb-4">
                    {history.map((update: any) => (
                      <div key={update.id} className="relative pl-8 group">
                        {/* Timeline Marker */}
                        <div className="absolute w-5 h-5 bg-[#131317] border-2 border-[#2D2D3D] group-hover:border-[#5B5CF6] rounded-full -left-[11px] top-1 transition-colors z-10" />
                        
                        <div className="bg-[#0D0D13] p-5 rounded-xl border border-[#1F1F2B] shadow-sm hover:border-[#5B5CF6]/30 hover:shadow-[0_4px_20px_rgba(91,92,246,0.05)] transition-all cursor-pointer">
                          <div className="flex items-center justify-between mb-3 border-b border-[#1F1F2B] pb-3">
                            <span className="font-bold text-[#E5E7EB] text-sm group-hover:text-[#A4A6FF] transition-colors flex items-center gap-2">
                               <FileText className="w-3.5 h-3.5" /> Weekly Update #{update.id}
                            </span>
                            <span className="text-xs font-medium text-[#6B7280] bg-[#1A1A24] px-2 py-1 rounded-md">
                               {new Date(update.date).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                             {update.done && update.done.length > 0 && (
                               <p className="text-sm text-[#9CA3AF] line-clamp-1 leading-relaxed">
                                 <span className="font-bold text-[#10B981] mr-1">✅</span> {update.done.join(', ')}
                               </p>
                             )}
                             {update.inProgress && update.inProgress.length > 0 && (
                               <p className="text-sm text-[#9CA3AF] line-clamp-1 leading-relaxed">
                                 <span className="font-bold text-[#F59E0B] mr-1">⏳</span> {update.inProgress.join(', ')}
                               </p>
                             )}
                          </div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
            
         </div>
       </div>
    </div>
  );
}
