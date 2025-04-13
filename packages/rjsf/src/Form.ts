import Form, { type FormProps, withTheme } from "@rjsf/core";
import type {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";
import { useRef, type ComponentType } from "react";
import { generateTheme } from "./theme";

export function generateForm<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  F extends FormContextType = any,
>(): ComponentType<FormProps<T, S, F>> {
  return withTheme<T, S, F>(generateTheme<T, S, F>());
}

export default generateForm();

export function useFormRef<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props?: FormProps<T, S, F>) {
  const ref = useRef<Form<T, S, F>>((props as any) ?? null);
  return ref;
}
