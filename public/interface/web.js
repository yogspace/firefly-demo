let sketchWidth;
let sketchHeight;
let btn1;
let btn2;
let btnPressedCount = 0;
let btn1Clicked = false; // New flag variable to track if btn1 was clicked
let btn2Clicked = false; // New flag variable to track if btn2 was clicked
let setting = 'idle';

//wabern
let phase = 1;
let speed = 0.01;
let posX = 0;
let posY = 0;

//speed = 0.01 = fast

let socket = io();

function setup() {
  sketchWidth = document.getElementById('sketch').offsetWidth;
  sketchHeight = document.getElementById('sketch').offsetHeight;

  let renderer = createCanvas(sketchWidth, sketchHeight);
  renderer.parent('sketch');

  config = {
    bgColor: color(20, 20, 20),
    scale: 0,
    interruptScale: 1,
    startActive: false,
    allowEnd: false,
  };

  btn1 = document.getElementById('btn1');
  btn2 = document.getElementById('btn2');

  btn1.addEventListener('touchstart', btn1Touched);
  btn2.addEventListener('touchstart', btn2Touched);
  btn1.addEventListener('touchend', btnReleased);
  btn2.addEventListener('touchend', btnReleased);

  //speed = 0.01 = fast
}

function draw() {
  clear();
  background(config.bgColor);
  polygons(
    posX,
    posY,
    (config.interruptScale * config.scale * sketchHeight) / 250,
    color(255, 180, 30),
    color(255, 255, 255),
    160,
    speed
  );
  startActive();
  allowEnd();
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
      btn1.style.left = `${600 - 600 * config.scale}px`;
      btn2.style.left = `${-600 + 600 * config.scale}px`;
      btn1.style.opacity = `${1 - config.scale}`;
      btn2.style.opacity = `${1 - config.scale}`;
    } else {
      config.allowEnd = true;
    }
  }
}

function allowEnd() {
  if (config.allowEnd === true && touches.length === 4) {
    socket.emit('end');
    speed = 0.01;
    let endInterval = setInterval(() => {
      if (config.interruptScale > 0.5) {
        config.interruptScale = config.interruptScale - 0.01;
        posY = posY + 1;
      } else {
        clearInterval(endInterval);
      }
    });
  }
}

socket.on('interrupt', (data) => {
  console.log(data);
  switch (data) {
    case 'start':
      speed = 0.06;
      let increaseInterruptSpeed = setInterval(() => {
        if (config.interruptScale > 0.5) {
          config.interruptScale = config.interruptScale - 0.01;
        } else {
          clearInterval(increaseInterruptSpeed);
        }
      }, 20);
      break;
    case 'end':
      speed = 0.01;
      let endInterruptionSpeed = setInterval(() => {
        if (config.interruptScale > 0) {
          config.interruptScale = config.interruptScale - 0.01;
        } else {
          socket.emit('reset', '');
          clearInterval(endInterruptionSpeed);
        }
      }, 20);
      break;
    case 'idle':
      speed = 0.01;
      let decreaseInterruptSpeed = setInterval(() => {
        if (config.interruptScale < 1) {
          config.interruptScale = config.interruptScale + 0.01;
        } else {
          clearInterval(decreaseInterruptSpeed);
        }
      }, 20);
      break;
    default:
      break;
  }
});

socket.on('reset', (data) => {
  console.log('resetted all');
  btn1.style.left = `600px`;
  btn2.style.left = `-600px`;
  btn1.style.opacity = `0.1`;
  btn2.style.opacity = `0.1`;
  setting = 'idle';
  config.startActive = false;
  config.scale = 0;
  config.interruptScale = 1;
  btn1Clicked = false;
  btn2Clicked = false;
  speed = 0.01;
  posX = 0;
  posY = 0;
});
