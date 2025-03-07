import {
  type EditorJSONContent,
  editorJsonToMarkdown,
} from "@shared/editor-json-to-markdown";
import { parseJsonOrNull } from "@shared/json";
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
