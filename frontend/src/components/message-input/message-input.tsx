import { Button, Group, Loader, Text as MantineText } from "@mantine/core";
import CodeBlock from "@tiptap/extension-code-block";
import Document from "@tiptap/extension-document";
import Gapcursor from "@tiptap/extension-gapcursor";
import HardBreak from "@tiptap/extension-hard-break";
import History from "@tiptap/extension-history";
import Mention from "@tiptap/extension-mention";
import Paragraph from "@tiptap/extension-paragraph";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Text from "@tiptap/extension-text";
import {
  EditorContent,
  Extension,
  mergeAttributes,
  useEditor,
} from "@tiptap/react";
import "./message-input.css";
import { ActionIcon, Box } from "@mantine/core";
import type { EditorJSONContent } from "@meside/shared/editor-json-to-markdown";
import {
  IconArrowUp,
  IconColumnInsertLeft,
  IconColumnInsertRight,
  IconColumnRemove,
  IconRowInsertBottom,
  IconRowInsertTop,
  IconRowRemove,
  IconTableMinus,
  IconTablePlus,
} from "@tabler/icons-react";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import { messageInputSubmitEvent } from "./message-input-submit-event";
import { createMentionSuggestionOptions } from "./message-suggestion-options";

export type MessageInputProps = {
  state?: {
    warehouseId?: string;
  };
  initialJSONContent?: EditorJSONContent;
  submit: (jsonContent: EditorJSONContent) => void;
  loading?: boolean;
  placeholder?: string;
};

export const MessageInput = ({
  state,
  initialJSONContent,
  submit,
  loading,
}: MessageInputProps) => {
  const stateRef = useRef<{
    warehouseId: string | null;
  } | null>(null);

  useEffect(() => {
    if (stateRef.current?.warehouseId !== state?.warehouseId) {
      stateRef.current = {
        warehouseId: state?.warehouseId ?? null,
      };
    }

    return () => {
      stateRef.current = null;
    };
  }, [state?.warehouseId]);

  const editor = useEditor({
    extensions: [
      CodeBlock,
      Document,
      Paragraph,
      Text,
      HardBreak,
      History,
      Placeholder.configure({
        placeholder: "Write your question, press shift+enter to submit",
        showOnlyWhenEditable: false,
      }),
      Mention.configure({
        renderText({ node }) {
          return node.attrs.label ?? "unknown";
        },
        renderHTML({ options, node }) {
          return [
            "span",
            mergeAttributes({}, options.HTMLAttributes),
            `${node.attrs.label ?? "unknown"}`,
          ];
        },
        deleteTriggerWithBackspace: true,
        suggestion: createMentionSuggestionOptions(stateRef),
      }),
      Gapcursor,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      EnterSubmit,
    ],
    content: initialJSONContent,
  });

  useEffect(() => {
    const callback = messageInputSubmitEvent.listen(() => {
      if (loading) {
        return;
      }
      const json = editor?.getJSON();
      if (!json) {
        return;
      }
      editor?.commands.clearContent(true);
      submit(json);
    });

    return () => {
      messageInputSubmitEvent.removeListener(callback);
    };
  }, [editor, loading, submit]);

  if (!editor) {
    return null;
  }

  return (
    <Box>
      <Box mb="md">
        <ActionIcon.Group>
          <ActionIcon
            variant="light"
            size="xs"
            onClick={() =>
              editor.chain().focus().insertTable({ rows: 1, cols: 5 }).run()
            }
          >
            <IconTablePlus />
          </ActionIcon>
          <ActionIcon
            variant="light"
            size="xs"
            onClick={() => editor.chain().focus().addColumnBefore().run()}
          >
            <IconColumnInsertLeft />
          </ActionIcon>
          <ActionIcon
            variant="light"
            size="xs"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
          >
            <IconColumnInsertRight />
          </ActionIcon>
          <ActionIcon
            variant="light"
            size="xs"
            onClick={() => editor.chain().focus().deleteColumn().run()}
          >
            <IconColumnRemove />
          </ActionIcon>
          <ActionIcon
            variant="light"
            size="xs"
            onClick={() => editor.chain().focus().addRowBefore().run()}
          >
            <IconRowInsertTop />
          </ActionIcon>
          <ActionIcon
            variant="light"
            size="xs"
            onClick={() => editor.chain().focus().addRowAfter().run()}
          >
            <IconRowInsertBottom />
          </ActionIcon>
          <ActionIcon
            variant="light"
            size="xs"
            onClick={() => editor.chain().focus().deleteRow().run()}
          >
            <IconRowRemove />
          </ActionIcon>
          <ActionIcon
            variant="light"
            size="xs"
            onClick={() => editor.chain().focus().deleteTable().run()}
          >
            <IconTableMinus />
          </ActionIcon>
        </ActionIcon.Group>
      </Box>
      <EditorContent editor={editor} />
      <Group justify="space-between">
        <MantineText size="xs" c="dimmed">
          Tips: Use / to search table columns
        </MantineText>
        <Button
          variant="light"
          size="xs"
          onClick={() => {
            if (loading) {
              return;
            }
            messageInputSubmitEvent.dispatch();
          }}
        >
          {loading ? <Loader type="dots" /> : <IconArrowUp />}
        </Button>
      </Group>
    </Box>
  );
};

const EnterSubmit = Extension.create({
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        messageInputSubmitEvent.dispatch();
        return true;
      },
      // "Mod-Enter": () => {
      //   messageInputSubmitEvent.dispatch();
      //   return true;
      // },
      // "Shift-Enter": () => {
      //   messageInputSubmitEvent.dispatch();
      //   return true;
      // },
    };
  },
});
