import type {
  CreateNotePayload,
  FetchNotesParams,
  Note,
  NotesResponse,
} from "@/types/note";
import { api, getAuthHeaders, toErrorMessage } from "./client";

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
    throw new Error(toErrorMessage(err));
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
    throw new Error(toErrorMessage(err));
  }
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  try {
    const response = await api.post<Note>("/notes", payload, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (err) {
    throw new Error(toErrorMessage(err));
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
    throw new Error(toErrorMessage(err));
  }
}
