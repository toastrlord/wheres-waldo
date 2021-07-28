let trackMouse = true;
let characters = [];
let startTime;

const timer = document.createElement('div');
timer.id = 'timer';
timer.textContent = '0.00';
timer.style.display = 'none';
document.body.appendChild(timer);
let timerInterval;
const circle = document.querySelector('#circle');
const image = document.querySelector('#image');
const buttonContainer = document.querySelector('#buttonContainer');
const scoreForm = document.querySelector('form');
const scoreField = document.querySelector('#score');
const selectionSize = 40; // diameter of the selection area, in pixels
const screenCover = document.querySelector('#screenCover');
const startButton = document.querySelector('#startButton');
const loadingText = document.querySelector('#loadingText');
circle.style.width = selectionSize + 'px';
circle.style.height = selectionSize + 'px';
let buttonContainerHeight = 0;
let currentScore;

(function loadCharacters() {
    let characterElements = document.querySelectorAll('.character');
    characterElements.forEach(c => {
        characters.push(c.textContent);
    });
})();

// TODO: wait until ALL images are loaded to start timer
// FIXME: going away from page for some time prevents thumbnails from being loaded
(function loadThumbnails() {
    const promises = [];
    characters.forEach(character => {
        const loadedPromise = new Promise((resolve, reject) => {
            const img = new Image();
            img.src = '/images/character_thumbnails/' + character.toLowerCase() + '.png';
            img.addEventListener('load', (e) => {
                resolve(img);
            });
        });
        promises.push(loadedPromise);
    });
    const mainImagePromise = new Promise((resolve, reject) => {
        const img = new Image();
        img.src = image.src;
        img.addEventListener('load', (e) => {
            resolve(img);
        });
    });
    promises.push(mainImagePromise);
    Promise.all(promises)
    .then(() => {
        loadingText.textContent = 'Ready';
        startButton.addEventListener('click', () => {
            startGame();
        });
        startButton.style.display = 'block';
    });
})();

function startGame() {
    screenCover.style.display = 'none';
    startTime = Date.now();
    timer.style.display = 'block';
    timerInterval = window.setInterval(() => {
        let currentTime = (Date.now() - startTime) / 1000;
        timer.textContent = currentTime.toFixed(2);
    }, 10);
}

function gameOver() {
    // display score form
    window.clearInterval(timerInterval);
    timer.style.display = 'none';
    circle.style.display = 'none';
    loadingText.style.display = 'none';
    score.value = currentScore;
    screenCover.style.display = 'flex';
    startButton.style.display = 'none';
    scoreForm.style.display = 'flex';
}

function removeCharacter(characterName) {
    characters.splice(characters.indexOf(characterName), 1);
    if (characters.length === 0) {
        gameOver();
    }
}

function validateSelection(x, y, radius, characterName) {
    const request = new XMLHttpRequest();
    request.open('GET', window.location.href + `/validate?x=${x}&y=${y}&r=${radius}&characterName=${characterName}&score=${currentScore}`);
    request.send();

    return new Promise((resolve, reject) => {
        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200 && request.responseText === 'true') {
                    resolve(characterName);
                }
                else {
                    reject(false);
                }
            }
        };
    });
}

function moveCircle(x, y) {
    circle.style.left = x - circle.clientWidth / 2 + 'px';
    circle.style.top = y - circle.clientHeight / 2 + 'px';
}

function resetButtonContainer() {
    buttonContainer.style.display = 'none';
    while (buttonContainer.firstChild) {
        buttonContainer.removeChild(buttonContainer.firstChild);
    }
}

function getCurrentScore() {
    return ((Date.now() - startTime) / 1000).toFixed(2);
}

function createCharacterBar(pageX, pageY, imgX, imgY) {
    buttonContainer.style.display = 'flex';
    buttonContainer.style.left = pageX - selectionSize + 'px';
    buttonContainer.style.width = selectionSize * 2 + 'px';
    characters.forEach(character => {
        const innerContainer = document.createElement('div');
        innerContainer.style.display = 'flex';
        innerContainer.style.flexDirection = 'column';
        const characterButton = document.createElement('div');
        characterButton.classList.add('pickCharacter');
        characterButton.textContent = character;
        characterButton.addEventListener('click', (e) => {
            currentScore = getCurrentScore();
            const result = validateSelection(imgX, imgY, selectionSize / 2, character);
            result.then((characterName, failure) => {
                removeCharacter(characterName);
            }, reason => {
            });
            trackMouse = true;
            moveCircle(e.clientX, e.clientY);
            circle.style.position = 'fixed';
            resetButtonContainer();
        });
        const image = document.createElement('img');
        image.src = '/images/character_thumbnails/' + character.toLowerCase() + '.png';
        innerContainer.appendChild(image);
        innerContainer.appendChild(characterButton);
        buttonContainer.appendChild(innerContainer);
    });
    document.body.appendChild(buttonContainer);
    if (!buttonContainerHeight) { // TODO: need to fix, doesn't work right if you click before the images are loaded
        buttonContainerHeight = buttonContainer.clientHeight;
    }
    buttonContainer.style.top = pageY - selectionSize / 2 - buttonContainerHeight + 'px';
}

document.addEventListener('mousemove', (e) => {
    if (trackMouse) {
        moveCircle(e.clientX, e.clientY);
    }
});

image.addEventListener('mousedown', (e) => {
    if (!trackMouse) { // if we've already clicked somewhere, clear previous selection
        trackMouse = true;
        circle.style.position = 'fixed';
        moveCircle(e.clientX, e.clientY);
        resetButtonContainer();
    }
    else {
        const rect = e.target.getBoundingClientRect();
        const imgX = Math.trunc(e.clientX - rect.left);
        const imgY = Math.trunc(e.clientY - rect.top);
        moveCircle(e.pageX, e.pageY);
        circle.style.position = 'absolute';
        createCharacterBar(e.pageX, e.pageY, imgX, imgY);
        trackMouse = false;
    }
});