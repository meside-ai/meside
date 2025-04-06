import { PreviewIframe } from "./preview-iframe";
import type { PreviewItem } from "./preview-type";

export const PreviewContent = ({ item }: { item: PreviewItem }) => {
  switch (item.type) {
    case "link":
      return <PreviewIframe url={item.text} />;
  }
};
