(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Class to do some testing of pixel data on a canvas.
 * Uses ES6, the next version of the JS standard.
 * This is mostly for the => syntax, which is extremely nice when working
 * with callbacks.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CanvasTest = (function () {
  /**
   * Create a new canvas test with the given canvas and image path
   * The version on the website calls this with the canvas an 
   * "/assets/tubahat.jpg", which is a picture of me wearing the bell of
   * a tuba as a hat.
   */

  function CanvasTest(canvas, path) {
    var _this = this;

    _classCallCheck(this, CanvasTest);

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    var img = new Image();
    img.onload = function (e) {
      _this.renderInitial();
    };
    this.img = img;
    img.src = path;
  }

  _createClass(CanvasTest, [{
    key: "renderInitial",
    value: function renderInitial() {
      var _this2 = this;

      this.width = this.img.width;
      this.height = this.img.height;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.ctx.drawImage(this.img, 0, 0);
      requestAnimationFrame(function (e) {
        _this2.steps = 0;

        _this2.data = _this2.ctx.getImageData(0, 0, _this2.height, _this2.width);

        _this2.array = new Uint8ClampedArray(_this2.data.data);
        _this2.drawStep();
      });
    }
  }, {
    key: "requestNextFrame",
    value: function requestNextFrame() {
      var _this3 = this;

      requestAnimationFrame(function (e) {
        _this3.drawStep();
      });
    }
  }, {
    key: "drawStep",
    value: function drawStep() {
      // Only do this once every ten frames
      if (this.steps > 0) {
        if (this.steps > 10) {
          this.steps = 0;
          return this.requestNextFrame();
        }
        this.steps++;
        return this.requestNextFrame();
      }
      console.log("Drawing!");

      var roll = Math.floor(Math.random() * 20) + 1;
      for (var i in this.array) {
        // Roll a D20
        this.array[i] = this.array[i] + roll;
      }
      var newData = new ImageData(this.array, this.data.width, this.data.height);
      console.log("Putting a new image data...");
      this.ctx.putImageData(newData, 0, 0);
      this.steps++;
      this.requestNextFrame();
    }
  }]);

  return CanvasTest;
})();

exports.CanvasTest = CanvasTest;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImagePreview = (function () {
  function ImagePreview(img) {
    _classCallCheck(this, ImagePreview);

    this.img = img;
  }

  _createClass(ImagePreview, [{
    key: "registerListener",
    value: function registerListener() {
      var _this = this;

      var listener = function listener(event) {
        console.log("Moving to a big image...");
        _this.img.removeEventListener("click", listener);
        _this.toBigImage();
        _this.registerSmallListener();
      };
      this.img.addEventListener("click", listener);
    }
  }, {
    key: "toBigImage",
    value: function toBigImage() {
      this.img.className = "big-image";
    }
  }, {
    key: "registerSmallListener",
    value: function registerSmallListener() {
      var _this2 = this;

      var listener = function listener(event) {
        console.log("Going back to a small image...");
        _this2.img.removeEventListener("click", listener);
        _this2.toNormalImage();
        _this2.registerListener();
      };
      this.img.addEventListener("click", listener);
    }
  }, {
    key: "toNormalImage",
    value: function toNormalImage() {
      this.img.className = "inset-image";
    }
  }]);

  return ImagePreview;
})();

exports.ImagePreview = ImagePreview;

},{}],3:[function(require,module,exports){
'use strict';

var _image_preview = require('./image_preview');

var _canvas_test = require('./canvas_test');

document.addEventListener("DOMContentLoaded", function (event) {
  var imgs = document.getElementsByClassName("inset-image");
  // conver to array
  imgs = Array.prototype.slice.call(imgs);
  console.log("After click, imgs is:", imgs);
  imgs.forEach(function (img) {
    console.log("Adding a handler on:", img);
    var handler = new _image_preview.ImagePreview(img);
    handler.registerListener();
  });
  var f = document.getElementById("testing-canvas");
  if (f) {
    console.log("Got a canvas: f");
    new _canvas_test.CanvasTest(f, "/assets/tubahat.jpg");
  }
});

},{"./canvas_test":1,"./image_preview":2}]},{},[3]);
