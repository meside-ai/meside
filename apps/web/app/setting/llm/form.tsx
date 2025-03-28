"use client";

import { llmProviderSchema } from "@meside/shared/api/llm.schema";
import JsonSchemaForm from "@rjsf/core";
import type { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const formSchema = z.object({
  name: z.string(),
  provider: llmProviderSchema,
  isDefault: z.boolean().optional(),
});

const jsonSchema: RJSFSchema = zodToJsonSchema(formSchema, "llm");

type FormData = z.infer<typeof formSchema>;

export function Form({
  initialData,
  onSubmit,
}: {
  initialData?: FormData;
  onSubmit: (data: FormData) => void;
}) {
  return (
    <JsonSchemaForm<FormData>
      schema={jsonSchema}
      validator={validator}
      formData={initialData}
      onSubmit={({ formData }) => onSubmit(formData as FormData)}
    />
  );
}
