import PasswordInput from "../components/PasswordInput";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { signup, LoginError } from "../api/auth";

type SignupProps = { onBack: () => void; onComplete: () => void };

export default function Signup({ onBack, onComplete }: SignupProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const shortPassword = password.length > 0 && password.length < 8;
  const mismatch = confirmation !== "" && password !== confirmation;
  useEffect(() => {
    if (!completed) return;
    const timer = window.setTimeout(onComplete, 2000);
    return () => window.clearTimeout(timer);
  }, [completed, onComplete]);
  const canSubmit = validEmail && password.length >= 8 && password === confirmation && !loading && !completed;
  const inputClass = "h-14 w-full rounded-xl bg-surface px-5 text-base placeholder:text-muted disabled:opacity-70";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || submitting.current) return;
    submitting.current = true;
    setLoading(true);
    setError("");
    try {
      await signup({ email: email.trim(), password });
      setCompleted(true);
    } catch (error) {
      setError(error instanceof LoginError ? error.message : "네트워크 연결이 불안정합니다. 잠시 후 다시 시도해주세요.");
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  }

  return (
    <main className="login-page flex min-h-dvh items-center justify-center bg-page px-6 py-12 text-accent">
      {completed && (
        <div role="status" className="signup-success fixed top-8 left-1/2 z-50 w-[calc(100%-48px)] max-w-[480px] -translate-x-1/2 rounded-2xl bg-accent px-6 py-4 text-center font-bold text-white shadow-lg">
          회원가입이 완료되었습니다
        </div>
      )}
      <div className="w-full max-w-[560px]">
        <h1 className="mb-8 text-center text-2xl font-bold text-accent">회원가입</h1>
        <form onSubmit={handleSubmit} aria-busy={loading}>
          <label htmlFor="signup-email" className="sr-only">이메일</label>
          <input id="signup-email" type="email" autoComplete="username" placeholder="이메일을 입력하세요" className={inputClass} disabled={loading || completed} value={email}
            onChange={(event) => { setEmail(event.target.value); setError(""); }} />
          <label htmlFor="signup-password" className="sr-only">비밀번호</label>
          <PasswordInput id="signup-password" autoComplete="new-password" minLength={8} placeholder="비밀번호를 입력하세요 (8자 이상)" className={inputClass} disabled={loading || completed} value={password}
            aria-invalid={shortPassword} aria-describedby="password-help" onChange={(event) => { setPassword(event.target.value); setError(""); }} />
          <p id="password-help" aria-live="polite" className={`mt-2 text-sm ${shortPassword ? "text-[#ff5656]" : "text-muted"}`}>비밀번호는 8자 이상 입력해주세요.</p>
          <label htmlFor="signup-confirmation" className="sr-only">비밀번호 확인</label>
          <PasswordInput id="signup-confirmation" toggleLabel="비밀번호 확인" autoComplete="new-password" placeholder="비밀번호를 한 번 더 입력하세요" className={inputClass} disabled={loading || completed} value={confirmation}
            aria-invalid={mismatch} aria-describedby={mismatch ? "confirmation-error" : undefined}
            onChange={(event) => { setConfirmation(event.target.value); setError(""); }} />
          <div className="min-h-10 pt-1 text-sm text-[#ff5656]" aria-live="polite">
            {mismatch && <p id="confirmation-error">비밀번호가 일치하지 않습니다.</p>}
            {error && <p role="alert">{error}</p>}
          </div>
          <button type="submit" disabled={!canSubmit} className="h-14 w-full rounded-xl bg-action text-lg font-bold text-accent disabled:cursor-not-allowed disabled:bg-soft disabled:text-muted">
            {completed ? "가입 완료" : loading ? "가입 중…" : "회원가입"}
          </button>
        </form>
        <div className="mt-7 text-center">
          <button type="button" onClick={onBack} disabled={loading || completed} className="text-sm text-muted disabled:opacity-50">로그인으로 돌아가기</button>
        </div>
      </div>
    </main>
  );
}
