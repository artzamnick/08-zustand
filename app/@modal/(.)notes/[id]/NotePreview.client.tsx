"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Modal from "@/components/Modal/Modal";
import { getNoteById } from "@/lib/api";
import type { Note } from "@/types/note";

import css from "./NotePreview.module.css";

type Props = {
  id: string;
};

export default function NotePreviewClient({ id }: Props) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  const { data: note, isLoading, isError, error } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => getNoteById(id),
    enabled: Boolean(id),           // ❗ ключ до фіксу "Note id is required"
    refetchOnMount: false,
    throwOnError: true,
  });

  if (isLoading) return null;
  if (isError) throw (error as Error);
  if (!note) return null;

  return (
    <Modal onClose={handleClose}>
      <article className={css.wrapper}>
        <h2 className={css.title}>{note.title}</h2>

        {note.content && (
          <p className={css.content}>{note.content}</p>
        )}

        <span className={css.tag}>{note.tag}</span>

        <div className={css.actions}>
          <button
            className={css.closeBtn}
            type="button"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </article>
    </Modal>
  );
}
