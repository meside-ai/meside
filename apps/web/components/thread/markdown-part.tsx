import { TextUIPart } from "@ai-sdk/ui-utils";
import { Box, Table, Text } from "@mantine/core";
import BaseMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";

export const MarkdownPart = ({ part }: { part: TextUIPart }) => {
  return (
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
              <SyntaxHighlighter
                PreTag="div"
                language={match[1]}
                wrapLines={true}
                wrapLongLines={true}
              >
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
      {part.text}
    </BaseMarkdown>
  );
};
