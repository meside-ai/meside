import type { MessageEntity } from "@/db/schema/message";

export type GetContent = (body: {
  message: MessageEntity;
}) => Promise<{
  content: string;
}>;
