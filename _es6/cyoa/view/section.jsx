import React, { Component } from "react";
import { observer } from "mobx-react";
import { NameField, DescriptionField } from "./helpers.jsx";
import Options from "./options.jsx";

@observer
class Section extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const section = this.props.section;
    const editing = this.props.editing;

    return <div className="cyoa-section">
      <div className="cyoa-section-name-wrapper">
        <NameField store={section} editing={editing} />
        {this.nameExtra}
      </div>
      <DescriptionField store={section} editing={editing} />
      {this.maxEditor}
      <Options store={section} editing={editing} />
    </div>;
  }

  get nameExtra() {
    console.log(this.props.editing, this.props.section.limitSelectable);
    if(this.props.editing || ! this.props.section.limitSelectable) {
      console.log("returning nothing lamo");
      return "";
    }
    if(this.props.section.numberSelected == 0) {
      return <span>(Pick {this.props.section.maxSelectable})</span>;
    }
    let a = this.props.section.numberSelected;
    let b = this.props.section.maxSelectable;
    return <span>
      ({a} of {b} selected)
    </span>;
  }

  get maxEditor() {
    if(! this.props.editing) return "";
    let { section } = this.props;
    const changeMax = (event) => {
      let num = parseInt(event.target.value);
      if(isNaN(num)) return;
      else section.maxSelectable = num;
    }
    let valueEditor = <div className="max-editor-section">
      <label>Max Selectable</label>
      <input type="number"
        value={section.maxSelectable}
        onChange={changeMax} />
    </div>;

    return <div className="cyoa-section-max-editor">
      <div className="max-editor-section">
        <label>Limit Number Selectable?</label>
        <input type="checkbox" 
          value={section.limitSelectable}
          onChange={(e) => section.limitSelectable = e.target.checked} />
      </div>
      {section.limitSelectable ? valueEditor : ""}
    </div>;
  }
}

export default Section;