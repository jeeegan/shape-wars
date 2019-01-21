const colors = {
  gridColor1 : "#03062a", // dark blue
  gridColor2 : "#036", // midnight blue
  gridColor3 : "white", // white
  lineColor : "#036", // midnight blue
  skyColor1 : "#e13cc0", // neon pink
  skyColor2 : "#572482", // purple
  skyColor3 : "#03062a" ,// dark blue
  sunColor1 : "#e13cc0", // neon pink
  sunColor2 : "#f95064", // red
  sunColor3 : "#f07850", // orange
  sunColor4 : "#fadc4b", // yellow
  skylineShadowColor : "#e13cc0", // neon pink
  horizonColor : "#18CAE6", // neon blue
  squareColor : "#ea1136", // neon red
  circleColor : "#39ff14", // neon green
  triangleColor : "#e13cc0", // neon pink
  textColor : "#18CAE6", // neon blue
  borderColor : "#e13cc0", // neon pink
  gameOver : "#f95064" // red
}
const width = 1000; // canvas width, other dimensions are on a fixed ratio of this
const height = width * 0.6;
const skyline = new Image();
skyline.src = "./img/skyline.png";
const skylineImgWidth = 0.93 * width;
const skylineImgHeight = 0.529 * skylineImgWidth;
const stars = new Image();
stars.src = "./img/stars.png";
const circleSound = new Sound("./sounds/circle.mp3");
const squareSound = new Sound("./sounds/square.mp3");
var backgroundMusic = new Sound("./sounds/background.mp3",true);
var frameSpeed = 15;
const game = new Game(colors,width,height,frameSpeed,stars,skyline,skylineImgWidth,skylineImgHeight,circleSound,squareSound);

document.onkeydown = getInput;

function startGame() {
  game.start();
  game.calcHorizontalDelta();
  displayNextFrame();
}

setInterval(() => {
  game.frames ++;
  if(game.frames === frameSpeed) { game.frames = 0;}
}, 20);

function getInput(e) { // listens for keyboard input
  if(game.gameOver === true && e.keyCode === 13) {
    game.reset();
  }
  switch(e.keyCode) {
    case 37: 
      game.triangle.moveLeft(game.width);
      break;
    case 39: 
      game.triangle.moveRight(game.width);
      break;
    case 32:
      backgroundMusic.play();
  }
  console.log(e.keyCode);
}

function renderGame() {
  game.clear();
  game.drawGridBackground();
  game.drawHorizontalLines();
  game.drawGrid();
  game.drawSky();
  game.drawStars();
  game.drawSun();
  game.drawSkyline();
  game.drawHorizon();
  game.drawTriangle();
  game.drawSquares();
  game.drawCircles();
  game.checkCrash();
  game.drawScore();
  game.drawLives();
  game.checkGameOver();
}

function displayNextFrame(){
  if(game.gameOver === false){
    renderGame();
  } else {
    game.clear();
    game.drawGridBackground();
    game.drawHorizontalLines();
    game.drawGrid();
    game.drawSky();
    game.drawStars();
    game.drawHorizon();
    game.drawGameOver();
  }
  window.requestAnimationFrame(displayNextFrame);
}

window.onload = function() {
  startGame();
}

