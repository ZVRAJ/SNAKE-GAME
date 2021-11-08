
let canv = document.querySelector('#game');
let display = canv.getContext('2d');
let d_score = document.querySelector("#scoredisplay");
let d_max = document.querySelector("#maxdisplay");

const box = 20;
const width = box * 21;
const height = box * 21;
const initialPoint = {
  x: (width - box) / 2,
  y: (height - box) / 2,
};

const snake = [initialPoint];
const appless = {
  x: Math.floor(Math.random() * 20 + 1) * box,
  y: Math.floor(Math.random() * 20 + 1) * box,
};

let ms = 120;
let score = 0;
let record = 0;
let dir = 'none';

const loop = () => {
  clearCanvas();
  d_max.innerText = record.toString().padStart(2, "0");
  apple();

  let [px, py] = [snake[0].x, snake[0].y];
  let [ax, ay] = [appless.x, appless.y];

  if (dir === 'left') px -= box;
  else if (dir === 'up') py -= box;
  else if (dir === 'right') px += box;
  else if (dir === 'down') py += box;

  if (px >= width) px = 0;
  if (px < 0) px = width;
  if (py >= height) py = 0;
  if (py < 0) py = height;

  if (px === ax && py === ay) {
    score += 10;
    d_score.innerText = score.toString().padStart(2, "0");
    ms = Math.round(ms * 0.97);
    updateAppleCoordinates();
    clearInterval(game);
    game = setInterval(loop, ms);
  } else {
    snake.pop();
  }

  if (snake.some((elem) => px === elem.x && py === elem.y)) {
    stopGame();
  } else {
    snake.unshift({ x: px, y: py });
  }

  snake.forEach((elem, index) => {
    display.fillStyle = index === 0 ? 'lime' : 'green';
    display.fillRect(elem.x, elem.y, box, box);
  });

  record = Math.max(score, record);
};

const clearCanvas = () => {
  display.fillStyle = '#f1f1f1';
  display.fillRect(0, 0, width, height);
};

const updateAppleCoordinates = () => {
  appless.x = Math.floor(Math.random() * 20 + 1) * box;
  appless.y = Math.floor(Math.random() * 20 + 1) * box;
};

const apple = () => {
  if (snake.some((elem) => elem.x === appless.x && elem.y === appless.y)) {
    updateAppleCoordinates();
    apple();
  } else {
    display.fillStyle = 'red';
    display.fillRect(appless.x, appless.y, box, box);
  }
};

// TANGLED
const stopGame = () => {
  clearInterval(game);
  setTimeout(showResult, 500);
};

// SHOW RESULT
const showResult = () => {
  clearCanvas();
  showScore();
  ctx.fillText('Press r to restart');
  ctx.font = `bold ${box * 3}px ${font}`;
};

// SPACEBAR TO RESTART
const restart = () => {
  clearInterval(game);
  updateAppleCoordinates();
  snake[0] = initialPoint;
  snake.length = 1;
  ms = 120;
  score = 0;
  dir = 'none';
  game = setInterval(loop, ms);
};

// USE KEYBOARDEVENT.KEYCODE'S
const controller = (e) => {
  if (e.keyCode === 32) restart();
  else if (e.keyCode === 37 && dir !== 'right') dir = 'left';
  else if (e.keyCode === 38 && dir !== 'down') dir = 'up';
  else if (e.keyCode === 39 && dir !== 'left') dir = 'right';
  else if (e.keyCode === 40 && dir !== 'up') dir = 'down';
};

// PRESS ANY KEY TO START
let game = setInterval(loop, ms);
document.addEventListener('keydown', controller);

