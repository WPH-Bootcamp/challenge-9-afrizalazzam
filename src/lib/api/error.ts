import { isAxiosError } from "axios";
import type { ApiError } from "@/types/auth";

export function getErrorMessage(error: unknown): string {
  if (isAxiosError<ApiError>(error)) {
    return (
      error.response?.data?.errors?.[0] ??
      error.response?.data?.message ??
      "Terjadi kesalahan, silakan coba lagi"
    );
  }
  return "Terjadi kesalahan, silakan coba lagi";
}
