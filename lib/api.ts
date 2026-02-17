import axios, { AxiosError } from "axios";
import type { CreateNotePayload, FetchNotesParams, Note, NotesResponse } from "@/types/note";

const API_BASE = "https://notehub-public.goit.study/api";

const api = axios.create({
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

function getAuthHeaders(): { Authorization: string } {
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

export async function getNotes(
  params: FetchNotesParams = {}
): Promise<NotesResponse> {
  const page = params.page ?? 1;
  const perPage = params.perPage ?? 12;

  try {
    const response = await api.get<NotesResponse>("/notes", {
      params: {
        page,
        perPage,
        ...(params.search ? { search: params.search } : {}),
        ...(params.tag ? { tag: params.tag } : {}),
      },
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (err) {
    throw new Error(toMessage(err));
  }
}

export async function getNoteById(id: string): Promise<Note> {
  if (!id) throw new Error("Note id is required");

  try {
    const response = await api.get<Note>(`/notes/${id}`, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (err) {
    throw new Error(toMessage(err));
  }
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  try {
    const response = await api.post<Note>("/notes", payload, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (err) {
    throw new Error(toMessage(err));
  }
}

export async function deleteNoteById(id: string): Promise<Note> {
  if (!id) throw new Error("Note id is required");

  try {
    const response = await api.delete<Note>(`/notes/${id}`, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (err) {
    throw new Error(toMessage(err));
  }
}
