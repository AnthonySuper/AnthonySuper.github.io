import React, { Component } from "react";
import { observer } from "mobx-react";

export const NameField = observer(({store, editing}) => {
  if(editing) {
    let change = (event) => store.name = event.target.value;
    return <div className="edit-container">
      <label>Name</label>
      <input onChange={change} value={store.name} />
    </div>
  }
  return <h1>{store.name}</h1>;
});

export const DescriptionField = observer(({store, editing}) => {
  if(editing) {
    let change = (event) => store.description = event.target.value;
    return <div className="edit-container">
      <label>Description</label>
      <textarea onChange={change} value={store.description}>
      </textarea>
    </div>
  }
  return <div className="description">
    {store.description}
  </div>;
})

