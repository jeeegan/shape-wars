class Game {
  constructor(colors,width,height,frameSpeed,starsImg,skylineImg,skylineImgWidth,skylineImgHeight,circleSound,squareSound) {
    this.colors = colors;
    this.width = width;
    this.height = height;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.frames = 0;
    this.frameSpeed = frameSpeed;
    this.horizontalDelta = this.calcHorizontalDelta();
    this.starsImg = starsImg;
    this.skylineImg = skylineImg;
    this.skylineImgWidth = skylineImgWidth;
    this.skylineImgHeight = skylineImgHeight;
    this.squares = [];
    this.circles = [];
    this.extraLives = [];
    this.triangle = new Triangle(this.width/2,this.height*0.90,this.width*0.04,this.height*0.025,this.colors.triangleColor);
    this.points = 0;
    this.lives = 5;
    this.gameOver = false;
    this.circleSound = circleSound;
    this.squareSound = squareSound;
    this.paused = false;
    this.shapeScalar = 0.75;
    this.gameStarted = false;
    this.soundOn = true;
    this.startTime = Date.now();
    this.pauseTimer = Date.now();
    this.extraLifeCounter = 0;
    this.giveExtraLife = false;
  }
  load() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    document.body.insertBefore(this.canvas, document.getElementById("game-container"));
  }
  start() {
    this.gameOver = false;
    this.gameStarted = true;
    this.lives = 5;
    this.points = 0;
    this.startTime = Date.now();
  }
  reset() {
    this.gameStarted = false;
    this.gameOver = false;
    this.paused = false;
    this.soundOn = true;
    this.lives = 5;
    this.points = 0;
    this.squares = [];
    this.circles = [];
    this.triangle.x = this.width/2;
    this.triangle.y = this.height*0.90;
    document.body.children[0].style.borderColor = this.colors.borderColor;
  }
  fullscreen(){
    var canv = document.body.children[0];

    if(canv.webkitRequestFullScreen) {
        canv.webkitRequestFullScreen();
    }
   else {
      canv.mozRequestFullScreen();
   }            
}
  checkGameOver() {
    if(this.lives === 0){
      this.gameOver = true;
    }
  }
  clear() {
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
  }
  toggleSound() {
    if(this.soundOn) {
      this.soundOn = false;
    } else {
      this.soundOn = true;
    }
  }
  togglePauseScreen() {
    if(this.paused) {
      this.startTime += (Date.now() - this.pauseTimer);
      this.paused = false;
    } else {
      this.pauseTimer = Date.now();
      this.paused = true;
    }
  }
  calcHorizontalDelta() { // calculates y-delta for horizontal lines
    var lineStops = []
    var offsetSum = 0;
    const horizontalDelta = []
    for (let line = 0; line < 11; line++) { // calc stop positions +1 off-canvas
      lineStops.push(height/2 + (line**2) + offsetSum + this.frames);
      offsetSum += line**2;
    }
    for(let line = 0; line <10; line++) {
      horizontalDelta.push(lineStops[line+1] - lineStops[line]);
    }
    return horizontalDelta;
  }
  updateExtraLifeCounter() {
    if(this.extraLifeCounter > 500) {
      this.giveExtraLife = true;
      this.extraLifeCounter = 0;
    } else {
      this.extraLifeCounter ++;
    }
  }
  checkCrash() {
    for(let check=0; check < this.squares.length; check++) { // check squares crash
      if((this.triangle.x - Math.floor(this.squares[check].x) >= -this.squares[check].width) &&
          (this.triangle.x - Math.floor(this.squares[check].x) <= this.squares[check].width) &&
          (this.triangle.y === Math.floor(this.squares[check].y))) {
        this.lives --;
        this.squares.splice(check,1);
        this.triangle.color = this.colors.squareColor;
        document.body.children[0].style.borderColor = this.colors.squareColor;
        if(this.soundOn) {this.squareSound.play();}
        setTimeout(()=> {
          this.triangle.color = this.colors.triangleColor;
          document.body.children[0].style.borderColor = this.colors.borderColor;
        },250);
      }
    }
    for(let check=0; check < this.circles.length; check++) { // check circles crash
      if((this.triangle.x - Math.floor(this.circles[check].x) >= -this.circles[check].radius*2.5) &&
          (this.triangle.x - Math.floor(this.circles[check].x) <= this.circles[check].radius*2.5) &&
          (this.triangle.y === Math.floor(this.circles[check].y))) {
        this.points += 5;
        this.triangle.color = this.colors.circleColor;
        this.circles.splice(check,1);
        document.body.children[0].style.borderColor = this.colors.circleColor;
        if(this.soundOn){this.circleSound.play();}
        setTimeout(()=> {
          this.triangle.color = this.colors.triangleColor;
          document.body.children[0].style.borderColor = this.colors.borderColor;
        },250);
      }
    }
  }
  drawGridBackground() { // draws background underneath the grid
    this.ctx.save();
    var grd = this.ctx.createLinearGradient(0,0,0,this.height);
    grd.addColorStop(1,this.colors.gridColor1);
    grd.addColorStop(0.5, this.colors.gridColor2);
    grd.addColorStop(0.25, this.colors.gridColor3);
    this.ctx.fillStyle = grd;
    this.ctx.fillRect(0,this.height/2,this.width,this.height/2);
    this.ctx.restore();
  }
  drawHorizontalLines() { // draws moving horizontal grid lines
    this.ctx.save();
    if(this.gameOver === true) {
      this.ctx.strokeStyle = this.colors.gameOver;
    } else {
      this.ctx.strokeStyle = this.colors.lineColor;
    }
    this.ctx.lineWidth = 4;
    var offsetSum = 0;
    for (let yOffset = 0; yOffset < 10; yOffset++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0,(this.height/2 + (yOffset**2) + offsetSum + (this.frames * (this.horizontalDelta[yOffset]/this.frameSpeed))));
      this.ctx.lineTo(this.width, (this.height/2 + (yOffset**2) + offsetSum + (this.frames * (this.horizontalDelta[yOffset]/this.frameSpeed))));
      this.ctx.stroke();
      offsetSum += yOffset**2;
    }
    this.ctx.restore();
  }
  drawGrid() { // draws the vertical perspective lines
    this.ctx.save();
    if(this.gameOver === true) {
      this.ctx.strokeStyle = this.colors.gameOver;
    } else {
      this.ctx.strokeStyle = this.colors.lineColor;
    }
    for(let lineXOffset = -20; lineXOffset<20; lineXOffset++) {
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(width/2,height/3);
      this.ctx.lineTo(lineXOffset * 150, this.height);
      this.ctx.stroke();
    }
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0,0,this.width,this.height/2);
    this.ctx.restore();
  }
  drawSky() {
    this.ctx.save();
    var grd = this.ctx.createLinearGradient(0,0,0,this.height/2);
    if(this.gameOver === true) {
      grd.addColorStop(1,"black");
    } else {
      grd.addColorStop(1,this.colors.skyColor1);
    }
    grd.addColorStop(0.75,this.colors.skyColor2);
    grd.addColorStop(0, this.colors.skyColor3);
    this.ctx.fillStyle = grd;
    this.ctx.fillRect(0,0,this.width,this.height/2);
    this.ctx.restore();
  }
  drawStars() {
    this.ctx.save();
    this.ctx.drawImage(this.starsImg,0, 0);
    this.ctx.restore();
  }
  drawSun() {
    this.ctx.save();
    var grd = this.ctx.createLinearGradient(0,0,0,this.height/2.5);
    grd.addColorStop(1,this.colors.sunColor1);
    grd.addColorStop(0.85,this.colors.sunColor2);
    grd.addColorStop(0.6,this.colors.sunColor3);
    grd.addColorStop(0.4,this.colors.sunColor4);
    this.ctx.fillStyle = grd;
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = this.colors.sunColor1;
    this.ctx.beginPath();
    this.ctx.arc(this.width/5, this.height/4,this.height/6,0,Math.PI*2);
    this.ctx.fill();
    this.ctx.restore();
  }
  drawSkyline() {
    this.ctx.save();
    this.ctx.globalAlpha = 0.75;
    this.ctx.shadowColor = this.colors.skylineShadowColor;
    this.ctx.shadowOffsetX = 2;
    this.ctx.drawImage(this.skylineImg,this.width/20, 0, this.skylineImgWidth, this.skylineImgHeight);
    this.ctx.restore();
  }
  drawHorizon() {
    this.ctx.save();
    if(this.gameOver === true) {
      this.ctx.strokeStyle = this.colors.gameOver;
    } else {
      this.ctx.strokeStyle = this.colors.horizonColor;
    }
    this.ctx.lineWidth = 5;
    if(this.gameOver === true) {
      this.ctx.shadowColor = this.colors.gameOver;
    } else {
      this.ctx.shadowColor = this.colors.horizonColor;
    }
    this.ctx.shadowOffsetY = 5;
    this.ctx.shadowBlur = 10;
    this.ctx.beginPath();
    this.ctx.moveTo(0,this.height/2);
    this.ctx.lineTo(this.width,this.height/2);
    this.ctx.stroke();
    this.ctx.restore();
  }
  drawTimer() {
    this.ctx.save();
    this.ctx.textAlign = "left";
    this.ctx.fillStyle = this.colors.textColor;
    this.ctx.font = "15px Orbitron";
    this.ctx.fillText(this.convertTime(Date.now() - this.startTime), this.width-this.width/6, this.height/18);
    this.ctx.restore();
  }
  convertTime(duration) {
    var milliseconds = parseInt((duration%1000)/100);
    var  seconds = parseInt((duration/1000)%60);
    var  minutes = parseInt((duration/(1000*60))%60);
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return "TIME: " + minutes + ":" + seconds + "." + milliseconds;
  }
  drawTriangle() {
    this.triangle.draw(this.ctx,this.width);
  }
  drawSquares() {
    if(this.frames % 5 === 0) {
      this.squares.push(new Square((Math.floor(Math.random()*this.width/3)+this.width/3),
      this.height/2,this.width/500,this.width/500,this.colors.squareColor,this.shapeScalar));
    }
    for(let sqr=0; sqr < this.squares.length; sqr++) {
      if(this.squares[sqr].checkOffCanvas(this.width,this.height)) {
        this.squares.splice(sqr,1);
      }
      this.squares[sqr].draw(this.ctx);
      this.squares[sqr].moveDown(this.width, this.height);
    }
  }
  drawCircles() {
    if(this.frames === 0) {
      this.circles.push(new Circle((Math.floor(Math.random()*this.width/3)+this.width/3),
      this.height/2,this.width/300,this.colors.circleColor,this.shapeScalar));
    }
    for(let circl=0; circl < this.circles.length; circl++) {
      if(this.circles[circl].checkOffCanvas(this.width,this.height)) {
        this.circles.splice(circl,1);
      }
      this.circles[circl].draw(this.ctx);
      this.circles[circl].moveDown(this.width, this.height);
    }
  }
  drawExtraLives() {
    if(this.giveExtraLife === true) {
      this.extraLives.push(new Life((Math.floor(Math.random()*this.width/3)+this.width/3),
      this.height/2,this.width/500,this.width/500,this.colors.triangleColor,this.shapeScalar));
      this.giveExtraLife = false;
    }
    if(this.extraLives.length > 0) {
      this.extraLives[0].draw(this.ctx);
      this.extraLives[0].moveDown(this.width, this.height);
      if(this.extraLives[0].checkOffCanvas(this.width,this.height)) {
        this.extraLives.splice(0,1);
      }
    }
  }
  drawScore() {
    this.ctx.save();
    this.ctx.textAlign = "left";
    this.ctx.fillStyle = this.colors.textColor;
    this.ctx.font = "15px Orbitron";
    this.ctx.fillText(`POINTS: ${this.points}`, this.width-this.width/6, this.height/12);
    this.ctx.restore();
  }
  drawLives() {
      if(this.lives > 0) {
      this.ctx.save();
      this.ctx.lineWidth = 5;
      this.ctx.fillStyle = this.colors.triangleColor;
      this.ctx.lineJoin = 'round';
      for(let life=0; life < this.lives; life++) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.width - this.width/6 + (life * 25), this.height/10);
        this.ctx.lineTo(this.width*0.02 + this.width-this.width/6 + (life * 25), this.height/10);
        this.ctx.lineTo(this.width*0.01 + this.width-this.width/6 + (life * 25), this.width*0.02 + this.height/10);
        this.ctx.closePath();
        this.ctx.fill();
      }
      this.ctx.restore();}
  }
  drawGameOver() {
    this.ctx.save();
    this.ctx.fillStyle = this.colors.gameOver;
    this.ctx.strokeStyle = "black";
    this.ctx.shadowColor = "black";
    this.ctx.shadowOffsetX = 5;
    this.ctx.font = "80px Orbitron";
    this.ctx.textAlign = "center"
    this.ctx.strokeText("GAME OVER",this.width/2,this.height/3);
    this.ctx.fillText("GAME OVER",this.width/2,this.height/3);
    this.ctx.font = "20px Orbitron";
    this.ctx.strokeText("PRESS ENTER TO PLAY AGAIN",this.width/2,this.height/2.5);
    this.ctx.fillText("PRESS ENTER TO PLAY AGAIN",this.width/2,this.height/2.5);
    this.ctx.restore();
    document.body.children[0].style.borderColor = this.colors.squareColor;
  }
  drawStartScreen() {
    this.ctx.save();
    this.ctx.fillStyle = this.colors.textColor;
    this.ctx.strokeStyle = "black";
    this.ctx.shadowColor = "black";
    this.ctx.shadowOffsetX = 5;
    this.ctx.font = "80px Orbitron";
    this.ctx.textAlign = "center"
    this.ctx.strokeText("SHAPE WARS",this.width/2,this.height/3);
    this.ctx.fillText("SHAPE WARS",this.width/2,this.height/3);
    this.ctx.font = "20px Orbitron";
    this.ctx.strokeText("PRESS ENTER TO PLAY",this.width/2,this.height/2.5);
    this.ctx.fillText("PRESS ENTER TO PLAY",this.width/2,this.height/2.5);
    this.ctx.font = "20px Orbitron";
    this.ctx.fillText("CONTROLS:",this.width/2,this.height/1.6);
    this.ctx.font = "15px Orbitron";
    this.ctx.fillText("LEFT-ARROW/RIGHT-ARROW: MOVE TRIANGLE",this.width/2,this.height/1.5);
    this.ctx.fillText("S KEY: TOGGLE SOUND",this.width/2,this.height/1.4);
    this.ctx.fillText("P KEY: PAUSE/UNPAUSE GAME",this.width/2,this.height/1.3);
    this.ctx.fillText("R KEY: RESET GAME",this.width/2,this.height/1.2);
    this.ctx.fillText("F KEY: GO FULL SCREEN (ESC TO EXIT)",this.width/2,this.height/1.1);
    this.ctx.restore();
  }

  drawPauseScreen() {
    this.ctx.save();
    this.ctx.fillStyle = this.colors.textColor;
    this.ctx.strokeStyle = "black";
    this.ctx.shadowColor = "black";
    this.ctx.shadowOffsetX = 5;
    this.ctx.font = "80px Orbitron";
    this.ctx.textAlign = "center"
    this.ctx.strokeText("PAUSED",this.width/2,this.height/3);
    this.ctx.fillText("PAUSED",this.width/2,this.height/3);
    this.ctx.font = "20px Orbitron";
    this.ctx.fillText("CONTROLS:",this.width/2,this.height/1.6);
    this.ctx.font = "15px Orbitron";
    this.ctx.fillText("LEFT-ARROW/RIGHT-ARROW: MOVE TRIANGLE",this.width/2,this.height/1.5);
    this.ctx.fillText("S KEY: TOGGLE SOUND",this.width/2,this.height/1.4);
    this.ctx.fillText("P KEY: PAUSE/UNPAUSE GAME",this.width/2,this.height/1.3);
    this.ctx.fillText("R KEY: RESET GAME",this.width/2,this.height/1.2);
    this.ctx.fillText("F KEY: GO FULL SCREEN (ESC TO EXIT)",this.width/2,this.height/1.1);
    this.ctx.restore();
  }
}