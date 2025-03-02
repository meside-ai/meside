import { chatApi } from "@/api";
import type {
  ChatAssistantRequest,
  ChatAssistantResponse,
  ChatSystemRequest,
  ChatSystemResponse,
  ChatUserRequest,
  ChatUserResponse,
  NameAssistantRequest,
  NameAssistantResponse,
} from "@/api/chat.schema";
import type { QueryClientError } from "@/utils/query-client";
import type { UseMutationOptions } from "@tanstack/react-query";

export const getChatSystem = (): UseMutationOptions<
  ChatSystemResponse,
  QueryClientError,
  ChatSystemRequest
> => ({
  mutationKey: [getChatSystem.name],
  mutationFn: async ({ parentThreadId, structure }) => {
    const response = await chatApi.system.$post({
      json: {
        parentThreadId,
        structure,
      },
    });
    const json = await response.json();
    return json;
  },
});

export const getChatUser = (): UseMutationOptions<
  ChatUserResponse,
  QueryClientError,
  ChatUserRequest
> => ({
  mutationKey: [getChatUser.name],
  mutationFn: async ({ parentThreadId, structure }) => {
    const response = await chatApi.user.$post({
      json: {
        parentThreadId,
        structure,
      },
    });
    const json = await response.json();
    return json;
  },
});

export const getChatAssistant = (): UseMutationOptions<
  ChatAssistantResponse,
  QueryClientError,
  ChatAssistantRequest
> => ({
  mutationKey: [getChatAssistant.name],
  mutationFn: async ({ parentThreadId }) => {
    const response = await chatApi.assistant.$post({
      json: {
        parentThreadId,
      },
    });
    const json = await response.json();
    return json;
  },
});

export const getNameAssistant = (): UseMutationOptions<
  NameAssistantResponse,
  QueryClientError,
  NameAssistantRequest
> => ({
  mutationKey: [getNameAssistant.name],
  mutationFn: async ({ parentThreadId }) => {
    const response = await chatApi.name.$post({
      json: {
        parentThreadId,
      },
    });
    const json = await response.json();
    return json;
  },
});
