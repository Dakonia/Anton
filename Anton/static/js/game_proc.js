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

// Параметры медведя
let bearJumping = false;
let bearBottom = 90;
let jumpCount = 0;
let gravity = -1.5;
let velocity = 23;
let doubleJumpVelocity = 19;
let velocityY = 0;
let fallSpeed = -0.2;
let gameRunning = false;
let progressBarAnimationFrame = null; 

const obstacleTypes = ["obstacle1", "obstacle2", "obstacle3", "obstacle4"];

// Обработка нажатия пробела для прыжка
document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        event.preventDefault();

        if (!bearJumping) {
            jumpCount = 1;
            performJump();
        } else if (jumpCount === 1) {
            jumpCount = 2;
            performDoubleJump();
        }
    }
});

// Функция для выполнения первого прыжка
function performJump() {
    bearJumping = true;
    velocityY = velocity;
    jumpAnimation();
}

// Функция для выполнения двойного прыжка
function performDoubleJump() {
    bearJumping = true;
    velocityY = doubleJumpVelocity;
    jumpAnimation();
}

// Анимация прыжка медведя
function jumpAnimation() {
    if (jumpCount === 2 && velocityY < 0) {
        velocityY += fallSpeed;
    } else {
        velocityY += gravity;
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
    setTimeout(createObstacle, Math.random() * 2000 + 1000);
}

// Проверка на столкновение медведя с препятствием
function checkCollision(obstacleLeft, obstacleHeight) {
    if (obstacleLeft < 100 && obstacleLeft > 50 && bearBottom < obstacleHeight + 90) {
        if (gameRunning) {
            showGameOverModal();
            bearFall();
            gameRunning = false;
        }
        return true;
    }
    return false;
}

// Анимация падения медведя
function bearFall() {
    const bearLeft = parseInt(window.getComputedStyle(bear).getPropertyValue("left"));
    bear.style.left = (bearLeft - (bearLeft * 0.9)) + "px";
    bear.style.transform = "rotate(-90deg)";
    const bearBottom = parseInt(window.getComputedStyle(bear).getPropertyValue("bottom"));
    bear.style.bottom = (bearBottom - 50) + "px";
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
    resetGameVariables();
    startCountdown();
});

// Функция сброса переменных игры
function resetGameVariables() {
    bearBottom = 90;
    bearJumping = false;
    jumpCount = 0;
    velocityY = 0;

    bear.style.bottom = bearBottom + "px";
    bear.style.transform = "rotate(0deg)";
    bear.style.left = "0";

    progressBar.style.width = "0%"; 
    while (obstaclesContainer.firstChild) {
        obstaclesContainer.removeChild(obstaclesContainer.firstChild);
    }
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
            gameContainer.style.display = "none"; // Скрыть блок игры
            document.getElementById("end-game").style.display = "block"; 
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
            fillProgressBar(60000); 
        }
    }, 1000); 
}

// Событие для наблюдения за видимостью блока игры
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === "style" && gameContainer.style.display === "block") {
            startCountdown(); // Запуск отсчета, когда блок игры становится видимым
        }
    });
});

// Начать наблюдение за изменениями атрибута "style" в gameContainer
observer.observe(gameContainer, { attributes: true, attributeFilter: ["style"] });