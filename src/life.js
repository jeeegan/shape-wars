class Life {
  constructor(x,y,w,h,col,lineWidth=1,scalar=0.75) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.color = col;
    this.scalar = scalar;
    this.lineWidth = lineWidth;
  }
  draw(ctx) {
    ctx.save();
    ctx.lineWidth = this.lineWidth;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - (this.height/2));
    ctx.lineTo(this.x - this.width/2,this.y + (this.height/2));
    ctx.lineTo(this.x + this.width/2,this.y + (this.height/2));
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
    console.log("draw")
  }
  moveDown(canvasWidth, canvasHeight) {
    this.x -= this.scalar * ((canvasWidth/200) * (canvasWidth/2 - this.x)/(canvasWidth/2));
    this.y += this.scalar * (0.25+(Math.abs(canvasHeight/2 - this.y))/(canvasHeight/12)); 
    this.height+= this.scalar * (0.1 +(Math.abs(canvasHeight/2 - this.y))/500);
    this.width+= this.scalar * (0.1 +(Math.abs(canvasHeight/2 - this.y))/500);
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