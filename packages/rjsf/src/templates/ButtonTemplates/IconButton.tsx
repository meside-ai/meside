import { ActionIcon, type ButtonProps } from "@mantine/core";
import {
  type FormContextType,
  type IconButtonProps,
  type RJSFSchema,
  type StrictRJSFSchema,
  TranslatableString,
} from "@rjsf/utils";
import {
  IconChevronDown,
  IconChevronUp,
  IconCopy,
  IconTrash,
} from "@tabler/icons-react";

function IconButton<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  F extends FormContextType = any,
>(props: IconButtonProps<T, S, F>) {
  // eliminate uiSchema and registry from props, which are not accepted by ActionIcon
  const {
    iconType,
    icon,
    uiSchema: _uiSchema,
    registry: _registry,
    color,
    title,
    ...rest
  } = props;
  return (
    <ActionIcon
      size={iconType as ButtonProps["size"]}
      variant="light"
      color={color as ButtonProps["color"]}
      aria-label={title}
      title={title}
      // biome-ignore lint/a11y/useSemanticElements: <explanation>
      role="button"
      {...rest}
    >
      {icon}
    </ActionIcon>
  );
}

export default IconButton;

export function CopyButton<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  F extends FormContextType = any,
>(props: IconButtonProps<T, S, F>) {
  const {
    registry: { translateString },
  } = props;
  return (
    <IconButton
      title={translateString(TranslatableString.CopyButton)}
      {...props}
      icon={<IconCopy />}
    />
  );
}

export function MoveDownButton<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  F extends FormContextType = any,
>(props: IconButtonProps<T, S, F>) {
  const {
    registry: { translateString },
  } = props;
  return (
    <IconButton
      title={translateString(TranslatableString.MoveDownButton)}
      {...props}
      icon={<IconChevronDown />}
    />
  );
}

export function MoveUpButton<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  F extends FormContextType = any,
>(props: IconButtonProps<T, S, F>) {
  const {
    registry: { translateString },
  } = props;
  return (
    <IconButton
      title={translateString(TranslatableString.MoveUpButton)}
      {...props}
      icon={<IconChevronUp />}
    />
  );
}

export function RemoveButton<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  F extends FormContextType = any,
>(props: IconButtonProps<T, S, F>) {
  const {
    registry: { translateString },
  } = props;
  return (
    <IconButton
      title={translateString(TranslatableString.RemoveButton)}
      color="red"
      {...props}
      icon={<IconTrash />}
    />
  );
}
