
import { useState, useEffect } from "react";
import { memoryState, subscribe } from "./store";
import { toast } from "./toast";
import { ToastState } from "./types";

export function useToast(): ToastState & {
  toast: typeof toast;
  dismiss: (toastId?: string) => void;
} {
  const [state, setState] = useState<ToastState>(memoryState);

  useEffect(() => {
    const unsubscribe = subscribe(setState);
    return unsubscribe;
  }, []);

  return {
    ...state,
    toast,
    dismiss: toast.dismiss,
  };
}

export { toast };
