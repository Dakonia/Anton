// Объявление переменных
const gameContainer = document.getElementById("game");
const bear = document.getElementById("game-bear");
const obstaclesContainer = document.getElementById("obstacles-container");
const gameBack1 = document.getElementById("game-back1");
const gameBack2 = document.getElementById("game-back2");
const modal = document.getElementById("game-over-modal");
const restartButton = document.getElementById("restart-button");
const progressBar = document.getElementById("progress-bar");
const countdownElement = document.getElementById("countdown");
const backgroundMusic = document.getElementById("background-music");
const jumpSound = document.getElementById("jump-sound");
const Mute = document.getElementById('mute');
const Unmute = document.getElementById('unmute');
const crashJump = document.getElementById('crash-jump');
const stopButton = document.getElementById('stop'); 
const CrashBear = document.getElementById('crash-bear');
 


// let backgroundAnimationFrame;
// Параметры медведя
let bearJumping = false;
let bearBottom = 50;
let jumpCount = 0;
let gravity = -1.5;
let velocity = 24;
let doubleJumpVelocity = 19;
let velocityY = 0;
let singleJumpFallSpeed = -0.2; // медленнее падение для одиночного прыжка
let doubleJumpFallSpeed = -0.08;
let gameRunning = false;
let progressBarAnimationFrame = null; 
let isPaused = false; 
let lastObstaclePosition = 1200;

const obstacleTypes = ["obstacle1", "obstacle2", "obstacle3", "obstacle4", "obstacle5", "obstacle6"];

// Обработка нажатия пробела для прыжка
document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        event.preventDefault();

        // Проверяем, если игра не активна (gameRunning = false), прыжок не выполняется
        if (!gameRunning) {
            return;
        }

        if (!bearJumping) {
            jumpCount = 1;
            performJump();
        } else if (jumpCount === 1) {
            jumpCount = 2;
            performDoubleJump();
        }
    }
});


// Функция для воспроизведения фоновой музыки
function playBackgroundMusic() {
    backgroundMusic.volume = 0.5; // Установка громкости фоновой музыки
    backgroundMusic.play();
}

function crashJumps(){
    crashJump.currentTime = 0;
    crashJump.play();
}

stopButton.addEventListener("click", function () {
    isPaused = !isPaused; // Переключаем флаг паузы

    if (isPaused) {
        gameRunning = false;
        backgroundMusic.pause(); // Останавливаем музыку
        cancelAnimationFrame(progressBarAnimationFrame); // Останавливаем анимацию прогресс-бара
        resetGameVariables() 
        
    } else {
        gameRunning = true; // Возобновляем игру
        backgroundMusic.play(); // Воспроизводим музыку
        requestAnimationFrame(moveBackground); // Возобновляем движение фона
        createObstacle(); // Возобновляем создание препятствий
        fillProgressBar(60000); // Возобновляем прогресс-бар
        setSoundState(loadSoundState());
    }
});

// Функция для остановки фоновой музыки
function stopBackgroundMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; // Сброс времени воспроизведения
}

function playJumpSound() {
    let jumpSoundClone = jumpSound.cloneNode(); // Клонируем звук
    jumpSoundClone.play(); // Воспроизводим клон
}
function stopJumpSound(){
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

// Функция для выполнения первого прыжка
function performJump() {
    bearJumping = true;
    velocityY = velocity;
    playJumpSound();
    jumpAnimation();
}

// Функция для выполнения двойного прыжка
function performDoubleJump() {
    bearJumping = true;
    velocityY = doubleJumpVelocity;
    playJumpSound();
    jumpAnimation();
}

// Анимация прыжка медведя
function jumpAnimation() {
    if (jumpCount === 2 && velocityY < 0) {
        velocityY += doubleJumpFallSpeed; // обычная скорость падения для двойного прыжка
    } else if (jumpCount === 1 && velocityY < 0) {
        velocityY += singleJumpFallSpeed; // медленное падение для одиночного прыжка
    } else {
        velocityY += gravity; // гравитация
    }
    
    bearBottom += velocityY;

    if (bearBottom <= 90) {
        bearBottom = 90;
        bearJumping = false;
        jumpCount = 0;
        velocityY = 0;
    }
    bear.style.bottom = bearBottom + "px";


    if (bearJumping) {
        requestAnimationFrame(jumpAnimation);
    }
}

// Создание препятствия
function createObstacle() {
    if (!gameRunning) return;
    const obstacle = document.createElement("div");

    const randomType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    obstacle.classList.add(randomType);

    obstacle.style.left = "1200px";
    obstacle.style.zIndex = 3;
    obstaclesContainer.appendChild(obstacle);

    let obstacleInterval = setInterval(() => {
        if (!gameRunning) {
            clearInterval(obstacleInterval);
            return;
        }
        let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));
        if (obstacleLeft < -100) {
            clearInterval(obstacleInterval);
            obstaclesContainer.removeChild(obstacle);
        } else {
            obstacle.style.left = (obstacleLeft - 10) + "px";
        }

        const obstacleHeight = parseInt(window.getComputedStyle(obstacle).getPropertyValue("height"));
        if (checkCollision(obstacleLeft, obstacleHeight)) {
            clearInterval(obstacleInterval);
        }
    }, 20);
    setTimeout(createObstacle, Math.random() * 2000 + 1300);
}

