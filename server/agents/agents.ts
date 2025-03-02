import type { MessageEntity } from "@/db/schema/message";
import { BadRequestError } from "@/utils/error";
import { getAssistantContentStructure } from "./content";
import {
  getAssistantContentMessageContent,
  getSystemContentMessageContent,
  getUserContentMessageContent,
} from "./content/content";
import { getAssistantDbStructure } from "./db";
import {
  getAssistantDbMessageContent,
  getSystemDbMessageContent,
} from "./db/content";
import { getAssistantEchartsStructure } from "./echarts";
import {
  getAssistantEchartsMessageContent,
  getSystemEchartsMessageContent,
} from "./echarts/content";
import { getAssistantNameStructure } from "./name/chat";
import { getAssistantNameMessageContent } from "./name/content";
import { getSystemNameMessageContent } from "./name/content";
import type { GetAssistantStructure } from "./types/chat.interface";
import type { GetContent } from "./types/content.interface";
import type {
  MessageStructure,
  SystemMessageStructure,
} from "./types/message-structure";
export const getAgent = (message: MessageEntity): GetAssistantStructure => {
  const agents: Record<SystemMessageStructure["type"], GetAssistantStructure> =
    {
      systemDb: getAssistantDbStructure,
      systemEcharts: getAssistantEchartsStructure,
      systemContent: getAssistantContentStructure,
      systemName: getAssistantNameStructure,
    };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const agent = (agents as any)?.[message.structure.type];

  if (!agent) {
    throw new BadRequestError("Invalid message structure");
  }

  return agent;
};

export const structureContentRecords: Record<
  MessageStructure["type"],
  GetContent
> = {
  systemDb: getSystemDbMessageContent,
  assistantDb: getAssistantDbMessageContent,
  systemEcharts: getSystemEchartsMessageContent,
  assistantEcharts: getAssistantEchartsMessageContent,
  systemContent: getSystemContentMessageContent,
  userContent: getUserContentMessageContent,
  assistantContent: getAssistantContentMessageContent,
  assistantName: getAssistantNameMessageContent,
  systemName: getSystemNameMessageContent,
};

export const getStructureContent = (message: MessageEntity): GetContent => {
  const content = structureContentRecords[message.structure.type];
  return content;
};
