let sketchWidth = document.getElementById('sketch').offsetWidth;
let sketchHeight = document.getElementById('sketch').offsetHeight;
let sketch = document.getElementById('sketch');
let socket = io();

let bgColor;

function preload() {}

function setup() {
  sketchWidth = document.getElementById('sketch').offsetWidth;
  sketchHeight = document.getElementById('sketch').offsetHeight;
  let renderer = createCanvas(sketchWidth, sketchHeight);
  renderer.parent('sketch');
  bgColor = color(15, 3, 0);
}

const pixelMatrixTranslation = [
  [
    0, 15, 16, 31, 32, 47, 48, 63, 64, 79, 80, 95, 96, 111, 112, 127, 128, 143,
    144, 159, 160, 175, 176, 191, 192, 207, 208, 223, 224, 239, 240, 255,
  ],
  [
    1, 14, 17, 30, 33, 46, 49, 62, 65, 78, 81, 94, 97, 110, 113, 126, 129, 142,
    145, 158, 161, 174, 177, 190, 193, 206, 209, 222, 225, 238, 241, 254,
  ],
  [
    2, 13, 18, 29, 34, 45, 50, 61, 66, 77, 82, 93, 98, 109, 114, 125, 130, 141,
    146, 157, 162, 173, 178, 189, 194, 205, 210, 221, 226, 237, 242, 253,
  ],
  [
    3, 12, 19, 28, 35, 44, 51, 60, 67, 76, 83, 92, 99, 108, 115, 124, 131, 140,
    147, 156, 163, 172, 179, 188, 195, 204, 211, 220, 227, 236, 243, 252,
  ],
  [
    4, 11, 20, 27, 36, 43, 52, 59, 68, 75, 84, 91, 100, 107, 116, 123, 132, 139,
    148, 155, 164, 171, 180, 187, 196, 203, 212, 219, 228, 235, 244, 251,
  ],
  [
    5, 10, 21, 26, 37, 42, 53, 58, 69, 74, 85, 90, 101, 106, 117, 122, 133, 138,
    149, 154, 165, 170, 181, 186, 197, 202, 213, 218, 229, 234, 245, 250,
  ],
  [
    6, 9, 22, 25, 38, 41, 54, 57, 70, 73, 86, 89, 102, 105, 118, 121, 134, 137,
    150, 153, 166, 169, 182, 185, 198, 201, 214, 217, 230, 233, 246, 249,
  ],
  [
    7, 8, 23, 24, 39, 40, 55, 56, 71, 72, 87, 88, 103, 104, 119, 120, 199, 200,
    215, 216, 231, 232, 247, 248, 135, 136, 151, 152, 167, 168, 183, 184,
  ],
  [
    504, 503, 488, 487, 472, 471, 456, 455, 440, 439, 424, 423, 408, 407, 392,
    391, 376, 375, 360, 359, 344, 343, 328, 327, 312, 311, 296, 295, 280, 279,
    264, 263,
  ],
  [
    505, 502, 489, 486, 473, 470, 457, 454, 441, 438, 425, 422, 409, 406, 393,
    390, 377, 374, 361, 358, 345, 342, 329, 326, 313, 310, 297, 294, 281, 278,
    265, 262,
  ],
  [
    506, 501, 490, 485, 474, 469, 458, 453, 442, 437, 426, 421, 410, 405, 394,
    389, 378, 373, 362, 357, 346, 341, 330, 325, 314, 309, 298, 293, 282, 277,
    266, 261,
  ],
  [
    507, 500, 491, 484, 475, 468, 459, 452, 443, 436, 427, 420, 411, 404, 395,
    388, 379, 372, 363, 356, 347, 340, 331, 324, 315, 308, 299, 292, 283, 276,
    267, 260,
  ],
  [
    508, 499, 492, 483, 476, 467, 460, 451, 444, 435, 428, 419, 412, 403, 396,
    387, 380, 371, 364, 355, 348, 339, 332, 323, 316, 307, 300, 291, 284, 275,
    268, 259,
  ],
  [
    509, 498, 493, 482, 477, 466, 461, 450, 445, 434, 429, 418, 413, 402, 397,
    386, 381, 370, 365, 354, 349, 338, 333, 322, 317, 306, 301, 290, 285, 274,
    269, 258,
  ],
  [
    510, 497, 494, 481, 478, 465, 462, 449, 446, 433, 430, 417, 414, 401, 398,
    385, 382, 369, 366, 353, 350, 337, 334, 321, 318, 305, 302, 289, 286, 273,
    270, 257,
  ],
  [
    511, 496, 495, 480, 479, 464, 463, 448, 447, 432, 431, 416, 415, 400, 399,
    384, 383, 368, 367, 352, 351, 336, 335, 320, 319, 304, 303, 288, 287, 272,
    271, 256,
  ],
];

