# Day 12 - 게임 시간 + 난이도 10단계 시스템 완성

## 오늘 배운 것
- **난이도 10단계화**: 3단계(EASY/NORMAL/HARD) → 10단계로 세분화
- **시간 기반 난이도**: 10초마다 자동으로 난이도 1씩 상향
- **콤보 보너스**: 콤보 5/10/15에서 추가 난이도 상향
- **실시간 업데이트**: setInterval로 HUD 시간 0.5초마다 갱신
- **게임오버 UX**: 게임 끝난 후 입력 비활성화 (disabled)
- **코드 리뷰**: 전체 코드 재사용성 검토

## 오늘 한 것
### 1. 난이도 10단계 시스템 구현
기존: Lv1(EASY) → Lv2(NORMAL) → Lv3(HARD) (3단계)
변경: Lv1 → Lv2 → ... → Lv10 (10단계로 세분화)

난이도 결정 로직:
- 시간 기반: 10초마다 1레벨 상향 (최대 Lv10)
- 콤보 보너스: 콤보 5(+1), 10(+2), 15+(+3)
- 콤보 리셋 시: 1레벨만 내려감 (너무 쉬워지지 않게)

### 2. 난이도별 설정값 (점진적 증가)
Lv1: spawn 2500ms, speed 1px
Lv2: spawn 2300ms, speed 1.5px
Lv3: spawn 2100ms, speed 2px
Lv4: spawn 1900ms, speed 2.5px
Lv5: spawn 1700ms, speed 3px
Lv6: spawn 1500ms, speed 3.5px
Lv7: spawn 1300ms, speed 4.5px
Lv8: spawn 1100ms, speed 5.5px
Lv9: spawn 900ms, speed 7px
Lv10: spawn 700ms, speed 8.5px

### 3. 게임 시간 표시
- HUD에 TIME 추가 (TIME: 45s)
- updateGameTime() 함수로 0.5초마다 업데이트
- gameStartTime으로 게임 시작 시간 기록

### 4. 게임오버 개선
- 게임오버 시 input.disabled = true
- 플레이어가 뒷편에서 타이핑해도 반응 없음
- 번쩍거림 제거

### 5. HUD 레이아웃 개선
```css
#hud {
  display: flex;
  justify-content: space-around;  /* 균등 배치 */
  flex-wrap: wrap;  /* 줄 바꿈 허용 */
  gap: 10px;
}
```
- 6개 항목(SCORE, LEVEL, TIME, COMBO, DIFFICULTY, HP) 깔끔하게 정렬

### 6. 전체 코드 검토
- script.js: 로직 완벽함 ✅
- index.html: 구조 좋음 ✅
- style.css: 스타일 깔끔함 ✅

## 막혔던 것
- 파일이 손상돼서 전체 복구
  → git status로 확인 후 수정

- 게임오버 후에도 입력이 처리됨
  → input.disabled = true로 해결

- HUD 항목들이 너무 퍼져있음
  → space-around + flex-wrap으로 개선

## 게임 완성도
- ✅ 기본 게임플레이
- ✅ 콤보 시스템
- ✅ 레벨업 시스템
- ✅ 최고 점수 저장
- ✅ 동적 난이도 (10단계)
- ✅ 게임 시간 표시
- ✅ 로봇 반응 시스템
- ✅ 사운드 효과
- ✅ 모바일 반응형
- ✅ 온라인 배포 (Netlify)
- ✅ 스크린샷 저장 기능
- ✅ 게임오버 UX 개선

## 🐛 다음 세션에서 수정할 버그

**문제**: 틀린 글자를 계속 빠르게 입력하면 어느 순간부터 playFailSound()가 작동하지 않음

**원인**: Audio Context가 너무 빠르게 많이 생성됨 (브라우저 제한)

**해결 방법** (다음 세션):
1. Audio Context를 전역으로 한 번만 생성
2. 같은 소리 재생 시 기존 Context 재사용
3. 소리 재생 간격 제한 (연속 입력 방지)

## 다음 할 것
- 🐛 Sound Context 버그 수정 (우선순위 1)
- 🎨 포트폴리오 디자인 개선 (게임에 맞춰)
- 📸 게임 스크린샷 추가
- 🔗 포트폴리오 OG 태그
- ⚛️ React 배우기 준비

## 개발 철학
지금은 재사용성 리팩토링보다 **게임 완성 우선**
→ React 배우면서 자연스럽게 개선됨
→ "동작하는 게임" > "완벽한 코드"