import type { MessageEntity } from "@/db/schema/message";

export interface Workflow {
  stream(body: {
    messages: MessageEntity[];
  }): Promise<ReadableStream<MessageEntity>>;

  generate(body: {
    messages: MessageEntity[];
  }): Promise<MessageEntity>;
}
