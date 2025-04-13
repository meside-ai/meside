import { Button } from "@mantine/core";
import {
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
  type SubmitButtonProps,
  getSubmitButtonOptions,
} from "@rjsf/utils";

/** The `SubmitButton` renders a button that represent the `Submit` action on a form
 */
export default function SubmitButton<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  F extends FormContextType = any,
>({ uiSchema }: SubmitButtonProps<T, S, F>) {
  const {
    submitText,
    norender,
    props: submitButtonProps = {},
  } = getSubmitButtonOptions<T, S, F>(uiSchema);
  if (norender) {
    return null;
  }
  return (
    <Button type="submit" variant="filled" {...submitButtonProps}>
      {submitText}
    </Button>
  );
}
