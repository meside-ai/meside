import type { PreviewItem } from "../chat-context/context";
import { PreviewIframe } from "./preview-iframe";

export const PreviewContent = ({ item }: { item: PreviewItem }) => {
  switch (item.type) {
    case "link":
      return <PreviewIframe url={item.text} />;
  }
};
