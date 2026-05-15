"use client";

import { useWhiteboardSave } from "@/hooks/use-whiteboard-save";
import { ExcalidrawWrapper } from "@/components/dashboard/excalidraw-wrapper";
import { WhiteboardTopbar } from "@/components/dashboard/whiteboard-topbar";

export default function GlobalWhiteboardPage() {
  const { 
    status, 
    initialData, 
    boardName, 
    isInitializing, 
    saveWhiteboard 
  } = useWhiteboardSave("global_whiteboard", "global", null, "My Global Board");

  if (isInitializing) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#0B0B0F]">
        <div className="w-8 h-8 border-2 border-[#5B5CF6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col bg-[#0B0B0F] overflow-hidden z-10">
      {/* Top Navigation specific to the whiteboard */}
      <WhiteboardTopbar 
        boardName={boardName}
        status={status}
        type="Global"
        onNameChange={(newName) => {
           // We pass the elements/appState silently to update the name immediately in the db/payload
           // Excalidraw's onChange will handle the actual elements.
           // However, to just update the name, we can utilize our save function.
           saveWhiteboard(initialData?.elements || [], initialData?.appState, initialData?.files, newName);
        }}
      />
      
      {/* Excalidraw Container */}
      <div className="flex-1 relative min-h-0">
        <ExcalidrawWrapper 
          initialData={initialData}
          onChange={(elements: any, appState: any, files: any) => {
            saveWhiteboard(elements, appState, files);
          }}
        />
      </div>
    </div>
  );
}
