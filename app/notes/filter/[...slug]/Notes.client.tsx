"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";

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
  const queryClient = useQueryClient();

  const tagKey = tag ?? "all";
  const apiTag = normalizeTag(tag);

  const [page, setPage] = useState(1);
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

  const queryKey = useMemo(
    () => ["notes", tagKey, page, PER_PAGE, normalizedSearch] as const,
    [tagKey, page, normalizedSearch]
  );

  const { data, isLoading, isError, error } = useQuery<NotesResponse>({
    queryKey,
    queryFn: () =>
      getNotes({
        page,
        perPage: PER_PAGE,
        search: normalizedSearch,
        tag: apiTag,
      }),
    placeholderData: (prev) => prev,
    refetchOnMount: false,
    staleTime: 0,
  });

  useEffect(() => {
    const key = "notehub:notes:refresh";

    let value: string | null = null;
    try {
      value = localStorage.getItem(key);
    } catch {
      value = null;
    }

    if (!value) return;

    try {
      localStorage.removeItem(key);
    } catch {}

    queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
  }, [queryClient]);

  if (isLoading) return null;

  if (isError) {
    return (
      <p style={{ padding: 16 }}>
        Could not fetch notes.{" "}
        {error instanceof Error ? error.message : "Unknown error."}
      </p>
    );
  }

  if (!data) return null;

  return (
    <div>
      <div className={css.toolbar}>
        <div className={css.search}>
          <SearchBox value={inputValue} onChange={setInputValue} />
        </div>

        <div className={css.pagination}>
          {data.totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={data.totalPages}
              setPage={setPage}
            />
          )}
        </div>

        <div className={css.create}>
          <Link href="/notes/action/create" className={css.createLink}>
            Create note +
          </Link>
        </div>
      </div>

      <NoteList notes={data.notes} />
    </div>
  );
}