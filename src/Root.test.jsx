import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Root from "./Root";
import { useAuthStore } from "./stores/auth";
import { login } from "./api/auth";

afterEach(() => {
  cleanup();
  useAuthStore.getState().logout();
  vi.unstubAllGlobals();
});
it("sends email/password, opens memo screen on success, and clears token on logout", async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, data: { accessToken: "test-only-token" }, message: null })));
  vi.stubGlobal("fetch", fetchMock);
  render(<Root />);
  fireEvent.change(screen.getByLabelText("이메일"), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText("비밀번호"), { target: { value: "test-only-password" } });
  fireEvent.click(screen.getByRole("button", { name: "로그인" }));
  const logout = await screen.findByRole("button", { name: "로그아웃" });
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ email: "test@example.com", password: "test-only-password" });
  expect(useAuthStore.getState().accessToken).toBe("test-only-token");
  fireEvent.click(logout);
  expect(useAuthStore.getState().accessToken).toBeNull();
  expect(screen.getByRole("button", { name: "로그인" })).toBeTruthy();
});
it.each([
  [401, { success: false, data: null, message: "invalid" }, "이메일 또는 비밀번호"],
  [400, { success: false, data: null, message: "이메일 형식이 올바르지 않습니다." }, "이메일 형식"],
  [503, {}, "서버에 문제가"],
  [200, { success: true, data: {} }, "로그인 정보가 없습니다"],
])("rejects unsuccessful or malformed login response (%s)", async (status, body, message) => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status })));
  await expect(login({ email: "test@example.com", password: "test-only-password" })).rejects.toThrow(message);
  expect(useAuthStore.getState().accessToken).toBeNull();
});

it("keeps login in browser history and renders back/forward destinations", async () => {
  window.history.replaceState(null, "", "/");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, data: { accessToken: "test-token" } }))));
  render(<Root />);
  expect(window.location.pathname).toBe("/login");
  fireEvent.change(screen.getByLabelText("이메일"), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText("비밀번호"), { target: { value: "test-password" } });
  fireEvent.click(screen.getByRole("button", { name: "로그인" }));
  await screen.findByRole("button", { name: "로그아웃" });
  expect(window.location.pathname).toBe("/");
  window.history.back();
  await screen.findByRole("button", { name: "로그인" });
  expect(window.location.pathname).toBe("/login");
  window.history.forward();
  await screen.findByRole("button", { name: "로그아웃" });
  expect(window.location.pathname).toBe("/");
});
