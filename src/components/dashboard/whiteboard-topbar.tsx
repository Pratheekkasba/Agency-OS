import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { SaveStatus } from "@/hooks/use-whiteboard-save";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface WhiteboardTopbarProps {
  boardName: string;
  status: SaveStatus;
  type: "Global" | "Internal" | "Client";
  onNameChange: (newName: string) => void;
  readOnly?: boolean;
}

export function WhiteboardTopbar({ boardName, status, type, onNameChange, readOnly = false }: WhiteboardTopbarProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(boardName);

  // Sync prop changes if changed externally
  useEffect(() => {
    setEditingName(boardName);
  }, [boardName]);

  const handleNameSubmit = () => {
    setIsEditing(false);
    if (editingName.trim() && editingName !== boardName) {
      onNameChange(editingName.trim());
    } else {
      setEditingName(boardName); // Revert
    }
  };

  return (
    <div className="flex-shrink-0 h-14 border-b border-white/10 bg-[#0B0B0F]/95 backdrop-blur flex items-center justify-between px-4">
      {/* Left items */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-l border-white/10 pl-4">
          <div className="flex flex-col">
            {isEditing && !readOnly ? (
              <input
                autoFocus
                className="bg-zinc-800 text-sm font-semibold text-white px-2 py-0.5 rounded outline-none border border-[#5B5CF6]/50 focus:border-[#5B5CF6]"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleNameSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNameSubmit();
                  if (e.key === "Escape") {
                    setIsEditing(false);
                    setEditingName(boardName);
                  }
                }}
              />
            ) : (
              <h2
                className={`text-sm font-semibold text-white truncate max-w-[200px] ${
                  !readOnly ? "cursor-text hover:text-zinc-200" : ""
                }`}
                onClick={() => !readOnly && setIsEditing(true)}
              >
                {boardName}
              </h2>
            )}
            <span className="text-xs text-zinc-500 font-medium">
              {type} Board
            </span>
          </div>
        </div>
      </div>

      {/* Right items - Save Status */}
      <div className="flex items-center gap-2">
        {status === "saving" && (
          <div className="flex items-center gap-2 text-zinc-400 bg-white/5 px-3 py-1.5 rounded-full text-xs font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Saving...
          </div>
        )}
        {status === "saved" && (
          <div className="flex items-center gap-2 text-[#22C55E] bg-[#22C55E]/10 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            All changes saved
          </div>
        )}
        {status === "idle" && !readOnly && (
           <div className="flex items-center gap-2 text-zinc-500 px-3 py-1.5 text-xs font-medium">
             Up to date
           </div>
        )}
        {readOnly && (
           <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full text-xs font-medium">
             View Only
           </div>
        )}
      </div>
    </div>
  );
}
