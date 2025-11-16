// Скрипт для мінігри «Полювання на зайве “й”»
document.addEventListener('DOMContentLoaded', () => {
  // Елементи інтерфейсу
  const startScreen = document.getElementById('start-screen');
  const startBtn = document.getElementById('start-btn');
  const gameContainer = document.getElementById('game-container');
  const wordDisplay = document.getElementById('word-display');
  const spellBtn = document.getElementById('spell-btn');
  const explanationEl = document.getElementById('explanation');
  const livesContainer = document.getElementById('lives-container');
  const scoreCount = document.getElementById('score-count');
  const timeFill = document.getElementById('time-fill');
  const timeLabel = document.getElementById('time-label');
  const finishScreen = document.getElementById('finish-screen');
  const finishText = document.getElementById('finish-text');
  const generalProgressFill = finishScreen.querySelector('.general-progress-fill');
  const generalProgressText = finishScreen.querySelector('.general-progress-text');

  // Массив слів: старі форми (із зайвою й) та нові форми
  const words = [
    {
      text: 'фойє',
      isOld: true,
      newForm: 'фоє',
      explanation:
        'У новій редакції правопису слово «фойє» пишемо без й: «фоє»【909614211959312†L570-L576】.',
    },
    {
      text: 'фоє',
      isOld: false,
      newForm: 'фоє',
      explanation: 'Правильно «фоє» — ця форма вже без зайвої букви.',
    },
    {
      text: 'майя',
      isOld: true,
      newForm: 'мая',
      explanation:
        'Назву «майя» (народність) у новій редакції пишемо без й: «мая»【909614211959312†L570-L576】.',
    },
    {
      text: 'мая',
      isOld: false,
      newForm: 'мая',
      explanation: 'Слово «мая» — це правильна форма в новому правописі.',
    },
    {
      text: 'Фейєрбах',
      isOld: true,
      newForm: 'Феєрбах',
      explanation:
        'Прізвище філософа пишемо «Феєрбах», без подвоєного й【909614211959312†L570-L576】.',
    },
    {
      text: 'Феєрбах',
      isOld: false,
      newForm: 'Феєрбах',
      explanation: '«Феєрбах» — правильне написання без подвоєного й.',
    },
    {
      text: 'Гойя',
      isOld: true,
      newForm: 'Гоя',
      explanation: 'Старе написання «Гойя» тепер передаємо як «Гоя»【909614211959312†L570-L576】.',
    },
    {
      text: 'Гоя',
      isOld: false,
      newForm: 'Гоя',
      explanation: '«Гоя» — правильне написання без зайвого й.',
    },
    {
      text: 'Савойя',
      isOld: true,
      newForm: 'Савоя',
      explanation: 'Відтепер пишемо «Савоя» без букви й【909614211959312†L570-L576】.',
    },
    {
      text: 'Савоя',
      isOld: false,
      newForm: 'Савоя',
      explanation: '«Савоя» — правильна форма.',
    },
    {
      text: 'Рамбуйє',
      isOld: true,
      newForm: 'Рамбує',
      explanation: 'Назву «Рамбуйє» тепер пишемо без й: «Рамбує»【909614211959312†L570-L576】.',
    },
    {
      text: 'Рамбує',
      isOld: false,
      newForm: 'Рамбує',
      explanation: '«Рамбує» — уже вірна форма без й.',
    },
    {
      text: 'Хайям',
      isOld: true,
      newForm: 'Хаям',
      explanation: 'Ім’я «Хайям» у новій редакції передаємо як «Хаям»【909614211959312†L570-L576】.',
    },
    {
      text: 'Хаям',
      isOld: false,
      newForm: 'Хаям',
      explanation: '«Хаям» — правильне написання.',
    },
  ];

  // Змінні стану гри
  let score = 0;
  let lives = 3;
  let timeLeft = 30;
  let timerInterval;
  let wordTimer;
  let hasClicked = false;
  let shuffledWords = [];
  let currentIndex = -1;

  // Генеруємо мерехтливі зірки
  function createStars() {
    const starContainer = document.getElementById('star-container');
    const numberOfStars = 70;
    for (let i = 0; i < numberOfStars; i++) {
      const star = document.createElement('span');
      star.classList.add('star');
      const size = Math.random() * 3 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDuration = `${Math.random() * 2 + 1.5}s`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      starContainer.appendChild(star);
    }
  }

  // Перемішуємо масив слів
  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Оновлення панелі життів
  function updateLives() {
    const hearts = livesContainer.querySelectorAll('.heart');
    hearts.forEach((heart, idx) => {
      if (idx < lives) {
        heart.style.opacity = '1';
      } else {
        heart.style.opacity = '0.3';
      }
    });
  }

  // Оновлення таймера
  function updateTimer() {
    timeLabel.textContent = `${timeLeft}`;
    const percent = (timeLeft / 30) * 100;
    timeFill.style.width = `${percent}%`;
    if (timeLeft <= 0) {
      endGame();
    }
  }

  // Показуємо наступне слово
  function nextWord() {
    // Якщо часу чи життів не залишилось — завершуємо
    if (timeLeft <= 0 || lives <= 0) {
      endGame();
      return;
    }
    hasClicked = false;
    currentIndex++;
    if (currentIndex >= shuffledWords.length) {
      // Якщо закінчилися слова, перемішуємо знову
      shuffledWords = shuffleArray(words);
      currentIndex = 0;
    }
    const current = shuffledWords[currentIndex];
    // Показуємо слово
    wordDisplay.textContent = current.text;
    // Ховаємо пояснення
    explanationEl.classList.add('hidden');
    explanationEl.textContent = '';
    // Запускаємо таймер переходу на наступне слово (2.5 c)
    clearTimeout(wordTimer);
    wordTimer = setTimeout(() => {
      // Якщо гравець не натиснув на стару форму — це не вважається помилкою,
      // просто переходимо далі
      nextWord();
    }, 2500);
  }

  // Обробка натискання заклинання
  function handleSpell() {
    if (hasClicked) return;
    hasClicked = true;
    clearTimeout(wordTimer);
    const current = shuffledWords[currentIndex];
    if (current.isOld) {
      // Правильний клік — слово містить зайву й
      score++;
      scoreCount.textContent = score;
      // Анімуємо очищення: спершу додаємо зелений відтінок, потім змінюємо текст
      wordDisplay.style.color = '#a1e7b2';
      setTimeout(() => {
        wordDisplay.textContent = current.newForm;
        wordDisplay.style.color = '#ffd27f';
      }, 300);
      // Пояснення
      explanationEl.textContent = current.explanation;
      explanationEl.classList.remove('hidden');
      // Переходимо до наступного слова через затримку
      setTimeout(() => {
        nextWord();
      }, 1200);
    } else {
      // Неправильний клік — слово вже правильне
      lives--;
      updateLives();
      // Підсвічуємо слово червоним
      const originalColor = wordDisplay.style.color;
      wordDisplay.style.color = '#e57373';
      setTimeout(() => {
        wordDisplay.style.color = originalColor || '#ffd27f';
      }, 300);
      // Пояснення
      explanationEl.textContent =
        'Це слово вже написано за новою нормою, не потрібно нічого змінювати.';
      explanationEl.classList.remove('hidden');
      // Якщо життя закінчилися — завершення буде у nextWord через перевірку
      setTimeout(() => {
        nextWord();
      }, 1200);
    }
  }

  // Запуск гри
  function startGame() {
    startScreen.classList.add('hidden');
    finishScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    // Скидаємо стан
    score = 0;
    lives = 3;
    timeLeft = 30;
    scoreCount.textContent = 0;
    updateLives();
    // Перемішуємо слова
    shuffledWords = shuffleArray(words);
    currentIndex = -1;
    // Оновлюємо таймер перед стартом
    updateTimer();
    // Запускаємо основний таймер
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimer();
    }, 1000);
    // Показуємо перше слово
    nextWord();
  }

  // Завершення гри
  function endGame() {
    // Очищаємо таймери
    clearInterval(timerInterval);
    clearTimeout(wordTimer);
    // Приховуємо ігровий контейнер
    gameContainer.classList.add('hidden');
    // Оновлюємо текст фінального екрана залежно від результату
    if (lives <= 0) {
      finishText.innerHTML =
        'Закляття закінчилося! Ти втратив усі життя. Спробуй ще раз і будь уважнішим.';
    } else {
      finishText.innerHTML =
        'Вітаємо! Ти очистив слова від зайвої букви. Продовжуй свою магічну подорож!';
    }
    // Оновлюємо загальний прогрес (4/9)
    if (generalProgressFill) {
      generalProgressFill.style.width = `${(4 / 9) * 100}%`;
    }
    if (generalProgressText) {
      generalProgressText.innerHTML = '4&nbsp;/&nbsp;9';
    }
    // Показуємо фінальний екран
    finishScreen.classList.remove('hidden');
  }

  // Події
  startBtn.addEventListener('click', startGame);
  spellBtn.addEventListener('click', handleSpell);
  // Створюємо зірковий фон при завантаженні
  createStars();
});