let trackMouse = true;
let characters = ['Waldo', 'Odlaw'];
const start = Date.now();

const timer = document.createElement('div');
timer.id = 'timer';
document.body.appendChild(timer);
window.setInterval(() => {
    let currentTime = (Date.now() - start) / 1000;
    timer.textContent = currentTime.toFixed(2);
}, 10);
const circle = document.querySelector('#circle');
const image = document.querySelector('#image');
const buttonContainer = document.querySelector('#buttonContainer');
const selectionSize = 40; // diameter of the selection area, in pixels
circle.style.width = selectionSize + 'px';
circle.style.height = selectionSize + 'px';
let buttonContainerHeight = 0;
let currentScore;

// TODO: wait until ALL images are loaded to start timer
// FIXME: going away from page for some time prevents thumbnails from being loaded
(function loadThumbnails() {
    const promises = [];
    characters.forEach(character => {
        const loadedPromise = new Promise((resolve, reject) => {
            const img = new Image();
            img.src = '/images/thumbnails/' + character.toLowerCase() + '.png';
            img.addEventListener('load', (e) => {
                console.log(`${character} thumbnail successfully loaded!`);
                resolve(img);
            });
        });
        promises.push(loadedPromise);
    });
    const mainImagePromise = new Promise((resolve, reject) => {
        const img = new Image();
        img.src = image.src;
        img.addEventListener('load', (e) => {
            console.log('Loaded main image!');
            resolve(img);
        });
    });
    promises.push(mainImagePromise);
    Promise.all(promises)
    .then(() => {
        console.log('all images loaded!');
    });
})();

function gameOver() {
    // display score form

}

function removeCharacter(characterName) {
    characters = caracters.splice(characters.indexOf(characterName), 1);
    if (characters.length === 0) {
        gameOver();
    }
}

function validateSelection(x, y, radius, characterName) {
    const request = new XMLHttpRequest();
    request.open('GET', 'url');
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify({
        x, y, radius, characterName
    }));

    return new Promise((resolve, reject) => {
        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 0) {
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
            currentScore = Date.now() - start;
            const result = validateSelection(imgX, imgY, selectionSize / 2, character);
            result.then((characterName, failure) => {
                removeCharacter(characterName);
            }, reason => {
                console.log('validation failed');
                removeCharacter(character);
            });
            trackMouse = true;
            moveCircle(e.clientX, e.clientY);
            circle.style.position = 'fixed';
            resetButtonContainer();
        });
        const image = document.createElement('img');
        image.src = '/images/thumbnails/' + character.toLowerCase() + '.png';
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