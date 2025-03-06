import type { MessageEntity } from "@/db/schema/message";
import {
  getAssistantContentMessageContent,
  getSystemContentMessageContent,
  getUserContentMessageContent,
} from "./content/content";
import {
  getAssistantDbMessageContent,
  getSystemDbMessageContent,
} from "./db/content";
import {
  getAssistantEchartsMessageContent,
  getSystemEchartsMessageContent,
} from "./echarts/content";
import { getAssistantNameMessageContent } from "./name/content";
import { getSystemNameMessageContent } from "./name/content";
import type { GetContent } from "./types/content.interface";
import type { MessageStructure } from "./types/message-structure";

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
