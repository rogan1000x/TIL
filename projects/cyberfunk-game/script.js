// 게임 상태 변수
let isGameOver = false;
let combo = 1;

// 난이도 시스템 (10단계)
let currentDifficultyLevel = 1;
let gameStartTime = 0;

// Audio Context (전역으로 한 번만 생성)
let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function getGameElapsedSeconds() {
  if (gameStartTime === 0) return 0;
  return Math.floor((Date.now() - gameStartTime) / 1000);
}

function getDifficultyLevel(comboCount) {
  const elapsedSeconds = getGameElapsedSeconds();

  // 시간 기반 기본 레벨 (10초마다 1레벨)
  let baseLevel = Math.min(10, Math.floor(elapsedSeconds / 10) + 1);

  // 콤보로 추가 레벨 상향
  let bonusLevel = 0;
  if (comboCount >= 15) {
    bonusLevel = 3;
  } else if (comboCount >= 10) {
    bonusLevel = 2;
  } else if (comboCount >= 5) {
    bonusLevel = 1;
  }

  return Math.min(10, baseLevel + bonusLevel);
}

// 난이도별 설정 (10단계)
const difficultySettings = {
  1: { spawnInterval: 2500, fallSpeed: 1 },
  2: { spawnInterval: 2300, fallSpeed: 1.5 },
  3: { spawnInterval: 2100, fallSpeed: 2 },
  4: { spawnInterval: 1900, fallSpeed: 2.5 },
  5: { spawnInterval: 1700, fallSpeed: 3 },
  6: { spawnInterval: 1500, fallSpeed: 3.5 },
  7: { spawnInterval: 1300, fallSpeed: 4.5 },
  8: { spawnInterval: 1100, fallSpeed: 5.5 },
  9: { spawnInterval: 900, fallSpeed: 7 },
  10: { spawnInterval: 700, fallSpeed: 8.5 }
};

function getDifficultySettings() {
  return difficultySettings[currentDifficultyLevel];
}

let previousDifficultyLevel = 1;

function updateDifficulty() {
  const newLevel = getDifficultyLevel(combo);

  // 콤보 리셋 시 1레벨만 내려감
  if (combo === 1 && previousDifficultyLevel > 1) {
    const baseLevel = getDifficultyLevel(0);
    currentDifficultyLevel = Math.max(baseLevel, previousDifficultyLevel - 1);
  } else {
    currentDifficultyLevel = newLevel;
  }

  previousDifficultyLevel = currentDifficultyLevel;
  document.getElementById('difficulty').textContent = 'Lv' + currentDifficultyLevel;
}

// 게임 시간 업데이트
function updateGameTime() {
  const seconds = getGameElapsedSeconds();
  document.getElementById('game-time').textContent = seconds + 's';
}


// 시작 버튼 소리 (준비 완료음)
function playStartSound() {
  const audioContext = getAudioContext();

  // 첫 번째 음
  const osc1 = audioContext.createOscillator();
  const gain1 = audioContext.createGain();
  osc1.connect(gain1);
  gain1.connect(audioContext.destination);
  osc1.frequency.value = 500;
  gain1.gain.setValueAtTime(0.3, audioContext.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  osc1.start(audioContext.currentTime);
  osc1.stop(audioContext.currentTime + 0.1);

  // 두 번째 음 (더 높음)
  const osc2 = audioContext.createOscillator();
  const gain2 = audioContext.createGain();
  osc2.connect(gain2);
  gain2.connect(audioContext.destination);
  osc2.frequency.value = 700;
  gain2.gain.setValueAtTime(0.3, audioContext.currentTime + 0.12);
  gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.22);
  osc2.start(audioContext.currentTime + 0.12);
  osc2.stop(audioContext.currentTime + 0.22);
}

// 카운트 소리 (각 숫자마다 비프)
function playCountSound() {
  const audioContext = getAudioContext();

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 900; // 높은 음
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.08);
}

// 버튼 클릭 소리
function playClickSound() {
  const audioContext = getAudioContext();

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 600;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.05);
}

// 사운드 효과
function playSuccessSound() {
  const audioContext = getAudioContext();

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

function playFailSound() {
  const audioContext = getAudioContext();
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 400;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.2);
}

function playGameOverSound() {
  const audioContext = getAudioContext();

  const osc1 = audioContext.createOscillator();
  const gain1 = audioContext.createGain();
  osc1.connect(gain1);
  gain1.connect(audioContext.destination);
  osc1.frequency.value = 600;
  gain1.gain.setValueAtTime(0.3, audioContext.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
  osc1.start(audioContext.currentTime);
  osc1.stop(audioContext.currentTime + 0.15);

  const osc2 = audioContext.createOscillator();
  const gain2 = audioContext.createGain();
  osc2.connect(gain2);
  gain2.connect(audioContext.destination);
  osc2.frequency.value = 400;
  gain2.gain.setValueAtTime(0.3, audioContext.currentTime + 0.2);
  gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.35);
  osc2.start(audioContext.currentTime + 0.2);
  osc2.stop(audioContext.currentTime + 0.35);
}


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
    const settings = getDifficultySettings();
    const speed = settings.fallSpeed;
    top += speed;
    word.style.top = top + 'px';

    if (top > 500) {
      word.remove();

      const hpEl = document.getElementById('hp');
      const currentHp = parseInt(hpEl.textContent);
      const newHp = Math.max(0, currentHp - 10);
      hpEl.textContent = newHp;

      playFailSound();

      hpEl.classList.add('flash');
      setTimeout(() => hpEl.classList.remove('flash'), 600);

      const gameContainer = document.getElementById('game-container');
      gameContainer.classList.add('fail');
      setTimeout(() => gameContainer.classList.remove('fail'), 600);

      // 콤보 리셋
      combo = 1;
      document.getElementById('combo').textContent = 'x1';

      updateDifficulty();

      // 로봇 흔들기
      const robotSvg = document.getElementById('robot-svg');
      robotSvg.classList.remove('shaking');
      void robotSvg.offsetHeight;
      robotSvg.classList.add('shaking');
      setTimeout(() => robotSvg.classList.remove('shaking'), 500);

      if (newHp <= 0) {
        isGameOver = true;
        const currentScore = parseInt(document.getElementById('score').textContent);
        saveBestScore(currentScore);

        playGameOverSound();

        const gameover = document.getElementById('gameover');
        gameover.style.display = 'flex';
        document.getElementById('final-score').textContent = currentScore;

        // 게임오버 시 입력창 비활성화 
        document.getElementById('type-input').disabled = true;
      }
    }
  });
}

