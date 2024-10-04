const trex = document.getElementById("trex");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const highScoreDisplay = document.getElementById("highScore");
const gameOverElement = document.getElementById('gameOver');
const spaceEnemy = document.getElementById('spaceEnemy');
const levelUpMessage = document.getElementById('levelUpMessage');
const spaceship = document.getElementById('spaceship'); 

let isJumping = false;
let isGameOver = false;
let gravity = 0.9;
let score = 0;
let level = 1;
let speed = 5;
let highScore = localStorage.getItem('highScore') || 0;
let difficultyIncreaseInterval = 5000;
let createCactusInterval;
let cactusIntervals = [];
let shootInterval;
let bulletSpeed = 10; 

const jumpSound = document.getElementById("jumpSound");
const gameOverSound = document.getElementById("gameOverSound");

document.addEventListener("keydown", function(event) {
    if (event.code === "Space" && !isJumping) {
        jump();
    }
});

document.addEventListener('touchstart', function() {
    if (!isJumping) {
        jump();
    }
});

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 20 - 10}px`;
        particle.style.bottom = '0px';
        const moveX = (Math.random() * 40 - 20) + 'px';
        const moveY = (Math.random() * 40 + 20) + 'px';
        particle.style.transform = `translate(${moveX}, ${moveY})`;
        particlesContainer.appendChild(particle);
        setTimeout(() => {
            particle.remove();
        }, 500);
    }
}

function jump() {
    jumpSound.play();
    createParticles();
    let position = 0;
    isJumping = true;
    trex.classList.add('jump');

    let upInterval = setInterval(() => {
        if (position >= 150) {
            clearInterval(upInterval);
            let downInterval = setInterval(() => {
                if (position <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                    trex.classList.remove('jump');
                } else {
                    position -= 7;
                    trex.style.bottom = position + 'px';
                }
            }, 15);
        } else {
            position += 7;
            trex.style.bottom = position + 'px';
        }
    }, 15);
}

function createCactus() {
    const cactus = document.createElement('div');
    cactus.classList.add('cactus');
    cactus.classList.add(Math.random() > 0.5 ? 'cactus1' : 'cactus2');
    document.getElementById("game").appendChild(cactus);

    let cactusPosition = 700;
    cactus.style.left = cactusPosition + 'px';

    let timer = setInterval(() => {
        if (cactusPosition <= -20) {
            clearInterval(timer);
            cactus.remove();
            increaseScore();
        } else {
            cactusPosition -= speed;
            cactus.style.left = cactusPosition + 'px';
        }

        let trexBottom = parseInt(window.getComputedStyle(trex).bottom);
        if (cactusPosition > 0 && cactusPosition < 40 && trexBottom < 40) {
            gameOver();
        }
    }, 20);

    cactusIntervals.push(timer);
}

function randomTime() {
    return Math.random() * 2000 + 1000;
}

function startGame() {
    createCactus();
    if (!isGameOver) {
        createCactusInterval = setTimeout(startGame, randomTime());
    }
}

function increaseScore() {
    score++;
    scoreDisplay.textContent = score;

    if (score % 10 === 0 && level === 1) {  
        level++;
        levelDisplay.textContent = "Level: " + level;
        showLevelUpMessage(); 
        changeBackground(level);  
        speed += 2;
    }

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreDisplay.textContent = "Лучший результат: " + highScore;
    }
}

function changeBackground(level) {
    const background1 = document.getElementById("background1");
    const background2 = document.getElementById("background2");

    if (level === 2) {
        background1.style.backgroundImage = `url('${backgrounds.level2}')`;
        background2.style.backgroundImage = `url('${backgrounds.level2}')`;
        removeCacti();
        spaceEnemy.classList.remove('hidden');
        spaceship.classList.remove('hidden'); 
        startShooting();
        increaseBulletSpeed(); 
        startSpaceshipMovement(); 
    }
}

function showLevelUpMessage() {
    levelUpMessage.classList.remove('hidden');
    levelUpMessage.classList.add('show');
    setTimeout(() => {
        levelUpMessage.classList.remove('show');
        levelUpMessage.classList.add('hidden');
    }, 3000); 
}

function removeCacti() {
    clearTimeout(createCactusInterval);
    cactusIntervals.forEach(interval => clearInterval(interval));
    document.querySelectorAll('.cactus').forEach(cactus => cactus.remove());
}

function startShooting() {
    shootInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(shootInterval);
            return;
        }

        const bullet = document.createElement('div');
        bullet.classList.add('bullet');
        document.getElementById("game").appendChild(bullet);

        let bulletPosition = spaceEnemy.offsetLeft;
        bullet.style.left = `${bulletPosition}px`;
        bullet.style.bottom = '10px';

        let bulletTimer = setInterval(() => {
            bulletPosition -= bulletSpeed; 
            bullet.style.left = `${bulletPosition}px`;

            let trexBottom = parseInt(window.getComputedStyle(trex).bottom);

            if (bulletPosition < 80 && bulletPosition > 0 && trexBottom < 60) {
                clearInterval(bulletTimer);
                bullet.remove();
                gameOver();
            }

            if (bulletPosition <= 0) {
                clearInterval(bulletTimer);
                bullet.remove();
                if (!isGameOver) {
                    increaseScore();  
                }
            }
        }, 20);
    }, 2000);
}

function startSpaceshipMovement() {
    let spaceshipPosition = -100; 
    spaceship.style.left = `${spaceshipPosition}px`;
    spaceship.style.top = `0px`; 

    let spaceshipInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(spaceshipInterval);
            return;
        }

        spaceshipPosition += 5;
        spaceship.style.left = `${spaceshipPosition}px`;

        if (spaceshipPosition > 700) { 
            spaceshipPosition = -100; 
        }
    }, 20);
}

function increaseBulletSpeed() {
    setInterval(() => {
        if (bulletSpeed < 20) {  
            bulletSpeed += 0.5;
        }
    }, 5000); 
}

function increaseDifficulty() {
    setInterval(() => {
        if (speed < 20) {
            speed += 0.5;
        }
    }, difficultyIncreaseInterval);
}

function gameOver() {
    isGameOver = true;
    gameOverSound.play();
    gameOverElement.classList.remove('hidden');
    trex.style.display = 'none';
    spaceEnemy.classList.add('hidden');
    spaceship.classList.add('hidden');

    clearTimeout(createCactusInterval);
    cactusIntervals.forEach(interval => clearInterval(interval));
    document.querySelectorAll('.cactus').forEach(cactus => cactus.remove());
    document.querySelectorAll('.bullet').forEach(bullet => bullet.remove());
}

function restartGame() {
    location.reload();
}

highScoreDisplay.textContent = "Лучший результат: " + highScore;

startGame();
increaseDifficulty();




