// 게임 상태 변수
// - isGameOver: 게임이 끝났는지 여부 (true/false)
let isGameOver = false;

// 랜덤 단어 하나 뽑기
// - Math.random(): 0~1 사이 랜덤 숫자
// - Math.floor(): 소수점 버리고 정수로 변환
function getRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

// 겹치지 않는 위치 찾기
// - 가로(left)뿐만 아니라 세로(top)도 체크해서 겹치지 않게 함
function getSafeLeft(gameArea) {
  const existing = gameArea.querySelectorAll('div');
  const wordWidth = 100;
  const wordHeight = 30;
  const maxLeft = 500;
  let attempts = 0;

  while (attempts < 30) {
    const left = Math.floor(Math.random() * maxLeft);
    let overlap = false;

    existing.forEach(function (word) {
      const existingLeft = parseInt(word.style.left);
      const existingTop = parseInt(word.style.top);

      // 가로, 세로 둘 다 가까우면 겹친다고 판단
      const tooClose =
        Math.abs(left - existingLeft) < wordWidth &&
        existingTop < wordHeight;

      if (tooClose) overlap = true;
    });

    if (!overlap) return left;
    attempts++;
  }

  return Math.floor(Math.random() * maxLeft);
}

// 단어 화면에 만들기
// - createElement: JavaScript로 HTML 요소 생성
// - appendChild: 게임 영역 안에 단어 추가
function createWord() {
  if (isGameOver) return;
  const gameArea = document.getElementById('game-area');

  const div = document.createElement('div');
  div.textContent = getRandomWord();
  div.style.position = 'absolute';
  div.style.color = '#ff2d9b';
  div.style.fontSize = '20px';
  div.style.left = getSafeLeft(gameArea) + 'px';
  div.style.top = '0px';

  gameArea.appendChild(div);
}

// 단어 떨어뜨리기
// - setInterval로 16ms마다 실행 = 60fps
// - top 값을 2씩 늘려서 아래로 이동
function fallWords() {
  if (isGameOver) return;
  const gameArea = document.getElementById('game-area');
  const words = gameArea.querySelectorAll('div');

  words.forEach(function (word) {
    let top = parseInt(word.style.top);
    
    // 레벨에 따라 속도 증가
    // - 레벨 1: 2px, 레벨 2: 3px, 레벨 3: 4px ...
    const level = parseInt(document.getElementById('level').textContent);
    const speed = 1 + level;
    top += speed;

    word.style.top = top + 'px';

    if (top > 500) {
      word.remove();

      // HP 깎기
      // - Math.max(0, n): n이 0보다 작아지지 않게 막음
      const hpEl = document.getElementById('hp');
      const currentHp = parseInt(hpEl.textContent);
      const newHp = Math.max(0, currentHp - 10);
      hpEl.textContent = newHp;

      // 게임오버 체크
      if (newHp <= 0) {
        isGameOver = true;
        const gameover = document.getElementById('gameover');
        gameover.style.display = 'flex';
        document.getElementById('final-score').textContent =
          document.getElementById('score').textContent;
      }
    }
  });
}

// 타이핑으로 단어 맞추기
// - keydown: 키보드 누를 때 이벤트 발생
// - event.key === 'Enter': 엔터 키인지 확인
const input = document.getElementById('type-input');

input.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    const typed = input.value.trim();fallWords 
    const gameArea = document.getElementById('game-area');
    const words = gameArea.querySelectorAll('div');

    words.forEach(function (word) {
      if (word.textContent === typed) {
        word.remove();
        input.value = '';

        // 점수 올리기
        const scoreEl = document.getElementById('score');
        scoreEl.textContent = parseInt(scoreEl.textContent) + 10;
      }
    });
  }
});

// 재시작 버튼
// - location.reload(): 페이지 새로고침으로 게임 리셋
window.onload = function () {
  document.getElementById('restart-btn').addEventListener('click', function () {
    location.reload();
  });

  // 레벨업 시스템
// - 20초마다 레벨 1씩 올라감
// - 레벨 올라갈수록 단어 생성 속도 빨라짐
function levelUp() {
  if (isGameOver) return;

  // 현재 레벨 읽어서 +1
  const levelEl = document.getElementById('level');
  const newLevel = parseInt(levelEl.textContent) + 1;
  levelEl.textContent = newLevel;
}

// 20초마다 레벨업
setInterval(levelUp, 20000);

// 단어 생성 속도 (레벨에 따라 빨라짐)
// - 레벨 1: 2000ms, 레벨 2: 1800ms, 레벨 3: 1600ms ...
function startSpawning() {
  if (isGameOver) return;
  const level = parseInt(document.getElementById('level').textContent);
  const interval = Math.max(500, 2000 - (level - 1) * 200);

  createWord();
  setTimeout(startSpawning, interval);
}

// 게임 시작
startSpawning();

// 16ms마다 떨어뜨리기 (60fps)
setInterval(fallWords, 16);
};