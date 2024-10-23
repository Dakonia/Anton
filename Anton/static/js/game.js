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
const gameBack = document.getElementById('exit-button-game');
const controlPlay = document.getElementById('control-play');
const controlMenu = document.getElementById('contol-menu');
const backMenu = document.getElementById('back-game');
const startCont = document.getElementById('start-button-cor');
const galaryMenu = document.getElementById('galary-menu');
const galaryBut = document.getElementById('galary-but');
const backMenus = document.getElementById('back-games');
const gameEnd = document.getElementById('game-end');
const restartGame =document.getElementById('restart')


let isGameVisible = false;

// Кнопки "МИФ" и "ФАКТ" в блоке end-game
const mythButton = document.getElementById("myth-button");
const factButton = document.getElementById("fact-button");

// Добавление блока promo-next к переменным
const promoNextBlock = document.getElementById("promo-next");

// Функция для загрузки всех медиа и js блока id="game"
function loadGameAssets(callback) {
    const images = [
        '/static/media/game/back1.png',
        '/static/media/game/back3.png',
        '/static/media/game/game-bear.svg',
        '/static/media/game/obstacle1.svg',
        '/static/media/game/obstacle2.svg',
        '/static/media/game/obstacle3.svg',
        '/static/media/game/obstacle4.svg',
        '/static/media/game/obstacle5.svg',
        '/static/media/game/obstacle6.svg',
        'static/media/game/bear-logo.svg',
        'static/media/game/like.svg',
        'static/media/game/dislike.svg',
        'static/media/game/bear-promo.svg',
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

controlPlay.addEventListener('click', function() {
    menuBlock.style.display = 'none';
    controlMenu.style.display = 'block';
});

galaryBut.addEventListener('click', function() {
    menuBlock.style.display = 'none';
    galaryMenu.style.display = 'block';
});

backMenu.addEventListener('click', function() {
    controlMenu.style.display = 'none';
    menuBlock.style.display = 'block';
});

backMenus.addEventListener('click', function() {
    galaryMenu.style.display = 'none';
    menuBlock.style.display = 'block';
});
restartGame.addEventListener('click', function(){
    gameEnd.style.display = 'none';
    menuBlock.style.display ='block';

});

startCont.addEventListener('click', function() {
    controlMenu.style.display = 'none';
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
            isGameVisible = true;
        });
    }, 2000); // 2 секунды
});

// Функция для скрытия всех блоков игры после завершения
function hideAllEndGameBlocks() {
    endGameBlock.style.display = 'none';
    falseQwestBlock.style.display = 'none';
    trueQwestBlock.style.display = 'none';
    finalGameBlock.style.display = 'none';
    promoNextBlock.style.display = 'none';
}

// Обработчик для кнопки "МИФ"
mythButton.addEventListener("click", () => {
    endGameBlock.style.display = 'none';
    falseQwestBlock.style.display = 'block';

    setTimeout(() => {
        falseQwestBlock.style.display = 'none';
        finalGameBlock.style.display = 'block';
        showFinalGameSequence();
    }, 4000);
});

// Обработчик для кнопки "ФАКТ"
factButton.addEventListener("click", () => {
    endGameBlock.style.display = 'none';
    trueQwestBlock.style.display = 'block';

    setTimeout(() => {
        trueQwestBlock.style.display = 'none';
        finalGameBlock.style.display = 'block';
        showFinalGameSequence();
    }, 4000);
});

// Функция для показа и скрытия блоков с задержкой
function showBlockWithDelay(showBlock, hideBlock, delay, callback) {
    // Показываем текущий блок
    showBlock.style.display = 'block';

    // Скрываем предыдущий блок, если он указан
    if (hideBlock) {
        hideBlock.style.display = 'none';
    }

    // Через указанное время скрываем текущий блок и вызываем обратный вызов
    setTimeout(() => {
        showBlock.style.display = 'none';
        if (callback) callback();
    }, delay);
}

// Изменение обработчика для блока finalGameBlock
function showFinalGameSequence() {
    const finalVideo = document.getElementById('final-video');

    // Показываем блок final-game1
    finalGameBlock.style.display = 'block';

    // Устанавливаем обработчик события ended для видео
    finalVideo.onended = function() {
        // Задержка в 2 секунды перед переходом к следующему блоку
        setTimeout(() => {
            // Скрываем блок finalGameBlock
            finalGameBlock.style.display = 'none';

            // Показываем блок promo-next
            promoNextBlock.style.display = 'block';

            // Показываем блок game-end через 3 секунды
            setTimeout(() => {
                promoNextBlock.style.display ='none'
                gameEnd.style.display = 'block';
            }, 3000); // 3 секунды
        }, 2000); // 2 секунды после окончания видео
    };
}

// Инициализация: скрытие всех блоков после загрузки и показываем главное меню
document.addEventListener("DOMContentLoaded", () => {
    hideAllEndGameBlocks();
    menuBlock.style.display = 'block';
});



