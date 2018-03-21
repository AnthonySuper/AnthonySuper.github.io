import { computed, observable, action } from "mobx";

class Option {
  @observable name = "";

  @observable description = "";
  
  @observable worth = 0;

  @observable selected = false;

  @action toggleSelected() {
    this.selected = ! this.selected;
  }

  @action replaceWith(obj) {
    this.name = obj.name;
    this.description = obj.description;
    this.selected = obj.selected;
    this.worth = obj.worth;
  }
}

export default Option;