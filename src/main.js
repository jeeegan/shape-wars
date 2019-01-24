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
  gameOver : "#f95064", // red
  laserColor : "#18CAE6", // neon blue
}
const colorsAlt = {
  gridColor1 : "black",
  gridColor2 : "black",
  gridColor3 : "#036", // midnight blue
  lineColor : "red", 
  skyColor1 : "black",
  skyColor2 : "black", 
  skyColor3 : "red" ,
  sunColor1 : "red", 
  sunColor2 : "red", 
  sunColor3 : "#f07850", // orange
  sunColor4 : "#f07850", // yellow
  skylineShadowColor : "red",
  horizonColor : "red", 
  squareColor : "#ea1136", // neon red
  circleColor : "white",
  triangleColor : "white",
  textColor : "white",
  borderColor : "red",
  gameOver : "white", 
  laserColor : "white",
}
const width = 1000; // canvas width, other dimensions are on a fixed ratio of this
const height = width * 0.6;
const skyline = new Image();
skyline.src = "./img/skyline.png";
const skylineImgWidth = 0.93 * width;
const skylineImgHeight = 0.529 * skylineImgWidth;
const skylineAlt = new Image();
skylineAlt.src = "./img/skylineAlt.png";
const stars = new Image();
stars.src = "./img/stars.png";
const circleSound = new Sound("./sounds/circle.mp3");
const squareSound = new Sound("./sounds/square.mp3");
var backgroundMusic = new Sound("./sounds/background.mp3",true);
var backgroundMusicAlt = new Sound("./sounds/backgroundAlt.mp3",true);
const destroySound = new Sound("./sounds/destroy.mp3");
const laserSound = new Sound("./sounds/laser.mp3");
var frameSpeed = 10;
const game = new Game(colors,width,height,frameSpeed,stars,skyline,skylineImgWidth,skylineImgHeight,backgroundMusic,circleSound,squareSound,destroySound,laserSound);

document.onkeydown = getInput;

function startGame() {
  game.load();
  game.calcHorizontalDelta();
  displayNextFrame();
}

setInterval(() => {
  game.frames ++;
  if(game.frames === game.frameSpeed) { game.frames = 0;}
}, 20);

function getInput(e) { // listens for keyboard input
  if(game.gameOver === true && e.keyCode === 13) {
    game.reset();
    // enter key
  } else if(game.gameStarted === false && e.keyCode === 13) {
    game.start();
  } // enter key
  if(game.gameStarted === true && e.keyCode === 80) {
    game.togglePauseScreen();
  } // enter key
  switch(e.keyCode) {
    case 37:  // left arrow
      game.triangle.moveLeft(game.width);
      break;
    case 39: // right arrow
      game.triangle.moveRight(game.width);
      break;
    case 83: // s key
      game.toggleSound();
      break;
    case 82: // r key
      game.backgroundMusic.stop();
      game.backgroundMusic = backgroundMusic;
      game.colors = colors;
      game.altTheme = false;
      game.reset();
      break;
    case 70: // f key
      game.fullscreen();
      break;
    case 32: // spacebar
      game.fireLaser = true
      break;
    case 72: // h key
      game.toggleHeroMode();
      break;
    case 65: // a key
      game.toggleAltTheme();
      if(game.altTheme === true) {
        game.backgroundMusic.stop();
        game.backgroundMusic = backgroundMusicAlt;
        game.colors = colorsAlt;
        game.reset();
      } else {
        game.backgroundMusic.stop();
        game.backgroundMusic = backgroundMusic;
        game.colors = colors;
        game.reset();
      }
    default:
      // nothing yet...
  }
}

function renderGame() {
  game.clear();
  game.drawGridBackground();
  game.drawHorizontalLines();
  game.drawGrid();
  game.drawSky();
  game.drawStars();
  game.drawSun();
  if(game.altTheme === false) {
    game.drawSkyline();
  }
  game.drawHorizon();
  game.drawTimer();
  game.drawTriangle();
  game.drawSquares();
  game.drawCircles();
  game.drawExtraLives();
  game.checkCrashSquares();
  game.checkCrashCircles();
  game.checkCrashExtraLives();
  game.checkCrashLasers();
  game.drawScore();
  game.drawHeroMode();
  game.drawLives();
  game.drawLaser();
  game.checkGameOver();
  game.updateExtraLifeCounter()
  if(game.soundOn === true) {
    game.backgroundMusic.play();
  } else {
    game.backgroundMusic.stop();
  }
}

function displayNextFrame(){
  if(game.gameStarted === false) {
    game.clear();
    game.drawGridBackground();
    game.drawHorizontalLines();
    game.drawGrid();
    game.drawSky();
    game.drawStars();
    game.drawHorizon();
    game.drawStartScreen();
    game.styleCanvasBorder();
    if(game.soundOn === true) {
      game.backgroundMusic.play();
    } else {
      game.backgroundMusic.stop();
    }
  } else if(game.gameOver === false && game.paused === false){
    renderGame();
  } else if(game.paused === true) {
    game.clear();
    game.drawGridBackground();
    game.drawHorizontalLines();
    game.drawGrid();
    game.drawSky();
    game.drawStars();
    game.drawHorizon();
    game.drawPauseScreen();
    if(game.soundOn === true) {
      game.backgroundMusic.play();
    } else {
      game.backgroundMusic.stop();
    }
  } else {
    game.clear();
    game.drawGridBackground();
    game.drawHorizontalLines();
    game.drawGrid();
    game.drawSky();
    game.drawStars();
    game.drawHorizon();
    game.drawGameOver();
    if(game.soundOn === true) {
      game.backgroundMusic.play();
    } else {
      game.backgroundMusic.stop();
    }
  }
  window.requestAnimationFrame(displayNextFrame);
}

window.onload = function() {
  startGame();
}

