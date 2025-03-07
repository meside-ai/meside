import BaseMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type MarkdownProps = {
  children: string;
};

export const Markdown = ({ children }: MarkdownProps) => {
  return <BaseMarkdown remarkPlugins={[remarkGfm]}>{children}</BaseMarkdown>;
};