const num_pixels_x = 32;
const num_pixels_y = 16;
const scale = sketchWidth / num_pixels_x;
let speed = 1;

class Firefly {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.radius = 1; // Radius des Firefly-Punkts
    this.moving = false;
    this.targetX = x;
    this.targetY = y;
  }

  display() {
    fill(210, 180, 200, 20);
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(255, 255, 255, 20);
    noStroke();
    circle(this.x, this.y, this.radius * 2);

    // Wenn der Punkt auf der Grenze ist, zeichne ihn auf der gegenüberliegenden Seite
    if (this.x - this.radius < 0) {
      circle(this.x + width, this.y, this.radius * 2);
    } else if (this.x + this.radius > width) {
      circle(this.x - width, this.y, this.radius * 2);
    }
  }

  move(speed) {
    if (!this.moving) {
      this.targetX = Math.round(random(0, width));
      this.targetY = Math.round(random(0, height));
      this.moving = true;
    }

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.speed) {
      const angle = Math.atan2(dy, dx);
      const newX = this.x + this.speed * speed * Math.cos(angle);

      // Check if crossing the boundary is faster
      if (this.shouldCrossBoundary(newX)) {
        this.crossBoundary();
      } else {
        this.x = newX;
      }

      this.y += this.speed * speed * Math.sin(angle);
    } else {
      this.x = this.targetX;
      this.y = this.targetY;
      this.moving = false;
    }
  }

  shouldCrossBoundary(newX) {
    return newX - this.radius > width || newX + this.radius < 0;
  }

  crossBoundary() {
    if (this.x - this.radius > width) {
      this.x = -this.radius;
    } else if (this.x + this.radius < 0) {
      this.x = width + this.radius;
    }
  }
}

let fireflies = [];
fireflies.push(new Firefly(sketchWidth / 2, sketchHeight / 2, 0.2));
fireflies.push(new Firefly(sketchWidth / 2, sketchHeight / 2, 0.2));
fireflies.push(new Firefly(sketchWidth / 2, sketchHeight / 2, 0.2));

let lastPixelMatrix = null;
function getPixels() {
  let pixels = [];

  for (let posY = 0; posY < 16; posY++) {
    for (let posX = 0; posX < 32; posX++) {
      let r = get(posX, posY)[0];
      let g = get(posX, posY)[1];
      let b = get(posX, posY)[2];

      let id = pixelMatrixTranslation[posY][posX];

      if (lastPixelMatrix && hasColorChanged(posX, posY, r, g, b)) {
        let pixel = {
          id: id,
          color: {
            r: r,
            g: g,
            b: b,
          },
        };
        pixels.push(pixel);
      }
    }
  }

  socket.emit('updatePixels', pixels);
  lastPixelMatrix = createPixelMatrix(); // Aktualisiere das letzte Pixel-Array
}

function hasColorChanged(x, y, r, g, b) {
  if (!lastPixelMatrix) {
    return true;
  }

  const lastPixel = lastPixelMatrix[y][x];
  return (
    lastPixel.color.r !== r ||
    lastPixel.color.g !== g ||
    lastPixel.color.b !== b
  );
}

