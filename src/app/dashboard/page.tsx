"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MoreHorizontal, Download, ArrowUpRight, TrendingUp, Clock, FileText, Check, Copy } from "lucide-react";
import { AddClientModal } from "@/components/dashboard/add-client-modal";
import { ClientSettingsPanel } from "@/components/dashboard/client-settings-panel";
import { useAuth } from "@/context/AuthContext";
import { getClients, getUpdates } from "@/lib/firebase/firestore";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q')?.toLowerCase() || "";
  
  const { userData } = useAuth();
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeClient, setActiveClient] = useState<any>(null);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  
  const [clients, setClients] = useState<any[]>([
    { id: '1', name: 'Velvet Digital', status: 'Active', accessId: 'OS-A92', progress: 40, lastUpdateDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), lastUpdateText: 'Frontend completed and designs approved.' },
    { id: '2', name: 'Nova Agency', status: 'Active', accessId: 'OS-X4F', progress: 70, lastUpdateDate: new Date().toISOString(), lastUpdateText: 'Working on backend API integration.' },
    { id: '3', name: 'Echo Labs', status: 'Paused', accessId: 'OS-L9P', progress: 20, lastUpdateDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), lastUpdateText: 'Project kicked off, gathering requirements.' }
  ]);
  const [recentUpdates, setRecentUpdates] = useState<any[]>([]);

  const isNeedsUpdate = (dateString: string) => {
    if (!dateString) return true;
    const updateDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - updateDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 2;
  };

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return 'Never';
    const updateDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - updateDate.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  const displayClients = clients
    .filter(c => {
      if (searchQuery && !c.name.toLowerCase().includes(searchQuery)) return false;
      const needsUpdate = isNeedsUpdate(c.lastUpdateDate);
      if (filter === "Active" && c.status !== "Active") return false;
      if (filter === "Needs Update" && !needsUpdate) return false;
      return true;
    })
    .sort((a, b) => {
      const aNeeds = isNeedsUpdate(a.lastUpdateDate);
      const bNeeds = isNeedsUpdate(b.lastUpdateDate);
      if (aNeeds && !bNeeds) return -1;
      if (!aNeeds && bNeeds) return 1;
      
      const dateA = a.lastUpdateDate ? new Date(a.lastUpdateDate).getTime() : 0;
      const dateB = b.lastUpdateDate ? new Date(b.lastUpdateDate).getTime() : 0;
      return dateB - dateA;
    });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success("Access ID copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fetchData = useCallback(async () => {
    if (!userData?.agencyId) return;
    setIsLoading(true);
    try {
      // Simulate network delay for premium skeleton state
      await new Promise(resolve => setTimeout(resolve, 800));
      // const fetchedClients = await getClients(userData.agencyId);
      // setClients(fetchedClients); // Disabled temporarily to show dummy data

      const fetchedUpdates = await getUpdates(userData.agencyId);
      setRecentUpdates(fetchedUpdates.slice(0, 5));
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openSettings = (client: any) => {
    setActiveClient(client);
    setIsSettingsOpen(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">

      {/* Urgency Banner */}
      {!isLoading && clients.some(c => isNeedsUpdate(c.lastUpdateDate)) && (
        <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl p-4 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#EF4444]/20 flex items-center justify-center text-[#EF4444]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#EF4444]">
                {clients.filter(c => isNeedsUpdate(c.lastUpdateDate)).length} client{clients.filter(c => isNeedsUpdate(c.lastUpdateDate)).length > 1 ? 's are' : ' is'} waiting for an update
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              const first = clients.find(c => isNeedsUpdate(c.lastUpdateDate));
              if (first) router.push(`/dashboard/updates?client=${first.id}`);
            }}
            className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
          >
            Send Update
          </button>
        </div>
      )}
      
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-headline">Overview</h1>
          <p className="text-sm text-[#9CA3AF] mt-1">Manage your clients and send weekly updates.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsAddClientOpen(true)} className="px-5 py-2.5 bg-[#1A1A24] hover:bg-[#252533] border border-[#2D2D3D] text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            + Add Client
          </button>
          <button onClick={() => router.push('/dashboard/updates')} className="px-5 py-2.5 bg-[#5B5CF6] hover:bg-[#4F50DB] border border-[#5B5CF6] hover:border-[#4F50DB] text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(91,92,246,0.15)] hover:shadow-[0_0_25px_rgba(91,92,246,0.3)] flex items-center gap-2">
            Create Update
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#131317] border border-[#1F1F2B] rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-[#9CA3AF]">Active Clients</h3>
            <span className="p-1.5 bg-[#5B5CF6]/10 text-[#5B5CF6] rounded-md"><TrendingUp className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-bold text-white font-headline">{clients.length || 0}</p>
          <p className="text-xs text-[#10B981] mt-2 flex items-center gap-1">+2 this month</p>
        </div>
        <div className="bg-[#131317] border border-[#1F1F2B] rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-[#9CA3AF]">Needs Update</h3>
            <span className="p-1.5 bg-[#EF4444]/10 text-[#EF4444] rounded-md"><Clock className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-bold text-white font-headline">{clients.filter(c => isNeedsUpdate(c.lastUpdateDate)).length}</p>
          <p className="text-xs text-[#EF4444] mt-2 flex items-center gap-1">Clients waiting &gt;2 days</p>
        </div>
        <div className="bg-[#131317] border border-[#1F1F2B] rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-[#9CA3AF]">Pending Updates</h3>
            <span className="p-1.5 bg-[#F59E0B]/10 text-[#F59E0B] rounded-md"><TrendingUp className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-bold text-white font-headline">03</p>
          <p className="text-xs text-[#F59E0B] mt-2 flex items-center gap-1">Due today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Main Content: Client Portfolio */}
        <div className="space-y-6">
          <div className="bg-[#131317] border border-[#1F1F2B] rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#1F1F2B] flex items-center justify-between">
              <h2 className="text-lg font-bold text-white font-headline">Client Portfolio</h2>
              <select 
                value={filter} 
                onChange={e => setFilter(e.target.value)} 
                className="bg-[#1A1A24] border border-[#2D2D3D] text-[#E5E7EB] text-sm font-medium rounded-lg px-3 py-2 outline-none focus:border-[#5B5CF6]/50 focus:ring-1 focus:ring-[#5B5CF6]/50 cursor-pointer shadow-sm"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Needs Update">Needs Update</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0D0D13]">
                    <th className="py-3 px-5 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Client</th>
                    <th className="py-3 px-5 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Access ID</th>
                    <th className="py-3 px-5 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                    <th className="py-3 px-5 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Progress</th>
                    <th className="py-3 px-5 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden sm:table-cell">Update Status</th>
                    <th className="py-3 px-5 text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1F2B]">
                  {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse border-b border-[#1F1F2B]">
                        <td className="py-4 px-5"><div className="w-32 h-5 bg-[#2D2D3D] rounded"></div></td>
                        <td className="py-4 px-5"><div className="w-20 h-5 bg-[#2D2D3D] rounded"></div></td>
                        <td className="py-4 px-5"><div className="w-16 h-5 bg-[#2D2D3D] rounded"></div></td>
                        <td className="py-4 px-5"><div className="w-24 h-5 bg-[#2D2D3D] rounded"></div></td>
                        <td className="py-4 px-5 hidden sm:table-cell"><div className="w-40 h-5 bg-[#2D2D3D] rounded"></div></td>
                        <td className="py-4 px-5 text-right"><div className="w-20 h-8 bg-[#2D2D3D] rounded-md ml-auto"></div></td>
                      </tr>
                    ))
                  ) : displayClients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <h3 className="text-xl font-bold text-white mb-2 font-headline">
                            {clients.length === 0 ? "No clients yet" : "No clients found"}
                          </h3>
                          <p className="text-sm text-[#9CA3AF] mb-6">
                            {clients.length === 0 ? "Add your first client to start sending updates" : "Try adjusting your filters or search query."}
                          </p>
                          {clients.length === 0 && (
                            <button onClick={() => setIsAddClientOpen(true)} className="px-6 py-2.5 bg-[#5B5CF6] hover:bg-[#4F50DB] text-white text-sm font-bold rounded-lg transition-colors shadow-[0_4px_15px_rgba(91,92,246,0.2)]">
                              + Add Client
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : displayClients.map(client => (
                    <tr key={client.id} className="hover:bg-[#1A1A24] hover:shadow-[inset_2px_0_0_0_#5B5CF6] transition-all group cursor-pointer duration-200" onClick={() => router.push(`/dashboard/clients/${client.id}`)}>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#25252B] flex items-center justify-center text-[#9CA3AF] text-xs font-bold border border-[#2D2D3D] group-hover:bg-[#5B5CF6]/10 group-hover:text-[#5B5CF6] group-hover:border-[#5B5CF6]/30 transition-colors">
                            {client.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="font-medium text-white group-hover:translate-x-1 transition-transform">{client.name}</div>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        {client.accessId ? (
                          <div className="flex items-center gap-2 group/copy relative">
                            <code className="bg-[#1A1A24] px-2 py-1 rounded text-xs text-[#A4A6FF] font-mono tracking-wider border border-[#2D2D3D]">
                              {client.accessId}
                            </code>
                            <button 
                              onClick={(e) => { e.stopPropagation(); copyToClipboard(client.accessId); }}
                              className="text-[#6B7280] hover:text-[#5B5CF6] transition-colors p-1 rounded-md hover:bg-[#5B5CF6]/10"
                              title="Copy Access ID"
                            >
                              {copiedId === client.accessId ? (
                                <Check className="w-4 h-4 text-[#10B981]" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            {copiedId === client.accessId && (
                              <div className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 bg-[#5B5CF6] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-50">
                                Copied!
                                <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-2 border-transparent border-r-[#5B5CF6]"></div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-[#6B7280] italic">Not set</span>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                          client.status === 'Active' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' :
                          client.status === 'Paused' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' :
                          'bg-[#6B7280]/10 text-[#9CA3AF] border-[#6B7280]/20'
                        }`}>
                          {client.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-[#1F1F2B] rounded-full overflow-hidden">
                            <div className="h-full bg-[#5B5CF6] rounded-full" style={{ width: `${client.progress || 0}%` }}></div>
                          </div>
                          <span className="text-sm font-medium text-white w-8">{client.progress || 0}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 hidden sm:table-cell max-w-[200px]">
                        <div className="flex flex-col gap-1.5">
                          {client.lastUpdateText && (
                            <span className="text-xs text-[#E5E7EB] truncate" title={client.lastUpdateText}>
                              {client.lastUpdateText}
                            </span>
                          )}
                          <div className="flex items-center gap-2">
                            {isNeedsUpdate(client.lastUpdateDate) ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 w-fit rounded text-[10px] font-bold uppercase tracking-wider bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
                                <span className="w-1 h-1 rounded-full bg-[#EF4444]"></span> Needs Update
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 w-fit rounded text-[10px] font-bold uppercase tracking-wider bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                                <span className="w-1 h-1 rounded-full bg-[#10B981]"></span> Updated
                              </span>
                            )}
                            <span className="text-[11px] font-medium text-[#9CA3AF]">{getTimeAgo(client.lastUpdateDate)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/updates?client=${client.id}`);
                          }}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-[#1F1F2B] hover:bg-[#5B5CF6] border border-[#2D2D3D] hover:border-[#5B5CF6] rounded-md transition-all hover:shadow-[0_0_15px_rgba(91,92,246,0.3)]">
                          Create Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Modals */}
      <AddClientModal isOpen={isAddClientOpen} onClose={() => setIsAddClientOpen(false)} onClientAdded={fetchData} />
      <ClientSettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
