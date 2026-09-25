export type LoginCredentials = { email: string; password: string };
type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  message: string | null;
};
type SignupResponse = ApiResponse<{ userId: number; email: string }>;
type LoginResponse = {
  success: boolean;
  data: { accessToken: string } | null;
  message: string | null;
};

export class LoginError extends Error {}

export async function login(credentials: LoginCredentials): Promise<string> {
  const response = await fetch("https://3-37-186-61.nip.io/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    signal: AbortSignal.timeout(15000),
  });
  if (response.status >= 500) {
    throw new LoginError("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
  let body: LoginResponse;
  try {
    body = await response.json();
  } catch {
    throw new LoginError("서버 응답을 확인할 수 없습니다. 잠시 후 다시 시도해주세요.");
  }
  if (response.status === 401) {
    throw new LoginError("이메일 또는 비밀번호가 올바르지 않습니다.");
  }
  if (!response.ok || !body?.success) {
    throw new LoginError(typeof body?.message === "string" ? body.message : "로그인에 실패했습니다. 다시 시도해주세요.");
  }
  if (typeof body.data?.accessToken !== "string" || !body.data.accessToken.trim()) {
    throw new LoginError("서버 응답에 로그인 정보가 없습니다. 다시 시도해주세요.");
  }
  return body.data.accessToken;
}

export async function signup(credentials: LoginCredentials): Promise<void> {
  const response = await fetch("https://3-37-186-61.nip.io/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    signal: AbortSignal.timeout(15000),
  });
  if (response.status >= 500) throw new LoginError("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
  let body: SignupResponse;
  try { body = await response.json(); }
  catch { throw new LoginError("서버 응답을 확인할 수 없습니다. 다시 시도해주세요."); }
  if (!response.ok || !body?.success) {
    throw new LoginError(typeof body?.message === "string" ? body.message : "회원가입에 실패했습니다. 다시 시도해주세요.");
  }
}
