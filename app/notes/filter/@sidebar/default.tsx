import Link from "next/link";
import css from "./default.module.css";

type MenuItem = {
  label: string;
  href: string;
};

const MENU: MenuItem[] = [
  { label: "All notes", href: "/notes/filter/all" },
  { label: "Todo", href: "/notes/filter/Todo" },
  { label: "Work", href: "/notes/filter/Work" },
  { label: "Personal", href: "/notes/filter/Personal" },
  { label: "Meeting", href: "/notes/filter/Meeting" },
  { label: "Shopping", href: "/notes/filter/Shopping" },
];

export default function Sidebar() {
  return (
    <nav aria-label="Notes filters">
      <ul className={css.menuList}>
        {MENU.map((item) => (
          <li key={item.href} className={css.menuItem}>
            <Link href={item.href} className={css.menuLink}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
