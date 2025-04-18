import { Box, Checkbox } from "@mantine/core";
import {
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
  type WidgetProps,
  ariaDescribedByIds,
  enumOptionsIndexForValue,
  enumOptionsValueForIndex,
  labelValue,
  optionId,
} from "@rjsf/utils";
import { type FocusEvent, useCallback } from "react";
import { useFieldContext } from "../templates/FieldTemplate";
import { createErrors } from "../utils/createErrors";

/** The `CheckboxesWidget` is a widget for rendering checkbox groups.
 *  It is typically used to represent an array of enums.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function CheckboxesWidget<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  F extends FormContextType = any,
>(props: WidgetProps<T, S, F>) {
  const {
    id,
    disabled,
    options: { inline = false, enumOptions, enumDisabled, emptyValue },
    value,
    autofocus,
    readonly,
    label,
    hideLabel,
    onChange,
    onBlur,
    onFocus,
    required,
    rawErrors,
    hideError,
  } = props;

  const checkboxesValues = Array.isArray(value) ? value : [value];

  const selectedIndices = enumOptionsIndexForValue<S>(
    checkboxesValues,
    enumOptions,
    true,
  ) as string[];

  const handleBlur = useCallback(
    ({ target: { value } }: FocusEvent<HTMLInputElement>) =>
      onBlur(id, enumOptionsValueForIndex<S>(value, enumOptions, emptyValue)),
    [onBlur, id, enumOptions, emptyValue],
  );

  const handleFocus = useCallback(
    ({ target: { value } }: FocusEvent<HTMLInputElement>) =>
      onFocus(id, enumOptionsValueForIndex<S>(value, enumOptions, emptyValue)),
    [onFocus, id, enumOptions, emptyValue],
  );

  const { description } = useFieldContext();

  const _onChange = (nextIndices: string[]) => {
    const nextValues = enumOptionsValueForIndex<S>(
      nextIndices,
      enumOptions,
      [],
    ) as T[];
    onChange(nextValues);
  };
  return (
    <Checkbox.Group
      label={labelValue(label, hideLabel, false)}
      description={description}
      error={createErrors<T>(rawErrors, hideError)}
      onChange={_onChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      value={selectedIndices}
      id={id}
      required={required}
      autoFocus={autofocus}
      className="armt-widget-checkboxes"
    >
      <Box
        style={{
          display: "flex",
          flexDirection: inline ? "row" : "column",
          gap: "0.5rem",
        }}
      >
        {enumOptions?.map((option, index) => {
          return (
            <Checkbox
              id={optionId(id, index)}
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              label={option.label}
              value={
                enumOptionsIndexForValue<S>(
                  option.value,
                  enumOptions,
                  false,
                ) as string
              }
              disabled={
                disabled || readonly || (enumDisabled ?? []).includes(index)
              }
              name={id}
              aria-describedby={ariaDescribedByIds<T>(id)}
              description={option.schema?.description}
            />
          );
        })}
      </Box>
    </Checkbox.Group>
  );
}
