import React, { Component } from "react";
import { observer } from "mobx-react";
import Section from "./section.jsx";

@observer
class Sections extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const store = this.props.store;
    const { editing } = store;
    let newButton = "";
    if(editing) {
      newButton = <button onClick={this.addSection.bind(this)}>
        Add Section
      </button>;
    }
    const sects = store.sections.map((s, i) => <Section section={s} editing={editing} key={i} />);
    return <div className="cyoa-sections-container">
      {newButton}
      {sects}
    </div>;
  }

  addSection() {
    this.props.store.addSection();
  }
}

export default Sections;