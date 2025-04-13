import { Alert, List } from "@mantine/core";
import {
  type ErrorListProps,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
  TranslatableString,
} from "@rjsf/utils";
import { IconZoomExclamation } from "@tabler/icons-react";

/** The `ErrorList` component is the template that renders the all the errors associated with the fields in the `Form`
 *
 * @param props - The `ErrorListProps` for this component
 */
export default function ErrorList<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  F extends FormContextType = any,
>({ errors, registry }: ErrorListProps<T, S, F>) {
  const { translateString } = registry;
  return (
    <Alert
      title={translateString(TranslatableString.ErrorsLabel)}
      icon={<IconZoomExclamation />}
    >
      <List size="sm">
        {errors.map((error, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <List.Item key={`error-${index}`}>{error.stack}</List.Item>
        ))}
      </List>
    </Alert>
  );
}
