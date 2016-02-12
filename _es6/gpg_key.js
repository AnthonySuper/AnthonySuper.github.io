class GPGKeyDisplay {
  constructor(element) {
    this.elm = element;
  }

  takeControl() {
    console.log("Taking control with",this.elm);
    var show = this.elm.getElementsByClassName("gpg-show-key")[0];
    console.log("Got show element",show);
    show.addEventListener("click", this.showKey.bind(this));
  }

  showKey(){
    console.log("Showing key",this);
    var s = this.elm.getElementsByClassName("gpg-key-content")[0];
    s.className = s.className.replace(/key-hidden/, "");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  var el = document.getElementsByClassName("gpg-key");
  for(let i  = 0; i < el.length; i++){
    var s = new GPGKeyDisplay(el[i]);
    s.takeControl();
  }
});
