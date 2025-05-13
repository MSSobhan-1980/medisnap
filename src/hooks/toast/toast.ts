
import { actionTypes } from "./constants";
import { createToast, dispatch } from "./store";
import { Toast, ToastProps } from "./types";

function toast(props: Toast) {
  return createToast(props);
}

toast.dismiss = (toastId?: string) => {
  dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
};

toast.success = (title: string, props?: Omit<ToastProps, "title" | "id" | "dismiss">) => {
  return toast({ ...props, title, variant: "default" });
};

toast.error = (title: string, props?: Omit<ToastProps, "title" | "id" | "dismiss">) => {
  return toast({ ...props, title, variant: "destructive" });
};

toast.warning = (title: string, props?: Omit<ToastProps, "title" | "id" | "dismiss">) => {
  return toast({ ...props, title, variant: "default" });
};

toast.info = (title: string, props?: Omit<ToastProps, "title" | "id" | "dismiss">) => {
  return toast({ ...props, title, variant: "default" });
};

export { toast };
