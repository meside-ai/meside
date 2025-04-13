import { Box, Group, TextInput } from "@mantine/core";
import {
  ADDITIONAL_PROPERTY_FLAG,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
  TranslatableString,
  type WrapIfAdditionalTemplateProps,
} from "@rjsf/utils";
import type { FocusEvent } from "react";

/** The `WrapIfAdditional` component is used by the `FieldTemplate` to rename, or remove properties that are
 * part of an `additionalProperties` part of a schema.
 *
 * @param props - The `WrapIfAdditionalProps` for this component
 */
export default function WrapIfAdditionalTemplate<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  F extends FormContextType = any,
>(props: WrapIfAdditionalTemplateProps<T, S, F>) {
  const {
    children,
    classNames,
    style,
    disabled,
    id,
    label,
    onDropPropertyClick,
    onKeyChange,
    readonly,
    required,
    schema,
    uiSchema,
    registry,
  } = props;
  const { templates, translateString } = registry;
  // Button templates are not overridden in the uiSchema
  const { RemoveButton } = templates.ButtonTemplates;
  const keyLabel = translateString(TranslatableString.KeyLabel, [label]);
  const { readonlyAsDisabled = true, wrapperStyle } = registry.formContext;

  const additional = ADDITIONAL_PROPERTY_FLAG in schema;

  if (!additional) {
    return (
      <Box
        className={`${classNames ?? ""} armt-template-wia`}
        style={{
          ...style,
          marginBottom: 8,
        }}
      >
        {children}
      </Box>
    );
  }

  const handleBlur = ({ target }: FocusEvent<HTMLInputElement>) =>
    onKeyChange(target.value);

  // the reason that wraps the children in a div is to match the result of additional=false
  return (
    <div
      className={`${classNames ?? ""} armt-template-wia`}
      style={style}
      key={`${id}-key`}
    >
      <Group align="center">
        <TextInput // key input
          label={keyLabel}
          required={required}
          defaultValue={label}
          disabled={disabled || (readonlyAsDisabled && readonly)}
          id={id}
          name={id}
          onBlur={!readonly ? handleBlur : undefined}
          style={wrapperStyle}
          type="text"
        />
        <Box
          style={{ flexGrow: 1 }} // value input as children
        >
          {children}
        </Box>
        <RemoveButton
          className="array-item-remove"
          disabled={disabled || readonly}
          onClick={onDropPropertyClick(label)}
          uiSchema={uiSchema}
          registry={registry}
        />
      </Group>
    </div>
  );
}
