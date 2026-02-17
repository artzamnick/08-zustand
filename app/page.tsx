import css from "./page.module.css";

export default function HomePage() {
  return (
    <div className={css.page}>
      <main className={css.main}>
        <div className={css.intro}>
          <h1>NoteHub</h1>
          <p>
            NoteHub is a simple and efficient application designed for managing
            personal notes.
          </p>
        </div>
      </main>
    </div>
  );
}
