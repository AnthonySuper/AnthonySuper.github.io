import React, { Component } from "react";
import { observer } from "mobx-react";

let Saver = observer(({store}) => {
  const click = () => {
    const a = document.createElement("a");
    a.style = "display: none";
    document.body.appendChild(a);
    let json = JSON.stringify(store);
    let blob = new Blob([json], {
      type: "text/json"
    });
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = `cyoa-${store.name}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  return <button onClick={click}>
    Download
  </button>
})

export default Saver;