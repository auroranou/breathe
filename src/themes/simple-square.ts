import "./simple-square.css";
import type { BreatheConfig } from "../types";

export function draw(config: BreatheConfig) {
  const square = document.createElement("div");
  square.className = "square";
  drawInhale(square, config);
  config.container.appendChild(square);
}

function getIndicator(square: HTMLDivElement): HTMLDivElement {
  let indicator = square.querySelector(".indicator");
  if (!indicator) {
    indicator = document.createElement("div");
    indicator.className = "indicator";
    square.appendChild(indicator);
  }
  return indicator as HTMLDivElement;
}

function getTextSpan(
  square: HTMLDivElement,
  className: string,
  textContent: string
): HTMLSpanElement {
  let textSpan = square.querySelector(`.${className}`);
  if (!textSpan) {
    textSpan = document.createElement("span");
    textSpan.className = `text ${className}`;
    textSpan.textContent = textContent;
    square.appendChild(textSpan);
  }
  return textSpan as HTMLSpanElement;
}

async function drawStep(
  indicator: HTMLDivElement,
  textSpan: HTMLSpanElement,
  startPosition: { left: string; top: string },
  endPosition: { left: string; top: string },
  duration: number,
  prevAnimation?: Animation
): Promise<Animation> {
  if (prevAnimation) {
    await prevAnimation.finished;
  }

  const keyframeOpts: KeyframeAnimationOptions = {
    duration,
    iterations: 1,
  };
  const baseAnimation = indicator.animate(
    [startPosition, endPosition],
    keyframeOpts
  );
  const textAnimation = textSpan.animate(
    [{ opacity: 1 }, { opacity: 0 }],
    keyframeOpts
  );

  const baseAnimationTiming = baseAnimation.effect?.getComputedTiming();
  if (baseAnimationTiming?.progress) {
    textAnimation.effect?.updateTiming({
      iterationStart: baseAnimationTiming.progress,
    });
  }

  return baseAnimation;
}

async function drawInhale(
  square: HTMLDivElement,
  config: BreatheConfig,
  prevAnimation?: Animation
) {
  const indicator = getIndicator(square);
  const inhaleSpan = getTextSpan(square, "inhale", "inhale");
  const animation = await drawStep(
    indicator,
    inhaleSpan,
    { left: "-1rem", top: "-1rem" },
    {
      left: "calc(50vh - 1rem - 2px)",
      top: "-1rem",
    },
    config.inhaleDuration * 1000,
    prevAnimation
  );

  drawHold1(square, config, animation);
}

async function drawHold1(
  square: HTMLDivElement,
  config: BreatheConfig,
  prevAnimation: Animation
) {
  const indicator = getIndicator(square);
  const hold1Span = getTextSpan(square, "hold1", "hold");
  const animation = await drawStep(
    indicator,
    hold1Span,
    {
      left: "calc(50vh - 1rem - 2px)",
      top: "-1rem",
    },
    {
      left: "calc(50vh - 1rem - 2px)",
      top: "calc(50vh - 1rem - 2px)",
    },
    config.hold1Duration * 1000,
    prevAnimation
  );

  drawExhale(square, config, animation);
}

async function drawExhale(
  square: HTMLDivElement,
  config: BreatheConfig,
  prevAnimation: Animation
) {
  const indicator = getIndicator(square);
  const exhaleSpan = getTextSpan(square, "exhale", "exhale");
  const animation = await drawStep(
    indicator,
    exhaleSpan,
    {
      left: "calc(50vh - 1rem - 2px)",
      top: "calc(50vh - 1rem - 2px)",
    },
    {
      left: "-1rem",
      top: "calc(50vh - 1rem - 2px)",
    },
    config.exhaleDuration * 1000,
    prevAnimation
  );

  drawHold2(square, config, animation);
}

async function drawHold2(
  square: HTMLDivElement,
  config: BreatheConfig,
  prevAnimation: Animation
) {
  const indicator = getIndicator(square);
  const hold2Span = getTextSpan(square, "hold2", "hold");
  const animation = await drawStep(
    indicator,
    hold2Span,
    {
      left: "-1rem",
      top: "calc(50vh - 1rem - 2px)",
    },
    {
      left: "-1rem",
      top: "-1rem",
    },
    config.hold2Duration * 1000,
    prevAnimation
  );

  drawInhale(square, config, animation);
}
