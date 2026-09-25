export default function EmptyState({ isEmpty, onAdd }: { isEmpty: boolean; onAdd?: () => void }) {
  return (
    <div
      role="status"
      className={`flex min-h-[500px] flex-col items-center justify-center rounded-[28px] border-2 border-dashed h-[calc(100vh-314px)] ${isEmpty ? "border-soft text-soft gap-7" : "border-accent text-accent gap-3"}`}
    >
      {isEmpty ? (
        <button type="button" onClick={onAdd} aria-label="첫 메모 작성" className="flex size-[120px] items-center justify-center rounded-full bg-soft transition-colors hover:bg-action focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight">
          <img src="/assets/icons/plus.svg" alt="" width="39" height="39" />
        </button>
      ) : (
        <span className="mb-3 flex size-24 items-center justify-center rounded-full bg-accent">
          <img src="/assets/icons/searchLight.svg" alt="" width="39" height="39" />
        </span>
      )}
      <p className={isEmpty ? "text-[22px] font-bold" : "text-sm"}>
        {isEmpty ? "새로운 메모를 작성해보세요!" : "검색 결과가 없습니다"}
      </p>
      {!isEmpty && (
        <p className="text-sm text-[#7a4352]">
          다른 검색어로 다시 시도해보세요
        </p>
      )}
    </div>
  );
}
