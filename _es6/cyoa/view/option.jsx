import React, { Component } from "react";
import { observer } from "mobx-react";
import { NameField, DescriptionField } from "./helpers.jsx";

const WorthSection = observer(({worth, editing, callback}) => {
  let field = <span>{worth}</span>
  if(editing) {
    const change = (event) => {
      let i = parseInt(event.target.value);
      if(isNaN(i)) i = 0;

      callback(i);
    };
    field = <input type="number" value={worth} onChange={change} />;
  }
  return <div className="cyoa-info-row">
    <span className="cyoa-info-row-label">Cost</span>
    {field}
  </div>;
});

@observer
class Option extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { option, editing } = this.props;
    let className = "cyoa-option";
    if(option.selected) {
      className += " selected";
    }
    return <div className={className} onClick={this.toggleSelected.bind(this)}>
      <NameField store={option} editing={editing} />
      <DescriptionField store={option} editing={editing} />
      <WorthSection worth={option.worth} editing={editing} callback={this.changeWorth.bind(this)} />
    </div>;
  }

  toggleSelected() {
    if(this.props.editing) return;
    this.props.option.toggleSelected();
  }

  changeWorth(worth) {
    this.props.option.worth = worth;
  }
}

export default Option;