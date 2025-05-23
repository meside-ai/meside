import type { TextUIPart } from "@ai-sdk/ui-utils";
import { Box, Button, Table, Text } from "@mantine/core";
import { PREVIEW_URL_PREFIX } from "@meside/shared/constant/index";
import BaseMarkdown, { defaultUrlTransform } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import { composePreviewLink, useChatContext } from "../chat-context/context";

export const MarkdownPart = ({ part }: { part: TextUIPart }) => {
  const { setActivePreviewItem } = useChatContext();

  return (
    <BaseMarkdown
      urlTransform={urlTransform}
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ children, ...props }) => {
          const { href, ...rest } = props;
          if (href?.startsWith(PREVIEW_URL_PREFIX)) {
            return (
              <Button
                variant="light"
                size="xs"
                radius="lg"
                onClick={() => {
                  setActivePreviewItem(composePreviewLink(href));
                }}
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {getClipText(href)}
              </Button>
            );
          }
          return (
            <Text component="a" href={href} {...rest}>
              {children}
            </Text>
          );
        },
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

const urlTransform = (url: string): string | null | undefined => {
  return defaultUrlTransform(url);
};

const getClipText = (text: string) => {
  // start with 10 chars, end with 10 chars, and show ... in the middle
  const start = text.slice(0, 20);
  const end = text.slice(-20);
  return `${start}...${end}`;
};
