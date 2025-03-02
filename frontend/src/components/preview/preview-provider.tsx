import { useEntity } from "@/utils/use-entity";
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

  const [previews, previewAction] = useEntity<PreviewEntity>([], "previewId");

  const preview = useMemo(() => {
    return (
      previews.find((preview) => preview.previewId === activePreviewId) ?? null
    );
  }, [previews, activePreviewId]);

  const openPreview = useCallback(
    (preview: Omit<PreviewEntity, "previewId">) => {
      const previewId = getPreviewId(preview);
      if (previewId === activePreviewId) {
        return;
      }
      if (previews.find((p) => p.previewId === previewId)) {
        setActivePreviewId(previewId);
        return;
      }
      previewAction.add({ ...preview, previewId });
      setActivePreviewId(previewId);
    },
    [previewAction, previews, activePreviewId]
  );

  const closePreview = useCallback(
    (previewId: string) => {
      previewAction.remove(previewId);
      if (activePreviewId === previewId) {
        setActivePreviewId(null);
      }
    },
    [activePreviewId, previewAction]
  );

  const movePreview = useCallback(
    (previewId: string, index: number) => {
      previewAction.move(previewId, index);
    },
    [previewAction]
  );

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
