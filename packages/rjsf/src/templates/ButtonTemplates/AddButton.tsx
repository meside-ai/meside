import { Button, type ButtonProps } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

import {
  type FormContextType,
  type IconButtonProps,
  type RJSFSchema,
  type StrictRJSFSchema,
  TranslatableString,
} from "@rjsf/utils";

/** The `AddButton` renders a button that represent the `Add` action on a form
 */
export default function AddButton<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  F extends FormContextType = any,
>({ uiSchema, registry, color, ...props }: IconButtonProps<T, S, F>) {
  const { translateString } = registry;
  return (
    <Button
      title={translateString(TranslatableString.AddItemButton)}
      color={color as ButtonProps["color"]}
      variant="light"
      {...props}
      leftSection={<IconPlus />}
    >
      {translateString(TranslatableString.AddItemButton)}
    </Button>
  );
}
