class ImagePreview{
  constructor(img){
    this.img = img;
  }
  registerListener(){
    var listener = (event) => {
      this.img.removeEventListener("click", listener);
      this.toBigImage();
      this.registerSmallListener();
    };
    this.img.addEventListener("click", listener);
  }
  toBigImage(){
    this.img.className = "big-image";
  }
  registerSmallListener(){
    var listener = (event) => {
      this.img.removeEventListener("click", listener);
      this.toNormalImage();
      this.registerListener();
    };
    this.img.addEventListener("click", listener);
  }
  toNormalImage(){
    this.img.className = "inset-image";
  }
}

export {ImagePreview};
