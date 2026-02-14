import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";

const DemoInner = React.lazy(() => import("./demo"));

const Demo = <Suspense fallback={<progress />}><DemoInner /></Suspense>;

document.addEventListener("DOMContentLoaded", () => {
  let elm = document.getElementById("dyn-highlight-demo");
  console.log("Running event handler...", elm);
  if(! elm) return;
  ReactDOM.render(Demo, elm);
});
