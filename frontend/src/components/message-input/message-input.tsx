import CodeBlock from "@tiptap/extension-code-block";
import Document from "@tiptap/extension-document";
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
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import { messageInputSubmitEvent } from "./message-input-submit-event";
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
      const text = editor?.getText()?.trim();

      if (text) {
        submit(text);
      }
    });

    return () => {
      messageInputSubmitEvent.removeListener(callback);
    };
  }, [editor, submit]);

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
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