// Проверка на столкновение медведя с препятствием
function checkCollision(obstacleLeft, obstacleHeight) {
    if (obstacleLeft < 100 && obstacleLeft > 50 && bearBottom < obstacleHeight + 90) {
        if (gameRunning) {
            crashJumps();
            showGameOverModal();
            bearFall();
            stopBackgroundMusic();
            gameRunning = false;
        }
        return true;
    }
    return false;
}


// Анимация падения медведя
function bearFall() {
    CrashBear.style.display = 'block';
    bear.style.display = 'none';
}
function bearStart() {
    CrashBear.style.display = 'none';
    bear.style.display = 'block';
}


// Отображение модального окна "Конец игры"
function showGameOverModal() {
    while (obstaclesContainer.firstChild) {
        obstaclesContainer.removeChild(obstaclesContainer.firstChild);
    }
    modal.style.display = "block";
    cancelAnimationFrame(progressBarAnimationFrame); // Остановить анимацию прогресс-бара при проигрыше
}

// Обработка нажатия на кнопку "Попробовать снова"
restartButton.addEventListener("click", function () {
    modal.style.display = "none";
    bearStart();
    resetGameVariables();
    startCountdown();
    setSoundState(loadSoundState());
});

// Инициализация игры — остановка музыки по умолчанию, если состояние звука не "on"
if (!loadSoundState()) {
    stopBackgroundMusic();
    Unmute.style.display = 'block'; // Показать кнопку Unmute
    Mute.style.display = 'none'; // Скрыть кнопку Mute
}

// Функция сброса переменных игры
function resetGameVariables() {
    bearBottom = 90;
    bearJumping = false;
    jumpCount = 0;
    velocityY = 0;
    gameRunning = false;

    bear.style.bottom = bearBottom + "px";
    bear.style.transform = "rotate(0deg)";
    bear.style.left = "0";

    progressBar.style.width = "0%"; 
    while (obstaclesContainer.firstChild) {
        obstaclesContainer.removeChild(obstaclesContainer.firstChild);
    }
}
function resetPause() {
    while (obstaclesContainer.firstChild) {
        obstaclesContainer.removeChild(obstaclesContainer.firstChild);
    }
}

// Функция для отображения блока завершения игры "end-windows" и "end-game"
function showEndWindows() {
    // Отобразить блок end-windows
    document.getElementById("end-windows").style.display = "block";

    // Через 2 секунды скрыть end-windows и показать end-game
    setTimeout(() => {
        document.getElementById("end-windows").style.display = "none"; // Скрыть end-windows
        document.getElementById("end-game").style.display = "block"; // Показать end-game
    }, 2000); // 2000 миллисекунд = 2 секунды
}

// Заполнение полосы прогресса
function fillProgressBar(duration) {
    let startTime = Date.now();

    function updateProgress() {
        if (!gameRunning) return; 

        let elapsed = Date.now() - startTime;
        let progress = Math.min(elapsed / duration, 1);
        progressBar.style.width = (progress * 100) + "%";

        if (progress < 1) {
            progressBarAnimationFrame = requestAnimationFrame(updateProgress);
        } else {
            // Прогресс бар полностью заполнился - игра закончена
            gameRunning = false; // Остановка игры
            stopBackgroundMusic();
            resetGameVariables();
            gameContainer.style.display = "none"; // Скрыть блок игры

            // Показать блок end-windows на 2 секунды, а затем end-game
            showEndWindows();

            cancelAnimationFrame(progressBarAnimationFrame); 
        }
    }
    progressBarAnimationFrame = requestAnimationFrame(updateProgress);
}

// Функции для бесконечного фона
const backgroundWidth = 1200; 

