"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import "@excalidraw/excalidraw/index.css";

// Loading skeleton/spinner for Excalidraw
const ExcalidrawLoader = () => (
  <div className="flex-1 flex flex-col items-center justify-center bg-[#0B0B0F] w-full h-full text-zinc-400">
    <div className="w-8 h-8 border-2 border-[#5B5CF6] border-t-transparent rounded-full animate-spin mb-4" />
    <p className="text-sm">Loading Whiteboard...</p>
  </div>
);

// Dynamically import Excalidraw to bypass SSR and hydration issues.
// We disable SSR since it requires `window` and Canvas APIs.
const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw),
  {
    ssr: false,
    loading: () => <ExcalidrawLoader />,
  }
);

interface ExcalidrawWrapperProps {
  initialData?: {
    elements?: readonly any[];
    appState?: any;
    files?: any;
  } | null;
  [key: string]: any;
}

export function ExcalidrawWrapper({ initialData, ...props }: ExcalidrawWrapperProps) {
  // Use a ref to strictly prevent re-initialization of Excalidraw,
  // which causes canvas resets. The initialData must only be passed once.
  const [dataToLoad, setDataToLoad] = useState<any>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (initialData && !isInitialized.current) {
      // Safely extract only serializable layout state to prevent 
      // Excalidraw from crashing on lost Map objects (like collaborators)
      const safeAppState = initialData.appState ? {
        viewBackgroundColor: initialData.appState.viewBackgroundColor,
        scrollX: initialData.appState.scrollX,
        scrollY: initialData.appState.scrollY,
        zoom: initialData.appState.zoom,
      } : undefined;

      setDataToLoad({
        elements: initialData.elements || [],
        appState: safeAppState,
        files: initialData.files || {},
      });
      isInitialized.current = true;
    }
  }, [initialData]);

  // If we haven't resolved our initial data yet (e.g. from local storage), keep loading
  if (!isInitialized.current) {
    return <ExcalidrawLoader />;
  }

  return (
    <div className="w-full h-full flex-1 relative">
      <Excalidraw
        theme="dark"
        initialData={dataToLoad}
        {...props}
      />
    </div>
  );
}
