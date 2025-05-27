// utils/toast.ts
"use client";

import { toast, ToastOptions } from "react-toastify";

type ToastSeverity = "success" | "error" | "warning";

export const showToast = (
  message: string,
  severity: ToastSeverity = "success",
  options?: ToastOptions
) => {
  const config: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options,
  };

  switch (severity) {
    case "success":
      toast.success(message, config);
      break;
    case "error":
      toast.error(message, config);
      break;
    case "warning":
      toast.warn(message, config);
      break;
    default:
      toast(message, config);
  }
};
