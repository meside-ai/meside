import type { ThemeProps } from "@rjsf/core";

import type {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";
import { generateFields } from "./fields";
import { generateTemplates } from "./templates";
import { generateWidgets } from "./widgets";

export function generateTheme<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  F extends FormContextType = any,
>(): ThemeProps<T, S, F> {
  return {
    templates: generateTemplates<T, S, F>(),
    widgets: generateWidgets<T, S, F>(),
    fields: generateFields<T, S, F>(),
  };
}

export default generateTheme();
