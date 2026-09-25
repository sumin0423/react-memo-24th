import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  logout: () => void;
};

// 현재는 메모리에만 보관하므로 새로고침하면 다시 로그인합니다.
export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  logout: () => set({ accessToken: null }),
}));
