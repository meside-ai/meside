import { Box } from "@mantine/core";
import BaseMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./markdown.css";

export type MarkdownProps = {
  children: string;
};

export const Markdown = ({ children }: MarkdownProps) => {
  return (
    <Box className="meside-markdown">
      <BaseMarkdown remarkPlugins={[remarkGfm]}>{children}</BaseMarkdown>
    </Box>
  );
};
