import { Title } from "@mantine/core";
import type {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  TitleFieldProps,
} from "@rjsf/utils";

const REQUIRED_FIELD_SYMBOL = "*";

/** The `TitleField` is the template to use to render the title of a field
 *
 * @param props - The `TitleFieldProps` for this component
 */
export default function TitleField<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  F extends FormContextType = any,
>({ title, required, id }: TitleFieldProps<T, S, F>) {
  if (!title) {
    return null;
  }
  return (
    <Title
      order={5}
      className="armt-template-title"
      id={id}
      size="sm"
      fw={500}
      // biome-ignore lint/a11y/useSemanticElements: <explanation>
      role="heading"
      style={{
        flexGrow: 0,
        flexShrink: 0,
      }}
    >
      {title}
      {required && <span className="required">{REQUIRED_FIELD_SYMBOL}</span>}
    </Title>
  );
}