const input = document.getElementById('type-input');

input.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    const typed = input.value.trim();
    if (typed === '') return; // 빈 입력 제외

    const gameArea = document.getElementById('game-area');
    const words = gameArea.querySelectorAll('div');
    let found = false;

    words.forEach(function (word) {
      if (word.textContent === typed) {
        found = true;
        word.remove();
        input.value = '';

        const scoreEl = document.getElementById('score');
        const points = 10 * combo;
        scoreEl.textContent = parseInt(scoreEl.textContent) + points;

        playSuccessSound();

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
        updateDifficulty();

        // 로봇 춤추기
        const robotSvg = document.getElementById('robot-svg');
        robotSvg.classList.remove('dancing');
        void robotSvg.offsetHeight;
        robotSvg.classList.add('dancing');
        setTimeout(() => robotSvg.classList.remove('dancing'), 600);
      }
    });

    // 틀렸을 때 처리
    if (!found && typed !== '') {
      input.value = '';
      playFailSound();

      // 로봇 놀라기
      const robotSvg = document.getElementById('robot-svg');
      robotSvg.classList.remove('surprised');
      void robotSvg.offsetHeight;
      robotSvg.classList.add('surprised');
      setTimeout(() => robotSvg.classList.remove('surprised'), 400);

      // 화면 깜빡이기
      const gameContainer = document.getElementById('game-container');
      gameContainer.classList.add('fail');
      setTimeout(() => gameContainer.classList.remove('fail'), 300);
    }
  }
});

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

    playCountSound();

    count--;

    if (count < 0) {
      clearInterval(interval);
      countdown.classList.remove('active');

      gameStartTime = Date.now();  // ← 이 줄 추가

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
  const settings = getDifficultySettings();
  const interval = settings.spawnInterval;

  createWord();
  setTimeout(startSpawning, interval);
}

window.onload = function () {
  document.getElementById('start-btn').addEventListener('click', function () {
    playStartSound();

    document.getElementById('start-screen').style.display = 'none';

    document.getElementById('game-container').classList.add('active');
    loadBestScore();
    showCountdown();
  });

  document.getElementById('restart-btn').addEventListener('click', function () {
    playClickSound();
    location.reload();
  });

  setInterval(levelUp, 20000);

  // 게임 시간 실시간 업데이트
  setInterval(updateGameTime, 500);
};

// 스크린샷 기능 (SNS 공유용)
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('screenshot-btn').addEventListener('click', function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 600;

    // 배경 그라데이션
    ctx.fillStyle = '#0d0015';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1a0033';
    ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

    // 테두리
    ctx.strokeStyle = '#ff2d9b';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // 게임 제목
    ctx.fillStyle = '#ff2d9b';
    ctx.font = 'bold 56px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SEOUL-2077', canvas.width / 2, 120);

    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#00ffff';
    ctx.fillText('HANGUL BREACH', canvas.width / 2, 170);

    // 구분선
    ctx.strokeStyle = '#ff2d9b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 200);
    ctx.lineTo(canvas.width - 100, 200);
    ctx.stroke();

    // 게임 통계
    ctx.font = '28px Arial';
    ctx.fillStyle = '#ff2d9b';
    const finalScore = document.getElementById('final-score').textContent;
    const bestScore = document.getElementById('best-score').textContent;
    const level = document.getElementById('level').textContent;
    const combo = document.getElementById('combo').textContent;

    ctx.textAlign = 'left';
    ctx.fillText(`최종 점수: ${finalScore}`, 120, 280);
    ctx.fillStyle = '#00ffff';
    ctx.fillText(`최고 점수: ${bestScore}`, 120, 330);
    ctx.fillStyle = '#ff2d9b';
    ctx.fillText(`도달 레벨: ${level}`, 120, 380);
    ctx.fillStyle = '#00ffff';
    ctx.fillText(`최대 콤보: ${combo}`, 120, 430);

    // 구분선
    ctx.strokeStyle = '#ff2d9b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 460);
    ctx.lineTo(canvas.width - 100, 460);
    ctx.stroke();

    // 게임 링크 및 정보
    ctx.font = '20px Arial';
    ctx.fillStyle = '#00ffff';
    ctx.textAlign = 'center';
    ctx.fillText('지금 바로 플레이!', canvas.width / 2, 510);

    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#ff2d9b';
    ctx.fillText('cyberfunk-hangle.netlify.app', canvas.width / 2, 550);

    // 다운로드
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `SEOUL-2077-${finalScore}-${new Date().getTime()}.png`;
    link.click();

    playClickSound();
  });
});