class Sound {
  constructor(src,loop=false) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.loop = loop;
    document.body.appendChild(this.sound);
  }
  play(){
    this.sound.play();
  }
  stop(){
    this.sound.pause();
  }
}