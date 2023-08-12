let sketchWidth;
let sketchHeight;
let btn1;
let btn2;
let btnPressedCount = 0;
let btn1Clicked = false; // New flag variable to track if btn1 was clicked
let btn2Clicked = false; // New flag variable to track if btn2 was clicked
let setting = 'idle';

let socket = io();

function setup() {
  sketchWidth = document.getElementById('sketch').offsetWidth;
  sketchHeight = document.getElementById('sketch').offsetHeight;

  let renderer = createCanvas(sketchWidth, sketchHeight);
  renderer.parent('sketch');

  config = {
    bgColor: color(20, 20, 20),
    scale: 0,
    startActive: false,
  };

  btn1 = document.getElementById('btn1');
  btn2 = document.getElementById('btn2');

  btn1.addEventListener('touchstart', btn1Touched);
  btn2.addEventListener('touchstart', btn2Touched);
  btn1.addEventListener('touchend', btnReleased);
  btn2.addEventListener('touchend', btnReleased);
}

function draw() {
  clear();
  background(config.bgColor);
  drawLightPoint();
  startActive();
}

function drawLightPoint() {
  fill(255, 0, 0);
  circle(sketchWidth / 2, sketchHeight / 2, 0.5 * sketchWidth * config.scale);
}

function btn1Touched() {
  if (setting === 'idle') {
    btn1Clicked = true; // Set flag to true when btn1 is clicked

    if (!btn2Clicked) {
      console.log('Button 1 touched!');
      btn1.style.opacity = '1'; // Set opacity to 100% when touched
      checkTouchCount();
      data = { setting: 'idle', area: ['B'], speed: 0.6 };
      socket.emit('init', data);
    } else {
      checkTouchCount();
    }
  }
}

function btn2Touched() {
  if (setting === 'idle') {
    btn2Clicked = true; // Set flag to true when btn2 is clicked
    if (!btn1Clicked) {
      console.log('Button 2 touched!');
      btn2.style.opacity = '1'; // Set opacity to 100% when touched
      checkTouchCount();
      data = { setting: 'idle', area: ['A'], speed: 0.5 };
      socket.emit('init', data);
    } else {
      checkTouchCount();
    }
  }
}

function btnReleased() {
  if (setting === 'idle') {
    console.log('Button released!');
    btn1.style.opacity = '0.1'; // Set opacity back to 10% when released
    btn2.style.opacity = '0.1'; // Set opacity back to 10% when released
    btn1Clicked = false; // Reset flag when btn1 is released
    btn2Clicked = false; // Reset flag when btn2 is released
    checkTouchCount();
    data = { setting: 'idle', area: [], speed: 0.6 };
    socket.emit('init', data);
  }
}

function checkTouchCount() {
  if (btn1Clicked && btn2Clicked) {
    thirdFunction();
    btn1.style.opacity = '1'; // Set opacity to 100% when touched
    btn2.style.opacity = '1'; // Set opacity to 100% when touched
    setting = 'active';
  }
}

function thirdFunction() {
  console.log(
    'Both buttons are touched simultaneously! Third function executed.'
  );
  data = { setting: 'active', area: ['A', 'B'], speed: 0.5 };
  socket.emit('init', data);
  config.startActive = true;
}

function startActive() {
  if (config.startActive === true) {
    if (config.scale < 1) {
      config.scale = config.scale + 0.01;
    }
  }
}
