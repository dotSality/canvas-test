import lifeControls from "./life.js";
import antControls from "./ant.js";
import wireworldControls from "./wireworld.js";

const buttonsData = [
  { label: "Ant", type: "ANT", controls: antControls },
  { label: "Life", type: "LIFE", controls: lifeControls },
  { label: "Wireworld (diode)", type: "WIREWORLD", controls: wireworldControls },
];

const container = document.querySelector(".controls");

let currentStop = null;

for (let button of buttonsData) {
  const element = document.createElement("button");
  element.classList.add("controls__button");
  element.innerText = button.label;
  container.appendChild(element);
  element.setAttribute("data-type", button.type);
  element.addEventListener("click", async () => {
    currentStop?.();
    button.controls.start();
    currentStop = button.controls.stop;
  });
}
