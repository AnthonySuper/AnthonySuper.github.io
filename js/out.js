/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [], result;
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// objects to store loaded and loading chunks
/******/ 	var installedChunks = {
/******/ 		2: 0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData === 0) {
/******/ 			return new Promise(function(resolve) { resolve(); });
/******/ 		}
/******/
/******/ 		// a Promise means "currently loading".
/******/ 		if(installedChunkData) {
/******/ 			return installedChunkData[2];
/******/ 		}
/******/
/******/ 		// setup Promise in chunk cache
/******/ 		var promise = new Promise(function(resolve, reject) {
/******/ 			installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 		});
/******/ 		installedChunkData[2] = promise;
/******/
/******/ 		// start chunk loading
/******/ 		var head = document.getElementsByTagName('head')[0];
/******/ 		var script = document.createElement('script');
/******/ 		script.type = 'text/javascript';
/******/ 		script.charset = 'utf-8';
/******/ 		script.async = true;
/******/ 		script.timeout = 120000;
/******/
/******/ 		if (__webpack_require__.nc) {
/******/ 			script.setAttribute("nonce", __webpack_require__.nc);
/******/ 		}
/******/ 		script.src = __webpack_require__.p + "" + ({"0":"frontpage","1":"katex"}[chunkId]||chunkId) + ".bundle.js";
/******/ 		var timeout = setTimeout(onScriptComplete, 120000);
/******/ 		script.onerror = script.onload = onScriptComplete;
/******/ 		function onScriptComplete() {
/******/ 			// avoid mem leaks in IE.
/******/ 			script.onerror = script.onload = null;
/******/ 			clearTimeout(timeout);
/******/ 			var chunk = installedChunks[chunkId];
/******/ 			if(chunk !== 0) {
/******/ 				if(chunk) {
/******/ 					chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));
/******/ 				}
/******/ 				installedChunks[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		head.appendChild(script);
/******/
/******/ 		return promise;
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__image_preview__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__canvas_test__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gpg_key__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gpg_key___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__gpg_key__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__frontpage_tabs__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__frontpage_tabs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__frontpage_tabs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__math__ = __webpack_require__(5);
let doFrontpage = (() => {
  var _ref = _asyncToGenerator(function* () {
    console.log("Frontpage called");
    let frontpage = yield __webpack_require__.e/* import() */(0).then(__webpack_require__.bind(null, 7));
    frontpage.default();
  });

  return function doFrontpage() {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }







document.addEventListener("DOMContentLoaded", function (event) {
  Object(__WEBPACK_IMPORTED_MODULE_4__math__["a" /* default */])();
  var imgs = document.getElementsByClassName("inset-image");
  // conver to array
  imgs = Array.prototype.slice.call(imgs);
  imgs.forEach(img => {
    var handler = new __WEBPACK_IMPORTED_MODULE_0__image_preview__["a" /* ImagePreview */](img);
    handler.registerListener();
  });
  var f = document.getElementById("testing-canvas");
  if (f) {
    console.log("Got a canvas: f");
    new __WEBPACK_IMPORTED_MODULE_1__canvas_test__["a" /* CanvasTest */](f, "/assets/tubahat.jpg");
  }

  if (document.getElementsByClassName("frontpage")) {
    doFrontpage();
  }
});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ImagePreview; });
class ImagePreview {
  constructor(img) {
    this.img = img;
  }
  registerListener() {
    var listener = event => {
      this.img.removeEventListener("click", listener);
      this.toBigImage();
      this.registerSmallListener();
    };
    this.img.addEventListener("click", listener);
  }
  toBigImage() {
    this.img.className = "big-image";
  }
  registerSmallListener() {
    var listener = event => {
      this.img.removeEventListener("click", listener);
      this.toNormalImage();
      this.registerListener();
    };
    this.img.addEventListener("click", listener);
  }
  toNormalImage() {
    this.img.className = "inset-image";
  }
}



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CanvasTest; });
/**
 * Class to do some testing of pixel data on a canvas.
 * Uses ES6, the next version of the JS standard.
 * This is mostly for the => syntax, which is extremely nice when working
 * with callbacks.
 */
