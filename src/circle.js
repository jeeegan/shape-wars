class Circle {
  constructor(x,y,r,col,lineWidth=1) {
    this.x = x;
    this.y = y;
    this.radius = r;
    this.color = col;
    this.speed = 0.75;
    this.lineWidth = lineWidth;
  }
  draw(ctx) {
    ctx.save();
    ctx.lineWidth = this.lineWidth;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y,this.radius,0,Math.PI*2);
    ctx.stroke();
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.restore();
  }
  moveDown(canvasWidth, canvasHeight) {
    this.x -= this.speed * ((canvasWidth/200) * (canvasWidth/2 - this.x)/(canvasWidth/2));
    this.y += this.speed * (0.25 + (Math.abs(canvasHeight/2 - this.y))/50);
    this.radius+= this.speed * (0 +(Math.abs(canvasHeight/2 - this.y))/900);
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