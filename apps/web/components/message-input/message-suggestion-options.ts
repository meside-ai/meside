import type { MentionOptions } from "@tiptap/extension-mention";
import { ReactRenderer } from "@tiptap/react";
import tippy, { type Instance as TippyInstance } from "tippy.js";
import SuggestionList, {
  type SuggestionListRef,
} from "./message-suggestion-list";

export type MentionSuggestion = {
  id: string;
  mentionLabel: string;
};

/**
 * Workaround for the current typing incompatibility between Tippy.js and Tiptap
 * Suggestion utility.
 *
 * @see https://github.com/ueberdosis/tiptap/issues/2795#issuecomment-1160623792
 *
 * Adopted from
 * https://github.com/Doist/typist/blob/a1726a6be089e3e1452def641dfcfc622ac3e942/stories/typist-editor/constants/suggestions.ts#L169-L186
 */
const DOM_RECT_FALLBACK: DOMRect = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
  toJSON() {
    return {};
  },
};

export const createMentionSuggestionOptions = (
  stateRef: React.RefObject<{
    warehouseId: string | null;
  } | null>,
): MentionOptions["suggestion"] => ({
  char: "/",
  // Replace this `items` code with a call to your API that returns suggestions
  // of whatever sort you like (including potentially additional data beyond
  // just an ID and a label). It need not be async but is written that way for
  // the sake of example.
  items: async ({ query }): Promise<MentionSuggestion[]> => {
    const warehouseId = stateRef.current?.warehouseId;

    if (!warehouseId) {
      return [];
    }

    // const data = await queryClient.fetchQuery(
    //   getCatalogSuggestion({
    //     warehouseId,
    //     keyword: query,
    //   }),
    // );

    // return data.suggestions.map((suggestion) => ({
    //   id: suggestion.id,
    //   mentionLabel: suggestion.label,
    // }));
    return [];
  },

  allowSpaces: true,

  render: () => {
    let component: ReactRenderer<SuggestionListRef> | undefined;
    let popup: TippyInstance | undefined;

    return {
      onStart: (props) => {
        component = new ReactRenderer(SuggestionList, {
          props,
          editor: props.editor,
        });

        popup = tippy("body", {
          getReferenceClientRect: () =>
            props.clientRect?.() ?? DOM_RECT_FALLBACK,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        })[0];
      },

      onUpdate(props) {
        component?.updateProps(props);

        popup?.setProps({
          getReferenceClientRect: () =>
            props.clientRect?.() ?? DOM_RECT_FALLBACK,
        });
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popup?.hide();
          return true;
        }

        if (!component?.ref) {
          return false;
        }

        return component.ref.onKeyDown(props);
      },

      onExit() {
        popup?.destroy();
        component?.destroy();

        // Remove references to the old popup and component upon destruction/exit.
        // (This should prevent redundant calls to `popup.destroy()`, which Tippy
        // warns in the console is a sign of a memory leak, as the `suggestion`
        // plugin seems to call `onExit` both when a suggestion menu is closed after
        // a user chooses an option, *and* when the editor itself is destroyed.)
        popup = undefined;
        component = undefined;
      },
    };
  },
});
