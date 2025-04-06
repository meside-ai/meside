import { Button, Group, Loader, Text as MantineText } from "@mantine/core";
import Document from "@tiptap/extension-document";
import Gapcursor from "@tiptap/extension-gapcursor";
import HardBreak from "@tiptap/extension-hard-break";
import History from "@tiptap/extension-history";
import Mention from "@tiptap/extension-mention";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import {
  EditorContent,
  Extension,
  mergeAttributes,
  useEditor,
} from "@tiptap/react";
import "./message-input.css";
import { Box } from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import { messageInputSubmitEvent } from "./message-input-submit-event";
import { jsonToMarkdown } from "./message-markdown";
import { createMentionSuggestionOptions } from "./message-suggestion-options";

export type MessageInputProps = {
  state?: {
    warehouseId?: string;
  };
  initialValue?: string;
  submit: (text: string) => void;
  loading?: boolean;
  placeholder?: string;
};

export const MessageInput = ({
  state,
  initialValue,
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
      EnterSubmit,
    ],
    content: convertTextToEditorContent(initialValue ?? ""),
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
      submit(jsonToMarkdown(json));
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
      <EditorContent editor={editor} />
      <Group justify="space-between">
        <MantineText size="xs" c="dimmed">
          Tips: Use / to search table columns
        </MantineText>
        <Button
          size="xs"
          onClick={() => {
            if (loading) {
              return;
            }
            messageInputSubmitEvent.dispatch();
          }}
          disabled={loading}
        >
          {loading ? <Loader type="dots" size="xs" /> : <IconArrowUp />}
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
    };
  },
});

const convertTextToEditorContent = (text: string) => {
  return {
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text }] }],
  };
};
