const customEventName = "question-name-change";

export const questionNameEvent = {
  dispatch: (payload: { userContent: string; assistantContent: string }) => {
    const event = new CustomEvent(customEventName, { detail: payload });
    window.dispatchEvent(event);
  },
  listen: (
    callback: (payload: {
      userContent: string;
      assistantContent: string;
    }) => void,
  ) => {
    const eventListener = (
      event: CustomEvent<{ userContent: string; assistantContent: string }>,
    ) => {
      callback(event.detail);
    };
    window.addEventListener(customEventName, eventListener as EventListener);
    return eventListener as EventListener;
  },
  removeListener: (callback: EventListener) => {
    window.removeEventListener(customEventName, callback);
  },
};
