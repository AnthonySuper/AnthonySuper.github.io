(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
"use strict";

var _image_preview = require('./image_preview');

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
});

},{"./image_preview":1}]},{},[2]);
