import React from "react";
import ReactDOM from "react-dom";
import Loadable from "react-loadable";

const Demo = Loadable({
  loader: () => import("./demo"),
  loading: () => <progress />
});

document.addEventListener("DOMContentLoaded", () => {
  let elm = document.getElementById("dyn-highlight-demo");
  if(! elm) return;
  ReactDOM.render(<Demo />, elm);
});
