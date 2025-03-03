import { environment } from "@/configs/environment";
import type { MessageEntity } from "@/db/schema/message";
import { BadRequestError } from "@/utils/error";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { BaseMessage } from "@langchain/core/messages";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { tool } from "@langchain/core/tools";
import { ChatDeepSeek } from "@langchain/deepseek";
import { ChatOpenAI } from "@langchain/openai";
import type { ZodSchema } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { getStructureContent } from "../agents";
import type { LLMRaw } from "../types/chat.interface";

export const convertMessageRole = (
  role: MessageEntity["messageRole"],
): "system" | "user" | "assistant" => {
  switch (role) {
    case "SYSTEM":
      return "system";
    case "USER":
    case "ASSISTANT":
      return "assistant";
  }
};

export const getSystemMessage = (messages: MessageEntity[]): MessageEntity => {
  const systemMessage = messages
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .find((message) => message.messageRole === "SYSTEM");
  if (!systemMessage) {
    throw new BadRequestError("System message not found");
  }
  return systemMessage;
};

export const getMessagesPrompt = async (
  messages: MessageEntity[],
): Promise<
  {
    role: "system" | "user" | "assistant";
    content: string;
  }[]
> => {
  return await Promise.all(
    messages.map(async (message) => {
      const getContent = getStructureContent(message);
      const data = await getContent({ message });
      return {
        role: convertMessageRole(message.messageRole),
        content: data.content,
      };
    }),
  );
};

export const getChatModel = () => {
  const model = environment.AI_MODEL ?? "gpt-4o";
  const verbose = environment.NODE_ENV === "development";

  if (["deepseek-reasoner", "deepseek-chat"].includes(model)) {
    return new ChatDeepSeek({
      // ChatDeepSeek does not support AI_BASE_URL
      // Langchain ChatOpenAI does not support deepseek well, due to function calling
      // add pull request to langchain to support AI_BASE_URL
      // @see https://github.com/langchain-ai/langchainjs/blob/0d6b66c007580272117397fcb06d9bb2559d3100/libs/langchain-deepseek/src/chat_models.ts#L404
      apiKey: environment.AI_API_KEY,
      model,
      temperature: 0,
      verbose,
    });
  }

  return new ChatOpenAI({
    model,
    temperature: 0,
    verbose,
    configuration: {
      baseURL: environment.AI_BASE_URL,
      apiKey: environment.AI_API_KEY,
    },
  });
};

export const extractLLMRaw = (raw: BaseMessage): LLMRaw => {
  const input = raw.response_metadata.tokenUsage.promptTokens;
  const output = raw.response_metadata.tokenUsage.completionTokens;
  const model = raw.response_metadata.model_name;
  const finishReason = raw.response_metadata.finish_reason;

  return {
    input,
    output,
    model,
    finishReason,
  };
};

export const getAIResult = async <T>(
  props: {
    llm: BaseChatModel;
    messages: {
      role: "system" | "user" | "assistant";
      content: string;
    }[];
    name: string;
    description: string;
    structureSchema: ZodSchema<T>;
  },
  options: {
    mode: "tool" | "structuredOutput" | "text";
  },
): Promise<{
  parsed: T;
  llmRaw: LLMRaw;
}> => {
  const { llm, messages, name, description, structureSchema } = props;
  const { mode } = options;

  if (mode === "structuredOutput") {
    const prompt = ChatPromptTemplate.fromMessages(messages, {
      templateFormat: "mustache",
    });

    const chain = prompt.pipe(
      llm.withStructuredOutput(structureSchema, {
        includeRaw: true,
      }),
    );

    const result = await chain.invoke({});

    return {
      parsed: result.parsed as T,
      llmRaw: extractLLMRaw(result.raw),
    };
  }

  if (mode === "tool") {
    const prompt = ChatPromptTemplate.fromMessages(messages, {
      templateFormat: "mustache",
    });

    const structureTool = tool(
      async (data) => {
        return data;
      },
      {
        name,
        description,
        schema: structureSchema,
      },
    );

    if (!llm.bindTools) {
      throw new BadRequestError("LLM does not support tool calling");
    }

    const chain = prompt.pipe(llm.bindTools([structureTool]));
    const raw = await chain.invoke({});

    const rawStructure = raw?.tool_calls?.[0].args;
    const parsed = structureSchema.parse(rawStructure);

    return {
      parsed,
      llmRaw: extractLLMRaw(raw),
    };
  }

  if (mode === "text") {
    const jsonSchema = zodToJsonSchema(structureSchema, name);

    const formatInstructions = [
      "#Instructions: Respond only in valid JSON. The JSON object you return should match the following JSON Schema:",
      JSON.stringify(jsonSchema, null, 2),
    ].join("\n");

    const systemMessage = messages.find((message) => message.role === "system");

    if (!systemMessage) {
      throw new BadRequestError("System message not found");
    }

    const newMessages = [
      {
        role: "user",
        content: `${systemMessage.content}\n${formatInstructions}`,
      },
      ...messages.filter((message) => message.role !== "system"),
    ];

    const new2Messages: {
      role: "user" | "assistant";
      content: string;
    }[] = [
      {
        role: "user",
        content: newMessages.reduce((acc, message) => {
          return `${acc}\n${message.content}`;
        }, ""),
      },
    ];

    const prompt = ChatPromptTemplate.fromMessages(new2Messages, {
      templateFormat: "mustache",
    });

    const parser = new JsonOutputParser<any>();

    const chain = prompt
      .pipe(llm)
      .pipe((result) => {
        console.log("ai chuck", result);
        return result;
      })
      .pipe(parser);

    const raw = await chain.invoke({});
    console.log("ai raw", raw);

    const parsed = structureSchema.parse(raw);

    return {
      parsed,
      llmRaw: {
        input: 0,
        output: 0,
        model: "",
        finishReason: "",
      },
    };
  }

  throw new BadRequestError("Invalid mode");
};
