import React, { Component } from "react";
import { observer } from "mobx-react";
import Option from "./option.jsx";

@observer
class Options extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { store, editing } = this.props;
    let newButton = "";
    if(editing) {
      newButton = <button onClick={this.addOption.bind(this)}>
        Add an Option
      </button>;
    }
    const options = store.options.map((o, i) => 
      <Option option={o} editing={editing} key={i} />
    );
    return <div className="cyoa-options-container-outer">
      {newButton}
      <div className="cyoa-options-container">
        {options}
      </div>
    </div>
  }

  addOption() {
    this.props.store.addOption();
  }
}

export default Options;