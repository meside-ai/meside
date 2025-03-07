const customEventName = "thread-name-change";

export const threadNameEvent = {
  dispatch: (payload: { threadId: string }) => {
    const event = new CustomEvent(customEventName, { detail: payload });
    window.dispatchEvent(event);
  },
  listen: (callback: (payload: { threadId: string }) => void) => {
    const eventListener = (event: CustomEvent<{ threadId: string }>) => {
      callback(event.detail);
    };
    window.addEventListener(customEventName, eventListener as EventListener);
    return eventListener as EventListener;
  },
  removeListener: (callback: EventListener) => {
    window.removeEventListener(customEventName, callback);
  },
};
