let sketchWidth;
let sketchHeight;
let btn1;
let btn2;
let btnPressedCount = 0;
let btn1TouchedFlag = false;
let btn2TouchedFlag = false;
let thirdFunctionExecuted = false; // New variable to track thirdFunction execution

let socket = io();

function setup() {
  sketchWidth = document.getElementById('sketch').offsetWidth;
  sketchHeight = document.getElementById('sketch').offsetHeight;

  let renderer = createCanvas(sketchWidth, sketchHeight);
  renderer.parent('sketch');

  config = {
    bgColor: color(20, 20, 20),
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
}

function btn1Touched() {
  if (thirdFunctionExecuted) return; // Don't execute if thirdFunction already executed
  console.log('Button 1 touched!');
  btn1.style.opacity = '1'; // Set opacity to 100% when touched
  btn1TouchedFlag = true;
  checkTouchCount();
  data = { setting: 'idle', area: ['B'], speed: 0.2 };
  socket.emit('init', data);
}

function btn2Touched() {
  if (thirdFunctionExecuted) return; // Don't execute if thirdFunction already executed
  console.log('Button 2 touched!');
  btn2.style.opacity = '1'; // Set opacity to 100% when touched
  btn2TouchedFlag = true;
  checkTouchCount();
  data = { setting: 'idle', area: ['A'], speed: 0.5 };
  socket.emit('init', data);
}

function btnReleased() {
  if (thirdFunctionExecuted) return; // Don't execute if thirdFunction already executed
  console.log('Button released!');
  btn1.style.opacity = '0.1'; // Set opacity back to 10% when released
  btn2.style.opacity = '0.1'; // Set opacity back to 10% when released
  btn1TouchedFlag = false;
  btn2TouchedFlag = false;
  checkTouchCount();
  data = { setting: 'idle', area: [], speed: 0.2 };
  socket.emit('init', data);
}

function checkTouchCount() {
  if (btn1TouchedFlag && btn2TouchedFlag && !thirdFunctionExecuted) {
    thirdFunction();
  }
}

function thirdFunction() {
  console.log(
    'Both buttons are touched simultaneously! Third function executed.'
  );
  thirdFunctionExecuted = true; // Set the flag to true after executing thirdFunction
  data = { setting: 'active', area: ['A', 'B'], speed: 0.5 };
  socket.emit('init', data);
}
