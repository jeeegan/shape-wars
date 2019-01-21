class Circle {
  constructor(x,y,r,col,lineWidth=1,scalar=0.75) {
    this.x = x;
    this.y = y;
    this.radius = r;
    this.color = col;
    this.scalar = scalar;
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
    this.x -= this.scalar * ((canvasWidth/200) * (canvasWidth/2 - this.x)/(canvasWidth/2));
    this.y += this.scalar * (0.25 + (Math.abs(canvasHeight/2 - this.y))/(canvasHeight/12));
    this.radius+= this.scalar * (0 +(Math.abs(canvasHeight/2 - this.y))/900);
    this.lineWidth += this.scalar * (0.01);
  }
  checkOffCanvas(canvasWidth, canvasHeight) {
    return(
      this.x < 0 ||
      this.x > canvasWidth ||
      this.y > canvasHeight
    );
  }
}