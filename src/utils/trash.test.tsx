import { afterEach, expect, it, vi } from "vitest";
import { archiveAndDelete, readTrash } from "./trash";
const memo = { id: 1, title: "메모", content: "본문", tag: "daily" as const, date: "2026-09-25", isPinned: false };
afterEach(() => { localStorage.clear(); vi.restoreAllMocks(); });
it("keeps deleted content for the matching account", async () => {
  await archiveAndDelete("one@example.com", memo, async () => {});
  expect(readTrash("one@example.com")).toMatchObject([memo]);
  expect(readTrash("two@example.com")).toEqual([]);
});
it("rolls back when server deletion fails", async () => {
  await expect(archiveAndDelete("one@example.com", memo, async () => { throw new Error("실패"); })).rejects.toThrow("실패");
  expect(readTrash("one@example.com")).toEqual([]);
});
it("does not delete when local backup cannot be saved", async () => {
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error(); });
  const remove = vi.fn();
  await expect(archiveAndDelete("one@example.com", memo, remove)).rejects.toThrow("삭제하지 않았습니다");
  expect(remove).not.toHaveBeenCalled();
});
