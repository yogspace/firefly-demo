const fs = require('fs');
const puppeteer = require('puppeteer-core');
const https = require('https');
const http = require('http');
const express = require('express');
const path = require('path');
const { Server } = require('socket.io');
const ip = require('ip');

const app = express();

// Pfade zu den Zertifikat-Dateien
const privateKey = fs.readFileSync('localhost-key.pem', 'utf8');
const certificate = fs.readFileSync('localhost.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const expressServer = https.createServer(credentials, app);
const ioExpress = new Server(expressServer);

const socketServerPixels = http.createServer();
const ioPixels = new Server(socketServerPixels);

socketServerPixels.listen(3000);

app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'phone')));
app.use(express.static(path.join(__dirname, 'public', 'matrix')));
app.use(express.static(path.join(__dirname, 'public', 'interface')));

app.get('/', (req, res) => {
  // res.sendFile(__dirname + '/public/phone/index.html');
  res.sendFile(path.join(__dirname, 'public', 'phone', 'index.html'));
});

app.get('/matrix', (req, res) => {
  console.log(__dirname);
  res.sendFile(__dirname + '/public/matrix/index.html');
});
app.get('/interface', (req, res) => {
  res.sendFile(__dirname + '/public/interface/index.html');
});

expressServer.listen(3001, async () => {
  console.log('\n###################');
  console.log(`this device:`);
  console.log('display interface is on route https://localhost:3001/interface');
  console.log('phone interface is on route https://localhost:3001/');
  console.log('\n');
  const ipAddress = ip.address(); // Erhalte die IP-Adresse
  console.log(`public:`);
  console.log(
    `display interface is on route https://${ipAddress}:3001/interface`
  );
  console.log(`phone interface is on route https://${ipAddress}:3001/`);
  console.log('###################\n');
  createHeadlessBrowser();
});

async function createHeadlessBrowser() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    ignoreHTTPSErrors: true, // Ignoriere HTTPS-Fehler, die durch das selbst signierte Zertifikat verursacht werden
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--no-sandbox',
      '--headless',
      '--autoplay-policy=no-user-gesture-required',
      '--no-first-run',
      '--disable-gpu',
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
      '--disable-sync',
      '--remote-debugging-port=9222',
      `--ignore-certificate-errors`, // Ignoriere Zertifikatsfehler
      `--allow-insecure-localhost`, // Erlaube unsichere Verbindung zu localhost
      `--user-data-dir=/tmp/puppeteer-profile`, // Benutzerdatenverzeichnis für das benutzerdefinierte Profil
    ],
  });
  const page = await browser.newPage();

  await page.setViewport({
    width: 700,
    height: 700,
    deviceScaleFactor: 1,
  });

  await page.setDefaultNavigationTimeout(0);

  //   await page.setViewport({ width: 1200, height: 720 });
  await page.goto('https://localhost:3001/matrix', {
    // waitUntil: 'networkidle0',
    waitUntil: 'load',
    // Remove the timeout
    timeout: 0,
  }); // wait until page load

  console.log('opened: https://localhost:3001/matrix headless');
}

//Pixelmatrix
ioPixels.on('connection', (client) => {
  console.log('python socket: new connection\n');
  ioPixels.emit('clear', 'clear');

  client.on('event', (data) => {
    //wenn Daten reinkommen
    /* … */
  });
  client.on('disconnect', () => {
    /* … */
  });
});

//Express
ioExpress.on('connection', (socket) => {
  socket.on('updatePixels', (pixels) => {
    //console.log(pixels);
    ioPixels.emit('setColorCanvasArray', JSON.stringify(pixels));
  });
  socket.on('movement data', (data) => {
    // console.log('got movement data: ', data);
    ioExpress.emit('movement data', data);
  });
  socket.on('init', (data) => {
    // console.log('got init data: ', data);
    ioExpress.emit('init', data);
  });

  socket.on('end', (data) => {
    // console.log('got end data: ', data);
    ioExpress.emit('end', data);
  });

  socket.on('reset', (data) => {
    console.log('reset in 25s');
    let t = 0;
    let resetInterval = setInterval(() => {
      console.log(t);
      if (t === 25) {
        clearInterval(resetInterval);
        console.log('reset now');
        ioExpress.emit('reset', data);
      }
      t++;
    }, 1000);
  });

  socket.on('interrupt', (data) => {
    // console.log('got interrupt data: ', data);
    ioExpress.emit('interrupt', data);
  });
});

process.on('SIGINT', async () => {
  await browser.close();
  process.exit();
});
