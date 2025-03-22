import { produce } from "immer";
import { useCallback, useMemo, useState } from "react";
import { PreviewContext } from "./preview-context";
import type { PreviewEntity } from "./types";
import { getPreviewId } from "./utils";

export const PreviewProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);
  const [previews, setPreviews] = useState<PreviewEntity[]>([]);

  const preview = useMemo(() => {
    return (
      previews.find((preview) => preview.previewId === activePreviewId) ?? null
    );
  }, [previews, activePreviewId]);

  const openPreview = useCallback(
    (newPreview: Omit<PreviewEntity, "previewId">) => {
      const newPreviewId = getPreviewId(newPreview);

      setPreviews((prev) => {
        return produce(prev, (draft) => {
          const existingPreview = draft.find(
            (preview) => preview.previewId === newPreviewId,
          );
          if (existingPreview) {
            draft.splice(draft.indexOf(existingPreview), 1);
          }
          draft.push({ ...newPreview, previewId: newPreviewId });
        });
      });
      setActivePreviewId(newPreviewId);
    },
    [],
  );

  const closePreview = useCallback(
    (previewId: string) => {
      setPreviews((prev) => {
        return produce(prev, (draft) => {
          const index = draft.findIndex(
            (preview) => preview.previewId === previewId,
          );
          if (index !== -1) {
            draft.splice(index, 1);
          }
          if (activePreviewId === previewId) {
            setActivePreviewId(null);
          }
        });
      });
    },
    [activePreviewId],
  );

  const movePreview = useCallback((previewId: string) => {
    setPreviews((prev) => {
      return produce(prev, (draft) => {
        const index = draft.findIndex(
          (preview) => preview.previewId === previewId,
        );
        if (index !== -1) {
          draft.splice(index, 1);
        }
      });
    });
  }, []);

  return (
    <PreviewContext.Provider
      value={{
        preview,
        previews,
        openPreview,
        closePreview,
        movePreview,
        activePreviewId,
        setActivePreviewId,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
};
