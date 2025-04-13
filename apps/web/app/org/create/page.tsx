"use client";

import { Container, Paper, Stack, Title } from "@mantine/core";
import JsonSchemaForm from "@meside/rjsf/src/index";
import { llmProviderSchema } from "@meside/shared/api/llm.schema";
import {
  type OrgCreateRequest,
  orgCreateRequestSchema,
} from "@meside/shared/api/org.schema";
import type { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { zodToJsonSchema } from "zod-to-json-schema";
import { getOrgCreate } from "../../../queries/org";

const formSchema = orgCreateRequestSchema;
const jsonSchema: RJSFSchema = zodToJsonSchema(formSchema, "createOrg");

export default function OrgCreatePage() {
  const router = useRouter();
  const createMutation = useMutation(getOrgCreate());

  // Handle form submission
  const handleSubmit = (formData: OrgCreateRequest) => {
    createMutation.mutate(formData, {
      onSuccess: (data) => {
        // Navigate to the newly created org
        router.push(`/org/${data.org.orgId}`);
      },
    });
  };

  return (
    <Container size="sm" py="xl">
      <Paper p="md" shadow="sm" radius="md" withBorder>
        <Stack>
          <Title order={2}>Create Organization</Title>
          <JsonSchemaForm
            schema={jsonSchema}
            validator={validator}
            onSubmit={({ formData }) =>
              handleSubmit(formData as OrgCreateRequest)
            }
            disabled={createMutation.isPending}
            uiSchema={{
              defaultLLmProvider: {
                "ui:widget": "radio",
                "ui:options": {
                  enumOptions: llmProviderSchema.options.map(
                    (option, index) => ({
                      value: index,
                      label: option.shape.provider.value,
                    }),
                  ),
                },
                anyOf: llmProviderSchema.options.map(() => ({
                  provider: {
                    "ui:widget": "hidden",
                  },
                })),
              },
            }}
          />
          {createMutation.isError && (
            <div className="text-red-500">
              Error: {createMutation.error.message}
            </div>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
