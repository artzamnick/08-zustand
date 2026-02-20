import React from "react";
import css from "./layout.module.css";

export default function NotesFilterLayout({
  children,
  sidebar,
}: Readonly<{
  children: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  return (
    <div className={css.container} style={{ minHeight: "100%" }}>
      <aside className={css.sidebar} style={{ alignSelf: "stretch" }}>
        {sidebar}
      </aside>

      <div className={css.notesWrapper}>{children}</div>
    </div>
  );
}