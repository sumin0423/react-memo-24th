# memo. — 3주차 구현

[배포 화면](https://react-memo-24th-tau.vercel.app/) · [실행 안내](DEVELOPMENT.md) · [Review Questions](docs/week3-review.md)

- Vite · React · TypeScript · Tailwind CSS
- Zustand 로그인 토큰 관리, 로그인·회원가입 API
- 메모 조회·작성·수정·삭제·고정 API, 검색·태그 필터
- 마이페이지 UI, 브라우저 사진 저장·휴지통 조회
- 요청 중 중복 제출 방지, 성공 안내, 실패 시 입력 유지

닉네임 수정과 태그 관리 API는 제공되지 않아 안내창만 구현했습니다. 새로고침하면 재로그인이 필요하며, 사진·휴지통은 이 브라우저에만 저장합니다.

## 2주차 리뷰 반영

태그 글자색을 공통 변수로 모으고 카드 본문에 4줄 말줄임을 적용했습니다. 상세창 바깥 클릭 닫기, 스크롤바 공간 유지, 편집 중 제목 표시와 별 고정 상태 구분도 반영했습니다.

---

# 3주차 과제: React Memo - API 연동
<br>

[2주차 README 백업](https://app.notion.com/p/README-3d325975dbba803c9d1efcf3358dd947?source=copy_link)

필수 구현 사항과 Review Question은 이 링크에서 확인 부탁드립니다.

<br>

# 서론

안녕하세요 🙌🏻 24기 프론트엔드 운영진 **이승연**입니다.

다들 2주차 미션인 React Memo를 만드시느라 수고 많으셨습니다! 지난 미션에서는 Vanilla JS로 구현했던 Memo 서비스를 React로 전환하면서, 컴포넌트 기반 개발 방식과 React Hooks를 활용한 상태 관리를 경험해보셨을 것이라 생각합니다.

이번 미션은 2주차에 구현한 Memo 서비스에 **로그인과 회원가입 페이지를 추가하고, API를 연동하는 것**입니다❗️

이번 주차에는 서버와 데이터를 주고받으며 로그인과 회원가입이 어떻게 이루어지는지 살펴보게 됩니다. 사용자가 입력한 정보를 서버에 어떤 형태로 전달하는지, 서버의 응답에 따라 화면과 상태를 어떻게 변경해야 하는지 고민해보시기 바랍니다.

또한 이번 과제에서는 **Zustand와 TypeScript 사용이 필수입니다.** Zustand를 활용하면서 여러 컴포넌트에서 공유해야 하는 상태와 개별 컴포넌트에서 관리할 상태를 구분해보세요. TypeScript로 컴포넌트의 props와 API 요청·응답 데이터의 타입을 정의하며, 타입을 활용하는 개발 방식에도 익숙해져 보시면 좋겠습니다.

API 연동이 처음이라면 다소 낯설게 느껴질 수 있습니다. 제공된 API 명세를 꼼꼼히 읽고, 요청과 응답을 하나씩 확인하면서 진행해보세요. 여유가 있다면 메모 작성·수정·삭제 API 연동과 마이페이지 UI 구현에도 도전해보시기 바랍니다!

과제를 진행하다가 막히는 부분이 있더라도, 우선은 스스로 공부하고 찾아보며 해결해보는 과정을 권장드립니다. 다만 미션과 관련해 운영진의 도움이 필요하다면, 언제든 프론트엔드 카카오톡방에 질문 남겨주세요!

<br>

# 과제

## 🎯 목표

- **API 명세**를 이해하고, 서버와 데이터를 주고받는 방법을 익힙니다.
- 로그인과 회원가입을 구현하며 **인증의 기본적인 흐름**을 이해합니다.
- API 요청의 로딩·성공·실패 **상태에 따른 UI 처리**를 고민합니다.
- **Zustand**를 활용한 전역 상태 관리 방법을 익힙니다.
- 컴포넌트의 **지역 상태와 전역 상태를 구분**하고 적절하게 관리합니다.
- **TypeScript**를 활용하여 컴포넌트의 props와 API 요청·응답 데이터의 타입을 정의합니다.

## 📅 기한

- **2026년 9월 27일 일요일 14:00까지**

## 💬 Review Questions

- 로그인 또는 회원가입 API 요청의 **로딩·성공·실패 상태**에 따라 UI를 어떻게 처리했나요? 본인의 구현 사례를 바탕으로 설명해주세요. 아직 구현하지 않은 상태라면, 사용자 경험을 고려하여 어떻게 처리하면 좋을지 작성해주세요.
- React의 `useState`와 Zustand는 상태 관리 방식에서 어떤 차이가 있나요? 이번 과제에서 전역으로 관리한 상태는 무엇이며, 그렇게 결정한 이유는 무엇인가요?
- 이번 과제에서 **TypeScript를 활용하며 느낀 장점과 어려움**은 무엇인가요? 컴포넌트의 props나 API 요청·응답에 타입을 정의한 사례를 바탕으로 설명해주세요.

## 💡 필수 요건

- 2주차에 React로 구현했던 **Memo 서비스를 기반으로 진행**합니다.
- 피그마에 제공된 UI를 기준으로 **로그인 페이지를 구현하고, 로그인 API를 연동**합니다.
- 피그마에 제공된 UI를 기준으로 **회원가입 페이지를 구현하고, 회원가입 API를 연동**합니다.
- **Zustand를 사용하여 전역 상태를 관리**합니다.
- **TypeScript를 사용하여 프로젝트를 진행**합니다.

  ### 🗂️ API 연동 관련 자료
  [API 명세서](https://app.notion.com/p/API-3da25975dbba80e48b96c4aaf56f8cb5?source=copy_link) <br>
  [Swagger 링크](https://3-37-186-61.nip.io/swagger-ui/index.html#/)

<br>

## ✅ 선택 요건

- 메모 **작성·수정·삭제 API를 연동**합니다.
- 추가 페이지인 **마이페이지 UI를 구현**합니다.

<br>

# 링크 및 참고자료

## HTTP와 API 연동

- [MDN — HTTP 요청 메서드](https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Methods)
- [MDN — HTTP 상태 코드](https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Status)
- [MDN — async function](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/async_function)
- [모던 JavaScript 튜토리얼 — fetch](https://ko.javascript.info/fetch)
- [MDN — Fetch API 사용하기](https://developer.mozilla.org/ko/docs/Web/API/Fetch_API/Using_Fetch)

## React의 폼과 상태 관리

- [React — State를 사용해 Input 다루기](https://ko.react.dev/learn/reacting-to-input-with-state)
- [React — 컴포넌트 간 State 공유하기](https://ko.react.dev/learn/sharing-state-between-components)

## Zustand

- [Zustand — 시작하기 (영문)](https://zustand.docs.pmnd.rs/learn/getting-started/introduction)
- [Zustand — TypeScript 기초 가이드 (영문)](https://zustand.docs.pmnd.rs/learn/guides/beginner-typescript.html)

## TypeScript

- [TypeScript — JavaScript 개발자를 위한 TypeScript](https://www.typescriptlang.org/ko/docs/handbook/typescript-in-5-minutes.html)
- [TypeScript — 기본 타입과 타입 정의](https://www.typescriptlang.org/ko/docs/handbook/2/everyday-types.html)
- [React — TypeScript 사용하기](https://ko.react.dev/learn/typescript)
- [ts 절대경로 설정하기](https://tesseractjh.tistory.com/232)
- [리액트 프로젝트에서 타입스크립트 사용하기(시리즈)](https://velog.io/@velopert/series/react-with-typescript)

## Network 탭에서 실제 요청과 응답을 확인하는 방법 (참고용)

- [Chrome DevTools — 네트워크 활동 검사](https://developer.chrome.com/docs/devtools/network?hl=ko)
