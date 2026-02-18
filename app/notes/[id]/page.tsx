import type { Metadata } from "next";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { getNoteById } from "@/lib/api";
import NoteDetails from "./NoteDetails.client";

type Props = {
  params: Promise<{ id: string }>;
};

const ogImage = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await getNoteById(id);

    const title = `${note.title} | NoteHub`;
    const description = note.content
      ? note.content.slice(0, 120)
      : `Note with tag ${note.tag}`;

    const url = `/notes/${id}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: "NoteHub",
          },
        ],
      },
    };
  } catch {
    const title = "Note not found | NoteHub";
    const description = "The requested note does not exist.";
    const url = `/notes/${id}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: "NoteHub",
          },
        ],
      },
    };
  }
}

export default async function NoteDetailsPage({ params }: Props) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => getNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetails id={id} />
    </HydrationBoundary>
  );
}
