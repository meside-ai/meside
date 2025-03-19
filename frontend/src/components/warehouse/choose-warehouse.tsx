import { getWarehouseCreate, getWarehouseList } from "@/queries/warehouse";
import {
  Box,
  Button,
  Group,
  Modal,
  NumberInput,
  PasswordInput,
  Radio,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import type { WarehouseCreateRequest } from "@meside/api/warehouse.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { z } from "zod";
import { WarehouseTitle } from "./warehouse-title";

type ChooseWarehouseProps = {
  warehouseId: string | null;
  setWarehouseId: (warehouseId: string | null) => void;
};

export const ChooseWarehouse = ({
  warehouseId,
  setWarehouseId,
}: ChooseWarehouseProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const { data } = useQuery(getWarehouseList());

  const cards = useMemo(
    () =>
      data?.warehouses.map((item) => (
        <Radio.Card
          p="md"
          radius="md"
          value={item.warehouseId}
          key={item.warehouseId}
        >
          <Group wrap="nowrap" align="center">
            <Radio.Indicator />
            <WarehouseTitle warehouseId={item.warehouseId} />
          </Group>
        </Radio.Card>
      )),
    [data?.warehouses]
  );

  return (
    <Box>
      <Box mb={8}>
        <Radio.Group
          label="Pick one warehouse to start a question"
          description="Choose a warehouse that you will need in your question"
          value={warehouseId}
          onChange={setWarehouseId}
        >
          <Stack pt="md" gap="xs">
            {cards}
          </Stack>
        </Radio.Group>
      </Box>
      <Group>
        <Button size="xs" variant="white" onClick={open}>
          Add new database
        </Button>
      </Group>

      <Modal opened={opened} onClose={close} title="Add new data warehouse">
        <AddNewDatabaseForm onClose={close} />
      </Modal>
    </Box>
  );
};

type AddNewDatabaseFormValues = {
  name: string;
  type: WarehouseCreateRequest["type"];
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
};

const AddNewDatabaseForm = ({ onClose }: { onClose: () => void }) => {
  const queryClient = useQueryClient();

  const form = useForm<AddNewDatabaseFormValues>({
    initialValues: {
      name: "",
      type: "postgresql",
      host: "",
      port: 5432,
      database: "",
      username: "",
      password: "",
    },
    validate: zodResolver(
      z.object({
        name: z.string().min(1, { message: "Name is required" }),
        type: z.enum(["postgresql", "bigquery", "mysql", "sqlserver"], {
          message: "Type is required",
        }),
        host: z.string().min(1, { message: "Host is required" }),
        port: z.number().min(1, { message: "Port is required" }),
        database: z.string().min(1, { message: "Database is required" }),
      })
    ),
  });

  const { mutateAsync: createWarehouse, isPending: isCreatingWarehouse } =
    useMutation({
      ...getWarehouseCreate(),
      onSuccess: () => {
        queryClient.invalidateQueries(getWarehouseList());
        onClose();
      },
    });

  const handleCreateWarehouse = useCallback(
    async (values: AddNewDatabaseFormValues) => {
      await createWarehouse(values);
    },
    [createWarehouse]
  );

  return (
    <form onSubmit={form.onSubmit(handleCreateWarehouse)}>
      <TextInput label="Name" {...form.getInputProps("name")} withAsterisk />
      <Select
        label="Type"
        {...form.getInputProps("type")}
        data={[
          {
            value: "postgresql",
            label: "PostgreSQL",
          },
          {
            value: "mysql",
            label: "MySql",
          },
          {
            value: "sqlserver",
            label: "SqlServer",
          },
          {
            value: "bigquery",
            label: "BigQuery",
          },
        ]}
        withAsterisk
      />
      <TextInput label="Host" {...form.getInputProps("host")} withAsterisk />
      <NumberInput label="Port" {...form.getInputProps("port")} withAsterisk />
      <TextInput
        label="Database"
        {...form.getInputProps("database")}
        withAsterisk
      />
      <TextInput label="Username" {...form.getInputProps("username")} />
      <PasswordInput label="Password" {...form.getInputProps("password")} />

      <Group mt="md">
        <Button type="submit" loading={isCreatingWarehouse}>
          Create
        </Button>
        <Button variant="subtle" onClick={onClose}>
          Cancel
        </Button>
      </Group>
    </form>
  );
};
