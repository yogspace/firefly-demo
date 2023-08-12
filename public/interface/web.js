let sketchWidth;
let sketchHeight;
let circleOpacity = 0.5;
let isCircle1Touched = false;
let isCircle2Touched = false;

function setup() {
  sketchWidth = document.getElementById('sketch').offsetWidth;
  sketchHeight = document.getElementById('sketch').offsetHeight;

  let renderer = createCanvas(sketchWidth, sketchHeight);
  renderer.parent('sketch');

  config = {
    bgColor: color(20, 20, 20),
  };
}

function draw() {
  clear();
  background(config.bgColor);

  // Draw reference circle (invisible)
  noFill();
  stroke(255, 0); // No opacity
  ellipse(sketchWidth / 2, sketchHeight / 2, sketchWidth);

  // Draw circles with opacity
  noStroke();
  fill(255);
  ellipse(sketchWidth / 4, sketchHeight / 2, sketchWidth);
  fill(255, 255, 255, (1 - circleOpacity) * 255);
  ellipse((3 * sketchWidth) / 4, sketchHeight / 2, sketchWidth);

  if (isCircle1Touched && isCircle2Touched) {
    // Both circles are touched
    // Execute a function or perform an action
    executeFunctionBothCirclesTouched();
  } else if (isCircle1Touched) {
    // Circle 1 is touched
    // Execute a function or perform an action
    executeFunctionCircle1Touched();
  }
}

function touchStarted() {
  // Check if touches are on the circles
  let circle1Dist = dist(
    touches[0].x,
    touches[0].y,
    sketchWidth / 4,
    sketchHeight / 2
  );
  let circle2Dist = dist(
    touches[0].x,
    touches[0].y,
    (3 * sketchWidth) / 4,
    sketchHeight / 2
  );

  if (circle1Dist < sketchWidth / 2) {
    isCircle1Touched = true;
  }
  if (circle2Dist < sketchWidth / 2) {
    isCircle2Touched = true;
  }
}

function touchEnded() {
  isCircle1Touched = false;
  isCircle2Touched = false;
}

function executeFunctionBothCirclesTouched() {
  // Your code for the action when both circles are touched
  console.log('Both circles are touched!');
}

function executeFunctionCircle1Touched() {
  // Your code for the action when only circle 1 is touched
  console.log('Circle 1 is touched!');
}
