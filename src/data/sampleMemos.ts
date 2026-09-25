import type { Memo } from "../types/memo";
export const sampleMemos: Memo[] = [
  {
    id: 1,
    title: "오늘의 기록",
    content:
      "오늘은 메모 앱의 목록 화면을 만들었다. HTML은 화면의 구조를 담당하고 CSS는 색상과 배치를 담당한다. JavaScript로 메모 데이터를 화면에 표시하는 방법도 익히고 있다. 작은 부분부터 직접 바꿔 보면서 어떤 차이가 생기는지 확인해 보자.",
    tag: "daily",
    date: "2026-09-07",
    isPinned: false,
  },
  {
    id: 2,
    title: "이번 주 할 일",
    content:
      "메모 목록 조회, 검색, 고정, 상세 보기 기능을 차례대로 구현하기. 기능 하나를 완성할 때마다 브라우저에서 확인하고 왜 이런 코드를 사용했는지 설명할 수 있도록 정리하기.",
    tag: "work",
    date: "2026-09-07",
    isPinned: false,
  },
  {
    id: 3,
    title: "떠오른 아이디어",
    content:
      "문득 생각난 아이디어를 잊기 전에 적어 두자. 메모에 태그를 붙이면 나중에 필요한 내용을 쉽게 찾을 수 있다.",
    tag: "others",
    date: "2026-09-06",
    isPinned: false,
  },
  {
    id: 4,
    title: "주말 계획",
    content:
      "아침에는 산책하고 오후에는 책 읽기. 저녁에는 이번 주에 배운 내용을 복습하며 다음 주 계획을 세워 보자.",
    tag: "daily",
    date: "2026-09-06",
    isPinned: false,
  },
  {
    id: 5,
    title: "과제 확인 목록",
    content:
      "Flexbox로 카드 배치하기. 함수와 변수 이름은 lowerCamelCase로 작성하기. 외부 라이브러리를 사용하지 않고 DOM API로 요소 만들기.",
    tag: "work",
    date: "2026-09-05",
    isPinned: false,
  },
  {
    id: 6,
    title: "읽고 싶은 책",
    content:
      "관심 있는 책의 제목과 읽고 싶은 이유를 모아 두는 메모. 읽은 뒤에는 가장 기억에 남는 문장을 내 말로 정리해 보자.",
    tag: "others",
    date: "2026-09-05",
    isPinned: false,
  },
  {
    id: 7,
    title: "장보기 목록",
    content:
      "우유, 달걀, 사과, 식빵. 집에 남아 있는 재료를 먼저 확인하고 필요한 것만 구매하기.",
    tag: "daily",
    date: "2026-09-04",
    isPinned: false,
  },
  {
    id: 8,
    title: "공부할 개념",
    content:
      "DOM, 이벤트 버블링과 캡처링, 클로저와 스코프. 용어를 외우는 것에서 끝내지 말고 직접 작은 예제를 만들어 확인하기.",
    tag: "work",
    date: "2026-09-04",
    isPinned: false,
  },
  {
    id: 9,
    title: "기억하고 싶은 문장",
    content:
      "새롭게 알게 된 내용을 자신의 말로 설명해 보자. 설명하다가 막히는 부분은 다시 확인하고, 작은 예제로 직접 실행해 보면 더 오래 기억할 수 있다.",
    tag: "others",
    date: "2026-09-03",
    isPinned: false,
  },
  {
    id: 10,
    title: "오늘의 산책",
    content:
      "저녁에 동네를 천천히 걸었다. 좋아하는 음악을 듣고 잠시 쉬면서 오늘 있었던 일을 돌아보았다. 내일도 짧게라도 걷는 시간을 마련해 보자.",
    tag: "daily",
    date: "2026-09-03",
    isPinned: false,
  },
  {
    id: 11,
    title: "제출 전 점검",
    content:
      "검색어와 태그를 함께 적용해 보기. 별을 눌러 고정과 해제가 되는지 확인하기. 메모 상세 창을 열고 닫아 보기. 검색 결과가 없을 때 안내가 나오는지도 확인하기.",
    tag: "work",
    date: "2026-09-02",
    isPinned: false,
  },
  {
    id: 12,
    title: "다음에 해볼 것",
    content:
      "필수 기능을 충분히 이해한 뒤에는 메모 저장 기능도 공부해 보고 싶다. 지금은 각 함수가 어떤 데이터를 받아 무엇을 바꾸는지 차근차근 살펴보자.",
    tag: "others",
    date: "2026-09-02",
    isPinned: false,
  },
];
