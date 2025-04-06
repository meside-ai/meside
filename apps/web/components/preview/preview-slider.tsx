import { ActionIcon, Box, Slider } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useCallback, useMemo } from "react";
import type { PreviewItem } from "../chat-context/context";

export const PreviewSlider = ({
  value,
  onChange,
  previewItems,
}: {
  value: PreviewItem | null;
  onChange: (item: PreviewItem) => void;
  previewItems: PreviewItem[];
}) => {
  const marks = useMemo(() => {
    return previewItems.map((item, index) => {
      return {
        value: ((index + 1) / previewItems.length) * 100,
      };
    });
  }, [previewItems]);

  const handleChange = useCallback(
    (value: number) => {
      const index = Math.floor(value / 100);
      const item = previewItems[index];
      if (item) {
        onChange(item);
      }
    },
    [onChange, previewItems],
  );

  const handlePrevious = useCallback(() => {
    const index = previewItems.findIndex((item) => item.id === value?.id);
    const previousItem = previewItems[index - 1];
    if (previousItem) {
      onChange(previousItem);
    }
  }, [onChange, previewItems, value]);

  const handleNext = useCallback(() => {
    const index = previewItems.findIndex((item) => item.id === value?.id);
    const nextItem = previewItems[index + 1];
    if (nextItem) {
      onChange(nextItem);
    }
  }, [onChange, previewItems, value]);

  const activePreviewItemValue = useMemo(() => {
    if (!value) {
      return 100;
    }
    const index = previewItems.findIndex((item) => item.id === value.id);
    return ((index + 1) / previewItems.length) * 100;
  }, [value, previewItems]);

  return (
    <Box
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <ActionIcon variant="white" onClick={handlePrevious}>
        <IconChevronLeft size={16} />
      </ActionIcon>
      <ActionIcon variant="white" onClick={handleNext}>
        <IconChevronRight size={16} />
      </ActionIcon>
      <Box style={{ flex: 1, overflow: "hidden" }}>
        <Slider
          restrictToMarks
          marks={marks}
          value={activePreviewItemValue}
          onChange={handleChange}
        />
      </Box>
    </Box>
  );
};
