"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { getNoteById } from "@/lib/api";
import type { Note } from "@/types/note";

import css from "./NoteDetails.module.css";

interface Props {
  id: string;
}

export default function NoteDetails({ id }: Props) {
  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => getNoteById(id),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className={css.container}>
        <p>Loading, please wait...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={css.container}>
        <p>
          {error instanceof Error ? error.message : "Could not load the note."}
        </p>
        <Link href="/notes/filter/all">Back to Notes</Link>
      </div>
    );
  }

  if (!note) {
    return (
      <div className={css.container}>
        <p>Note not found.</p>
        <Link href="/notes/filter/all">Back to Notes</Link>
      </div>
    );
  }

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <Link href="/notes/filter/all">Back to Notes</Link>
        </div>

        <span className={css.tag}>{note.tag}</span>

        {note.content ? (
          <p className={css.content}>{note.content}</p>
        ) : (
          <p className={css.content} style={{ opacity: 0.7 }}>
            No content
          </p>
        )}

        <p className={css.date}>{note.updatedAt ?? note.createdAt}</p>
      </div>
    </div>
  );
}
