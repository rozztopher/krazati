import Timeline from "../Utils/Timeline.js";
import gsap from "gsap";

export default class TimelineControls {
  constructor() {
    this.leftArrow = document.getElementById("left-arrow");
    this.rightArrow = document.getElementById("right-arrow");
    this.buttonText = document.querySelector('.button-text');
    this.textContent = document.querySelector(".text-content");
    this.divider = document.querySelector(".divider");
    this.header = document.getElementById("text-header");
    this.paragraph = document.getElementById("text-paragraph");

    this.section = 0;
    this.chapter = 0;

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

  transitionSection(section) {
    this.section = section
    this.buttonText.innerHTML = Timeline[this.section].section
    this.header.innerHTML = Timeline[this.section].chapters[this.chapter].header
    this.paragraph.innerHTML = Timeline[this.section].chapters[this.chapter].text

    gsap.set(this.textContent, {opacity: 1})
    gsap.timeline().to(this.divider, {duration: 1, opacity: 1})
    gsap.timeline().to(this.header, {delay: 1, duration: 2, opacity: 1})
    gsap.timeline().to(this.paragraph, {delay: 2, duration: 1, opacity: 1})
  }
}
