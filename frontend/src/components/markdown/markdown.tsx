import { Box, Table, Text } from "@mantine/core";
import BaseMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";

export type MarkdownProps = {
  children: string;
};

export const Markdown = ({ children }: MarkdownProps) => {
  return (
    <Box className="meside-markdown">
      <BaseMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => {
            return <Text>{children}</Text>;
          },
          table: ({ children }) => {
            return (
              <Table withTableBorder withColumnBorders withRowBorders>
                {children}
              </Table>
            );
          },
          tr: ({ children }) => {
            return <Table.Tr>{children}</Table.Tr>;
          },
          td: ({ children }) => {
            return <Table.Td>{children}</Table.Td>;
          },
          th: ({ children }) => {
            return <Table.Th>{children}</Table.Th>;
          },
          code: (props) => {
            const { children, className, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <Box style={{ borderRadius: "12px", overflow: "hidden" }}>
                <SyntaxHighlighter PreTag="div" language={match[1]}>
                  {String(children)}
                </SyntaxHighlighter>
              </Box>
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
        }}
      >
        {children}
      </BaseMarkdown>
    </Box>
  );
};
