
import * as React from "react";
import { ActionType, actionTypes } from "./constants";

export type ToastActionElement = React.ReactElement;

export type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: ToastActionElement;
  duration?: number;
  variant?: "default" | "destructive";
  dismiss: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type ToastState = {
  toasts: ToastProps[];
};

export interface State {
  toasts: ToastProps[];
}

export type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: Omit<ToastProps, "id" | "dismiss" | "open" | "onOpenChange">;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToastProps> & { id: string };
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    };

// Type for toast creation
export type Toast = Omit<ToastProps, "id" | "dismiss" | "open" | "onOpenChange">;
