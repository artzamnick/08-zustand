"use server";

import { createNote } from "@/lib/api";
import type { NoteTag } from "@/types/note";

export type CreateNoteActionState = {
  ok: boolean;
  message?: string;
};

const TAGS: readonly NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;

function isValidTag(value: string): value is NoteTag {
  return (TAGS as readonly string[]).includes(value);
}

export async function createNoteAction(
  _prev: CreateNoteActionState,
  formData: FormData
): Promise<CreateNoteActionState> {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const rawTag = String(formData.get("tag") ?? "Todo");

  if (title.length < 3 || title.length > 50) {
    return { ok: false, message: "Title must be 3–50 characters." };
  }

  if (content.length > 500) {
    return { ok: false, message: "Content must be up to 500 characters." };
  }

  if (!isValidTag(rawTag)) {
    return { ok: false, message: "Invalid tag." };
  }

  try {
    await createNote({ title, content, tag: rawTag });
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Failed to create note.",
    };
  }
}
