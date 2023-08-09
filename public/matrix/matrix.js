let socket = io();

socket.on('chat message', function (msg) {
  console.log(msg);
});

let sketchWidth = document.getElementById('sketch').offsetWidth;
let sketchHeight = document.getElementById('sketch').offsetHeight;
let sketch = document.getElementById('sketch');
let backgroundImg;

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

function draw() {
  clear();
  background(255, 0, 0);
  fill(255, 255, 255);
  circle(width / 2, height / 2, 100);
}
