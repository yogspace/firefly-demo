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

const updatePixels = setInterval(getPixels, 10);
