import Timeline from "../Utils/Timeline.js";

export default class TimelineControls {
  constructor() {
    this.leftArrow = document.getElementById("left-arrow");
    this.rightArrow = document.getElementById("right-arrow");
    this.buttonText = document.querySelector('.button-text')

    this.section = 0;

    this.leftArrow.addEventListener("click", () => this.decrement());
    this.rightArrow.addEventListener("click", () => this.increment());
  }

  decrement() {
    if (this.section === 0) {
      this.section = Timeline.length - 1;
    } else {
      this.section--;
    }
    this.transitionSection()
  }

  increment() {
    if (this.section === Timeline.length -1) {
      this.section = 0;
    } else {
      this.section++;
    }
    this.transitionSection()
  }

  transitionSection() {
    this.buttonText.innerHTML = Timeline[this.section].section
  }
}
