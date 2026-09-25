import type { EditorMemo } from "../types/memo";
import { useEffect, useRef, useState } from "react";
import MemoAlert from "./MemoAlert";
import MemoEditor from "./MemoEditor";
import { tags } from "../data/tags";

export default function MemoDetail<T extends EditorMemo>({ memo, onClose, onSave, onDelete, isNew = false }: { memo: T; onClose: () => void; onSave: (memo: T) => Promise<void>; onDelete?: (id: number) => Promise<void>; isNew?: boolean }) {
  const [isEditing, setIsEditing] = useState(isNew);
  const [exitReason, setExitReason] = useState<"back" | "cancel" | null>(null);
  const [completed, setCompleted] = useState(false);
  function leaveEditor() {
    setExitReason(null);
    setError("");
    if (isNew) onClose(); else setIsEditing(false);
  }
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const requestPending = useRef(false);
  async function runAction(action: () => Promise<void>) {
    if (requestPending.current) return;
    requestPending.current = true;
    setBusy(true);
    setError("");
    try { await action(); }
    catch (error) { setError(error instanceof Error ? error.message : "요청에 실패했습니다."); }
    finally { requestPending.current = false; setBusy(false); }
  }
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClick={(event) => {
        if (event.target !== event.currentTarget || isEditing || busy || confirmDelete) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) { if (isEditing) setExitReason("back"); else onClose(); }
      }}
      aria-labelledby="detail-title"
      className={isEditing ? "fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto bg-surface p-6 text-accent sm:px-16 sm:py-12" : `fixed m-auto max-h-[calc(100vh-48px)] w-[560px] max-w-[calc(100vw-32px)] overflow-y-auto rounded-3xl p-6 text-accent shadow-md backdrop:bg-accent/25 sm:px-11 sm:py-10 ${tags[memo.tag || "others"].cardClass}`}
    >
      {isEditing ? <>
        <h2 id="detail-title" className="sr-only">{isNew ? "새 메모" : "메모 수정"}</h2>
        <button disabled={busy} aria-label="뒤로" onClick={() => setExitReason("back")} className="mb-6 flex size-10 items-center justify-center text-4xl">‹</button>
        <MemoEditor memo={memo} isNew={isNew} busy={busy || completed} error={error}
          onSave={(updatedMemo) => runAction(async () => { await onSave(updatedMemo); if (isNew) setCompleted(true); else setIsEditing(false); })}
          onCancel={() => setExitReason("cancel")} />
        {exitReason && <MemoAlert
          title={exitReason === "back" ? "이전으로 돌아가시겠습니까?" : "메모 작성을 그만두시겠습니까?"}
          description="작성 중이던 변경 사항은 저장되지 않습니다."
          cancelLabel="계속 작성하기"
          confirmLabel={exitReason === "back" ? "돌아가기" : "작성 취소하기"}
          onCancel={() => setExitReason(null)} onConfirm={leaveEditor} />}
        {completed && <MemoAlert title="작성이 완료되었습니다" description="메인 화면에서 작성한 메모를 확인할 수 있어요." onConfirm={onClose} />}
      </> : <article className="flex min-h-[480px] flex-col">
        <header className="flex items-center justify-between gap-5">
          <h2
            id="detail-title"
            className="min-w-0 text-2xl sm:text-3xl font-bold break-words"
          >
            {isNew ? "새 메모" : isEditing ? "메모 수정" : memo.title}
          </h2>
          <button
            autoFocus
            disabled={busy}
            onClick={onClose}
            aria-label="닫기"
            className="flex size-9 shrink-0 items-center justify-center"
          >
            <img src="/assets/icons/close.svg" alt="" width="32" height="32" />
          </button>
        </header>
        <div className="mt-7 mb-8 flex flex-wrap items-center gap-3 sm:gap-6 text-base sm:text-lg font-bold">
          <span
            className={`flex items-center gap-4 rounded-full bg-page py-1 pr-5 pl-3 ${tags[memo.tag || "others"].textClass}`}
          >
            <img
              src={`/assets/icons/${memo.tag}.svg`}
              alt=""
              className="size-5"
            />
            {tags[memo.tag || "others"].label}
          </span>
          <time
            dateTime={memo.date}
            className="flex min-h-[52px] items-center border-l-[3px] border-accent/20 pl-3 sm:pl-6"
          >
            {memo.date.replaceAll("-", ".")}
          </time>
        </div>
        <>
            <p className="whitespace-pre-wrap text-lg leading-relaxed break-words">
              {memo.content}
            </p>
            {error && <p role="alert" className="mt-4">{error}</p>}
            {confirmDelete && <MemoAlert title="메모를 삭제하시겠습니까?" description="삭제한 메모는 이 브라우저의 휴지통에 보관됩니다." confirmLabel="삭제" busy={busy} error={error} onCancel={() => { setConfirmDelete(false); setError(""); }} onConfirm={() => runAction(() => onDelete && memo.id !== undefined ? onDelete(memo.id) : Promise.resolve())} />}
            <footer className="mt-auto flex justify-end gap-4 pt-8">
              <button disabled={busy || confirmDelete} onClick={() => setIsEditing(true)} aria-label="메모 수정">
                <img
                  src="/assets/icons/edit.svg"
                  alt=""
                  width="27"
                  height="27"
                />
              </button>
              <button disabled={busy} onClick={() => setConfirmDelete(true)} aria-label="메모 삭제">
                <img
                  src="/assets/icons/trash.svg"
                  alt=""
                  width="24"
                  height="24"
                />
              </button>
            </footer>
          </>
      </article>}
    </dialog>
  );
}
