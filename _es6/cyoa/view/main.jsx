import React, { Component } from "react";
import ReactDOM from "react-dom";
import Cyoa from "../store/cyoa";
import { observer } from "mobx-react";
import { NameField, DescriptionField } from "./helpers.jsx";
import Sections from "./sections.jsx";
import Saver from "./saver.jsx";
import Loader from "./loader.jsx";

const InfoField = observer(({store, editing}) => {
  let { totalPoints, pointsUsed, pointsLeft } = store;
  let totalPointsDisp;
  if(! editing) {
    totalPointsDisp = <span>{totalPoints}</span>;
  }
  else {
    const update = event => {
      let num = parseInt(event.target.value);
      if(isNaN(num)) num = 0;
      store.totalPoints = num;
    };
    totalPointsDisp = <input
      type="number"
      onChange={update}
      value={totalPoints} />;
  }
  return <div className="cyoa-info-field">
    <div className="cyoa-info-row">
      <span className="cyoa-info-row-label">Total Points</span>
      {totalPointsDisp}
    </div>
    <div className="cyoa-info-row">
      <span className="cyoa-info-row-label">Points Used</span>
      <span>{pointsUsed}</span>
    </div>
    <div className="cyoa-info-row">
      <span className="cyoa-info-row-label">Points Left</span>
      <span className={pointsLeft >= 0 ? "" : "cyoa-invalid"}>
        {pointsLeft}
      </span> 
    </div>
  </div>;
});

@observer
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    console.log(Saver);
    const store = this.props.store;
    let editButton = store.editing ? 
      <button onClick={this.stopEditing.bind(this)}>
        Stop editing
      </button> :
      <button onClick={this.startEditing.bind(this)}>
        Edit
      </button>;
    return <div className="cyoa-container">
      <div className="cyoa-header-edit">
        <NameField store={store} editing={store.editing}/>
      </div>
      <div className="cyoa-actions">
        {editButton}
        <Saver store={store} />
        <Loader store={store} />
      </div>
      <DescriptionField store={store} editing={store.editing} />
      <InfoField store={store} editing={store.editing} />
      <Sections store={store} />
    </div>;
  }

  stopEditing() {
    this.props.store.stopEditing();
  }

  startEditing() {
    this.props.store.makeEditable();
  }
}

export function render() {
  const cyoa = new Cyoa();
  ReactDOM.render(
    <Main store={cyoa}/>,
    document.getElementById("MainContainer")
  );
  console.log("Rendered!");
}