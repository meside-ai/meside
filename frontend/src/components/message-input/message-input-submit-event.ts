const customEventName = "editor-submit";

export const messageInputSubmitEvent = {
  dispatch: () => {
    const event = new CustomEvent(customEventName);
    window.dispatchEvent(event);
  },
  listen: (callback: () => void) => {
    window.addEventListener(customEventName, callback);
    return callback;
  },
  removeListener: (callback: () => void) => {
    window.removeEventListener(customEventName, callback);
  },
};
