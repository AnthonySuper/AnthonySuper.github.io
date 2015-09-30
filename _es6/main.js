import {ImagePreview} from './image_preview';

document.addEventListener("DOMContentLoaded", function(event){
  var imgs = document.getElementsByClassName("inset-image");
  // conver to array
  imgs = Array.prototype.slice.call(imgs);
  console.log("After click, imgs is:",imgs);
  imgs.forEach((img) => {
    console.log("Adding a handler on:",img);
    var handler = new ImagePreview(img);
    handler.registerListener();
  });
});
