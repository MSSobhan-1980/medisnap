
import { useState, useEffect, useCallback } from "react";

export type ToastAction = {
  altText: string;
  onClick: () => void;
  label: string;
};

export type ToastProps = {
  title?: string;
  description?: string;
  action?: ToastAction;
  duration?: number;
  variant?: "default" | "destructive";
};

export const toast = {
  success: (title: string, props?: Omit<ToastProps, "title">) => {
    const event = new CustomEvent("toast", {
      detail: {
        ...props,
        title,
        variant: "default",
      },
    });
    document.dispatchEvent(event);
  },
  error: (title: string, props?: Omit<ToastProps, "title">) => {
    const event = new CustomEvent("toast", {
      detail: {
        ...props,
        title,
        variant: "destructive",
      },
    });
    document.dispatchEvent(event);
  },
  warning: (title: string, props?: Omit<ToastProps, "title">) => {
    const event = new CustomEvent("toast", {
      detail: {
        ...props,
        title,
        variant: "default",
      },
    });
    document.dispatchEvent(event);
  },
  info: (title: string, props?: Omit<ToastProps, "title">) => {
    const event = new CustomEvent("toast", {
      detail: {
        ...props,
        title,
        variant: "default",
      },
    });
    document.dispatchEvent(event);
  },
};

export interface UseToastOptions {
  duration?: number;
}

export type Toast = ToastProps & {
  id: string;
  dismiss: () => void;
};

export function useToast({ duration = 5000 }: UseToastOptions = {}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const { detail } = e as CustomEvent<ToastProps>;
      const id = Math.random().toString(36).substring(2, 9);
      
      setToasts((toasts) => [
        ...toasts,
        {
          ...detail,
          id,
          dismiss: () => dismiss(id),
        },
      ]);

      if (detail.duration || duration) {
        setTimeout(() => {
          dismiss(id);
        }, detail.duration || duration);
      }
    };

    document.addEventListener("toast", handleToast);
    return () => document.removeEventListener("toast", handleToast);
  }, [dismiss, duration]);

  return {
    toasts,
    dismiss,
    toast,
  };
}
