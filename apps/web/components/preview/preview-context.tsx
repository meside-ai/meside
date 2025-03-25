import { createContext, useContext } from "react";
import type { PreviewEntity } from "./types";

export type PreviewContextType = {
  preview: PreviewEntity | null;
  previews: PreviewEntity[];
  openPreview: (preview: Omit<PreviewEntity, "previewId">) => void;
  closePreview: (previewId: string) => void;
  movePreview: (previewId: string, index: number) => void;
  activePreviewId: string | null;
  setActivePreviewId: (previewId: string | null) => void;
};

export const PreviewContext = createContext<PreviewContextType | null>(null);

export const usePreviewContext = () => {
  const context = useContext(PreviewContext);
  if (!context) {
    throw new Error("usePreviewContext must be used within a PreviewContext");
  }
  return context;
};
