"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Note } from "@/types/note";
import { deleteNoteById } from "@/lib/api";

import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (noteId: string) => deleteNoteById(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <>
      {deleteMutation.isError && (
        <p>
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : "Could not delete the note."}
        </p>
      )}

      <ul className={css.list}>
        {notes.map((note) => (
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{note.title}</h2>

            <p className={css.content}>{note.content}</p>

            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>

              <Link href={`/notes/${note.id}`} className={css.link}>
                View details
              </Link>

              <button
                type="button"
                className={css.button}
                onClick={() => deleteMutation.mutate(note.id)}
                disabled={
                  deleteMutation.isPending &&
                  deleteMutation.variables === note.id
                }
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
