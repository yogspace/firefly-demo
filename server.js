const puppeteer = require('puppeteer-core');
const http = require('http');
const express = require('express');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const expressServer = http.createServer(app);
const ioExpress = new Server(expressServer);

const socketServerPixels = http.createServer();
const ioPixels = new Server(socketServerPixels);

socketServerPixels.listen(3000);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/phone/index.html');
});
app.get('/matrix', (req, res) => {
  console.log(__dirname);
  res.sendFile(__dirname + '/public/matrix/index.html');
});
app.get('/interface', (req, res) => {
  res.sendFile(__dirname + '/public/interface/index.html');
});

expressServer.listen(3001, () => {
  console.log('headless browser is on route https://localhost:3001/matrix');
  console.log('display interface is on route https://localhost:3001/interface');
  console.log('phone interface is on route https://localhost:3001/');
  createHeadlessBrowser();
});

async function createHeadlessBrowser() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
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
    ],
  });
  const page = await browser.newPage();

  console.log('browser has been openend.');
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

const pixelMatrix = [
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

const width = 32;
const height = 16;

//Pixelmatrix
ioPixels.on('connection', (client) => {
  console.log('new connection\n');
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
  socket.on('pixelMatrix', (pixels) => {
    //console.log(pixels);
    ioPixels.emit('setColorCanvasArray', JSON.stringify(pixels));
  });
});

process.on('SIGINT', async () => {
  await browser.close();
  process.exit();
});
