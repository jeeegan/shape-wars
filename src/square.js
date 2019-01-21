class Square {
  constructor(x,y,w,h,col,lineWidth=1) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.color = col;
    this.speed = 0.75;
    this.lineWidth = lineWidth;
  }
  draw(ctx) {
    ctx.save();
    ctx.lineWidth = this.lineWidth;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.lineJoin = 'round';
    ctx.strokeRect(this.x-(this.width/2),this.y-(this.height/2),this.width,this.height);
    ctx.globalAlpha = 0.5;
    ctx.fillRect(this.x-(this.width/2),this.y-(this.height/2),this.width,this.height);
    ctx.restore();
  }
  moveDown(canvasWidth, canvasHeight) {
    this.x -= this.speed * ((canvasWidth/200) * (canvasWidth/2 - this.x)/(canvasWidth/2));
    this.y += this.speed * (0.25 + (Math.abs(canvasHeight/2 - this.y))/50);
    this.height+= this.speed * (0.1 +(Math.abs(canvasHeight/2 - this.y))/500);
    this.width+= this.speed * (0.1 +(Math.abs(canvasHeight/2 - this.y))/500);
    this.lineWidth += this.speed * (0.01);
  }
  checkOffCanvas(canvasWidth, canvasHeight) {
    return(
      this.x < 0 ||
      this.x > canvasWidth ||
      this.y > canvasHeight
    );
  }
}