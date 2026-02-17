"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

import { getNotes } from "@/lib/api";
import type { FetchTagNote, NoteTag, NotesResponse } from "@/types/note";

import css from "./page.module.css";

type Props = {
  tag?: FetchTagNote;
};

const PER_PAGE = 12;

function normalizeTag(tag?: FetchTagNote): NoteTag | undefined {
  if (!tag || tag === "all") return undefined;
  return tag;
}

export default function NotesClient({ tag }: Props) {
  const tagKey = tag ?? "all";
  const apiTag = normalizeTag(tag);

  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(inputValue);
      setPage(1);
    }, 350);

    return () => clearTimeout(t);
  }, [inputValue]);

  const normalizedSearch = search.trim();

  const { data, isLoading, isError, error } = useQuery<NotesResponse>({
    queryKey: ["notes", tagKey, page, 12, normalizedSearch],
    queryFn: () =>
      getNotes({
        page,
        perPage: PER_PAGE,
        search: normalizedSearch,
        tag: apiTag,
      }),
    placeholderData: (prev: NotesResponse | undefined) => prev,
  });

  if (isLoading) return null;
  if (isError) throw (error as Error);
  if (!data) return null;

  return (
    <div key={tagKey}>
      <div className={css.toolbar}>
        <div className={css.search}>
          <SearchBox value={inputValue} onChange={setInputValue} />
        </div>

        <div className={css.pagination}>
          {data.totalPages > 1 && (
            <Pagination page={page} totalPages={data.totalPages} setPage={setPage} />
          )}
        </div>

        <div className={css.create}>
          <button type="button" onClick={() => setIsModalOpen(true)}>
            Add note
          </button>
        </div>
      </div>

      <NoteList notes={data.notes} />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onSuccess={() => {
              setIsModalOpen(false);
              setPage(1);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
