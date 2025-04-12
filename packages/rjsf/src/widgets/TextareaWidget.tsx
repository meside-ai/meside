import { Textarea } from "@mantine/core";
import {
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
  type WidgetProps,
  ariaDescribedByIds,
  labelValue,
} from "@rjsf/utils";
import type { ChangeEvent } from "react";
import { createErrors } from "../utils/createErrors";

/** The `TextareaWidget` is a widget for rendering input fields as textarea.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function TextareaWidget<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  F extends FormContextType = any,
>(props: WidgetProps<T, S, F>) {
  const {
    id,
    placeholder,
    value,
    required,
    disabled,
    autofocus,
    label,
    hideLabel,
    readonly,
    onBlur,
    onFocus,
    onChange,
    options,
    rawErrors,
    hideError,
    schema,
  } = props;
  const description = options.description || schema.description;

  const _onChange = ({ target: { value } }: ChangeEvent<HTMLTextAreaElement>) =>
    // biome-ignore lint/complexity/useOptionalChain: <explanation>
    onChange && onChange(value === "" ? options.emptyValue : value);
  // biome-ignore lint/complexity/useOptionalChain: <explanation>
  const _onBlur = () => onBlur && onBlur(id, value);
  // biome-ignore lint/complexity/useOptionalChain: <explanation>
  const _onFocus = () => onFocus && onFocus(id, value);
  return (
    <Textarea
      id={id}
      key={id}
      name={id}
      className="armt-widget-textarea"
      label={labelValue(label || undefined, hideLabel, false)}
      placeholder={placeholder}
      autoFocus={autofocus}
      required={required}
      disabled={disabled || readonly}
      value={value || ""}
      error={createErrors<T>(rawErrors, hideError)}
      rows={options.rows || 5}
      onChange={_onChange}
      onBlur={_onBlur}
      onFocus={_onFocus}
      aria-describedby={ariaDescribedByIds<T>(id)}
      description={description}
    />
  );
}
