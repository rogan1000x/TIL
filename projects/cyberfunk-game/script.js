// 게임 상태 변수
let isGameOver = false;
let combo = 1;

function getRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

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

function createWord() {
  if (isGameOver) return;
  const gameArea = document.getElementById('game-area');

  const div = document.createElement('div');
  div.textContent = getRandomWord();
  div.style.position = 'absolute';
  div.style.color = '#ff2d9b';
  div.style.fontSize = '18px';
  div.style.fontWeight = 'bold';
  div.style.left = getSafeLeft(gameArea) + 'px';
  div.style.top = '0px';
  div.style.padding = '8px 16px';
  div.style.borderRadius = '20px';
  div.style.border = '2px solid #00ffff';
  div.style.backgroundColor = 'rgba(255, 45, 155, 0.15)';
  div.style.boxShadow = '0 0 15px rgba(255, 45, 155, 0.8), 0 0 30px rgba(0, 255, 255, 0.4)';

  gameArea.appendChild(div);
}

function fallWords() {
  if (isGameOver) return;
  const gameArea = document.getElementById('game-area');
  const words = gameArea.querySelectorAll('div');

  words.forEach(function (word) {
    let top = parseInt(word.style.top);

    const level = parseInt(document.getElementById('level').textContent);
    const speed = 1 + level;
    top += speed;

    word.style.top = top + 'px';

    if (top > 500) {
      word.remove();

      // HP 깎기 (단어를 놓쳤을 때만!)
      const hpEl = document.getElementById('hp');
      const currentHp = parseInt(hpEl.textContent);
      const newHp = Math.max(0, currentHp - 10);
      hpEl.textContent = newHp;

      // 점등 효과
      hpEl.classList.add('flash');
      setTimeout(() => hpEl.classList.remove('flash'), 600);

      // 실패 애니메이션 (흔들림 + 빨간색)
      const gameContainer = document.getElementById('game-container');
      gameContainer.classList.add('fail');
      setTimeout(() => gameContainer.classList.remove('fail'), 600);

      // 콤보 리셋
      combo = 1;
      document.getElementById('combo').textContent = 'x1';

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

const input = document.getElementById('type-input');

input.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    const typed = input.value.trim();
    const gameArea = document.getElementById('game-area');
    const words = gameArea.querySelectorAll('div');

    words.forEach(function (word) {
      if (word.textContent === typed) {
        word.remove();
        input.value = '';

        // 점수 올리기 (콤보에 따라 배수 적용)
        const scoreEl = document.getElementById('score');
        const points = 10 * combo;
        scoreEl.textContent = parseInt(scoreEl.textContent) + points;

        // 점등 효과
        scoreEl.classList.add('flash');
        setTimeout(() => scoreEl.classList.remove('flash'), 600);

        // 게임 테두리 점등
        const gameContainer = document.getElementById('game-container');
        gameContainer.classList.add('success');
        setTimeout(() => gameContainer.classList.remove('success'), 500);

        // 콤보 올리기
        combo++;
        const comboEl = document.getElementById('combo');
        comboEl.textContent = 'x' + combo;

        // 점등 효과
        comboEl.classList.add('flash');
        setTimeout(() => comboEl.classList.remove('flash'), 600);
      }
    });
  }
});

window.onload = function () {
  // 게임 시작 버튼
  document.getElementById('start-btn').addEventListener('click', function () {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').classList.add('active');
  });

  document.getElementById('restart-btn').addEventListener('click', function () {
    location.reload();
  });

  function levelUp() {
    if (isGameOver) return;

    const levelEl = document.getElementById('level');
    const newLevel = parseInt(levelEl.textContent) + 1;
    levelEl.textContent = newLevel;

    // 점등 효과
    levelEl.classList.add('flash');
    setTimeout(() => levelEl.classList.remove('flash'), 600);
  }

  setInterval(levelUp, 20000);

  function startSpawning() {
    if (isGameOver) return;
    const level = parseInt(document.getElementById('level').textContent);
    const interval = Math.max(500, 2000 - (level - 1) * 200);

    createWord();
    setTimeout(startSpawning, interval);
  }

  startSpawning();

  setInterval(fallWords, 16);
};