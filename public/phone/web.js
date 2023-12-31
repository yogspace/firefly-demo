let socket = io();
let sendingEnabled = false; // Zustand des Sendens
let lastGyrometerData = null;
let tolerance = 0.2;
let id = generateUUID();

console.log(id);
// socket.join('matrix');

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
// Funktion zum Senden der Bewegungsdaten über den Socket
function sendMovementData(data) {
  data = {
    id: id,
    data: data,
  };
  socket.emit('movement data', data);
}

// Funktion, um den Zustand des Sendens zu aktualisieren
function toggleSending() {
  sendingEnabled = !sendingEnabled;
  let sendButton = document.getElementById('sendButton');
  if (sendingEnabled) {
    socket.emit('phone login', id);
    sendButton.textContent = 'Senden stoppen';
    // Starte das Senden der Bewegungsdaten
    startSending();
  } else {
    socket.emit('phone logout', id);
    sendButton.textContent = 'Bewegungsdaten senden';
    // Stoppe das Senden der Bewegungsdaten
    stopSending();
  }
}

// Event-Listener für den Button
document.getElementById('sendButton').addEventListener('click', function () {
  toggleSending();
});

// Funktion zum Starten des Sendens der Bewegungsdaten
function startSending() {
  if (isAppleDevice()) {
    getAccelWithPermission();
  } else {
    getAccel();
  }
}

// Funktion zum Stoppen des Sendens der Bewegungsdaten
function stopSending() {
  window.removeEventListener('devicemotion', handleDeviceMotion);
}

// Funktion, um die Accelerometer-Daten zu erhalten, nur auf Apple-Geräten
function getAccelWithPermission() {
  DeviceMotionEvent.requestPermission().then((response) => {
    if (response == 'granted') {
      // Listener für Beschleunigung hinzufügen
      window.addEventListener('devicemotion', handleDeviceMotion);
    }
  });
}

// Funktion, um die Accelerometer-Daten zu erhalten, auf anderen Geräten
function getAccel() {
  window.addEventListener('devicemotion', handleDeviceMotion);
}

function handleDeviceMotion(event) {
  if (sendingEnabled) {
    let currentGyrometerData = {
      x: event.accelerationIncludingGravity.x,
      y: event.accelerationIncludingGravity.y,
      z: event.accelerationIncludingGravity.z,
    };

    // Wenn es vorherige Daten gibt, interpoliere sie und sende nur bei Abweichung
    if (lastGyrometerData !== null) {
      thresholdAndSendData(currentGyrometerData, lastGyrometerData);
    }

    lastGyrometerData = currentGyrometerData;
  }
}

function thresholdAndSendData(currentData, previousData) {
  let thresholddData = {
    x: threshold(currentData.x, previousData.x),
    y: threshold(currentData.y, previousData.y),
    z: threshold(currentData.z, previousData.z),
  };

  // Toleranz von 0.1 prüfen
  if (
    Math.abs(thresholddData.x - currentData.x) > tolerance ||
    Math.abs(thresholddData.y - currentData.y) > tolerance ||
    Math.abs(thresholddData.z - currentData.z) > tolerance
  ) {
    sendMovementData(thresholddData);
  }
}

function threshold(currentValue, previousValue) {
  // Interpoliere die Werte als Durchschnitt
  return (currentValue + previousValue) / 2;
}

// Funktion zur Überprüfung, ob es sich um ein Apple-Gerät handelt
function isAppleDevice() {
  return /(iPhone|iPod|iPad|Macintosh|MacIntel|MacPPC|Mac68K)/i.test(
    navigator.userAgent
  );
}
