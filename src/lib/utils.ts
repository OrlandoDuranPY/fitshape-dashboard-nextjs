import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ========================================
   = Dates =
========================================= */

/**
 * Formats a date string or Date object to DD/MM/YYYY
 * Example: "2026-04-15T20:31:48.000000Z" → "15/04/2026"
 */
export function formatDate(value: string | Date): string {
  const date = new Date(value);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formats a date string or Date object to DD/MM/YYYY HH:MM am/pm
 * Example: "2026-04-15T20:31:48.000000Z" → "15/04/2026 08:31 pm"
 */
export function formatDateTime(value: string | Date): string {
  const date = new Date(value);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  const hours24 = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const ampm = hours24 >= 12 ? "pm" : "am";
  const hours12 = String(hours24 % 12 || 12).padStart(2, "0");
  return `${day}/${month}/${year} ${hours12}:${minutes} ${ampm}`;
}
