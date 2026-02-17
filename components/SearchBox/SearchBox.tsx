import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="search"
      name="search"
      value={value}
      placeholder="Search notes"
      autoComplete="off"
      aria-label="Search notes"
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
