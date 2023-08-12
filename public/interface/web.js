let sketchWidth;
let sketchHeight;

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
  // fill(config.bgColor);
  // circle(sketchWidth / 2, sketchHeight / 2, sketchWidth);
  // getTouchControls();
}

function touchStarted() {
  island.touchStarted();
}
// let persons = [{ isReady: false }, { isReady: false }];

// Deine anderen Funktionen hier

// function getTouchControls() {
//   if (touches.length >= 2) {
//     persons[0].isReady = true;
//     isReady = 'one';
//   }
//   if (touches.length >= 4) {
//     persons[1].isReady = true;
//     isReady = 'both';
//   }
//   if (touches.length < 2) {
//     persons.forEach((person) => {
//       person.isReady = false;
//     });
//     isReady = 'none';
//   }
//   console.log(isReady);
// }
