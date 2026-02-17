import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";

import type { FetchTagNote, NoteTag } from "@/types/note";
import { getNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

import css from "./page.module.css";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

const PER_PAGE = 12;

const ALLOWED = new Set<NoteTag>([
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
]);

export default async function FilteredNotesPage({ params }: Props) {
  const { slug } = await params;
  const raw = slug?.[0];

  const tag: FetchTagNote = !raw
    ? "all"
    : raw === "all"
    ? "all"
    : ALLOWED.has(raw as NoteTag)
    ? (raw as NoteTag)
    : "all";

  const tagKey = tag;
  const page = 1;
  const search = "";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", tagKey, page, PER_PAGE, search],
    queryFn: () =>
      getNotes({
        page,
        perPage: PER_PAGE,
        search,
        tag: tag === "all" ? undefined : (tag as NoteTag),
      }),
  });

  return (
    <main className={css.container}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient tag={tag} />
      </HydrationBoundary>
    </main>
  );
}
