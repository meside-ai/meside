import {
  type EditorJSONContent,
  editorJsonToMarkdown,
} from "@meside/shared/editor/editor-json-to-markdown";
import { parseJsonOrNull } from "@meside/shared/utils/json";
import { useMemo } from "react";
import { Markdown } from "../markdown/markdown";

export type EditorJsonMarkdownProps = {
  children: string;
};

export const EditorJsonMarkdown = ({ children }: EditorJsonMarkdownProps) => {
  const markdown = useMemo(() => {
    const json = parseJsonOrNull<EditorJSONContent>(children);
    if (json) {
      return editorJsonToMarkdown(json);
    }
    return children;
  }, [children]);

  return <Markdown>{markdown}</Markdown>;
};
