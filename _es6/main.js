import {ImagePreview} from './image_preview';
import {CanvasTest} from './canvas_test';
import './gpg_key';
import './frontpage_tabs';
import setupMath from './math';

async function doFrontpage() {
  console.log("Frontpage called");
  let frontpage = await import(/* webpackChunkName: "frontpage" */ "./frontpage");
  frontpage.default();
}

document.addEventListener("DOMContentLoaded", function(event){
  setupMath();
  var imgs = document.getElementsByClassName("inset-image");
  // conver to array
  imgs = Array.prototype.slice.call(imgs);
  imgs.forEach((img) => {
    var handler = new ImagePreview(img);
    handler.registerListener();
  });
  var f = document.getElementById("testing-canvas");
  if(f){
    console.log("Got a canvas: f");
    new CanvasTest(f, "/assets/tubahat.jpg");
  }

  if(document.getElementsByClassName("frontpage")) {
    doFrontpage();
  }
});
