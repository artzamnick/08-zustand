"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import css from "./NoteForm.module.css";
import type { NoteTag } from "@/types/note";
import { useNoteStore } from "@/lib/store/noteStore";
import { createNoteAction, type CreateNoteActionState } from "@/app/notes/action/create/page";

const TAGS: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

const initialState: CreateNoteActionState = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={css.submitButton} disabled={pending}>
      {pending ? "Creating..." : "Create note"}
    </button>
  );
}

export default function NoteForm() {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const [state, formAction] = useFormState(createNoteAction, initialState);
  const [clientError, setClientError] = useState<string | null>(null);

  useEffect(() => {
    if (state.ok) {
      clearDraft();
      router.back();
    }
  }, [state.ok, clearDraft, router]);

  const onCancel = () => {
    router.back();
  };

  const canSubmit = useMemo(() => {
    const title = draft.title.trim();
    if (title.length < 3 || title.length > 50) return false;
    if (draft.content.trim().length > 500) return false;
    return true;
  }, [draft.title, draft.content]);

  return (
    <form
      className={css.form}
      action={async (fd) => {
        setClientError(null);

        if (!canSubmit) {
          setClientError("Please fix the form fields before submitting.");
          return;
        }

        await formAction(fd);
      }}
      onChange={(e) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        const { name, value } = target;

        if (name === "title" || name === "content" || name === "tag") {
          setDraft({ [name]: value } as any);
        }
      }}
    >
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          className={css.input}
          type="text"
          value={draft.title}
          onChange={(e) => setDraft({ title: e.target.value })}
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
          onChange={(e) => setDraft({ content: e.target.value })}
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
          onChange={(e) => setDraft({ tag: e.target.value as NoteTag })}
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onCancel}>
          Cancel
        </button>

        <SubmitButton />
      </div>

      {(clientError || (!state.ok && state.message)) && (
        <p className={css.error}>{clientError ?? state.message}</p>
      )}
    </form>
  );
}