class CanvasTest {
  /**
   * Create a new canvas test with the given canvas and image path
   * The version on the website calls this with the canvas an 
   * "/assets/tubahat.jpg", which is a picture of me wearing the bell of
   * a tuba as a hat.
   */
  constructor(canvas, path) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    var img = new Image();
    img.onload = e => {
      this.renderInitial();
    };
    this.img = img;
    img.src = path;
  }
  renderInitial() {
    this.width = this.img.width;
    this.height = this.img.height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx.drawImage(this.img, 0, 0);
    requestAnimationFrame(e => {
      this.steps = 0;

      this.data = this.ctx.getImageData(0, 0, this.height, this.width);

      this.array = new Uint8ClampedArray(this.data.data);
      this.drawStep();
    });
  }
  requestNextFrame() {

    requestAnimationFrame(e => {
      this.drawStep();
    });
  }
  drawStep() {
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
}



/***/ }),
/* 3 */
/***/ (function(module, exports) {

class GPGKeyDisplay {
  constructor(element) {
    this.elm = element;
  }

  takeControl() {
    console.log("Taking control with", this.elm);
    var show = this.elm.getElementsByClassName("gpg-show-key")[0];
    console.log("Got show element", show);
    show.addEventListener("click", this.showKey.bind(this));
  }

  showKey() {
    console.log("Showing key", this);
    var s = this.elm.getElementsByClassName("gpg-key-content")[0];
    s.className = s.className.replace(/key-hidden/, "");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  var el = document.getElementsByClassName("gpg-key");
  for (let i = 0; i < el.length; i++) {
    var s = new GPGKeyDisplay(el[i]);
    s.takeControl();
  }
});

/***/ }),
/* 4 */
/***/ (function(module, exports) {

function hideAllItems() {
  console.log("Hiding all bio sections");
  var i = document.getElementsByClassName("bio-section-active");
  console.log("Got active elements:", i);
  Array.prototype.slice.call(i).forEach(item => {
    item.className = item.className.replace("bio-section-active", "");
    item.className = item.className + " bio-section-hidden";
  });
  var s = document.getElementById("bio-sections-list");
  var heads = s.getElementsByClassName("active");
  Array.prototype.slice.call(heads).forEach(item => {
    item.className = "";
  });
}

function showSection(section, event) {
  hideAllItems();
  this.className += " active";
  section.className += " bio-section-active";
  section.className = section.className.replace("bio-section-hidden", "");
}

function addListener(n) {
  var id = n.dataset.headerFor;
  var lists = document.getElementsByClassName("bio-section");
  lists = Array.prototype.slice.call(lists);
  lists.forEach(item => {
    if (id == item.dataset.tabId) {
      n.addEventListener("click", showSection.bind(n, item));
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  var elm = document.getElementById("bio-sections-list");
  if (!elm) return;
  var list = elm.getElementsByTagName("li");
  for (let i = 0; i < list.length; i++) {
    addListener(list[i]);
  }
});

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* harmony default export */ __webpack_exports__["a"] = ((() => {
  var _ref = _asyncToGenerator(function* () {
    let $ = (() => {
      var _ref2 = _asyncToGenerator(function* (sel, replace) {
        let docs = Array.prototype.slice.call(document.querySelectorAll(sel));
        if (!docs) return;
        yield 10;
        let katex = yield __webpack_require__.e/* import() */(1).then(__webpack_require__.bind(null, 6));

        docs.forEach(function (doc) {
          console.log(doc);
          let parent = doc.parentNode;
          let tmp = document.createElement('div');
          let fragment = replace.call(doc, katex);
          tmp.innerHTML = fragment;
          let newChild = tmp.childNodes[0];
          parent.replaceChild(newChild, doc);
        });
      });

      return function $(_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    })();

    $("script[type='math/tex']", function (katex) {
      var tex = this.textContent;
      return katex.renderToString(tex, { displayMode: false });
    });

    $("script[type='math/tex; mode=display']", function (katex) {
      var tex = this.innerHTML;
      return katex.renderToString(tex.replace(/%.*/g, ''), { displayMode: true });
    });
  });

  function setup() {
    return _ref.apply(this, arguments);
  }

  return setup;
})());

/***/ })
/******/ ]);