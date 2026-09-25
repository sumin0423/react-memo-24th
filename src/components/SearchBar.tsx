import type { Tag, TagFilter } from "../types/memo";
export type SearchBarProps = { searchText: string; onSearchChange: (value: string) => void; selectedTag: TagFilter; onTagChange: (value: TagFilter) => void };
import { tags } from "../data/tags";

export default function SearchBar({
  searchText,
  onSearchChange,
  selectedTag,
  onTagChange,
}: SearchBarProps) {
  return (
    <form
      role="search"
      onSubmit={(event) => event.preventDefault()}
      className="flex h-20 min-w-0 basis-full sm:flex-1 sm:basis-auto items-center gap-3 rounded-[28px] bg-surface p-4 transition-shadow focus-within:ring-2 focus-within:ring-soft"
    >
      <div className="relative shrink-0">
        <label htmlFor="tag" className="sr-only">
          태그 선택
        </label>
        <select
          id="tag"
          value={selectedTag}
          onChange={(event) => onTagChange(event.target.value as TagFilter)}
          className={`h-9 w-[116px] appearance-none rounded-full bg-page text-sm font-bold ${selectedTag === "all" ? "pl-4 pr-9" : `pl-11 pr-2 ${tags[selectedTag].textClass}`}`}
        >
          <option value="all">태그 선택</option>
          {(Object.keys(tags) as Tag[]).map((tag) => (
            <option key={tag} value={tag}>
              {tags[tag].label}
            </option>
          ))}
        </select>
        <img
          alt=""
          src={`/assets/icons/${selectedTag === "all" ? "play" : selectedTag}.svg`}
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${selectedTag === "all" ? "right-4 h-4 w-[13px]" : "left-3 size-5"}`}
        />
      </div>
      <label htmlFor="search" className="sr-only">
        메모 검색
      </label>
      <input
        id="search"
        type="search"
        value={searchText}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="원하는 메모를 검색하세요"
        className="h-full min-w-0 flex-1 border-0 bg-transparent px-1 text-sm text-accent placeholder:text-muted focus:outline-none focus-visible:outline-none"
      />
      <button
        type="submit"
        aria-label="검색"
        className="flex size-12 shrink-0 items-center justify-center"
      >
        <img src="/assets/icons/search.svg" alt="" className="size-[39px]" />
      </button>
    </form>
  );
}
