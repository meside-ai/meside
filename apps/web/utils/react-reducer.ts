interface DevTools<Action> {
  init(state: unknown): void;
  send(action: Action, state: unknown): void;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
let devTools: DevTools<any> | null = null;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
let previousDevToolState: any | undefined = undefined;

if (typeof window !== "undefined") {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const extension = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
  if (extension) {
    devTools = extension.connect({});
  }
}

export const createLogReducer =
  (name: string) =>
  <T, Action>(reducer: (state: T, action: Action) => T) => {
    return (state: T, action: Action) => {
      const nextState = reducer(state, action);
      if (devTools) {
        const nextDevToolState = {
          ...previousDevToolState,
          [name]: nextState,
        };
        if (!previousDevToolState) {
          devTools.init(nextState);
        } else {
          devTools.send(action, nextState);
        }
        previousDevToolState = nextDevToolState;
      }
      return nextState;
    };
  };
