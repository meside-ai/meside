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

import { Flex, Radio } from "@mantine/core";
import { createErrors } from "../utils/createErrors";

/** The `RadioWidget` is a widget for rendering a radio group.
 *  It is typically used with a string property constrained with enum options.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function RadioWidget<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  F extends FormContextType = any,
>(props: WidgetProps<T, S, F>) {
  const {
    id,
    value,
    required,
    disabled,
    readonly,
    hideLabel,
    label,
    onChange,
    onBlur,
    onFocus,
    options,
    rawErrors,
    hideError,
    schema,
  } = props;
  const { enumOptions, enumDisabled, emptyValue, inline } = options;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const _onChange = (nextValue: any) => {
    onChange(enumOptionsValueForIndex<S>(nextValue, enumOptions, emptyValue));
  };

  const _onBlur = () => onBlur(id, value);
  const _onFocus = () => onFocus(id, value);

  const description = options.description || schema.description;
  return (
    <Radio.Group
      name={id}
      label={labelValue(label || undefined, hideLabel, false)}
      description={description}
      required={required}
      value={
        enumOptionsIndexForValue<S>(value, enumOptions, false) as
          | string
          | undefined
      } // since I set multiple to false, this should not be an array, so I need to cast and suppress the error
      onChange={_onChange}
      onBlur={_onBlur}
      onFocus={_onFocus}
      error={createErrors<T>(rawErrors, hideError)}
      className="armt-widget-radio"
    >
      <Flex direction={inline ? "row" : "column"} m="xs" gap="sm">
        {enumOptions?.map((option, index) => {
          const itemDisabled =
            enumDisabled && enumDisabled.indexOf(option.value) !== -1;
          return (
            <Radio
              id={optionId(id, index)}
              name={id}
              label={option.label}
              value={
                enumOptionsIndexForValue<S>(
                  option.value,
                  enumOptions,
                  false,
                ) as string
              }
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              disabled={disabled || itemDisabled || readonly}
              aria-describedby={ariaDescribedByIds<T>(id)}
              description={option.schema?.description}
            />
          );
        })}
      </Flex>
    </Radio.Group>
  );
}
