"use client";

import {
  Button,
  NumberInput,
  Paper,
  PasswordInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useState } from "react";
import {
  type WarehouseProvider,
  warehouseProviderSchema,
} from "../../../../../packages/shared/src/api/warehouse.type";

export default function WarehouseSettingsPage() {
  const [warehouseType, setWarehouseType] = useState<"postgresql" | "bigquery">(
    "postgresql",
  );

  const form = useForm<WarehouseProvider>({
    validate: zodResolver(warehouseProviderSchema),
    initialValues:
      warehouseType === "postgresql"
        ? {
            type: "postgresql",
            host: "",
            port: 5432,
            username: "",
            password: "",
          }
        : {
            type: "bigquery",
            projectId: "",
            credentials: "",
          },
  });

  const handleSubmit = (values: WarehouseProvider) => {
    console.log(values);
    // TODO: Implement submission logic
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-medium">Warehouse Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your warehouse settings and connections
        </p>
      </div>

      <Paper p="md" withBorder>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Select
              label="Warehouse Type"
              data={[
                { value: "postgresql", label: "PostgreSQL" },
                { value: "bigquery", label: "BigQuery" },
              ]}
              value={warehouseType}
              onChange={(value) => {
                setWarehouseType(value as "postgresql" | "bigquery");
                form.setValues(
                  value === "postgresql"
                    ? {
                        type: "postgresql",
                        host: "",
                        port: 5432,
                        username: "",
                        password: "",
                      }
                    : {
                        type: "bigquery",
                        projectId: "",
                        credentials: "",
                      },
                );
              }}
            />

            {warehouseType === "postgresql" ? (
              <>
                <TextInput
                  label="Host"
                  placeholder="localhost"
                  {...form.getInputProps("host")}
                />
                <NumberInput
                  label="Port"
                  placeholder="5432"
                  {...form.getInputProps("port")}
                />
                <TextInput
                  label="Username"
                  placeholder="postgres"
                  {...form.getInputProps("username")}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Enter password"
                  {...form.getInputProps("password")}
                />
              </>
            ) : (
              <>
                <TextInput
                  label="Project ID"
                  placeholder="your-project-id"
                  {...form.getInputProps("projectId")}
                />
                <TextInput
                  label="Credentials"
                  placeholder="Enter your JSON credentials"
                  {...form.getInputProps("credentials")}
                />
              </>
            )}

            <Button type="submit">Save Settings</Button>
          </Stack>
        </form>
      </Paper>
    </div>
  );
}
