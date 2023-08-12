let sketchWidth;
let sketchHeight;
let btn1;
let btn2;
let btnPressedCount = 0;

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
  console.log('Button 1 touched!');
  btn1.style.opacity = '1'; // Set opacity to 100% when touched
  btnPressedCount++;
  checkTouchCount();
  socket.emit('init', ['A']);
}

function btn2Touched() {
  console.log('Button 2 touched!');
  btn2.style.opacity = '1'; // Set opacity to 100% when touched
  btnPressedCount++;
  checkTouchCount();
  socket.emit('init', ['B']);
}

function btnReleased() {
  console.log('Button released!');
  btn1.style.opacity = '0.1'; // Set opacity back to 10% when released
  btn2.style.opacity = '0.1'; // Set opacity back to 10% when released
  btnPressedCount--;
  checkTouchCount();
}

function checkTouchCount() {
  if (btnPressedCount === 2) {
    thirdFunction();
  }
}

function thirdFunction() {
  console.log(
    'Both buttons are touched simultaneously! Third function executed.'
  );
  socket.emit('init', ['A', 'B']);
}
