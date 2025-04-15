"use client";

import JsonSchemaForm from "@meside/rjsf/src/index";
import { teamOrchestrationSchema } from "@meside/shared/api/team.schema";
import type { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  orchestration: teamOrchestrationSchema,
});

const jsonSchema: RJSFSchema = zodToJsonSchema(formSchema, "team");

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
        orchestration: {
          type: {
            "ui:widget": "hidden",
          },
          agents: {
            items: {
              "ui:order": [
                "name",
                "description",
                "llmId",
                "toolIds",
                "instructions",
              ],
            },
          },
        },
      }}
    />
  );
}
