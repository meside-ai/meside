import { getChatSystem } from "@/queries/chat";
import { getMessageList } from "@/queries/message";
import { getThreadCreate } from "@/queries/thread";
import { getWarehouseCreate, getWarehouseList } from "@/queries/warehouse";
import {
  Box,
  Button,
  Group,
  Modal,
  NumberInput,
  PasswordInput,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import type { MessageListResponse } from "@meside/api/message.schema";
import type { WarehouseCreateRequest } from "@meside/api/warehouse.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { z } from "zod";
import { WarehouseSelect } from "../warehouse/warehouse-select";

type StarterSystemDbFormValues = {
  warehouseId: string | null;
};

type StarterSystemDbProps = {
  setThreadId: (threadId: string) => void;
};

export const StarterSystemDb = ({ setThreadId }: StarterSystemDbProps) => {
  const queryClient = useQueryClient();

  const form = useForm<StarterSystemDbFormValues>({
    initialValues: {
      warehouseId: null,
    },
  });

  const { mutateAsync: createThread, isPending: isCreatingThread } =
    useMutation(getThreadCreate());

  const { mutateAsync: sendSystemMessage, isPending: isSendingSystemMessage } =
    useMutation(getChatSystem());

  const isLoading = useMemo(
    () => isCreatingThread || isSendingSystemMessage,
    [isCreatingThread, isSendingSystemMessage]
  );

  const handleSendSystemMessage = useCallback(
    async ({ warehouseId }: StarterSystemDbFormValues) => {
      if (!warehouseId) {
        return;
      }

      const { thread } = await createThread({
        parentMessageId: null,
        name: "New Thread",
      });

      const systemMessage = await sendSystemMessage({
        parentThreadId: thread.threadId,
        structure: {
          type: "systemDb",
          warehouseId,
        },
      });

      queryClient.setQueryData(
        getMessageList({
          parentThreadId: thread.threadId,
          createdAtSort: "asc",
        }).queryKey,
        (data: MessageListResponse | undefined) => {
          if (!data) {
            return {
              messages: [systemMessage.message],
            };
          }

          return {
            ...data,
            messages: [systemMessage.message, ...data.messages],
          };
        }
      );

      setThreadId(thread.threadId);
    },
    [createThread, queryClient, sendSystemMessage, setThreadId]
  );

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Box>
      <Text mb={8}>Select a warehouse to start a query</Text>
      <form onSubmit={form.onSubmit(handleSendSystemMessage)}>
        <Box mb={8}>
          <WarehouseSelect
            value={form.values.warehouseId}
            onChange={(value) => form.setFieldValue("warehouseId", value)}
          />
        </Box>
        <Group>
          <Button type="submit" loading={isLoading}>
            Start
          </Button>

          <Button variant="subtle" onClick={open}>
            Add new database
          </Button>
        </Group>
      </form>

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
        type: z.enum(["postgresql"], {
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
