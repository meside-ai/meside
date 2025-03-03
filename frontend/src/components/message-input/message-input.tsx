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
import {
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
import { jsonToMarkdown } from "./message-markdown";
import { createMentionSuggestionOptions } from "./message-suggestion-options";

export type MessageInputProps = {
  state?: {
    warehouseId?: string;
  };
  submit: (text: string) => void;
  loading?: boolean;
  placeholder?: string;
};

export const MessageInput = ({ state, submit, loading }: MessageInputProps) => {
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
      EnterSubmit,
      CodeBlock,
      Document,
      Paragraph,
      Text,
      HardBreak,
      History,
      Placeholder.configure({
        placeholder: "Write your question …",
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
    ],
    content: "",
  });

  useEffect(() => {
    if (loading) {
      editor?.setOptions({ editable: false });
    } else {
      editor?.setOptions({ editable: true });
    }
  }, [editor, loading]);

  useEffect(() => {
    const callback = messageInputSubmitEvent.listen(() => {
      const json = editor?.getJSON();
      if (!json) {
        return;
      }
      const text = jsonToMarkdown(json);

      submit(text);
    });

    return () => {
      messageInputSubmitEvent.removeListener(callback);
    };
  }, [editor, submit]);

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
    };
  },
});
