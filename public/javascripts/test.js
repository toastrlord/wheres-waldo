let trackMouse = true;
let characters = ['Waldo', 'Odlaw'];

const circle = document.querySelector('#circle');
const image = document.querySelector('#image');
const buttonContainer = createButtonContainer();
const selectionSize = 40; // diameter of the selection area, in pixels
circle.style.width = selectionSize + 'px';
circle.style.height = selectionSize + 'px';

// TODO: wait until ALL images are loaded to start timer
// FIXME: going away from page for some time prevents thumbnails from being loaded
(function preloadThumbnails() {
    characters.forEach(character => {
        const img = new Image();
        img.src = '/images/thumbnails/' + character.toLowerCase() + '.png';
    });
})();

function moveCircle(x, y) {
    circle.style.left = x - circle.clientWidth / 2 + 'px';
    circle.style.top = y - circle.clientHeight / 2 + 'px';
}

function createButtonContainer() {
    const container = document.createElement('div');
    container.classList.add('buttonContainer');

    return container;
}

function resetButtonContainer() {
    buttonContainer.style.display = 'none';
    while (buttonContainer.firstChild) {
        buttonContainer.removeChild(buttonContainer.firstChild);
    }
}

// FIXME: doesn't display properly on first click, but is fixed on subsequent clicks.
// seems to be related to image loading time- could be fixed by preloading thumbnails?
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
            /*  TODO: send message to server, get response on if it was a good selection
                if you guess correct, remove character from the array
                sendToServer(imgX, imgY, selectionSize / 2, character);
                characters = characters.filter(thisCharacter => thisCharacter != character);
            */
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
    buttonContainer.style.top = pageY - selectionSize / 2 - buttonContainer.clientHeight + 'px';
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