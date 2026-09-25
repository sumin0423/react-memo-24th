import { useState } from "react";
import { readTrash } from "../utils/trash";
import { tags } from "../data/tags";

export default function Trash({ email, onBack }: { email: string; onBack: () => void }) {
  const [result] = useState(() => {
    try { return { items: readTrash(email), error: "" }; }
    catch (error) { return { items: [], error: error instanceof Error ? error.message : "휴지통을 불러올 수 없습니다." }; }
  });
  return <main className="mx-auto w-[calc(100%-32px)] max-w-[1200px] py-8 text-accent md:w-5/6">
    <button type="button" onClick={onBack} aria-label="마이페이지로 돌아가기" className="flex size-11 items-center justify-center rounded-full text-4xl hover:bg-surface">‹</button>
    <h1 className="mt-8 text-3xl font-bold">휴지통</h1>
    <p className="mt-3 text-sm text-muted">삭제한 메모를 모아두는 곳이에요.</p>
    {result.error ? <p role="alert" className="mt-10">{result.error}</p> : result.items.length === 0 ? <p role="status" className="mt-12 py-12 text-center text-muted">삭제한 메모가 없습니다.</p> : <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {result.items.map((memo) => <li key={memo.id} className={`rounded-3xl p-6 ${(tags[memo.tag] || tags.others).cardClass}`}>
        <h2 className="break-words text-xl font-bold">{memo.title}</h2>
        <p className="mt-4 whitespace-pre-wrap break-words">{memo.content}</p>
        <p className="mt-6 text-sm">{(tags[memo.tag] || tags.others).label} · {memo.date}</p>
        <p className="mt-2 text-xs text-muted">삭제일: {new Date(memo.deletedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}</p>
      </li>)}
    </ul>}
  </main>;
}
