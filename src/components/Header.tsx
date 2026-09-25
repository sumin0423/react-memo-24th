import type { SearchBarProps } from "./SearchBar";
import SearchBar from "./SearchBar";

export default function Header(props: SearchBarProps & { loading: boolean; onAdd: () => void; onProfile?: () => void }) {
  return (
    <header className="flex flex-wrap items-center gap-3 sm:flex-nowrap sm:gap-6">
      <h1 className="sr-only">React Memo</h1>
      <SearchBar {...props} />
      <button
        disabled={props.loading}
        onClick={props.onAdd}
        aria-label="새 메모"
        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-surface sm:size-20"
      >
        <img src="/assets/icons/plus.svg" alt="" width="28" height="28" />
      </button>
      <button
        onClick={props.onProfile}
        aria-label="마이페이지"
        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-surface sm:size-20"
      >
        <img src="/assets/icons/user.svg" alt="" width="32" height="32" />
      </button>
    </header>
  );
}
