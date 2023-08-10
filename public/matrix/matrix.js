let sketchWidth = document.getElementById('sketch').offsetWidth;
let sketchHeight = document.getElementById('sketch').offsetHeight;
let sketch = document.getElementById('sketch');

function preload() {}

function setup() {
  sketchWidth = document.getElementById('sketch').offsetWidth;
  sketchHeight = document.getElementById('sketch').offsetHeight;
  let renderer = createCanvas(sketchWidth, sketchHeight);
  renderer.parent('sketch');
  rectMode(CENTER);
}

function windowResized() {
  sketchWidth = document.getElementById('sketch').offsetWidth;
  sketchHeight = document.getElementById('sketch').offsetHeight;
  resizeCanvas(sketchWidth, sketchHeight);
}

let socket = io();

socket.on('chat message', function (msg) {
  console.log(msg);
});

const num_pixels_x = 32;
const num_pixels_y = 16;

function getPixels() {
  /**
   *
   * width / 32
   * height / 16
   *
   * so groß ist ein LEDPixel
   *
   * in diesem LEDPixel alle Pixel auswerten und Durchschnittsfarbe ermitteln
   * diese dann im Array speichern und schicken
   * 
    socket.emit('matrixPixels', pixels);
   * 
   */

  let pixels = [];
  for (let posY = 0; posY < num_pixels_y; posY++) {
    let row = [];
    for (let posX = 0; posX < num_pixels_y; posX++) {
      let p = {
        r: 0,
        g: 0,
        b: 0,
      };
      row.push(pixel);
    }
    pixels.push(row);
  }
}

socket.emit('chat message', 'hi');

function draw() {
  clear();
  background(255, 0, 0);
  fill(255, 255, 255);
  circle(width / 2, height / 2, 100);
}

function mouseClicked(x) {
  console.log(x);
  let c = get(x.layerX, x.layerY);
  console.log(c);
}
