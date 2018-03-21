import React, { Component } from "react";
import { observer } from "mobx-react";

const Loader = observer(({store}) => {
  const readFile = (event) => {
    let reader = new FileReader();
    reader.onload = () => {
      let json = JSON.parse(reader.result);
      store.replaceWith(json);
    };
    reader.readAsText(event.target.files[0]);
  }

  return <div className="cyoa-loader-container">
    <label>Upload</label>
    <input type="file" onChange={readFile} accept="json">
    </input>
  </div>
});

export default Loader;