import type { FormEvent } from "react";
import type { EditorMemo, Tag } from "../types/memo";
import { useRef, useState } from "react";
import MemoAlert from "./MemoAlert";
import { tags } from "../data/tags";

export default function MemoEditor<T extends EditorMemo>({ memo, onSave, onCancel, busy, error, isNew }: { memo: T; onSave: (memo: T) => void; onCancel: () => void; busy: boolean; error: string; isNew: boolean }) {
  const [title, setTitle] = useState(memo.title);
  const [content, setContent] = useState(memo.content);
  const [tag, setTag] = useState(memo.tag);
  const [date, setDate] = useState(memo.date);
  const [tagAlert, setTagAlert] = useState(false);
  const tagRef = useRef<HTMLSelectElement>(null);
  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !content.trim() || !date || busy) return;
    if (!tag) { setTagAlert(true); return; }
    onSave({ ...memo, title: title.trim(), content: content.trim(), tag, date });
  }
  return <form onSubmit={handleSave} className="mx-auto w-full max-w-[750px]">
    <section className={`flex min-h-[560px] flex-col rounded-[30px] p-6 text-accent shadow-md sm:min-h-[640px] sm:p-12 ${tag ? tags[tag].cardClass : "bg-page"}`}>
      <label className="sr-only" htmlFor="memo-title">제목</label>
      <input id="memo-title" autoFocus required maxLength={50} disabled={busy} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="제목을 입력하세요..." className="w-full bg-transparent text-3xl font-bold placeholder:text-accent/40 sm:text-4xl" />
      <div className="my-8 flex flex-wrap items-center gap-5 sm:my-10">
        <label className="flex items-center gap-3 rounded-full bg-page px-4 py-2 font-bold">
          <span className="sr-only">태그</span>
          {tag && <img src={`/assets/icons/${tag}.svg`} width="20" height="20" alt="" />}
          <select ref={tagRef} disabled={busy} value={tag} onChange={(event) => setTag(event.target.value as Tag)} className="bg-transparent"><option value="" disabled>태그 선택</option><option value="daily">Daily</option><option value="work">Work</option><option value="others">Others</option></select>
        </label>
        <label className="border-l-[3px] border-accent/25 py-3 pl-5 font-bold"><span className="sr-only">날짜</span><input required disabled={busy} type="date" value={date} onChange={(event) => setDate(event.target.value)} className="min-w-0 bg-transparent" /></label>
      </div>
      <label className="sr-only" htmlFor="memo-content">내용</label>
      <textarea required id="memo-content" maxLength={1000} disabled={busy} value={content} onChange={(event) => setContent(event.target.value)} placeholder="본문을 입력하세요..." className="min-h-[300px] w-full flex-1 resize-none bg-transparent text-lg leading-relaxed placeholder:text-accent/40" />
    </section>
    {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
    <div className="mt-8 flex gap-4">
      <button type="button" disabled={busy} onClick={onCancel} className="h-14 flex-1 rounded-2xl bg-gray-200 text-lg font-bold text-muted">작성 취소</button>
      <button type="submit" disabled={!title.trim() || !content.trim() || !date || busy} className="h-14 flex-1 rounded-2xl bg-action text-lg font-bold text-accent disabled:opacity-45">{busy ? "저장 중..." : isNew ? "작성 완료" : "수정 완료"}</button>
    </div>
    {tagAlert && <MemoAlert title="태그를 선택해주세요" onConfirm={() => { setTagAlert(false); requestAnimationFrame(() => tagRef.current?.focus()); }} />}
  </form>;
}
