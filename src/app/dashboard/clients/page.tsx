"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Clock, ExternalLink, MoreVertical, LayoutGrid, CheckCircle2, Eye, FileText, Copy } from "lucide-react";
import { AddClientModal } from "@/components/dashboard/add-client-modal";
import { useAuth } from "@/context/AuthContext";
import { getClients } from "@/lib/firebase/firestore";
import { toast } from "sonner";

const isNeedsUpdate = (dateString: string) => {
  if (!dateString) return true;
  const updateDate = new Date(dateString);
  const diffDays = Math.ceil(Math.abs(new Date().getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays > 2;
};

const getTimeAgo = (dateString: string) => {
  if (!dateString) return 'Never';
  const diffHours = Math.floor(Math.abs(new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
};

function ClientCard({ client }: { client: any }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const needsUpdate = isNeedsUpdate(client.lastUpdateDate) && client.status !== 'Paused';

  useEffect(() => {
    if (!isMenuOpen) return;
    const close = () => setIsMenuOpen(false);
    const timeout = setTimeout(() => document.addEventListener('click', close), 0);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener('click', close);
    };
  }, [isMenuOpen]);

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(client.accessId || "");
    toast.success("Access ID copied!");
    setIsMenuOpen(false);
  };

  return (
    <div 
      onClick={() => router.push(`/dashboard/clients/${client.id}`)}
      className="bg-[#131317] border border-[#1F1F2B] hover:border-[#5B5CF6]/40 hover:shadow-[0_0_30px_rgba(91,92,246,0.15)] rounded-2xl p-6 transition-all duration-300 group flex flex-col h-full cursor-pointer hover:scale-[1.02] relative"
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1A1A24] to-[#252533] border border-[#2D2D3D] flex items-center justify-center shadow-inner group-hover:border-[#5B5CF6]/30 transition-colors">
            <span className="text-[#A4A6FF] font-bold text-sm uppercase">{client.name.substring(0, 2)}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[17px] font-bold text-white tracking-tight">{client.name}</h3>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                client.status === 'Active' ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' : 'bg-[#6B7280]/10 text-[#6B7280] border border-[#6B7280]/20'
              }`}>
                {client.status}
              </span>
            </div>
            <p className="text-[11px] font-medium text-[#6B7280] font-mono mt-0.5 tracking-wider">{client.accessId || "NO-ID"}</p>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
            className="text-[#6B7280] hover:text-white p-1 rounded-md transition-colors hover:bg-[#1A1A24]"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {isMenuOpen && (
            <div 
              className="absolute right-0 top-full mt-1 w-44 bg-[#1A1A24] border border-[#2D2D3D] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden z-20 py-1" 
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => { setIsMenuOpen(false); router.push(`/dashboard/clients/${client.id}`); }} 
                className="w-full text-left px-4 py-2.5 text-sm text-[#E5E7EB] hover:bg-[#252533] hover:text-white transition-colors flex items-center gap-2.5"
              >
                 <Eye className="w-4 h-4 text-[#A4A6FF]" /> View Details
              </button>
              <button 
                onClick={() => { setIsMenuOpen(false); router.push(`/dashboard/updates?client=${client.id}`); }} 
                className="w-full text-left px-4 py-2.5 text-sm text-[#E5E7EB] hover:bg-[#252533] hover:text-white transition-colors flex items-center gap-2.5"
              >
                 <FileText className="w-4 h-4 text-[#A4A6FF]" /> Create Update
              </button>
              <div className="h-px w-full bg-[#2D2D3D] my-1"></div>
              <button 
                onClick={handleCopyId} 
                className="w-full text-left px-4 py-2.5 text-sm text-[#E5E7EB] hover:bg-[#252533] hover:text-white transition-colors flex items-center gap-2.5"
              >
                 <Copy className="w-4 h-4 text-[#A4A6FF]" /> Copy Access ID
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Card Body - Content */}
      <div className="flex-1">
        {/* Progress */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Progress</span>
            <span className="text-xs font-bold text-white bg-[#1A1A24] px-1.5 py-0.5 rounded border border-[#2D2D3D]">{client.progress || 0}%</span>
          </div>
          <div className="h-1.5 w-full bg-[#1F1F2B] rounded-full overflow-hidden">
            <div className="h-full bg-[#5B5CF6] rounded-full" style={{ width: `${client.progress || 0}%` }} />
          </div>
        </div>

        {/* Update Preview & Status */}
        <div className="p-3.5 rounded-xl bg-[#0D0D13] border border-[#1F1F2B] group-hover:bg-[#131317] transition-colors h-[84px] overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Latest Update</span>
            <span className="text-[10px] font-medium text-[#4B5563]">{getTimeAgo(client.lastUpdateDate)}</span>
          </div>
          {client.lastUpdateText ? (
            <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed">
              "{client.lastUpdateText}"
            </p>
          ) : (
            <p className="text-xs text-[#6B7280] italic">No updates available.</p>
          )}
        </div>

        {/* Smart Insights */}
        <div className="mt-4 flex flex-col gap-1.5 px-1 min-h-[36px]">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${needsUpdate ? 'bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.6)]'}`} />
            <span className="text-[11.5px] font-medium text-[#9CA3AF]">
              Last updated <span className="text-[#E5E7EB]">{getTimeAgo(client.lastUpdateDate)}</span>
            </span>
          </div>
          {needsUpdate && (
            <p className="text-[11px] font-medium text-[#EF4444]/90 ml-4 flex items-center gap-1.5">
              Client may follow up soon
            </p>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center gap-3 mt-5 pt-5 border-t border-[#1F1F2B]">
        <button 
          onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/clients/${client.id}`); }}
          className="flex-1 bg-[#1A1A24] hover:bg-[#252533] border border-[#2D2D3D] hover:border-[#4B5563] text-white text-xs font-bold rounded-lg py-2.5 transition-all flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Details
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/updates?client=${client.id}`); }}
          className="flex-1 bg-[#5B5CF6]/10 hover:bg-[#5B5CF6] border border-[#5B5CF6]/30 hover:border-[#5B5CF6] text-[#A4A6FF] hover:text-white text-xs font-bold rounded-lg py-2.5 transition-all flex items-center justify-center gap-2 hover:shadow-[0_4px_15px_rgba(91,92,246,0.3)]"
        >
          Create Update
        </button>
      </div>
    </div>
  );
}


