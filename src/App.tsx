import type { Memo, EditorMemo, TagFilter } from "./types/memo";
import { useEffect, useRef, useState } from "react";
import MemoAlert from "./components/MemoAlert";
import { archiveAndDelete } from "./utils/trash";
import Header from "./components/Header";
import MemoList from "./components/MemoList";
import MemoDetail from "./components/MemoDetail";
import EmptyState from "./components/EmptyState";
import { getMemos, createMemo, updateMemo, deleteMemo } from "./api/memos";

export default function App({ onProfile, email }: { onProfile?: () => void; email: string }) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedTag, setSelectedTag] = useState<TagFilter>("all");
  const [selectedMemoId, setSelectedMemoId] = useState<number | null>(null);
  const selectedMemo = memos.find((memo) => memo.id === selectedMemoId);

  const visibleMemos = memos.filter((memo) => {
    const matchesTag = selectedTag === "all" || memo.tag === selectedTag;
    const matchesSearch = `${memo.title} ${memo.content}`
      .toLowerCase()
      .includes(searchText.trim().toLowerCase());
    return matchesTag && matchesSearch;
  });
  const pinnedMemos = visibleMemos.filter((memo) => memo.isPinned);
  const regularMemos = visibleMemos.filter((memo) => !memo.isPinned);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [deleted, setDeleted] = useState(false);
  const [creating, setCreating] = useState(false);
  const pendingPins = useRef(new Set<number>());
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getMemos().then((items) => { if (active) setMemos(items); })
      .catch((error) => { if (active) setError(error instanceof Error ? error.message : "요청에 실패했습니다."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reload]);

  async function togglePin(memoId: number) {
    if (pendingPins.current.has(memoId)) return;
    const memo = memos.find((item) => item.id === memoId);
    if (!memo) return;
    pendingPins.current.add(memoId);
    try { await saveMemo({ ...memo, isPinned: !memo.isPinned }); setError(""); }
    catch (error) { setError(error instanceof Error ? error.message : "요청에 실패했습니다."); }
    finally { pendingPins.current.delete(memoId); }
  }
  async function saveMemo(memo: Memo) {
    const saved = await updateMemo(memo);
    setMemos((items) => items.map((item) => item.id === saved.id ? saved : item));
  }
  async function addMemo(memo: EditorMemo) {
    const saved = await createMemo({ ...memo, tag: memo.tag || "others" });
    setMemos((items) => [saved, ...items]);
    setSearchText("");
    setSelectedTag("all");

  }
  async function removeMemo(id: number) {
    const memo = memos.find((item) => item.id === id);
    if (!memo) return;
    await archiveAndDelete(email, memo, () => deleteMemo(id));
    setMemos((items) => items.filter((memo) => memo.id !== id));
    setSelectedMemoId(null);
    setDeleted(true);
  }

  return (
    <div className="mx-auto w-[calc(100%-32px)] max-w-[1200px] pt-8 pb-[86px] md:w-5/6 md:pt-[72px]">
      <Header
        onProfile={onProfile}
        onAdd={() => setCreating(true)}
        loading={loading}
        searchText={searchText}
        onSearchChange={setSearchText}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
      />
      <main
        className={`flex flex-col gap-5 ${memos.length === 0 ? "mt-[76px]" : "mt-[52px]"}`}
      >
        {error && <div role="alert">{error} <button onClick={() => setReload((value) => value + 1)}>다시 불러오기</button></div>}
        {loading ? <p role="status">메모를 불러오는 중...</p> : visibleMemos.length === 0 ? (
          <EmptyState isEmpty={memos.length === 0} onAdd={() => setCreating(true)} />
        ) : (
          <>
            <MemoList
              title="고정된 메모"
              memos={pinnedMemos}
              onTogglePin={togglePin}
              onSelect={(memo) => setSelectedMemoId(memo.id)}
            />
            <MemoList
              title="일반 메모"
              memos={regularMemos}
              onTogglePin={togglePin}
              onSelect={(memo) => setSelectedMemoId(memo.id)}
            />
          </>
        )}
      </main>
      {deleted && <MemoAlert title="해당 메모가 삭제되었습니다" onConfirm={() => setDeleted(false)} />}
      {creating && <MemoDetail
        isNew
        memo={{ title: "", content: "", tag: "", date: new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()), isPinned: false }}
        onSave={addMemo}
        onClose={() => setCreating(false)}
      />}
      {selectedMemo && (
        <MemoDetail
          memo={selectedMemo}
          onSave={saveMemo}
          onDelete={removeMemo}
          onClose={() => setSelectedMemoId(null)}
        />
      )}
    </div>
  );
}
