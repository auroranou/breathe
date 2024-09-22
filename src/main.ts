import "./reset.css";
import "./style.css";

import * as SimpleSquare from "./themes/simple-square";
import type { BreatheConfig } from "./types";

function getSelectedTheme(): string {
  const themeSelect = document.getElementById("theme");
  const selectedOpts = (themeSelect as HTMLSelectElement).selectedOptions;
  return selectedOpts.length ? selectedOpts[0].value : "simple";
}

function getDuration(inputId: string) {
  const input = document.getElementById(inputId);
  return input ? parseInt((input as HTMLInputElement).value, 10) : 4;
}

function getBreatheConfig(): BreatheConfig {
  const container = document.getElementById("container");

  if (!container) {
    throw new Error("Container element not found");
  }

  const inhaleDuration = getDuration("inhale");
  const hold1Duration = getDuration("hold1");
  const exhaleDuration = getDuration("exhale");
  const hold2Duration = getDuration("hold2");
  const totalDuration =
    inhaleDuration + hold1Duration + exhaleDuration + hold2Duration;

  return {
    container,
    inhaleDuration,
    inhaleOffset: 0,
    hold1Duration,
    hold1Offset: inhaleDuration / totalDuration,
    exhaleDuration,
    exhaleOffset: (inhaleDuration + hold1Duration) / totalDuration,
    hold2Duration,
    hold2Offset:
      (inhaleDuration + hold1Duration + exhaleDuration) / totalDuration,
    totalDuration,
  };
}

function onThemeChange() {
  const theme = getSelectedTheme();
  const config = getBreatheConfig();

  config.container.innerHTML = "";

  switch (theme) {
    case "simple-square":
      SimpleSquare.draw(config);
      break;
    default:
  }
}

function init() {
  const themeSelect = document.getElementById("theme");
  themeSelect?.addEventListener("change", onThemeChange);

  onThemeChange();
}

init();
