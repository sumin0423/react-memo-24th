import type { LoginCredentials } from "./api/auth";
import { useEffect, useState } from "react";
import Trash from "./pages/Trash";
import MyPage from "./pages/MyPage";
import Signup from "./pages/Signup";
import App from "./App";
import Login from "./pages/Login";
import { login } from "./api/auth";
import { useAuthStore } from "./stores/auth";

export default function Root() {
  const [email, setEmail] = useState("");
  const [page, setPage] = useState(() => {
    const path = window.location.pathname;
    return path === "/" && !useAuthStore.getState().accessToken ? "/login" : path;
  });
  useEffect(() => {
    if (window.location.pathname === "/" && !useAuthStore.getState().accessToken) {
      window.history.replaceState(null, "", "/login");
    }
    const handlePopState = () => setPage(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  function navigate(path: string) {
    window.history.pushState(null, "", path);
    setPage(path);
  }
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    setEmail("");
    setPage("/login");
    window.history.replaceState(null, "", "/login");
  }

  async function handleLogin(credentials: LoginCredentials) {
    const token = await login(credentials);
    setEmail(credentials.email.trim());
    setAccessToken(token);
    navigate("/");
    return "success" as const;
  }

  if (!accessToken || page === "/login" || page === "/signup") {
    if (page === "/signup") return <Signup onBack={() => navigate("/login")} onComplete={() => {
      navigate("/login");
    }} />;
    return <Login onLogin={handleLogin} onSignup={() => navigate("/signup")} />;
  }

  return (
    <>
      {page !== "/mypage" && <div className="mx-auto flex w-[calc(100%-32px)] max-w-[1200px] justify-end pt-5 md:w-5/6">
        <button className="relative top-2 inline-flex min-h-11 items-center gap-2 rounded-full border border-soft bg-surface px-5 py-2 text-sm font-bold text-[#b0445c] shadow-sm transition-colors hover:bg-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight" type="button" onClick={handleLogout}>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4H4v16h5M9 12h11m-4-4 4 4-4 4" /></svg>
          로그아웃
        </button>
      </div>}
      {page === "/trash" ? <Trash email={email} onBack={() => navigate("/mypage")} /> : page === "/mypage" ? <MyPage onLogout={handleLogout} onTrash={() => navigate("/trash")} email={email} onBack={() => navigate("/")} /> : <App email={email} onProfile={() => navigate("/mypage")} />}
    </>
  );
}
