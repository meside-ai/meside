import { z } from "zod";
import {
  systemContentMessageStructure,
  userContentMessageStructure,
} from "../content/type";
import { assistantContentMessageStructure } from "../content/type";
import { assistantDbMessageStructure, systemDbMessageStructure } from "../db";
import { assistantEchartsMessageStructure } from "../echarts/type";
import { systemEchartsMessageStructure } from "../echarts/type";
import {
  assistantNameMessageStructure,
  systemNameMessageStructure,
} from "../name";

export const systemMessageStructureSchema = z.union([
  systemDbMessageStructure,
  systemEchartsMessageStructure,
  systemContentMessageStructure,
  systemNameMessageStructure,
]);

export type SystemMessageStructure = z.infer<
  typeof systemMessageStructureSchema
>;

export const userMessageStructureSchema = userContentMessageStructure;

export type UserMessageStructure = z.infer<typeof userMessageStructureSchema>;

export const assistantMessageStructureSchema = z.union([
  assistantDbMessageStructure,
  assistantEchartsMessageStructure,
  assistantContentMessageStructure,
  assistantNameMessageStructure,
]);

export type AssistantMessageStructure = z.infer<
  typeof assistantMessageStructureSchema
>;

export const messageStructureSchema = z.union([
  systemMessageStructureSchema,
  userMessageStructureSchema,
  assistantMessageStructureSchema,
]);

export type MessageStructure = z.infer<typeof messageStructureSchema>;
