import type { Memo } from "../api/memos";
export type DeletedMemo = Memo & { deletedAt: string };
function key(email: string) {
  if (!email.trim()) throw new Error("계정 정보를 확인할 수 없습니다. 다시 로그인해주세요.");
  return `memo-trash:${email.trim()}`;
}
export function readTrash(email: string): DeletedMemo[] {
  try {
    const items = JSON.parse(localStorage.getItem(key(email)) || "[]");
    if (!Array.isArray(items)) throw new Error();
    return items.filter((item) => typeof item?.id === "number" && typeof item.title === "string" && typeof item.content === "string" && typeof item.deletedAt === "string");
  } catch { throw new Error("이 브라우저의 휴지통을 읽을 수 없습니다."); }
}
export async function archiveAndDelete(email: string, memo: Memo, remove: () => Promise<void>) {
  const storageKey = key(email);
  const previous = readTrash(email);
  try {
    localStorage.setItem(storageKey, JSON.stringify([{ ...memo, deletedAt: new Date().toISOString() }, ...previous.filter((item) => item.id !== memo.id)]));
  } catch { throw new Error("휴지통에 보관할 공간이 없어 삭제하지 않았습니다."); }
  try { await remove(); }
  catch (error) {
    localStorage.setItem(storageKey, JSON.stringify(previous));
    throw error;
  }
}
