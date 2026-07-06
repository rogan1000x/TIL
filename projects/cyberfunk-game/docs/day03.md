# Day 03 - JavaScript 기초

## 오늘 배운 것
- `setInterval` → 일정 시간마다 함수 반복 실행
- `createElement` → JavaScript로 HTML 요소 만들기
- `querySelector` → HTML 요소 찾기
- `addEventListener` → 키보드/마우스 이벤트 감지
- `parseInt` → 문자열을 숫자로 변환

## 게임에 적용한 것
- 단어가 2초마다 랜덤 위치에서 생성됨
- 단어가 60fps로 아래로 떨어짐
- 단어 겹치지 않게 위치 계산 (getSafeLeft)
- 엔터 치면 타이핑한 단어와 일치하는 단어 사라짐

## 막혔던 것
- 단어가 떨어지지 않고 첫 줄에 쌓임
  → fallWords 함수로 해결
- 단어들이 겹쳐서 내려옴
  → getSafeLeft 함수로 해결

## 내일 할 것
- 점수 시스템 추가
- HP 시스템 추가
- 레벨업 기능 추가