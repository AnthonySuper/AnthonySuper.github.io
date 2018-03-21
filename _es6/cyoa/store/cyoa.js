import { observable, computed, action } from "mobx";
import Section from "./section";

class Cyoa {
  @observable sections = [];

  @observable name = "Untitled";

  @observable description = "No Description Yet";

  @observable editing = false;

  @observable totalPoints = 0;

  @computed get pointsUsed() {
    return this.sections
      .map(s => s.pointsUsed)
      .reduce((acc, curr) => acc + curr, 0);
  }

  @computed get pointsLeft() {
    return this.totalPoints - this.pointsUsed;
  }

  @action addSection() {
    this.sections.push(new Section());
  }

  @action removeSection(name) {
    this.sections = this.sections.filter(
      s => s.name !== name
    );
  }

  @action makeEditable() {
    this.editing = true;
  }

  @action stopEditing() {
    this.editing = false;
  }

  @action replaceWith(obj) {
    this.name = json.name;
    this.description = json.description;
    this.totalPoints = json.totalPoints;
    this.sections = obj.sections.map(section => {
        let sec = new Section();
        sec.replaceWith(section);
        return sec;
    });
  }
}

export default Cyoa;