webpackJsonp([1],{

/***/ 15:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__frontpage_scroll_animator__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__frontpage_project_expansion__ = __webpack_require__(234);
/* harmony export (immutable) */ __webpack_exports__["default"] = setUp;




function setUp() {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__frontpage_scroll_animator__["a" /* ready */])();
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__frontpage_project_expansion__["a" /* default */])();
  // LOL spammers
  let ar = ["mailto:", "anthony", "@", "noided", ".", "media"];
  document.getElementById("MailReplace").href = ar.join("");
}

/***/ }),

/***/ 234:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = ready;


function ready() {
  let spliceSelector = query => Array.prototype.slice.call(document.querySelectorAll(query));
  const elements = spliceSelector(".frontpage-project img");
  let listener = event => {
    let toggleActive = elm => elm.classList.toggle("active");
    const parent = event.currentTarget.parentElement;
    if (!parent.classList.contains("active")) {
      let otherActive = spliceSelector(".frontpage-project.active");
      if (otherActive.length != 0) {
        otherActive.forEach(toggleActive);
        window.setTimeout(() => toggleActive(parent), 251);
        return;
      }
    }
    toggleActive(parent);
  };

  elements.forEach(elm => {
    elm.addEventListener("click", listener);
  });
}

/***/ }),

/***/ 235:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ready; });


const FadeIn = (element, percentDone) => {
  element.style.opacity = Math.min(percentDone, 1.0);
};

const BlurIn = (element, percentDone) => {
  const pxValue = 10.0 * Math.max(1.0 - percentDone, 0);
  element.style.filter = `blur(${pxValue}px)`;
};

const ScaleIn = (element, percentDone) => {
  const normalized = Math.min(percentDone, 1.0);
  element.style.transform = `scale(${normalized})`;
};

const ColorInBlack = (element, percentDone) => {
  const e = percentDone * 238 ^ 0;
  console.log(e);
  element.style.backgroundColor = `rgba(${e}, ${e}, ${e}, 1)`;
};

const RotateIn = (element, percentDone) => {
  const e = 90.0 * Math.max(1.0 - percentDone, 0);
  element.style.transform = `rotateY(${e}deg)`;
};

const DarkenIn = (element, percentDone) => {
  const e = 255 - (255 - 15) * percentDone ^ 0;
  element.style.backgroundColor = `rgba(${e}, ${e}, ${e}, 1)`;
};

const AnimationFunctions = {
  "fade-in": FadeIn,
  "blur-in": BlurIn,
  "scale-in": ScaleIn,
  "color-in-black": ColorInBlack,
  "rotate-in": RotateIn,
  "darken-in": DarkenIn
};

class ScrollAnimator {
  constructor(elm) {
    this.elm = elm;
    this.animationFunction = AnimationFunctions[elm.dataset.scrollAnimate];
    this.offsetHeight = elm.offsetHeight;
    this.max = elm.dataset.scrollAnimateMax || 0.25;
    this.max = parseFloat(this.max + "");
    this.oneshot = elm.dataset.scrollAnimateOneshot;
    this.shouldAnimate = true;
  }

  update(scroll) {
    if (!this.shouldAnimate) return;
    let { offsetHeight, scrollTop } = this;
    let toBottom = window.innerHeight - this.elm.getBoundingClientRect().top;
    if (toBottom < 0) return;
    let percentVisible = toBottom / window.innerHeight;
    this.doAnimation(percentVisible / this.max);
  }

  doAnimation(animationPercent) {
    if (this.hasCompleted && animationPercent > 1.0) return;
    window.requestAnimationFrame(() => {
      this.animationFunction(this.elm, animationPercent);
    });
    if (animationPercent > 1.0) {
      this.hasCompleted = true;
      if (this.oneshot) this.shouldAnimate = false;
    } else if (!this.oneshot) {
      this.hasCompleted = false;
    }
  }
}
/* unused harmony export ScrollAnimator */


function frameListener(elms, fr) {
  let counter = 0;
  return function animate() {
    if (counter % fr == 0) {
      elms.forEach(a => a.update());
    }
    window.requestAnimationFrame(animate);
  };
}

let ready = () => {
  let elmList = document.querySelectorAll("[data-scroll-animate]");
  let elms = Array.prototype.slice.call(elmList);
  let animators = elms.map(e => new ScrollAnimator(e));
  frameListener(elms, 5)();
};

/***/ })

});
//# sourceMappingURL=frontpage.58b21d0a.bundle.js.map