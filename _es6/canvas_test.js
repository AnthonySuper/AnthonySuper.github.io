/**
 * Class to do some testing of pixel data on a canvas.
 * Uses ES6, the next version of the JS standard.
 * This is mostly for the => syntax, which is extremely nice when working
 * with callbacks.
 */
class CanvasTest{
  /**
   * Create a new canvas test with the given canvas and image path
   * The version on the website calls this with the canvas an 
   * "/assets/tubahat.jpg", which is a picture of me wearing the bell of
   * a tuba as a hat.
   */
  constructor(canvas, path){
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    var img = new Image();
    img.onload = e =>{
      this.renderInitial();
    };
    this.img = img;
    img.src = path;
  }
  renderInitial(){
    this.width = this.img.width;
    this.height = this.img.height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx.drawImage(this.img, 0, 0);
    requestAnimationFrame(e => {
      this.steps = 0;

      this.data = this.ctx.getImageData(0,0,this.height,this.width);

      this.array = new Uint8ClampedArray(this.data.data);
      this.drawStep();
    });
  }
  requestNextFrame(){

    requestAnimationFrame(e => {this.drawStep()});
  }
  drawStep(){
    // Only do this once every ten frames
    if(this.steps > 0){
      if(this.steps > 10){
        this.steps = 0;
        return this.requestNextFrame();
      }
      this.steps++;
      return this.requestNextFrame();
    }
    console.log("Drawing!");

      var roll = Math.floor(Math.random() * 20) + 1;
    for(var i in this.array){
      // Roll a D20
      this.array[i] = this.array[i] + roll;
    }
    var newData = new ImageData(this.array, this.data.width, this.data.height);
    console.log("Putting a new image data...");
    this.ctx.putImageData(newData, 0,0);
    this.steps++;
    this.requestNextFrame();
  }
}

export {CanvasTest};
