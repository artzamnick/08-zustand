import type { Metadata } from "next";
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";

import type { FetchTagNote, NoteTag } from "@/types/note";
import { getNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

import css from "./page.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

function resolveTag(raw?: string): FetchTagNote {
  if (!raw || raw === "all") return "all";
  return ALLOWED.has(raw as NoteTag) ? (raw as NoteTag) : "all";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const raw = slug?.[0];
  const tag = resolveTag(raw);

  const filterLabel = tag === "all" ? "All notes" : tag;

  const title = `${filterLabel} | NoteHub`;
  const description = `Notes list filtered by: ${filterLabel}.`;

  const url = `/notes/filter/${tag}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
    },
  };
}

export default async function FilteredNotesPage({ params }: Props) {
  const { slug } = await params;
  const raw = slug?.[0];

  const tag = resolveTag(raw);

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
    <div className={css.container}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient key={tag} tag={tag} />
      </HydrationBoundary>
    </div>
  );
}