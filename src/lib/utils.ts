import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getErrorMessage(
  error: unknown,
  defaultMessage = "Something went wrong. Please try again.",
): string {
  if (!error) return defaultMessage;

  // RTK Query / fetchBaseQuery error shape
  if (typeof error === "object" && error !== null) {
    const err = error as any;

    // Handle array of messages (NestJS validation errors)
    if (Array.isArray(err?.data?.message) && err.data.message.length > 0) {
      return err.data.message[0]; // Return first error message
      // OR join all messages:
      // return err.data.message.join(", ");
    }

    // Handle single message string
    if (typeof err?.data?.message === "string") {
      return err.data.message;
    }

    // Handle direct message
    if (typeof err?.message === "string") {
      return err.message;
    }

    // Handle error string
    if (typeof err?.error === "string") {
      return err.error;
    }

    // Handle status text
    if (
      typeof err?.status === "number" &&
      typeof err?.statusText === "string"
    ) {
      return `${err.status}: ${err.statusText}`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
}