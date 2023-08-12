let sketchWidth;
let sketchHeight;
let bgColor;
let island;

function setup() {
  sketchWidth = document.getElementById('sketch').offsetWidth;
  sketchHeight = document.getElementById('sketch').offsetHeight;

  let renderer = createCanvas(sketchWidth, sketchHeight);
  renderer.parent('sketch');

  bgColor = color(20, 20, 20);
  island = new Island();
}

function draw() {
  clear();
  background(bgColor);
  island.display();
}

class Island {
  constructor() {
    this.diameter = sketchWidth;
    this.radius = this.diameter / 2;
    this.centerX = sketchWidth / 2;
    this.centerY = sketchHeight / 2;
    this.opacity1 = 127; // Anfangs 50% Sichtbarkeit
    this.opacity2 = 63; // Anfangs 25% Sichtbarkeit
    this.touched = false; // Für die Berührungssteuerung
  }

  display() {
    noStroke();
    fill(255, this.opacity1); // Kreis 1
    circle(this.centerX, this.centerY, this.diameter);

    if (this.touched) {
      fill(255, this.opacity2); // Kreis 2
      circle(sketchWidth / 2, sketchHeight / 2, this.diameter);
    }
  }

  touchStarted() {
    let distance = dist(touches[0].x, touches[0].y, this.centerX, this.centerY);
    if (touches.length === 2 && distance < this.radius) {
      this.touched = true;
      this.opacity1 = 255; // Kreis 1 wird 100% sichtbar
      this.opacity2 = 127; // Kreis 2 wird 50% sichtbar
    }
  }

  touchEnded() {
    this.touched = false;
    this.opacity1 = 127; // Kreis 1 zurück auf 50% Sichtbarkeit
    this.opacity2 = 63; // Kreis 2 zurück auf 25% Sichtbarkeit
  }
}
