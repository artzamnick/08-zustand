import type { ReactNode } from "react";
import css from "./layout.module.css";

type Props = {
  children: ReactNode;
  sidebar: ReactNode;
};

export default function Layout({ children, sidebar }: Props) {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <div className={css.notesWrapper}>{children}</div>
    </div>
  );
}
