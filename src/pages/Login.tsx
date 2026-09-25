import PasswordInput from "../components/PasswordInput";
import { Fragment, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { LoginError } from "../api/auth";
import type { LoginCredentials } from "../api/auth";
type LoginProps = {
  onSignup?: () => void;
  onLogin?: (credentials: LoginCredentials) => Promise<"success" | "invalid" | "network">;
};

export default function Login({ onLogin, onSignup }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [networkError, setNetworkError] = useState(false);
  const noticeRef = useRef<HTMLDialogElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const submitting = useRef(false);
  const canSubmit = email.trim() !== "" && password !== "" && !loading;

  useEffect(() => {
    if (!networkError) return;
    const dialog = dialogRef.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
    };
  }, [networkError]);

  useEffect(() => {
    if (!notice) return;
    const dialog = noticeRef.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
    };
  }, [notice]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || submitting.current) return;
    setError("");
    setNotice("");
    if (!onLogin) {
      setNotice("로그인 기능은 준비 중입니다.");
      return;
    }
    submitting.current = true;
    setLoading(true);
    try {
      const result = await onLogin({ email: email.trim(), password });
      if (result === "invalid") setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      if (result === "network") setNetworkError(true);
    } catch (error) {
      if (error instanceof LoginError) setError(error.message);
      else setNetworkError(true);
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  }

  return (
    <main className="login-page flex min-h-dvh items-center justify-center bg-page px-6 py-12 text-accent">
      <div className="w-full max-w-[560px]">
        <header className="mb-10 text-center sm:mb-12">
          <h1 className="text-5xl font-bold tracking-tight text-accent sm:text-6xl">memo.<span className="sr-only"> 로그인</span></h1>
          <p className="mt-2 text-base tracking-wide text-muted">나만의 작은 기록을 남겨 보아요</p>
        </header>
        <form onSubmit={handleSubmit} aria-busy={loading}>
          <label htmlFor="login-id" className="sr-only">이메일</label>
          <input id="login-id" type="email" autoComplete="username" placeholder="이메일을 입력하세요" value={email}
            onChange={(event) => { setEmail(event.target.value); setError(""); setNotice(""); }}
            className="h-14 w-full rounded-xl bg-surface px-5 text-base placeholder:text-muted" />
          <label htmlFor="login-password" className="sr-only">비밀번호</label>
          <PasswordInput id="login-password" autoComplete="current-password" placeholder="비밀번호를 입력하세요" value={password}
            aria-invalid={Boolean(error)} aria-describedby={error ? "login-error" : undefined}
            onChange={(event) => { setPassword(event.target.value); setError(""); setNotice(""); }}
            className="h-14 w-full rounded-xl bg-surface px-5 text-base placeholder:text-muted" />
          <div className="min-h-10 pt-1 text-sm">
            {error && <p id="login-error" role="alert" className="text-[#ff5656]">*{error}</p>}
          </div>
          <button type="submit" disabled={!canSubmit} className="h-14 w-full rounded-xl bg-action text-lg font-bold text-accent disabled:cursor-not-allowed disabled:bg-soft disabled:text-muted">
            {loading ? "로그인 중…" : "로그인"}
          </button>
        </form>
        <nav aria-label="계정 도움말" className="mt-7 flex items-center justify-center text-sm text-muted">
          {["회원가입", "아이디 찾기", "비밀번호 찾기"].map((label, index) => (
            <Fragment key={label}>
              {index > 0 && <img src="/assets/icons/login-divider.svg" width={1} height={23} alt="" aria-hidden="true" className="shrink-0" />}
              <button type="button" onClick={() => label === "회원가입" && onSignup ? onSignup() : setNotice(`${label} 기능은 준비 중입니다.`)} className="px-3 sm:px-8">{label}</button>
            </Fragment>
          ))}
        </nav>
      </div>
      <dialog ref={noticeRef} aria-labelledby="notice-title" onCancel={() => setNotice("")}
        className="fixed inset-0 m-auto w-[calc(100%-48px)] max-w-[480px] rounded-3xl border-0 bg-surface px-8 pt-10 pb-6 text-center text-accent shadow-xl backdrop:bg-accent/50">
        <h2 id="notice-title" className="text-xl font-bold">{notice}</h2>
        <button type="button" autoFocus onClick={() => setNotice("")}
          className="mt-8 h-14 w-full rounded-xl bg-action text-lg font-bold text-accent">확인</button>
      </dialog>
      <dialog aria-labelledby="network-title" ref={dialogRef} onCancel={() => setNetworkError(false)} className="fixed inset-0 m-auto w-[calc(100%-48px)] max-w-[480px] rounded-3xl border-0 bg-surface px-8 pt-12 pb-6 text-center text-accent shadow-xl backdrop:bg-accent/50">
        <h2 className="text-2xl font-bold" id="network-title">네트워크 연결이 불안정합니다</h2>
        <p className="mt-5 text-sm text-accent">네트워크 상태를 확인해주세요</p>
        <button type="button" autoFocus onClick={() => setNetworkError(false)} className="mt-10 h-14 w-full rounded-xl bg-action text-lg font-bold text-accent">확인</button>
      </dialog>
    </main>
  );
}
