import {
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
  type WidgetProps,
  ariaDescribedByIds,
  labelValue,
} from "@rjsf/utils";
import { useCallback } from "react";

import { DateTimePicker } from "@mantine/dates";
import { createErrors } from "../utils/createErrors";

/** The `DateTimeWidget` component uses the `BaseInputTemplate` changing the type to `datetime-local` and transforms
 * the value to/from utc using the appropriate utility functions.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function MantineDateTimeWidget<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  F extends FormContextType = any,
>(props: WidgetProps<T, S, F>) {
  const {
    id,
    placeholder,
    label,
    hideLabel,
    value,
    required,
    readonly,
    disabled,
    onChange,
    onChangeOverride,
    autofocus,
    rawErrors,
    hideError,
    options,
    schema,
  } = props;
  const description = options.description || schema.description;

  // TODO: options
  const inputValue = value ? new Date(value) : null;

  const _onChange = useCallback(
    (value: Date | null) => onChange(value ? value.toJSON() : undefined),
    [onChange],
  );
  return (
    <DateTimePicker
      withSeconds
      value={inputValue}
      onChange={onChangeOverride || _onChange}
      key={id}
      id={id}
      placeholder={placeholder}
      label={labelValue(label, hideLabel, undefined)}
      required={required}
      clearable={!required}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      error={createErrors<T>(rawErrors, hideError)}
      aria-describedby={ariaDescribedByIds<T>(id)}
      className="armt-widget-datetime-mt"
      description={description}
    />
  );
}
