import { useState, useEffect, useCallback, useRef } from "react";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export interface WhiteboardData {
  name: string;
  elements: readonly any[];
  appState: any;
  files: any;
  version: number;
}

// Helper to sanitize layout-only state so we don't save garbage to Firestore
const extractLayoutState = (fullAppState: any) => {
  if (!fullAppState) return undefined;
  return {
    scrollX: fullAppState.scrollX || 0,
    scrollY: fullAppState.scrollY || 0,
    zoom: fullAppState.zoom || { value: 1 },
    viewBackgroundColor: fullAppState.viewBackgroundColor || "#0B0B0F",
  };
};

export function useWhiteboardSave(
  boardId: string, 
  boardType: "global" | "internal" | "client",
  clientId: string | null = null,
  defaultName: string = "Untitled Board"
) {
  const { userData, user } = useAuth();
  
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [initialData, setInitialData] = useState<WhiteboardData | null>(null);
  const [boardName, setBoardName] = useState(defaultName);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const latestDataRef = useRef<WhiteboardData | null>(null);
  
  // Real-time synchronization
  useEffect(() => {
    if (!userData || !boardId) return;

    const orgId = userData?.organization_id;
    if (!orgId) return; // Wait for org ID to load
    
    // We compose a unique firestore ID using orgId and boardId to strictly isolate
    const firestoreDocId = `${orgId}_${boardId}`;
    
    const docRef = doc(db, "whiteboards", firestoreDocId);

    setIsInitializing(true);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const payload = docSnap.data();
        
        // Ensure remote data format matches WhiteboardData
        const remoteData: WhiteboardData = {
          name: payload.name || defaultName,
          elements: payload.data?.elements || [],
          appState: payload.data?.appState || undefined,
          files: payload.data?.files || {},
          version: payload.data?.version || 1,
        };
        
        // If we haven't loaded initial data yet
        if (isInitializing) {
          setInitialData(remoteData);
          setBoardName(remoteData.name);
          setIsInitializing(false);
        } else {
          // TODO: Implement advanced conflict resolution for simultaneous real-time cursors
          // For now, onSnapshot will fire, but we don't blindly clobber the user's active canvas.
        }
      } else {
        // Document does not exist yet. Initialize it locally.
        setInitialData({
          name: defaultName,
          elements: [],
          appState: undefined,
          files: {},
          version: 1,
        });
        setIsInitializing(false);
      }
    }, (error) => {
      console.error("Whiteboard sync error:", error);
      setStatus("error");
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, [userData, boardId, defaultName]); // We explicitly don't put isInitializing here to prevent loops.

  const forceSaveNow = useCallback(async () => {
    if (!latestDataRef.current || !userData) return;
    
    try {
      const orgId = userData?.organization_id;
      if (!orgId) throw new Error("Organization ID is missing. Cannot save whiteboard.");
      
      const firestoreDocId = `${orgId}_${boardId}`;
      const docRef = doc(db, "whiteboards", firestoreDocId);

      setStatus("saving");
      
      await setDoc(docRef, {
        id: firestoreDocId,
        name: latestDataRef.current.name,
        type: boardType,
        organization_id: orgId,
        client_id: clientId,
        data: {
          elements: latestDataRef.current.elements,
          appState: extractLayoutState(latestDataRef.current.appState),
          files: latestDataRef.current.files,
          version: 1,
        },
        updated_at: serverTimestamp(),
        created_by: user?.uid || "unknown",
      }, { merge: true });

      setStatus("saved");
      
      // Auto-hide the saved status after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error("Failed to save whiteboard to Firestore:", err);
      setStatus("error");
    }
  }, [boardId, boardType, clientId, userData, user?.uid]);

  // Handle unload scenario
  useEffect(() => {
    const handleBeforeUnload = () => {
      forceSaveNow();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [forceSaveNow]);

  const saveWhiteboard = useCallback((elements: readonly any[], appState: any, files: any, newName?: string) => {
    // Merge latest data and name
    const dataToSave: WhiteboardData = {
      name: newName !== undefined ? newName : boardName,
      elements,
      appState,
      files,
      version: 1,
    };
    
    latestDataRef.current = dataToSave;
    
    if (newName !== undefined) {
      setBoardName(newName);
    }

    setStatus("saving");

    // Debounce for 2 seconds
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      forceSaveNow();
    }, 2000);

  }, [boardName, forceSaveNow]);

  return {
    status,
    initialData,
    boardName,
    isInitializing,
    saveWhiteboard,
    forceSaveNow,
  };
}
