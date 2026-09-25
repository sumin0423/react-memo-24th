# memo. 실행 안내

```bash
npm ci
npm run dev
npm test
npm run typecheck
npm run build
```

## 구조

- `src/Root.tsx`: 로그인 상태에 따른 화면 전환, 브라우저 뒤로가기 처리
- `src/pages/Login.tsx`, `Signup.tsx`: 인증 폼, 입력 검증, 요청 상태 표시
- `src/stores/auth.ts`: Zustand 로그인 토큰 관리
- `src/api/auth.ts`, `memos.ts`: 인증·메모 API 요청과 오류 처리
- `src/types/memo.ts`: 메모, 태그, 작성 중 메모 타입
- `src/App.tsx`: 서버 메모 목록, 검색, 태그 필터, 선택한 메모 ID
- `src/components/MemoEditor.tsx`: 저장 전 입력 상태와 필수값 검사
- `src/components/MemoDetail.tsx`, `MemoAlert.tsx`: 상세·편집·확인창
- `src/pages/MyPage.tsx`, `Trash.tsx`: 마이페이지, 브라우저 휴지통
- `src/utils/trash.ts`: 계정별 삭제 메모 보관

## 실행 및 배포 시 유의점

API 주소는 제공받은 `https://3-37-186-61.nip.io`를 사용합니다. 배포 주소에 대한 CORS 허용은 API 서버 설정이 필요합니다.

인증 토큰은 메모리에만 저장하므로 새로고침 시 다시 로그인합니다. 비밀번호는 저장하지 않습니다. 메모는 서버에 저장되므로 다시 로그인하면 조회할 수 있습니다.

휴지통과 프로필 사진은 이 브라우저의 localStorage에 이메일별로 보관합니다. 다른 기기와 동기화되지 않으며, 브라우저 데이터를 삭제하면 사라집니다. 휴지통은 조회용이며 복원 API는 없습니다. 닉네임 수정·태그 관리는 준비 중 안내만 제공합니다.

API는 본문을 선택값으로 받지만, 화면에서는 사용자 요청에 따라 제목·본문·태그를 모두 입력해야 저장합니다. 제목 최대 50자, 본문 최대 1,000자입니다. 날짜는 작성창을 열 때 한국 날짜를 사용하며, 이미 열린 작성창의 날짜를 자정에 자동 변경하지 않습니다.

Vercel은 `npm run build`로 타입 검사 후 빌드합니다. `vercel.json`은 로그인·마이페이지 주소로 직접 접속할 때 앱을 반환합니다.

테스트는 모의 API와 jsdom 기반입니다. 실제 서버 통신, 브라우저 화면 배치와 파일 선택은 별도 확인이 필요합니다.

2주차 실행 안내 및 학습 정리는 [백업](docs/week2-development.md)에 보관했습니다.
