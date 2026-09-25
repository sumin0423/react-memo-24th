import { afterEach, beforeAll, expect, it, vi } from "vitest";
import { cleanup, render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});
afterEach(cleanup);
function fill() {
  fireEvent.change(screen.getByLabelText("이메일"), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText("비밀번호"), { target: { value: "password" } });
}
it("requires both fields and does not pretend to authenticate without an API", () => {
  render(<Login />);
  const button = screen.getByRole("button", { name: "로그인" }) as HTMLButtonElement;
  expect(button.disabled).toBe(true);
  fireEvent.change(screen.getByLabelText("이메일"), { target: { value: "test@example.com" } });
  expect(button.disabled).toBe(true);
  fill();
  expect(button.disabled).toBe(false);
  fireEvent.click(button);
  expect(screen.getByRole("dialog").textContent).toContain("준비 중");
});
it("shows invalid credentials and clears the error when editing", async () => {
  render(<Login onLogin={vi.fn().mockResolvedValue("invalid")} />);
  fill();
  fireEvent.click(screen.getByRole("button", { name: "로그인" }));
  expect((await screen.findByRole("alert")).textContent).toContain("올바르지 않습니다");
  fireEvent.change(screen.getByLabelText("이메일"), { target: { value: "other@example.com" } });
  expect(screen.queryByRole("alert")).toBeNull();
});
it("blocks repeat submissions and restores scrolling after a network error", async () => {
  let finish!: (value: "network") => void;
  const onLogin = vi.fn(() => new Promise<"network">((resolve) => { finish = resolve; }));
  render(<Login onLogin={onLogin} />);
  fill();
  fireEvent.click(screen.getByRole("button", { name: "로그인" }));
  const button = screen.getByRole("button", { name: "로그인 중…" }) as HTMLButtonElement;
  expect(button.disabled).toBe(true);
  fireEvent.click(button);
  expect(onLogin).toHaveBeenCalledTimes(1);
  finish("network");
  await screen.findByRole("dialog");
  expect(document.body.style.overflow).toBe("hidden");
  fireEvent.click(screen.getByRole("button", { name: "확인" }));
  await waitFor(() => expect(document.body.style.overflow).toBe(""));
});

it("opens a dismissible notice for password recovery", () => {
  render(<Login />);
  fireEvent.click(screen.getByRole("button", { name: "비밀번호 찾기" }));
  expect(screen.getByRole("dialog").textContent).toContain("비밀번호 찾기 기능은 준비 중입니다.");
  expect(document.body.style.overflow).toBe("hidden");
  fireEvent.click(screen.getByRole("button", { name: "확인" }));
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(document.body.style.overflow).toBe("");
});
