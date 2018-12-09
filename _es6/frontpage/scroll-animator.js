

const FadeIn = (element, percentDone) => {
  element.style.opacity = Math.min(percentDone, 1.0);
}


const BlurIn = (element, percentDone) => {
  const pxValue = 10.0 * Math.max(1.0 - percentDone, 0);
  element.style.filter = `blur(${pxValue}px)`;
}

const ScaleIn = (element, percentDone) => {
  const normalized = Math.min(percentDone, 1.0);
  element.style.transform = `scale(${normalized})`;
}

const ColorInBlack = (element, percentDone) => {
  const e = (percentDone * 238) ^ 0;
  console.log(e);
  element.style.backgroundColor = `rgba(${e}, ${e}, ${e}, 1)`;
}

const RotateIn = (element, percentDone) => {
  const e = 90.0 * Math.max(1.0 - percentDone, 0);
  element.style.transform = `rotateY(${e}deg)`;
};

const DarkenIn = (element, percentDone) => {
  const e = 255 - ((255 - 15) * percentDone) ^ 0;
  element.style.backgroundColor = `rgba(${e}, ${e}, ${e}, 1)`;
}

const AnimationFunctions = {
  "fade-in": FadeIn,
  "blur-in": BlurIn,
  "scale-in": ScaleIn,
  "color-in-black": ColorInBlack,
  "rotate-in": RotateIn,
  "darken-in": DarkenIn,
};



export class ScrollAnimator {
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
    if(! this.shouldAnimate) return;
    let { offsetHeight, scrollTop } = this;
    let toBottom = window.innerHeight - this.elm.getBoundingClientRect().top;
    if(toBottom < 0) return;
    let percentVisible = toBottom / window.innerHeight;
    this.doAnimation(percentVisible / this.max);
  }

  doAnimation(animationPercent) {
    if(this.hasCompleted && animationPercent > 1.0) return;
    window.requestAnimationFrame(() => {
      this.animationFunction(this.elm, animationPercent);
    })
    if(animationPercent > 1.0) {
      this.hasCompleted = true;
      if(this.oneshot) this.shouldAnimate = false;
    }
    else if(! this.oneshot) {
      this.hasCompleted = false;
    }
  }
}

function frameListener(elms, fr) {
  let counter = 0;
  return function animate() {
    if(counter % fr == 0) {
      elms.forEach(a => a.update());
    }
    window.requestAnimationFrame(animate);
  }
}


export let ready = () => {};
