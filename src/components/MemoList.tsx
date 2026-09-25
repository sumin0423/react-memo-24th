import type { Memo } from "../types/memo";
import MemoItem from "./MemoItem";

export default function MemoList({ title, memos, onTogglePin, onSelect }: { title: string; memos: Memo[]; onTogglePin: (id: number) => void; onSelect: (memo: Memo) => void }) {
  if (memos.length === 0) return null;
  return (
    <section aria-label={title}>
      <h2 className="sr-only">{title}</h2>
      <ul className="flex flex-wrap gap-5">
        {memos.map((memo) => (
          <MemoItem
            key={memo.id}
            memo={memo}
            onTogglePin={onTogglePin}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </section>
  );
}
