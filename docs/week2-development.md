# React Memo 실행 안내

```bash
npm install
npm run dev
```

배포용 빌드: `npm run build`
기능 테스트: `npm test`

## 파일 역할

- `src/App.jsx`: 메모 목록, 검색어, 태그, 선택한 메모 ID 상태 관리
- `src/components/Header.jsx`: 상단 영역
- `src/components/SearchBar.jsx`: 검색 입력과 태그 선택
- `src/components/MemoList.jsx`: 일반·고정 목록에 재사용하는 컴포넌트
- `src/components/MemoItem.jsx`: 메모 카드와 고정 버튼
- `src/components/MemoDetail.jsx`: 상세 창과 편집 모드 전환
- `src/components/MemoEditor.jsx`: 제목·내용 입력, 빈 입력 검사, 저장·취소
- `src/components/EmptyState.jsx`: 메모 없음·검색 결과 없음 안내
- `src/data/sampleMemos.js`: 1주차에서 가져온 예시 메모 12개
- `src/data/tags.js`: 태그 이름과 Tailwind 색상 클래스
- `src/index.css`: Tailwind 연결, 색상, 폰트, 기본 스타일

공통 상태는 App에서 관리하고 자식에게 props로 전달합니다. 자식은 전달받은 함수를 호출해 상태를 변경합니다. 검색 결과는 filter로 계산하며 별도 state에 중복 저장하지 않습니다.

상세 창의 useRef는 dialog 요소를 참조합니다. useEffect는 창을 열고 컴포넌트가 제거될 때 닫는 역할을 합니다. StrictMode에서도 정리 함수가 실행됩니다.

새 메모·사용자·삭제 버튼은 비활성 상태입니다. 수정은 현재 화면의 메모 목록에 반영됩니다. 브라우저 저장 기능은 없으므로 새로고침하면 예시 메모로 돌아가고 수정·고정 상태가 초기화됩니다. 테스트는 jsdom으로 실행하며 실제 브라우저의 모달 포커스 동작이나 화면 배치를 보장하지는 않습니다.

## Vercel 설정

- Framework Preset: Vite
- Root Directory: ./
- Build Command: npm run build
- Output Directory: dist
- Production Branch: sumin0423

배포 및 PR 제출은 별도로 진행합니다.

## 2주차 구현 범위

Vite, React, Tailwind CSS를 사용합니다. 기본 기능은 목록, 제목·내용 검색, 태그 필터, 고정·해제, 상세 보기, 빈 화면 안내입니다. 추가로 제목·내용 수정과 취소를 구현했습니다. TypeScript, 전역 상태관리 라이브러리, 로그인·API 연동은 사용하지 않습니다.

선택한 메모는 ID만 state로 저장하고 목록에서 find로 찾습니다. 수정 시 목록만 갱신해도 상세 화면은 최신 내용을 표시합니다. 편집 중 입력값은 MemoEditor 안에서 관리하므로 취소하면 목록에 반영되지 않습니다.

## Review Questions 학습 정리

### Virtual DOM은 무엇이고 이점은 무엇인가요?

React가 화면을 계산할 때 사용하는 메모리상의 UI 표현입니다. 렌더링 결과를 이전 결과와 비교하고 필요한 변경을 실제 DOM에 반영합니다. 개발자는 DOM 조작 순서를 직접 작성하기보다 상태에 맞는 화면을 선언할 수 있습니다. 모든 상황에서 직접 DOM을 다루는 것보다 빠르다는 의미는 아닙니다.

### 컴포넌트를 분리하는 기준과 이점은 무엇인가요?

반복되는 UI인지, 명확한 역할이 있는지, 별도로 관리할 상태가 있는지를 기준으로 나눕니다. MemoList는 고정 목록과 일반 목록에 재사용하고 MemoItem은 카드 한 개를 담당합니다. MemoEditor는 편집 입력값을 관리합니다. 역할별로 나누면 수정할 위치를 찾기 쉽고 중복을 줄일 수 있습니다.

### React 컴포넌트의 생명주기는 무엇인가요?

화면에 처음 추가되는 마운트, 상태나 props 변화로 다시 렌더링되는 업데이트, 화면에서 제거되는 언마운트로 설명할 수 있습니다. useEffect는 렌더링 후 외부 시스템과 동기화하는 데 사용합니다. 의존성이 바뀌면 이전 정리 함수를 실행한 뒤 Effect를 다시 실행하며, 언마운트할 때도 정리합니다. 이 앱은 상세 창에서 dialog를 열고, 정리 함수에서 닫기와 배경 스크롤 복구를 수행합니다. 개발 환경의 StrictMode에서는 Effect의 설정과 정리를 한 번 더 실행해 정리 로직을 점검합니다.
