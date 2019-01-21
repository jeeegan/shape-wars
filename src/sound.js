class Sound {
  constructor(src,loop=false,volume=1) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.volume = volume;
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