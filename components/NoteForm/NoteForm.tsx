"use client";

import { useEffect, useMemo } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import css from "./NoteForm.module.css";
import type { NoteTag } from "@/types/note";
import { useNoteStore } from "@/lib/store/noteStore";
import {
  createNoteAction,
  type CreateNoteActionState,
} from "@/app/notes/action/create/actions";

const TAGS: readonly NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;

const initialState: CreateNoteActionState = { ok: false };

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={css.submitButton}
      disabled={disabled || pending}
    >
      {pending ? "Creating..." : "Create note"}
    </button>
  );
}

export default function NoteForm() {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const [state, formAction] = useFormState(createNoteAction, initialState);

  useEffect(() => {
    if (state.ok) {
      clearDraft();
      router.back();
    }
  }, [state.ok, clearDraft, router]);

  const canSubmit = useMemo(() => {
    const title = draft.title.trim();
    if (title.length < 3 || title.length > 50) return false;
    if (draft.content.trim().length > 500) return false;
    return true;
  }, [draft.title, draft.content]);

  const handleTitle = (value: string) => setDraft({ title: value });
  const handleContent = (value: string) => setDraft({ content: value });

  const handleTag = (value: string) => {
    if ((TAGS as readonly string[]).includes(value)) {
      setDraft({ tag: value as NoteTag });
    }
  };

  return (
    <form className={css.form} action={formAction}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          className={css.input}
          type="text"
          value={draft.title}
          onChange={(e) => handleTitle(e.target.value)}
          required
          minLength={3}
          maxLength={50}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          className={css.textarea}
          rows={8}
          value={draft.content}
          onChange={(e) => handleContent(e.target.value)}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={(e) => handleTag(e.target.value)}
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <SubmitButton disabled={!canSubmit} />
      </div>

      {!state.ok && state.message && <p className={css.error}>{state.message}</p>}
    </form>
  );
}
