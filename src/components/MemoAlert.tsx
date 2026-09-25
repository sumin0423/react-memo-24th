import { useEffect, useRef } from "react";

export default function MemoAlert({ title, description, onConfirm, onCancel, busy, error, cancelLabel = "취소", confirmLabel = "확인" }: { title: string; description?: string; onConfirm: () => void; onCancel?: () => void; busy?: boolean; error?: string; cancelLabel?: string; confirmLabel?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => { dialog.close(); document.body.style.overflow = overflow; };
  }, []);
  return <dialog ref={ref} aria-label={title} onCancel={(event) => { event.preventDefault(); if (!busy) (onCancel || onConfirm)(); }} className="fixed m-auto w-[480px] max-w-[calc(100vw-32px)] rounded-3xl bg-surface px-8 pt-12 pb-6 text-center text-accent shadow-xl backdrop:bg-accent/45">
    <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
    {description && <p className="mt-6 text-sm text-muted">{description}</p>}
    {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
    <div className="mt-10 flex gap-3">
      {onCancel && <button type="button" autoFocus disabled={busy} onClick={onCancel} className="h-14 flex-1 rounded-xl bg-gray-200 font-bold text-muted disabled:opacity-50">{cancelLabel}</button>}
      <button type="button" disabled={busy} onClick={onConfirm} className="h-14 flex-1 rounded-xl bg-action font-bold disabled:opacity-50">{busy ? "삭제 중..." : confirmLabel}</button>
    </div>
  </dialog>;
}
