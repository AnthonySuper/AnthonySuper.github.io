import { observable, computed, action } from "mobx";
import Option from "./option";

class Section {
  @observable name = "";

  @observable description = "";

  @observable options = [];

  @observable maxSelectable = 1;

  @observable limitSelectable = false;

  @computed get selectedOptions() {
    return this.options.filter(s => s.selected);
  }

  @computed get pointsUsed() {
    return this.selectedOptions
      .map(s => s.worth)
      .reduce((curr, acc) => curr + acc, 0);
  }

  @computed get numberSelected() {
    return this.selectedOptions.length;
  }

  @computed get canSelectFuther() {
    return (! this.limitSelectable) || this.numberSelected < this.maxSelectable;
  }

  @action addOption() {
    this.options.push(new Option());
  }

  @action removeOption(name) {
    this.options = this.options.filter(o => o.name !== name);
  }

  @action replaceWith(obj) {
    this.name = obj.name;
    this.description = obj.description;
    this.maxSelectable = obj.maxSelectable;
    this.options = obj.options.map(opt => {
      let o = new Option();
      o.replaceWith(opt);
      return o;
    })
  }
}

export default Section;