import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UAParser } from "ua-parser-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateSlug = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-")
    .trim();
};

export const getDeviceInfo = async () => {
  const parser = new UAParser();
  const result = parser.getResult();

  const device = result.device?.model || "Unknown";
  const browser = result.browser?.name || "Unknown";
  const os = result.os?.name || "Unknown";

  return {
    location: "",
    device,
    browser,
    os,
  };
};