function createPixelMatrix() {
  let matrix = [];
  for (let posY = 0; posY < 16; posY++) {
    let row = [];
    for (let posX = 0; posX < 32; posX++) {
      let r = get(posX, posY)[0];
      let g = get(posX, posY)[1];
      let b = get(posX, posY)[2];

      let id = pixelMatrixTranslation[posY][posX];

      let pixel = {
        id: id,
        color: {
          r: r,
          g: g,
          b: b,
        },
      };

      row.push(pixel);
    }
    matrix.push(row);
  }
  return matrix;
}

function drawFireflies() {
  for (let i = 0; i < fireflies.length; i++) {
    fireflies[i].display();
    fireflies[i].move(speed);
  }
}

function draw() {
  clear();
  background(bgColor);

  drawFireflies();
}

let valueToIncrease = 0;
let increaseInterval;
let countdownInterval;
let countdownValue = 11;
let newDataReceivedDuringCountdown = false;
let stillReceivingDataAfterCountdown = false;

function startIncrease() {
  if (!increaseInterval && !newDataReceivedDuringCountdown) {
    console.log('1: countdown');
    increaseInterval = setInterval(() => {
      valueToIncrease++;
      if (valueToIncrease > 10) {
        valueToIncrease = 10;
      }
      if (stillReceivingDataAfterCountdown === false) {
        bgColor = color(0, 0, valueToIncrease);
        console.log('2: countdown');
      } else {
        clearInterval(increaseInterval);
      }
    }, 50); // Wert alle 0.05 Sekunden erhöhen
  }
}

function resetIncrease() {
  clearInterval(increaseInterval);
  increaseInterval = null;
  valueToIncrease = 0;
  console.log('3: reset');
}

function startCountdown() {
  clearInterval(countdownInterval);
  countdownValue = 11;
  console.log('4: start countdown');

  countdownInterval = setInterval(() => {
    console.log(countdownValue);
    countdownValue--;

    if (countdownValue === 1) {
      newDataReceivedDuringCountdown = false; // Zurücksetzen während der letzten Sekunde
    }

    if (countdownValue < 0) {
      clearInterval(countdownInterval);
      console.log('Countdown abgelaufen!');
      if (newDataReceivedDuringCountdown) {
        handleDataAfterCountdown();
      } else {
        handleNoDataAfterCountdown(); // Funktion für keinen Datenempfang
      }
      countdownInterval = null; // Zurücksetzen des Countdown-Intervalls
    }
  }, 1000); // Timer alle 1 Sekunde aktualisieren
}

socket.on('movement data', function (data) {
  if (!newDataReceivedDuringCountdown) {
    startIncrease();
    newDataReceivedDuringCountdown = true; // Neue Daten während Countdown empfangen
    if (!countdownInterval) {
      startCountdown(); // Countdown neu starten, wenn Daten empfangen werden
    }
  }
  // Füge hier den Code hinzu, um auf die empfangenen Daten zu reagieren
  // z.B. bgColor = color(0, 0, 255);
  // speed = speed + 1;
});

function handleDataAfterCountdown() {
  // Hier wird deine Funktion aufgerufen, wenn nach dem Countdown
  // immer noch Daten empfangen werden
  console.log('Daten werden immer noch empfangen nach Countdown.');
  bgColor = color(255, 0, 0);
  stillReceivingDataAfterCountdown = true;
  // Füge hier den Code hinzu, den du ausführen möchtest
}

function handleNoDataAfterCountdown() {
  // Hier wird deine Funktion aufgerufen, wenn nach dem Countdown
  // keine Daten mehr empfangen werden
  bgColor = color(15, 3, 0);
  console.log('Keine Daten mehr empfangen nach Countdown.');

  resetIncrease(); // Setze den Wert zurück
  newDataReceivedDuringCountdown = false; // Zurücksetzen nach dem Aufrufen der Funktion
  // Füge hier den Code hinzu, den du ausführen möchtest
}

//UpdatePixels
const updatePixels = setInterval(getPixels, 50);
