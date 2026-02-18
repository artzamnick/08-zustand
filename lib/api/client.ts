import axios, { AxiosError } from "axios";

const API_BASE = "https://notehub-public.goit.study/api";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

function getToken(): string {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  if (!token) {
    throw new Error("Missing NEXT_PUBLIC_NOTEHUB_TOKEN in env");
  }

  return token;
}

export function getAuthHeaders(): { Authorization: string } {
  return {
    Authorization: `Bearer ${getToken()}`,
  };
}

function toMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const axErr = err as AxiosError<{ message?: string }>;
    return axErr.response?.data?.message ?? axErr.message ?? "Request failed";
  }

  if (err instanceof Error) return err.message;
  return "Unknown error";
}

export function getHttpMessage(error: unknown): string {
  return toMessage(error);
}

export function toErrorMessage(error: unknown): string {
  return toMessage(error);
}