gameBack1.style.width = (backgroundWidth + 10) + "px";
gameBack1.style.height = "77%";
gameBack1.style.position = "absolute";
gameBack1.style.top = "30px";
gameBack1.style.left = "0"; 
gameBack1.style.zIndex = 0; 

let gameBack1Clone = gameBack1.cloneNode(true);
gameBack1Clone.style.left = (backgroundWidth - 1) + "px"; 
gameBack1Clone.style.zIndex = 1; 
gameContainer.appendChild(gameBack1Clone);

gameBack2.style.width = (backgroundWidth + 10) + "px";
gameBack2.style.height = "90%"; 
gameBack2.style.position = "absolute";
gameBack2.style.top = "60px";
gameBack2.style.left = "0"; 
gameBack2.style.zIndex = 2; 

let gameBack2Clone = gameBack2.cloneNode(true);
gameBack2Clone.style.left = (backgroundWidth - 1) + "px"; 
gameBack2Clone.style.zIndex = 2; 
gameContainer.appendChild(gameBack2Clone);

// Функция для перемещения фонов
function moveBackground() {
    if (!gameRunning) return; 

    let back1Left = parseInt(window.getComputedStyle(gameBack1).getPropertyValue("left"));
    let back1CloneLeft = parseInt(window.getComputedStyle(gameBack1Clone).getPropertyValue("left"));
    let back2Left = parseInt(window.getComputedStyle(gameBack2).getPropertyValue("left"));
    let back2CloneLeft = parseInt(window.getComputedStyle(gameBack2Clone).getPropertyValue("left"));

    gameBack1.style.left = (back1Left - 1) + "px";
    gameBack1Clone.style.left = (back1CloneLeft - 1) + "px";
    gameBack2.style.left = (back2Left - 2) + "px";
    gameBack2Clone.style.left = (back2CloneLeft - 2) + "px";

    if (back1Left <= -backgroundWidth) {
        gameBack1.style.left = (backgroundWidth - 1) + "px";
    }
    if (back1CloneLeft <= -backgroundWidth) {
        gameBack1Clone.style.left = (backgroundWidth - 1) + "px";
    }
    if (back2Left <= -backgroundWidth) {
        gameBack2.style.left = (backgroundWidth - 1) + "px";
    }
    if (back2CloneLeft <= -backgroundWidth) {
        gameBack2Clone.style.left = (backgroundWidth - 1) + "px";
    }

    requestAnimationFrame(moveBackground);
}

// Функция для начала отсчета перед игрой
function startCountdown() {
    let count = 3; 
    countdownElement.style.display = "block"; 
    countdownElement.textContent = count; 

    let countdownInterval = setInterval(() => {
        count--; 
        countdownElement.textContent = count;

        if (count === 0) {
            clearInterval(countdownInterval); 
            countdownElement.style.display = "none"; 
            gameRunning = true;
            createObstacle(); 
            moveBackground(); 
            fillProgressBar(50000); 
        }
    }, 1000); 
}
// Инициализация игры — установка начального состояния звука
window.addEventListener('load', () => {
    const soundState = loadSoundState();
    setSoundState(soundState); // Установим состояние звука при загрузке страницы
});
// Функция для загрузки состояния звука из localStorage
function loadSoundState() {
    return localStorage.getItem("soundState") === "on"; // Вернет true, если soundState равен "on"
}

// Функция для сохранения состояния звука в localStorage
function saveSoundState(state) {
    localStorage.setItem("soundState", state ? "on" : "off");
}

// Функция для установки состояния звука и изменения отображения кнопок
function setSoundState(isSoundOn) {
    if (isSoundOn) {
        playBackgroundMusic();
        Unmute.style.display = 'none';
        Mute.style.display = 'block';
    } else {
        stopBackgroundMusic();
        Unmute.style.display = 'block';
        Mute.style.display = 'none';
    }
}

// Обработчики для кнопок Unmute и Mute
Unmute.addEventListener('click', function () {
    Unmute.style.display = 'none';
    Mute.style.display = 'block';
    playBackgroundMusic();
    saveSoundState(true); // Сохранить состояние звука как "включено"
});

Mute.addEventListener('click', function () {
    Mute.style.display = 'none';
    Unmute.style.display = 'block';
    stopBackgroundMusic();
    saveSoundState(false); // Сохранить состояние звука как "выключено"
});


// Событие для наблюдения за видимостью блока игры
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === "style" && gameContainer.style.display === "block") {
            startCountdown(); // Запуск отсчета
        }
    });
});

// Начать наблюдение за изменениями атрибута "style" в gameContainer
observer.observe(gameContainer, { attributes: true, attributeFilter: ["style"] });