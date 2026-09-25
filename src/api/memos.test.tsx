import { afterEach, expect, it, vi } from "vitest";
import { getMemos, updateMemo, createMemo, deleteMemo } from "./memos";
import { useAuthStore } from "../stores/auth";
const memo = { id: 7, title: "제목", content: "내용", date: "2026-09-30", tag: "others" as const, isPinned: true };
const serverMemo = { ...memo, category: "OTHER" };
function response(data: unknown) { return new Response(JSON.stringify({ success: true, data })); }
afterEach(() => { vi.unstubAllGlobals(); useAuthStore.getState().logout(); });
it("sends all fields and authorization for create/update, and delete method", async () => {
  useAuthStore.getState().setAccessToken("test-token");
  const fetchMock = vi.fn().mockImplementation(async () => response(serverMemo));
  vi.stubGlobal("fetch", fetchMock);
  await createMemo(memo);
  await updateMemo(memo);
  await deleteMemo(7);
  expect(fetchMock.mock.calls.map((call) => call[1].method)).toEqual(["POST", "PUT", "DELETE"]);
  expect(fetchMock.mock.calls[1][0]).toMatch(/memos\/7$/);
  expect(fetchMock.mock.calls[1][1].headers.Authorization).toBe("Bearer test-token");
  expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ title: "제목", content: "내용", date: "2026-09-30", category: "OTHER", isPinned: true });
});
it("loads every page and maps nullable content/category", async () => {
  const fetchMock = vi.fn().mockResolvedValueOnce(response({ content: [{ ...serverMemo, content: null }], last: false })).mockResolvedValueOnce(response({ content: [], last: true }));
  vi.stubGlobal("fetch", fetchMock);
  expect(await getMemos()).toMatchObject([{ tag: "others", content: "" }]);
  expect(fetchMock.mock.calls[1][0]).toContain("page=1");
});
it("clears expired authentication", async () => {
  useAuthStore.getState().setAccessToken("expired");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 401 })));
  await expect(getMemos()).rejects.toThrow("로그인이 만료");
  expect(useAuthStore.getState().accessToken).toBeNull();
});
