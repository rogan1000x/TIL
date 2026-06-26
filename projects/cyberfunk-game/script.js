// 게임 상태 변수
let isGameOver = false;
let combo = 1;

// 최고 점수 관련
function loadBestScore() {
  const bestScore = localStorage.getItem('bestScore') || 0;
  document.getElementById('best-score-start').textContent = bestScore;
  document.getElementById('best-score').textContent = bestScore;
  return parseInt(bestScore);
}

function saveBestScore(score) {
  const currentBest = parseInt(localStorage.getItem('bestScore') || 0);
  if (score > currentBest) {
    localStorage.setItem('bestScore', score);
    document.getElementById('best-score').textContent = score;
  }
}

loadBestScore();

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
      const tooClose = Math.abs(left - existingLeft) < wordWidth && existingTop < wordHeight;
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

      const hpEl = document.getElementById('hp');
      const currentHp = parseInt(hpEl.textContent);
      const newHp = Math.max(0, currentHp - 10);
      hpEl.textContent = newHp;

      hpEl.classList.add('flash');
      setTimeout(() => hpEl.classList.remove('flash'), 600);

      const gameContainer = document.getElementById('game-container');
      gameContainer.classList.add('fail');
      setTimeout(() => gameContainer.classList.remove('fail'), 600);

      combo = 1;
      document.getElementById('combo').textContent = 'x1';

      if (newHp <= 0) {
        isGameOver = true;
        const currentScore = parseInt(document.getElementById('score').textContent);
        saveBestScore(currentScore);

        const gameover = document.getElementById('gameover');
        gameover.style.display = 'flex';
        document.getElementById('final-score').textContent = currentScore;
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

        const scoreEl = document.getElementById('score');
        const points = 10 * combo;
        scoreEl.textContent = parseInt(scoreEl.textContent) + points;

        scoreEl.classList.add('flash');
        setTimeout(() => scoreEl.classList.remove('flash'), 600);

        const gameContainer = document.getElementById('game-container');
        gameContainer.classList.add('success');
        setTimeout(() => gameContainer.classList.remove('success'), 500);

        combo++;
        const comboEl = document.getElementById('combo');
        comboEl.textContent = 'x' + combo;

        comboEl.classList.add('flash');
        setTimeout(() => comboEl.classList.remove('flash'), 600);
      }
    });
  }
});

// 카운터 함수
function showCountdown() {
  const countdown = document.getElementById('countdown');
  const countdownText = document.getElementById('countdown-text');

  countdown.classList.add('active');
  let count = 3;

  const interval = setInterval(() => {
    countdownText.classList.remove('countdown-text');
    void countdownText.offsetHeight;
    countdownText.textContent = count;
    countdownText.classList.add('countdown-text');

    count--;

    if (count < 0) {
      clearInterval(interval);
      countdown.classList.remove('active');
      startSpawning();
      setInterval(fallWords, 16);
    }
  }, 1500);
}

function levelUp() {
  if (isGameOver) return;
  const levelEl = document.getElementById('level');
  const newLevel = parseInt(levelEl.textContent) + 1;
  levelEl.textContent = newLevel;

  levelEl.classList.add('flash');
  setTimeout(() => levelEl.classList.remove('flash'), 600);
}

function startSpawning() {
  if (isGameOver) return;
  const level = parseInt(document.getElementById('level').textContent);
  const interval = Math.max(500, 2000 - (level - 1) * 200);

  createWord();
  setTimeout(startSpawning, interval);
}

window.onload = function () {
  document.getElementById('start-btn').addEventListener('click', function () {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').classList.add('active');
    loadBestScore();
    showCountdown();
  });

  document.getElementById('restart-btn').addEventListener('click', function () {
    location.reload();
  });

  setInterval(levelUp, 20000);
};