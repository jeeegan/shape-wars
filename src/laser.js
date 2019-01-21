class Laser {
  constructor(x,y,col,lineWidth=10,scalar=0.75) {
    this.x = x;
    this.y = y;
    this.length = 10;
    this.color = col;
    this.scalar = scalar;
    this.lineWidth = lineWidth;
  }
  draw(ctx) {
    ctx.save();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.x,this.y);
    ctx.lineTo(this.x, this.y-this.length);
    ctx.stroke();
    ctx.restore();
  }
  moveUp(canvasWidth, canvasHeight) {
    this.x += this.scalar * ((canvasWidth/200) * (canvasWidth/2 - this.x)/(canvasWidth/2));
    this.y -= this.scalar * (0.25+(Math.abs(canvasHeight/2 - this.y))/(canvasHeight/12)); 
  }
  checkOffCanvas(canvasWidth, canvasHeight) {
    return(
      this.x < 0 ||
      this.x > canvasWidth ||
      this.y < canvasHeight/2
    );
  }
}