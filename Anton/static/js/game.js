// Объявление переменных
const playButton = document.getElementById('play-button');
const menuBlock = document.getElementById('menu-block');
const menuControl = document.getElementById('menu-control');
const exitButton = document.getElementById('exit-button');
const startButton = document.getElementById('start-button');
const startWindows = document.getElementById('start-windows');
const gameBlock = document.getElementById('game');
const endGameBlock = document.getElementById("end-game");
const falseQwestBlock = document.getElementById("false-qwest");
const trueQwestBlock = document.getElementById("true-qwest");
const finalGameBlock = document.getElementById("final-game1");

let isGameVisible = false; // Переменная для отслеживания видимости блока игры

// Кнопки "МИФ" и "ФАКТ" в блоке end-game
const mythButton = document.getElementById("myth-button");
const factButton = document.getElementById("fact-button");

// Функция для загрузки всех медиа и js блока id="game"
function loadGameAssets(callback) {
    const images = [
        '/static/media/game/back1.png',
        '/static/media/game/back3.png',
        '/static/media/game/game-bear.svg',
        '/static/media/game/obstacle1.png',
        '/static/media/game/obstacle2.png',
        '/static/media/game/obstacle3.png',
        '/static/media/game/obstacle4.png',
    ];
    
    let loadedImages = 0;

    images.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            loadedImages++;
            if (loadedImages === images.length) {
                callback(); // Вызов обратного вызова после загрузки всех изображений
            }
        };
    });
}

// При нажатии на кнопку "Играть" скрываем меню и показываем управление
playButton.addEventListener('click', function() {
    menuBlock.style.display = 'none';
    menuControl.style.display = 'block';
});

// При нажатии на кнопку "Выход" возвращаемся к меню
exitButton.addEventListener('click', function() {
    menuControl.style.display = 'none';
    menuBlock.style.display = 'block';
});

// Обработчик события для кнопки "Начать"
startButton.addEventListener('click', function() {
    menuControl.style.display = 'none';
    startWindows.style.display = 'block';
    
    // Показываем стартовый экран на 2 секунды
    setTimeout(() => {
        // Загружаем медиафайлы
        loadGameAssets(() => {
            // После загрузки всех медиафайлов показываем блок игры
            startWindows.style.display = 'none';
            gameBlock.style.display = 'block';
            isGameVisible = true; // Устанавливаем флаг видимости игры
        });
    }, 2000); // 2 секунды
});

// Функция для скрытия всех блоков игры после завершения
function hideAllEndGameBlocks() {
    endGameBlock.style.display = 'none';
    falseQwestBlock.style.display = 'none';
    trueQwestBlock.style.display = 'none';
    finalGameBlock.style.display = 'none';
}

// Обработчик для кнопки "МИФ"
mythButton.addEventListener("click", () => {
    endGameBlock.style.display = 'none'; 
    falseQwestBlock.style.display = 'block'; 

    setTimeout(() => {
        falseQwestBlock.style.display = 'none'; 
        finalGameBlock.style.display = 'block'; 
    }, 4000); 
});

// Обработчик для кнопки "ФАКТ"
factButton.addEventListener("click", () => {
    endGameBlock.style.display = 'none'; 
    trueQwestBlock.style.display = 'block'; 

    setTimeout(() => {
        trueQwestBlock.style.display = 'none'; 
        finalGameBlock.style.display = 'block'; 
    }, 4000); 
});

// Инициализация: скрытие всех блоков после загрузки и показываем главное меню
document.addEventListener("DOMContentLoaded", () => {
    hideAllEndGameBlocks();
    menuBlock.style.display = 'block'; 
});
