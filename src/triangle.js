class Triangle {
  constructor(x,y,w,h,col) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.color = col;
  }
  draw(ctx,canvasWidth) {
    ctx.save();
    ctx.lineWidth = 5;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    let skew3d = (this.width/2) * (canvasWidth/2 - this.x)/(canvasWidth/2);
    ctx.moveTo(this.x + skew3d,this.y - (this.height/2));
    ctx.lineTo(this.x - this.width/2,this.y + (this.height/2));
    ctx.lineTo(this.x + this.width/2,this.y + (this.height/2));
    ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.restore();
  }
  moveLeft(canvasWidth) {
    if(this.x - this.width <0) {
      this.x = canvasWidth;
    } else {
      this.x -= this.width;
    }
  }
  moveRight(canvasWidth) {
    if(this.x + this.width > canvasWidth) {
      this.x = 0;
    } else {
      this.x += this.width;
    }
  }
}