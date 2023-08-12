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
let scale = 1;

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
    0,
    0,
    (config.interruptScale * config.scale * sketchHeight) / 250,
    color(255, 180, 30),
    color(255, 255, 255),
    160,
    speed
  );
  startActive();
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
      // btn1.style.opacity = '0.1'; // Set opacity to 100% when touched
      // btn2.style.opacity = '0.1'; // Set opacity to 100% when touched
    }
  }
}
socket.on('interrupt', (data) => {
  console.log(data);
  switch (data) {
    case 'start':
      speed = 0.06;
      let increaseInterruptSpeed = setInterval(() => {
        if (config.interruptScale > 0.5) {
          config.interruptScale = config.interruptScale - 0.05;
        } else {
          clearInterval(increaseInterruptSpeed);
        }
      }, 20);
      // config.interruptScale = 0.5;
      break;
    case 'end':
      speed = 0.01;
      let endInterruptionSpeed = setInterval(() => {
        if (config.interruptScale > 0) {
          config.interruptScale = config.interruptScale - 0.05;
        } else {
          reset();
          clearInterval(endcreaseInterruptSpeed);
        }
      }, 100);
      break;
    case 'idle':
      speed = 0.01;
      let decreaseInterruptSpeed = setInterval(() => {
        if (config.interruptScale < 1) {
          config.interruptScale = config.interruptScale + 0.05;
        } else {
          clearInterval(decreaseInterruptSpeed);
        }
      }, 100);

      break;
    default:
      break;
  }
});

function reset() {
  console.log('reset in 10s');
  setTimeOut(() => {
    console.log('reset now');
    socket.emit('reset', '');
  }, 10000);
}

socket.on('reset', (data) => {
  btn1.style.left = `800px`;
  btn2.style.left = `-800px`;
  btn1.style.opacity = `0.1`;
  btn2.style.opacity = `0.1`;
  setting = 'idle';
  config.startActive = false;
  config.scale = 0;
  config.interruptScale = 1;
});

// WABERN##########################################################
function getCircleSpread(x, y, npoints, noiseVal, noiseMin, noiseMax, speed) {
  let circleSpread = [];

  let angle = TWO_PI / npoints;
  //Polarkoordinate um Punkte auf einem Kreis zu bekommen
  for (let a = 0; a < TWO_PI; a += angle) {
    let offX = map(cos(a), -1, 1, 0, noiseVal);
    let offY = map(sin(a + phase), -1, 1, 0, noiseVal);
    r = map(noise(offX, offY, sin(phase / 2)), 0, 1, noiseMin, noiseMax);
    let sx = x + cos(a) * r;
    let sy = y + sin(a) * r;
    let e = [sx, sy, offX, offY];
    //Koordinaten + Winkel zum Mittelpunkt werden gespeichert
    circleSpread.push(e);
  }
  // phase = phase + phase;
  phase += speed;
  return circleSpread;
}

function polygons(x, y, scale, color1, color2, alpha, speed) {
  push();
  translate(x, y);
  polygon(
    0,
    0,
    100,
    0.5,
    70 * scale,
    100 * scale,
    speed,
    color1,
    color2,
    0.9 * PI,
    alpha
  );
  polygon(
    0,
    0,
    100,
    0.6,
    50 * scale,
    100 * scale,
    speed,
    color1,
    color2,
    0.3 * PI,
    alpha
  );
  polygon(
    0,
    0,
    100,
    1,
    50 * scale,
    80 * scale,
    speed,
    color1,
    color2,
    0.6 * PI,
    alpha
  );
}

function polygon(
  x,
  y,
  npoints,
  noiseVal,
  noiseMin,
  noiseMax,
  speed,
  color1,
  color2,
  rotation,
  alpha
) {
  //die Mitte ist der Nullpunkt
  push();
  translate(width / 2, height / 2);
  //ein Array aus Punkten auf einem Kreis

  let circleSpread = getCircleSpread(
    x,
    y,
    npoints,
    noiseVal,
    noiseMin,
    noiseMax,
    speed
  );

  //Aus jedem neuen Punkt wird ein Vector gemacht und als vertex gezeichnet
  noStroke();
  rotate(rotation);

  gradientColor(-noiseMax + x, 0, noiseMax + x, 0, color1, color2, alpha);

  beginShape();
  for (let i = 0; i <= circleSpread.length - 1; i++) {
    let pointX = circleSpread[i][0];
    let pointY = circleSpread[i][1];
    vertex(pointX, pointY);
  }
  endShape(CLOSE);
  pop();
}

function gradientColor(x1, y1, x2, y2, color1, color2, alpha) {
  // linear gradient from start to end of line
  var grad = this.drawingContext.createLinearGradient(x1, y1, x2, y2);
  color1.setAlpha(alpha);
  color2.setAlpha(alpha);

  grad.addColorStop(0, color1);
  grad.addColorStop(1, color2);

  this.drawingContext.fillStyle = grad;
}
