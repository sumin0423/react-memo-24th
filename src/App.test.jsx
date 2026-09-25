import { StrictMode } from "react";
import { beforeEach, afterEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import EmptyState from "./components/EmptyState";

import { sampleMemos } from "./data/sampleMemos";
import { getMemos, updateMemo, createMemo, deleteMemo } from "./api/memos";
vi.mock("./api/memos", () => ({ getMemos: vi.fn(), updateMemo: vi.fn(), createMemo: vi.fn(), deleteMemo: vi.fn() }));
beforeEach(() => {
  getMemos.mockResolvedValue(sampleMemos);
  updateMemo.mockImplementation(async (memo) => memo);
  createMemo.mockImplementation(async (memo) => ({ ...memo, id: 999 }));
  deleteMemo.mockResolvedValue(undefined);
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});
afterEach(() => { cleanup(); localStorage.clear(); vi.clearAllMocks(); });

test("태그와 검색어를 함께 적용하고 초기화한다", async () => {
  const user = userEvent.setup();
  render(<App email="test@example.com" />);
  await screen.findByLabelText("오늘의 기록 상세 보기");
  expect(screen.getAllByRole("listitem")).toHaveLength(12);
  await user.selectOptions(screen.getByLabelText("태그 선택"), "daily");
  expect(screen.getAllByRole("listitem")).toHaveLength(4);
  await user.type(screen.getByLabelText("메모 검색"), "장보기");
  expect(screen.getAllByRole("listitem")).toHaveLength(1);
  await user.selectOptions(screen.getByLabelText("태그 선택"), "work");
  expect(screen.getByRole("status").textContent).toContain(
    "검색 결과가 없습니다",
  );
  await user.clear(screen.getByLabelText("메모 검색"));
  await user.selectOptions(screen.getByLabelText("태그 선택"), "all");
  expect(screen.getAllByRole("listitem")).toHaveLength(12);
});

test("고정한 메모는 별도 목록으로 이동하고 해제된다", async () => {
  const user = userEvent.setup();
  render(<App email="test@example.com" />);
  await screen.findByLabelText("오늘의 기록 상세 보기");
  await user.click(screen.getByLabelText("오늘의 기록 고정"));
  expect(
    within(screen.getByRole("region", { name: "고정된 메모" })).getAllByRole(
      "listitem",
    ),
  ).toHaveLength(1);
  expect(screen.queryByRole("dialog")).toBeNull();
  await user.click(screen.getByLabelText("오늘의 기록 고정 해제"));
  expect(screen.queryByRole("region", { name: "고정된 메모" })).toBeNull();
});

test("선택한 메모의 상세 창을 열고 닫는다", async () => {
  HTMLDialogElement.prototype.showModal = vi.fn(function () {
    this.setAttribute("open", "");
  });
  HTMLDialogElement.prototype.close = vi.fn(function () {
    this.removeAttribute("open");
  });
  const user = userEvent.setup();
  render(
    <StrictMode>
      <App email="test@example.com" />
    </StrictMode>,
  );
  await screen.findByLabelText("오늘의 기록 상세 보기");
  const previousOverflow = document.body.style.overflow;
  await user.click(screen.getByLabelText("오늘의 기록 상세 보기"));
  expect(document.body.style.overflow).toBe("hidden");
  expect(
    within(screen.getByRole("dialog")).getByRole("heading").textContent,
  ).toBe("오늘의 기록");
  await user.click(screen.getByLabelText("닫기"));
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(document.body.style.overflow).toBe(previousOverflow);
});

test("메모가 없는 안내는 검색 실패 안내와 구분한다", () => {
  render(<EmptyState isEmpty={true} />);
  expect(screen.getByRole("status").textContent).toContain(
    "새로운 메모를 작성해보세요!",
  );
  expect(screen.queryByText("검색 결과가 없습니다")).toBeNull();
});

test("수정 저장은 목록에도 반영되고 취소는 원래 내용을 유지한다", async () => {
  HTMLDialogElement.prototype.showModal = vi.fn(function () {
    this.setAttribute("open", "");
  });
  HTMLDialogElement.prototype.close = vi.fn(function () {
    this.removeAttribute("open");
  });
  const user = userEvent.setup();
  render(<App email="test@example.com" />);
  await screen.findByLabelText("오늘의 기록 상세 보기");
  await user.click(screen.getByLabelText("오늘의 기록 상세 보기"));
  await user.click(screen.getByLabelText("메모 수정"));
  await user.clear(screen.getByLabelText("제목"));
  expect(screen.getByRole("button", { name: "수정 완료" }).disabled).toBe(true);
  await user.type(screen.getByLabelText("제목"), "수정한 기록");
  await user.clear(screen.getByLabelText("내용"));
  await user.type(screen.getByLabelText("내용"), "수정한 내용입니다");
  await user.click(screen.getByRole("button", { name: "수정 완료" }));
  expect(
    within(screen.getByRole("dialog")).getByText("수정한 내용입니다"),
  ).toBeTruthy();
  await user.click(screen.getByLabelText("메모 수정"));
  await user.type(screen.getByLabelText("제목"), " 취소할 변경");
  await user.click(screen.getByRole("button", { name: "작성 취소" }));
  await user.click(screen.getByRole("button", { name: "작성 취소하기" }));
  expect(within(screen.getByRole("dialog")).getByRole("heading").textContent).toBe("수정한 기록");
  await user.click(screen.getByLabelText("닫기"));
  expect(screen.getByLabelText("수정한 기록 상세 보기")).toBeTruthy();
});

test("생성 후 서버 메모를 보여주고 확인 후 삭제한다", async () => {
  const user = userEvent.setup();
  render(<App email="test@example.com" />);
  await screen.findByLabelText("오늘의 기록 상세 보기");
  await user.click(screen.getByLabelText("새 메모"));
  await user.type(screen.getByLabelText("제목"), "서버 메모");
  expect(screen.getByRole("button", { name: "작성 완료" }).disabled).toBe(true);
  await user.type(screen.getByLabelText("내용"), "   ");
  expect(screen.getByRole("button", { name: "작성 완료" }).disabled).toBe(true);
  await user.clear(screen.getByLabelText("내용"));
  await user.type(screen.getByLabelText("내용"), "메모 본문");
  expect(screen.getByRole("button", { name: "작성 완료" }).disabled).toBe(false);
  await user.click(screen.getByRole("button", { name: "작성 완료" }));
  expect(screen.getByRole("dialog", { name: "태그를 선택해주세요" })).toBeTruthy();
  expect(createMemo).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: "확인" }));
  expect(screen.queryByRole("dialog", { name: "태그를 선택해주세요" })).toBeNull();
  expect(screen.getByLabelText("내용").value).toBe("메모 본문");
  await user.selectOptions(screen.getByLabelText("태그"), "others");
  await user.click(screen.getByRole("button", { name: "작성 완료" }));
  expect(await screen.findByLabelText("서버 메모 상세 보기")).toBeTruthy();
  expect(createMemo.mock.calls[0][0]).toMatchObject({ title: "서버 메모", content: "메모 본문", tag: "others", isPinned: false });
  await user.click(screen.getByRole("button", { name: "확인" }));
  await user.click(screen.getByLabelText("서버 메모 상세 보기"));
  await user.click(screen.getByLabelText("메모 삭제"));
  expect(deleteMemo).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: "삭제" }));
  expect(deleteMemo).toHaveBeenCalledWith(999);
  expect(await screen.findByRole("dialog", { name: "해당 메모가 삭제되었습니다" })).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "확인" }));
  expect(screen.queryByLabelText("서버 메모 상세 보기")).toBeNull();
});
test("수정 실패 시 입력값과 편집창을 유지한다", async () => {
  updateMemo.mockRejectedValueOnce(new Error("저장 실패"));
  const user = userEvent.setup();
  render(<App email="test@example.com" />);
  await user.click(await screen.findByLabelText("오늘의 기록 상세 보기"));
  await user.click(screen.getByLabelText("메모 수정"));
  await user.type(screen.getByLabelText("제목"), " 변경");
  await user.click(screen.getByRole("button", { name: "수정 완료" }));
  expect(await screen.findByRole("alert")).toBeTruthy();
  expect(screen.getByLabelText("제목").value).toBe("오늘의 기록 변경");
  expect(screen.getByLabelText("오늘의 기록 상세 보기")).toBeTruthy();
});

