import { Route } from "@/routes/chat";
import { createLogReducer } from "@/utils/react-reducer";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useReducer } from "react";
import { ChatContext } from "./context";
import { chatReducer } from "./reducer";
import { chatInitialState } from "./reducer";

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(
    createLogReducer("chat")(chatReducer),
    chatInitialState
  );
  const { warehouseId } = state;

  const setWarehouseId = useCallback((warehouseId: string | null) => {
    dispatch({ type: "SET_WAREHOUSE_ID", payload: warehouseId });
  }, []);

  const { thread } = Route.useSearch();

  const navigate = useNavigate({ from: Route.fullPath });

  const setThreadId = useCallback(
    (threadId: string | null) => {
      navigate({
        search: (prev) =>
          prev.thread !== threadId ? { thread: threadId ?? undefined } : prev,
      });
    },
    [navigate]
  );

  return (
    <ChatContext.Provider
      value={{
        warehouseId,
        setWarehouseId,
        threadId: thread ?? null,
        setThreadId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
