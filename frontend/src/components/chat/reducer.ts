export type ChatState = {
  warehouseId: string | null;
};

export type ChatAction = { type: "SET_WAREHOUSE_ID"; payload: string | null };

export const chatInitialState: ChatState = {
  warehouseId: null,
};

export const chatReducer = (
  state: ChatState,
  action: ChatAction,
): ChatState => {
  switch (action.type) {
    case "SET_WAREHOUSE_ID":
      return {
        ...state,
        warehouseId: action.payload,
      };
  }
};