test("작성 취소와 뒤로가기 확인에서 입력 내용을 유지하거나 버린다", async () => {
  const user = userEvent.setup();
  render(<App email="test@example.com" />);
  await screen.findByLabelText("오늘의 기록 상세 보기");
  await user.click(screen.getByLabelText("새 메모"));
  expect(screen.getByLabelText("태그").value).toBe("");
  expect(screen.getByRole("button", { name: "작성 완료" }).disabled).toBe(true);
  await user.type(screen.getByLabelText("제목"), "남길 내용");
  await user.click(screen.getByLabelText("뒤로"));
  await user.click(screen.getByRole("button", { name: "계속 작성하기" }));
  expect(screen.getByLabelText("제목").value).toBe("남길 내용");
  await user.click(screen.getByRole("button", { name: "작성 취소" }));
  await user.click(screen.getByRole("button", { name: "작성 취소하기" }));
  expect(screen.queryByLabelText("제목")).toBeNull();
  expect(createMemo).not.toHaveBeenCalled();
});

test("상세 창 안쪽 여백은 유지하고 바깥 클릭은 닫는다", async () => {
  const user = userEvent.setup();
  render(<App email="test@example.com" />);
  await user.click(await screen.findByLabelText("오늘의 기록 상세 보기"));
  const dialog = screen.getByRole("dialog");
  vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue({ left: 100, right: 600, top: 100, bottom: 700 });
  fireEvent.click(dialog, { clientX: 120, clientY: 120 });
  expect(screen.getByRole("dialog")).toBeTruthy();
  fireEvent.click(dialog, { clientX: 50, clientY: 120 });
  expect(screen.queryByRole("dialog")).toBeNull();
});
