import { useAuthStore } from "../stores/auth";

import type { Memo, MemoDraft } from "../types/memo";
export type { Memo, MemoDraft } from "../types/memo";
type ServerMemo = Omit<Memo, "tag"> & { category: "DAILY" | "WORK" | "OTHER" };
const categories = { daily: "DAILY", work: "WORK", others: "OTHER" } as const;
const tags = { DAILY: "daily", WORK: "work", OTHER: "others" } as const;
function fromServer(memo: ServerMemo): Memo {
  return { ...memo, content: memo.content ?? "", tag: tags[memo.category] ?? "others" };
}
async function request<T>(path: string, method = "GET", draft?: MemoDraft): Promise<T> {
  const token = useAuthStore.getState().accessToken;
  let response: Response;
  try {
    response = await fetch(`https://3-37-186-61.nip.io/api/memos${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      ...(draft && { body: JSON.stringify({ title: draft.title, content: draft.content, date: draft.date, category: categories[draft.tag], isPinned: draft.isPinned }) }),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error("네트워크 연결을 확인하고 다시 시도해주세요.");
  }
  if (response.status === 401) {
    if (useAuthStore.getState().accessToken === token) useAuthStore.getState().logout();
    throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
  }
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.success) {
    throw new Error(body?.message || "메모를 처리하지 못했습니다. 잠시 후 다시 시도해주세요.");
  }
  return body.data as T;
}
export async function getMemos(): Promise<Memo[]> {
  const memos: Memo[] = [];
  for (let page = 0; ; page++) {
    const result = await request<{ content: ServerMemo[]; last: boolean }>(`?page=${page}&size=100`);
    if (!Array.isArray(result?.content)) throw new Error("메모 목록을 확인할 수 없습니다.");
    memos.push(...result.content.map(fromServer));
    if (result.last || result.content.length === 0) return memos;
  }
}
export async function createMemo(draft: MemoDraft): Promise<Memo> {
  return fromServer(await request<ServerMemo>("", "POST", draft));
}
export async function updateMemo(memo: Memo): Promise<Memo> {
  return fromServer(await request<ServerMemo>(`/${memo.id}`, "PUT", memo));
}
export async function deleteMemo(id: number): Promise<void> {
  await request(`/${id}`, "DELETE");
}
