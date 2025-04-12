import {
  type FieldTemplateProps,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
  getTemplate,
  getUiOptions,
} from "@rjsf/utils";
import { type ReactNode, createContext, useContext } from "react";

/** `FieldContext passes the items of the `FieldTemplate` down to descendants, to avoid prop drilling.
 * It is used by the nearest descendant consumer.
 */
export const FieldContext = createContext<{
  description: ReactNode;
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
}>(null!);

export const useFieldContext = () => {
  const context = useContext(FieldContext);
  if (!context) {
    throw new Error("FieldContext not found");
  }
  return context;
};

/** The `FieldTemplate` component is the template used by `SchemaField` to render any field. It renders the field
 * content, (label, description, children, errors and help) inside of a `WrapIfAdditional` component.
 *
 * @param props - The `FieldTemplateProps` for this component
 */
export default function FieldTemplate<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  F extends FormContextType = any,
>(props: FieldTemplateProps<T, S, F>) {
  const {
    id,
    children,
    classNames,
    style,
    label,
    help,
    hidden,
    registry,
    schema,
    uiSchema,
    errors,
    description,
    ...otherProps
  } = props;
  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const WrapIfAdditionalTemplate = getTemplate<
    "WrapIfAdditionalTemplate",
    T,
    S,
    F
  >("WrapIfAdditionalTemplate", registry, uiOptions);

  if (hidden) {
    return <div style={{ display: "none" }}>{children}</div>;
  }

  // Conditions whether errors should be displayed or not is handled by the FieldErrorTemplate
  return (
    <FieldContext.Provider value={{ description: description }}>
      <WrapIfAdditionalTemplate
        classNames={classNames}
        style={style}
        id={id}
        label={label}
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        {...otherProps}
      >
        {children}
        {errors}
        {help}
      </WrapIfAdditionalTemplate>
    </FieldContext.Provider>
  );
}
