"use client";

import {
  Alert,
  Button,
  Container,
  Divider,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { useFormRef } from "@meside/rjsf/src/Form";
import JsonSchemaForm from "@meside/rjsf/src/index";
import { llmProviderSchema } from "@meside/shared/api/llm.schema";
import {
  type OrgCreateRequest,
  orgCreateRequestSchema,
} from "@meside/shared/api/org.schema";
import type { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { zodToJsonSchema } from "zod-to-json-schema";
import { Logo } from "../../../components/brand/logo";
import { getOrgCreate, getOrgList } from "../../../queries/org";
import { useSignout } from "../../hooks/signout";

const formSchema = orgCreateRequestSchema;
const jsonSchema: RJSFSchema = zodToJsonSchema(formSchema, "createOrg");

export default function OrgCreatePage() {
  const { signout } = useSignout();
  const router = useRouter();
  const createMutation = useMutation(getOrgCreate());
  const orgListQuery = useQuery(getOrgList({}));
  const isFirstOrg = useMemo(() => {
    if (orgListQuery.data?.orgs.length === 0) {
      return true;
    }
    return false;
  }, [orgListQuery.data?.orgs.length]);

  // Handle form submission
  const handleSubmit = (formData: OrgCreateRequest) => {
    createMutation.mutate(formData, {
      onSuccess: (data) => {
        // Navigate to the newly created org
        router.push(`/org/${data.org.orgId}`);
      },
    });
  };

  const formRef = useFormRef();

  return (
    <Container size="xs" py="xl">
      <Stack mb="md">
        <Logo fontSize={40} />
        <Text size="xs" c="dimmed">
          Your first AI team and MCP tools in one place
        </Text>
        <Divider />
        <Text fw={500}>
          Create {isFirstOrg ? "your first" : ""} Organization
        </Text>
        {createMutation.isError && (
          <Alert color="red">{createMutation.error.message}</Alert>
        )}
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
                enumOptions:
                  llmProviderSchema?.options?.map((option, index) => ({
                    value: index,
                    label: option.shape.provider.value,
                  })) ?? [],
              },
              anyOf:
                llmProviderSchema?.options?.map((option) => ({
                  provider: {
                    "ui:widget": "hidden",
                  },
                  model: {
                    "ui:widget":
                      option.shape.provider.value === "openai" ||
                      option.shape.provider.value === "deepseek"
                        ? "radio"
                        : "text",
                  },
                })) ?? [],
            },
            "ui:submitButtonOptions": {
              norender: true,
            },
          }}
        >
          <Group>
            <Button
              type="submit"
              loading={createMutation.isPending}
              onClick={() => formRef.current?.submit()}
            >
              Create Organization
            </Button>
            <Button variant="transparent" onClick={signout}>
              It's not this account? Sign out
            </Button>
          </Group>
        </JsonSchemaForm>
      </Stack>
    </Container>
  );
}
