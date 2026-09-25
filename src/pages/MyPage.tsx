import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import MemoAlert from "../components/MemoAlert";

export default function MyPage({ email, onBack, onTrash, onLogout }: { email: string; onBack: () => void; onTrash: () => void; onLogout: () => void }) {
  const photoInput = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState(() => {
    try { return email ? localStorage.getItem(`memo-profile-photo:${email.trim()}`) || "" : ""; }
    catch { return ""; }
  });
  const [uploading, setUploading] = useState(false);
  async function changePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setNotice("JPG, PNG, WebP 사진을 선택해주세요."); return;
    }
    if (file.size > 5 * 1024 * 1024) { setNotice("5MB 이하의 사진을 선택해주세요."); return; }
    if (!email) { setNotice("다시 로그인한 뒤 사진을 변경해주세요."); return; }
    setUploading(true);
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 320;
      const context = canvas.getContext("2d");
      if (!context) throw new Error();
      const size = Math.min(image.naturalWidth, image.naturalHeight);
      context.drawImage(image, (image.naturalWidth - size) / 2, (image.naturalHeight - size) / 2, size, size, 0, 0, 320, 320);
      const value = canvas.toDataURL("image/webp", 0.85);
      localStorage.setItem(`memo-profile-photo:${email.trim()}`, value);
      setPhoto(value);
    } catch { setNotice("사진을 저장하지 못했습니다. 다른 사진으로 다시 시도해주세요."); }
    finally { URL.revokeObjectURL(url); setUploading(false); }
  }
  const [notice, setNotice] = useState("");
  return <main className="mx-auto min-h-[85vh] w-[calc(100%-32px)] max-w-[1200px] py-8 text-accent md:w-5/6">
    <button type="button" onClick={onBack} aria-label="홈으로 돌아가기" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-soft bg-surface px-4 py-2 text-sm font-bold transition-colors hover:bg-daily">
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8" /></svg>
      홈으로
    </button>
    <h1 className="sr-only">마이페이지</h1>
    <section className="mx-auto mt-16 w-full max-w-[560px] sm:mt-28">
      <div className="mb-10 flex flex-col items-center gap-7 sm:flex-row sm:px-6">
        <div className="relative flex size-32 shrink-0 items-center justify-center rounded-full bg-surface ring-4 ring-white/60 sm:size-36">
          {photo ? <img src={photo} alt="프로필 사진" className="size-full rounded-full object-cover" /> : <img src="/assets/icons/user.svg" alt="" width="64" height="64" />}
          <input ref={photoInput} type="file" accept="image/jpeg,image/png,image/webp" aria-label="프로필 사진 파일" className="hidden" onChange={changePhoto} disabled={uploading} />
          <button type="button" aria-label="프로필 사진 변경" title="프로필 사진 변경" disabled={uploading} onClick={() => photoInput.current?.click()} className="absolute right-0 bottom-0 flex size-9 items-center justify-center rounded-full border-[3px] border-page bg-daily transition-colors hover:bg-work disabled:opacity-50"><img src="/assets/icons/edit.svg" alt="" width="16" height="16" /></button>
          {uploading && <span role="status" className="absolute -bottom-7 text-xs">사진 저장 중...</span>}
        </div>
        <div className="min-w-0 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start"><h2 className="text-3xl font-bold">사용자 님</h2><button type="button" aria-label="닉네임 수정" onClick={() => setNotice("닉네임 수정 기능은 준비 중입니다.")} className="flex size-9 shrink-0 items-center justify-center rounded-full opacity-60 transition-colors hover:bg-daily hover:opacity-100"><img src="/assets/icons/edit.svg" alt="" width="18" height="18" /></button></div>
          <p className="mt-3 break-all text-base text-muted">{email || "로그인한 계정"}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <button type="button" onClick={() => setNotice("태그 관리 기능은 준비 중입니다.")} className="flex min-h-16 items-center gap-4 rounded-xl bg-surface px-6 text-lg font-bold shadow-sm hover:bg-daily"><span aria-hidden="true" className="text-2xl">☷</span>태그 관리</button>
        <button type="button" onClick={onTrash} className="flex min-h-16 items-center gap-4 rounded-xl bg-surface px-6 text-lg font-bold shadow-sm hover:bg-daily"><img src="/assets/icons/trash.svg" alt="" width="24" height="24" />휴지통</button>
        <button type="button" onClick={onLogout} className="flex min-h-16 items-center gap-4 rounded-xl bg-surface px-6 text-lg font-bold text-[#b0445c] shadow-sm hover:bg-daily">
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4H4v16h5M9 12h11m-4-4 4 4-4 4" /></svg>
          로그아웃
        </button>
      </div>
    </section>
    {notice && <MemoAlert title={notice} onConfirm={() => setNotice("")} />}
  </main>;
}
