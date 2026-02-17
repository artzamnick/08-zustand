import type { Metadata } from "next";
import css from "./page.module.css";

export const metadata: Metadata = {
  title: "404 | NoteHub",
  description: "The page you are looking for does not exist in the NoteHub application.",
  openGraph: {
    title: "404 | NoteHub",
    description: "The page you are looking for does not exist in the NoteHub application.",
    url: "https://notehub.vercel.app/not-found",
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

export default function NotFound() {
  return (
    <div className={css.notfound}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}