export default function ClientsPage() {
  const router = useRouter();
  const { userData } = useAuth();
  
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const [clients, setClients] = useState<any[]>([
    { id: '1', name: 'Velvet Digital', status: 'Active', accessId: 'OS-A92', progress: 40, lastUpdateDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), lastUpdateText: 'Frontend completed and designs approved.' },
    { id: '2', name: 'Nova Agency', status: 'Active', accessId: 'OS-X4F', progress: 70, lastUpdateDate: new Date().toISOString(), lastUpdateText: 'Working on backend API integration.' },
    { id: '3', name: 'Echo Labs', status: 'Paused', accessId: 'OS-L9P', progress: 20, lastUpdateDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), lastUpdateText: 'Project kicked off, gathering requirements.' },
    { id: '4', name: 'Stark Industries', status: 'Active', accessId: 'OS-S99', progress: 95, lastUpdateDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), lastUpdateText: 'Final QA and testing.' }
  ]);

  const fetchData = useCallback(async () => {
    if (!userData?.agencyId) return;
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600)); // Premium skeleton feel
      // const fetchedClients = await getClients(userData.agencyId);
      // setClients(fetchedClients); // Disabled temporarily to show dummy data
    } catch (err) {
      console.error("Error fetching clients:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const displayClients = clients
    .filter(c => {
      if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      const needsUpdate = c.status !== 'Paused' && isNeedsUpdate(c.lastUpdateDate);
      if (filter === "Active" && c.status !== "Active") return false;
      if (filter === "Needs Update" && !needsUpdate) return false;
      return true;
    })
    .sort((a, b) => {
      return new Date(a.lastUpdateDate || 0).getTime() - new Date(b.lastUpdateDate || 0).getTime();
    });

  const needsAttentionClients = displayClients.filter(c => c.status !== 'Paused' && isNeedsUpdate(c.lastUpdateDate));
  const activeClients = displayClients.filter(c => c.status === 'Active' && !isNeedsUpdate(c.lastUpdateDate));
  const pausedClients = displayClients.filter(c => c.status === 'Paused');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-headline tracking-tight">Clients</h1>
          <p className="text-[#9CA3AF] mt-1.5 text-[15px]">Manage all your clients from a bird's-eye view.</p>
        </div>
        <button 
          onClick={() => setIsAddClientOpen(true)}
          className="px-5 py-2.5 bg-[#5B5CF6] hover:bg-[#4F50DB] border border-[#5B5CF6] hover:border-[#4F50DB] text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(91,92,246,0.15)] hover:shadow-[0_0_25px_rgba(91,92,246,0.3)] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#131317] border border-[#1F1F2B] p-4 rounded-2xl shadow-sm">
        <div className="relative w-full sm:w-96 group">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-[#5B5CF6] transition-colors" />
          <input 
            type="text" 
            placeholder="Search by client name..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#0D0D13] border border-[#2D2D3D] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-[#5B5CF6]/50 focus:ring-1 focus:ring-[#5B5CF6]/50 transition-all shadow-inner"
          />
        </div>
        <div className="w-full sm:w-auto flex items-center gap-3">
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)} 
            className="w-full sm:w-auto bg-[#0D0D13] border border-[#2D2D3D] text-[#E5E7EB] text-sm font-medium rounded-xl px-4 py-2.5 outline-none focus:border-[#5B5CF6]/50 focus:ring-1 focus:ring-[#5B5CF6]/50 cursor-pointer shadow-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Needs Update">Needs Update</option>
          </select>
          <div className="w-10 h-10 rounded-xl bg-[#1A1A24] border border-[#2D2D3D] flex items-center justify-center shrink-0">
            <LayoutGrid className="w-4 h-4 text-[#A4A6FF]" />
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-[#131317] border border-[#1F1F2B] rounded-2xl p-6 h-[260px] animate-pulse flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2D2D3D]" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-[#2D2D3D] rounded" />
                    <div className="h-3 w-16 bg-[#2D2D3D] rounded" />
                  </div>
                </div>
                <div className="w-16 h-5 rounded-full bg-[#2D2D3D]" />
              </div>
              <div className="space-y-2 mt-4">
                <div className="h-2 w-full bg-[#2D2D3D] rounded-full" />
                <div className="h-2 w-2/3 bg-[#2D2D3D] rounded-full" />
              </div>
              <div className="mt-auto flex gap-3">
                <div className="flex-1 h-10 bg-[#2D2D3D] rounded-xl" />
                <div className="flex-1 h-10 bg-[#2D2D3D] rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : displayClients.length === 0 ? (
        <div className="bg-[#131317] border border-[#1F1F2B] rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-[#1A1A24] border border-[#2D2D3D] rounded-2xl flex items-center justify-center mb-6">
            <LayoutGrid className="w-8 h-8 text-[#6B7280]" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 font-headline">
            {clients.length === 0 ? "No clients yet" : "No clients found"}
          </h3>
          <p className="text-[15px] text-[#9CA3AF] mb-8 max-w-sm">
            {clients.length === 0 ? "Add your first client to start managing projects and sending updates." : "Try adjusting your search query or removing filters."}
          </p>
          {clients.length === 0 && (
            <button 
              onClick={() => setIsAddClientOpen(true)}
              className="px-6 py-3 bg-[#5B5CF6] hover:bg-[#4F50DB] text-white text-[15px] font-bold rounded-xl transition-all shadow-[0_4px_15px_rgba(91,92,246,0.2)] hover:shadow-[0_4px_25px_rgba(91,92,246,0.4)] flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add your first client
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-12">
          {needsAttentionClients.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>
                </div>
                <h2 className="text-lg font-bold text-white tracking-wide font-headline">Needs Attention</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {needsAttentionClients.map(client => <ClientCard key={client.id} client={client} />)}
              </div>
            </div>
          )}

          {activeClients.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                </div>
                <h2 className="text-lg font-bold text-white tracking-wide font-headline">Active Clients</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {activeClients.map(client => <ClientCard key={client.id} client={client} />)}
              </div>
            </div>
          )}

          {pausedClients.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#6B7280]/10 border border-[#6B7280]/20 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#6B7280]"></span>
                </div>
                <h2 className="text-lg font-bold text-white tracking-wide font-headline">Paused Clients</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {pausedClients.map(client => <ClientCard key={client.id} client={client} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AddClientModal isOpen={isAddClientOpen} onClose={() => setIsAddClientOpen(false)} onClientAdded={fetchData} />
    </div>
  );
}
