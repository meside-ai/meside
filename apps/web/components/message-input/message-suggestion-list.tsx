import { Box, Card } from "@mantine/core";
// import { List, ListItem, ListItemButton, Paper } from "@mui/material";
import type { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import type { MentionSuggestion } from "./message-suggestion-options";

export type SuggestionListRef = {
  // For convenience using this SuggestionList from within the
  // mentionSuggestionOptions, we'll match the signature of SuggestionOptions's
  // `onKeyDown` returned in its `render` function
  onKeyDown: NonNullable<
    ReturnType<
      NonNullable<SuggestionOptions<MentionSuggestion>["render"]>
    >["onKeyDown"]
  >;
};

// This type is based on
// https://github.com/ueberdosis/tiptap/blob/a27c35ac8f1afc9d51f235271814702bc72f1e01/packages/extension-mention/src/mention.ts#L73-L103.
// TODO(Steven DeMartini): Use the Tiptap exported MentionNodeAttrs interface
// once https://github.com/ueberdosis/tiptap/pull/4136 is merged.
interface MentionNodeAttrs {
  id: string | null;
  label?: string | null;
}

export type SuggestionListProps = SuggestionProps<MentionSuggestion>;

const SuggestionList = forwardRef<SuggestionListRef, SuggestionListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      if (index >= props.items.length) {
        // Make sure we actually have enough items to select the given index. For
        // instance, if a user presses "Enter" when there are no options, the index will
        // be 0 but there won't be any items, so just ignore the callback here
        return;
      }

      const suggestion = props.items[index];

      // Set all of the attributes of our Mention node based on the suggestion
      // data. The fields of `suggestion` will depend on whatever data you
      // return from your `items` function in your "suggestion" options handler.
      // Our suggestion handler returns `MentionSuggestion`s (which we've
      // indicated via SuggestionProps<MentionSuggestion>). We are passing an
      // object of the `MentionNodeAttrs` shape when calling `command` (utilized
      // by the Mention extension to create a Mention Node).
      const mentionItem: MentionNodeAttrs = {
        id: suggestion?.id ?? null,
        label: suggestion?.mentionLabel ?? null,
      };
      // type where if you specify the suggestion type (like
      // `SuggestionProps<MentionSuggestion>`), it will incorrectly require that
      // type variable for `command`'s argument as well (whereas instead the
      // type of that argument should be the Mention Node attributes). This
      // should be fixed once https://github.com/ueberdosis/tiptap/pull/4136 is
      // merged and we can add a separate type arg to `SuggestionProps` to
      // specify the type of the commanded selected item.
      props.command(mentionItem);
    };

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length,
      );
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    return (
      <Card
        withBorder
        shadow="sm"
        p="xs"
        style={() => ({
          overflow: "hidden",
        })}
      >
        {props.items.length ? (
          props.items.map((item, index) => (
            <Box
              variant="subtle"
              key={item.id}
              onClick={() => selectItem(index)}
              style={(theme) => ({
                textAlign: "left",
                background:
                  index === selectedIndex ? theme.primaryColor : "transparent",
                color: index === selectedIndex ? "white" : undefined,
                padding: "2px 6px",
                cursor: "pointer",
                fontSize: 12,
                borderRadius: 6,
              })}
            >
              {item.mentionLabel}
            </Box>
          ))
        ) : (
          <Box>No result</Box>
        )}
      </Card>
    );
  },
);

SuggestionList.displayName = "SuggestionList";

export default SuggestionList;
