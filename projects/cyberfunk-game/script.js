// 랜덤 단어 하나 뽑기
function getRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

// 겹치지 않는 위치 찾기
function getSafeLeft(gameArea) {
  const existing = gameArea.querySelectorAll('div');
  const wordWidth = 80;
  const maxLeft = 500;
  let attempts = 0;

  while (attempts < 20) {
    const left = Math.floor(Math.random() * maxLeft);
    let overlap = false;

    existing.forEach(function(word) {
      const existingLeft = parseInt(word.style.left);
      if (Math.abs(left - existingLeft) < wordWidth) {
        overlap = true;
      }
    });

    if (!overlap) return left;
    attempts++;
  }

  return Math.floor(Math.random() * maxLeft);
}

// 단어 화면에 만들기
function createWord() {
  const gameArea = document.getElementById('game-area');

  const div = document.createElement('div');
  div.textContent = getRandomWord();
  div.style.position = 'absolute';
  div.style.color = '#00ffcc';
  div.style.fontSize = '20px';
  div.style.left = getSafeLeft(gameArea) + 'px';
  div.style.top = '0px';

  gameArea.appendChild(div);
}

// 단어 떨어뜨리기
function fallWords() {
  const gameArea = document.getElementById('game-area');
  const words = gameArea.querySelectorAll('div');

  words.forEach(function(word) {
    let top = parseInt(word.style.top);
    top += 2;
    word.style.top = top + 'px';

    if (top > 500) {
      word.remove();
    }
  });
}

// 타이핑으로 단어 맞추기
const input = document.getElementById('type-input');

input.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    const typed = input.value.trim();
    const gameArea = document.getElementById('game-area');
    const words = gameArea.querySelectorAll('div');

    words.forEach(function(word) {
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

// 2초마다 단어 생성
setInterval(createWord, 2000);

// 16ms마다 떨어뜨리기 (60fps)
setInterval(fallWords, 16);