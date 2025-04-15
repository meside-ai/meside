"use client";

import JsonSchemaForm from "@meside/rjsf/src/index";
import RadioWidget from "@meside/rjsf/src/widgets/RadioWidget";
import { teamOrchestrationSchema } from "@meside/shared/api/team.schema";
import type { RJSFSchema, WidgetProps } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { getLlmList } from "../../../../../queries/llm";
import { getToolList } from "../../../../../queries/tool";

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
  const { data: toolList } = useQuery(getToolList({}));

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
                "instructions",
                "description",
                "llmId",
                "toolIds",
              ],
              instructions: {
                "ui:widget": "textarea",
              },
              description: {
                "ui:description":
                  "One word description of the agent for manager agent to choose what team agent to handle the task.",
              },
              llmId: {
                "ui:title": "AI model",
                "ui:description": "Choose the AI model for the agent.",
                "ui:widget": LlmIdWidget,
              },
              toolIds: {
                "ui:widget": "select",
                "ui:title": "AI tools",
                "ui:options": {
                  enumOptions: toolList?.tools.map((tool) => ({
                    label: tool.name,
                    value: tool.toolId,
                  })),
                },
              },
            },
          },
        },
      }}
    />
  );
}

const LlmIdWidget = (props: WidgetProps) => {
  // const { formData, onChange, options } = props;
  const { data: llmList } = useQuery(getLlmList({}));

  return (
    <RadioWidget
      {...props}
      options={{
        enumOptions: llmList?.llms.map((llm) => ({
          label: llm.name,
          value: llm.llmId,
        })),
      }}
    />
  );
};
