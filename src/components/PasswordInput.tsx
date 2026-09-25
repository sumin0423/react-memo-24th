import { useState } from "react";
import type { InputHTMLAttributes } from "react";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  toggleLabel?: string;
};

export default function PasswordInput({ className = "", toggleLabel = "비밀번호", disabled, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative mt-4">
      <input {...props} disabled={disabled} type={visible ? "text" : "password"}
        className={`${className} pr-14`} />
      <button type="button" disabled={disabled} aria-label={`${toggleLabel} ${visible ? "숨기기" : "보기"}`}
        aria-pressed={visible} aria-controls={props.id}
        onClick={() => setVisible((previous) => !previous)}
        className="absolute inset-y-0 right-1 my-auto flex h-11 w-11 items-center justify-center rounded-lg text-muted hover:text-accent disabled:opacity-50">
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
          {!visible && <path d="M3 3 21 21" />}
        </svg>
      </button>
    </div>
  );
}
