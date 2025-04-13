"use client";

import JsonSchemaForm from "@meside/rjsf/src/index";
import { warehouseProviderSchema } from "@meside/shared/api/warehouse.schema";
import type { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const formSchema = z.object({
  name: z.string(),
  provider: warehouseProviderSchema,
});

const jsonSchema: RJSFSchema = zodToJsonSchema(formSchema, "warehouse");

type FormData = z.infer<typeof formSchema>;

export function Form({
  initialData,
  onSubmit,
}: {
  initialData?: FormData;
  onSubmit: (data: FormData) => void;
}) {
  return (
    <JsonSchemaForm
      schema={jsonSchema}
      validator={validator}
      formData={initialData}
      onSubmit={({ formData }) => onSubmit(formData as FormData)}
      uiSchema={{
        provider: {
          "ui:widget": "radio",
          "ui:options": {
            enumOptions: warehouseProviderSchema.options.map(
              (option, index) => ({
                value: index,
                label: option.shape.type.value,
              }),
            ),
          },
          anyOf: warehouseProviderSchema.options.map(() => ({
            provider: {
              "ui:widget": "hidden",
            },
          })),
        },
      }}
    />
  );
}
