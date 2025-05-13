
import { actionTypes } from "./constants";
import { reducer } from "./reducer";
import { Action, State, Toast } from "./types";
import { genId } from "./utils";

const listeners: Array<(state: State) => void> = [];
export const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

export let memoryState: State = { toasts: [] };

export function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

export function subscribe(listener: (state: State) => void) {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

export function createToast(props: Toast) {
  const id = genId();

  const update = (props: Toast) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    });

  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}
