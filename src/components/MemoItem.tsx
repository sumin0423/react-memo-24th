import type { Memo } from "../types/memo";
import { tags } from "../data/tags";

export default function MemoItem({ memo, onTogglePin, onSelect }: { memo: Memo; onTogglePin: (id: number) => void; onSelect: (memo: Memo) => void }) {
  return (
    <li
      className={`relative aspect-square min-h-[240px] w-full rounded-[20px] p-5 text-accent sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-60px)/4)] ${tags[memo.tag].cardClass}`}
    >
      <article className="flex h-full flex-col gap-3">
        <button
          onClick={() => onSelect(memo)}
          aria-label={`${memo.title} 상세 보기`}
          className="absolute inset-0 rounded-[20px]"
        />
        <header className="pointer-events-none flex shrink-0 items-center justify-between gap-2">
          <h3 className="truncate text-xl font-bold">{memo.title}</h3>
          <button
            onClick={() => onTogglePin(memo.id)}
            aria-label={`${memo.title} ${memo.isPinned ? "고정 해제" : "고정"}`}
            aria-pressed={memo.isPinned}
            className="pointer-events-auto relative flex size-8 shrink-0 items-center justify-center"
          >
            <img
              src={`/assets/icons/${memo.isPinned ? "starPinned" : "star"}.svg`}
              alt=""
              width="23"
              height="22"
            />
          </button>
        </header>
        <div className="pointer-events-none min-h-0 flex-1"><p className="line-clamp-4 whitespace-pre-wrap text-sm leading-[1.4] break-words">
          {memo.content}
        </p></div>
        <footer className="pointer-events-none flex shrink-0 justify-between gap-2 text-sm">
          <span>{tags[memo.tag].label}</span>
          <time dateTime={memo.date}>{memo.date.replaceAll("-", ".")}</time>
        </footer>
      </article>
    </li>
  );
}
