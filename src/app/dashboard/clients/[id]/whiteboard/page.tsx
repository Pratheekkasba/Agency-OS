"use client";

import { useWhiteboardSave } from "@/hooks/use-whiteboard-save";
import { ExcalidrawWrapper } from "@/components/dashboard/excalidraw-wrapper";
import { WhiteboardTopbar } from "@/components/dashboard/whiteboard-topbar";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function ClientWhiteboardPage() {
  const params = useParams();
  const clientId = params.id as string;
  const { userData } = useAuth();
  const [readOnly, setReadOnly] = useState<boolean | null>(null);

  const { 
    status, 
    initialData, 
    boardName, 
    isInitializing, 
    saveWhiteboard 
  } = useWhiteboardSave(`client_whiteboard_${clientId}`, "client", clientId, "Client Project Board");

  // Determine read-only mode based on user permission safely
  useEffect(() => {
    if (userData) {
       // Only team and admin can edit client boards
       setReadOnly(userData.role === "client");
    }
  }, [userData]);

  if (isInitializing || readOnly === null) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#0B0B0F]">
        <div className="w-8 h-8 border-2 border-[#5B5CF6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col bg-[#0B0B0F] overflow-hidden z-10">
      <WhiteboardTopbar 
        boardName={boardName}
        status={status}
        type="Client"
        readOnly={readOnly}
        onNameChange={(newName) => {
           if (readOnly) return;
           saveWhiteboard(initialData?.elements || [], initialData?.appState, initialData?.files, newName);
        }}
      />
      
      <div className="flex-1 relative min-h-0">
        <ExcalidrawWrapper 
          initialData={initialData}
          viewModeEnabled={readOnly} // Directly turns Excalidraw interaction off
          onChange={(elements: any, appState: any, files: any) => {
            if (readOnly) return; // Prevent saving if readonly
            saveWhiteboard(elements, appState, files);
          }}
        />
      </div>
    </div>
  );
}
