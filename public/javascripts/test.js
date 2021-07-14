console.log('hello!');

const circle = document.querySelector('#circle');
const image = document.querySelector('#image');

function moveCircle(x, y) {
    circle.style.left = x - circle.clientWidth / 2 + 'px';
    circle.style.top = y - circle.clientHeight / 2 + 'px';
}

image.addEventListener('mousedown',(e) => {
    console.log(`Client coords: (${e.clientX}, ${e.clientY})`);
});

document.addEventListener('mousemove', (e) => {
    moveCircle(e.pageX, e.pageY);
});

// need to ensure selection circle keeps pace when we scroll, too
document.addEventListener('scroll', (e) => {
    moveCircle(e.pageX, e.pageY);
});

document.addEventListener('mousedown', (e) => {
    console.log(`Global coords: (${e.pageX},${e.pageY})`);
});