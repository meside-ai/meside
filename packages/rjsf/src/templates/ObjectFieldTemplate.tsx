import { Box, Fieldset, Group } from "@mantine/core";
import {
  type FormContextType,
  type ObjectFieldTemplatePropertyType,
  type ObjectFieldTemplateProps,
  type RJSFSchema,
  type StrictRJSFSchema,
  canExpand,
  getTemplate,
  getUiOptions,
  titleId,
} from "@rjsf/utils";
import { useFieldContext } from "./FieldTemplate";

/** The `ObjectFieldTemplate` is the template to use to render all the inner properties of an object along with the
 * title and description if available. If the object is expandable, then an `AddButton` is also rendered after all
 * the properties.
 *
 * @param props - The `ObjectFieldTemplateProps` for this component
 */
export default function ObjectFieldTemplate<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  F extends FormContextType = any,
>(props: ObjectFieldTemplateProps<T, S, F>) {
  const {
    disabled,
    formData,
    idSchema,
    onAddClick,
    properties,
    readonly,
    registry,
    required,
    schema,
    title,
    uiSchema,
  } = props;

  const { description } = useFieldContext();
  const options = getUiOptions<T, S, F>(uiSchema);
  const TitleFieldTemplate = getTemplate<"TitleFieldTemplate", T, S, F>(
    "TitleFieldTemplate",
    registry,
    options,
  );

  // Button templates are not overridden in the uiSchema
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;

  const classNames = options.classNames;

  const legendNode = (
    <Group gap="xs" className="armt-template-objectfield-legend">
      {title && (
        <TitleFieldTemplate
          id={titleId<T>(idSchema)}
          title={title}
          required={required}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}
      {description}
    </Group>
  );
  return (
    <Fieldset
      id={idSchema.$id}
      style={{
        width: "100%",
        margin: 0,
        padding: 0,
      }}
      className={`armt-template-objectfield ${classNames ?? ""}`}
      variant="unstyled"
    >
      <Box className="armt-template-objectfield-item">
        {properties.map(
          (prop: ObjectFieldTemplatePropertyType) => prop.content,
        )}
      </Box>
      {canExpand<T, S, F>(schema, uiSchema, formData) && (
        <AddButton
          className="object-property-expand"
          onClick={onAddClick(schema)}
          disabled={disabled || readonly}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}
    </Fieldset>
  );
}
