import type {
  FormContextType,
  RJSFSchema,
  RegistryFieldsType,
  StrictRJSFSchema,
} from "@rjsf/utils";

import NullField from "./NullField";

export function generateFields<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  F extends FormContextType = any,
>(): RegistryFieldsType<T, S, F> {
  return {
    NullField,
  };
}

export default generateFields();
