'use strict';

//series approximation
function mandelbrotApprox(target, width, height) {
  
  let ox = [target.x], oy = [target.y];
  let oxox = [ox[0] * ox[0]], oyoy = [oy[0] * oy[0]], oxoy = ox[0] * oy[0];
  for (let i = 0; i < maxIteration - 1; i++) {
    ox.push(oxox[i] - oyoy[i] + target.x);
    oy.push(oxoy + oxoy + target.y);
    oxox.push(ox[i+1] * ox[i+1]);
    oyoy.push(oy[i+1] * oy[i+1]);
    oxoy = ox[i+1] * oy[i+1];
  }

  pixelColorId = 0;
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      let vx = -target.dx + 2 * target.dx * i / width;
      let vy = target.dy - 2 * target.dy * j / height;
      
      let dx = vx, dy = vy, rr = 0, n = -1;
      let zx, zy, dxdx, dydy, oxdx, oydy, oxn, oyn;
      while (n++ < ox.length && rr < escapeSqr) {
        oxn = ox[n]; oyn = oy[n]; dxdx = dx * dx; dydy = dy * dy; oxdx = oxn * dx; oydy = oyn * dy;
        dy = oxn * dy + oyn * dx + dx * dy; dy = dy + dy + vy;
        dx = oxdx - oydy; dx = dx + dx + dxdx - dydy + vx;
        zx = oxn + dx; zy = oyn + dy;
        rr = oxox[n] + oxdx + oxdx + dxdx + oyoy[n] + oydy + oydy + dydy;
      }

      colorizeNextPixel(n - 1, rr, zx, zy, dx, dy);
    }
  }
}

//z -> z^2 + 1/c
function drop(target, width, height) {
  pixelColorId = 0;
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {

      let iteration = 0, x = 0, y = 0, xx = 0, xy = 0, yy = 0;
      let temp = 0, dx = 0, dy = 0;
      let cx = target.x - target.dx + 2 * target.dx * i / width + 1.25;
      let cy = target.y + target.dy - 2 * target.dy * j / height;
      temp = cx * cx + cy * cy;
      cx = cx / temp;
      cy = cy / temp;

      while (iteration++ < maxIteration && (!preventEscape || xx + yy < escapeSqr)) {
        x = xx - yy + cx;
        y = xy + xy + cy;
        xx = x * x;
        yy = y * y;
        xy = x * y;

        if (colorAlgo > 1) {
          temp = 2 * (x * dx - y * dy) + 1;
          dy = 2 * (x * dy + y * dx);
          dx = temp;
        }
      }

      colorizeNextPixel(iteration - 1, xx + yy, x, y, dx, dy);
    }
  }
}

//z -> z^3 + 1/c
function eye(target, width, height) {
  pixelColorId = 0;
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {

      let iteration = 0, x = 0, y = 0, xx = 0, yy = 0;
      let temp = 0, dx = 0, dy = 0;
      let cx = target.x - target.dx + 2 * target.dx * i / width;
      let cy = target.y + target.dy - 2 * target.dy * j / height;
      temp = cx * cx + cy * cy;
      cx = cx / temp;
      cy = cy / temp;

      while (iteration++ < maxIteration && (!preventEscape || xx + yy < escapeSqr)) {
        temp = (xx - 3 * yy) * x + cx;
        y = 3 * xx * y - yy * y + cy;
        x = temp;
        xx = x * x;
        yy = y * y;

        if (colorAlgo > 1) {
          temp = 2 * (x * dx - y * dy) + 1;
          dy = 2 * (x * dy + y * dx);
          dx = temp;
        }
      }

      colorizeNextPixel(iteration - 1, xx + yy, x, y, dx, dy);
    }
  }
}

//z -> z^2 + 1/c - 1
function circle(target, width, height) {
  pixelColorId = 0;
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {

      let iteration = 0, x = 0, y = 0, xx = 0, xy = 0, yy = 0;
      let temp = 0, dx = 0, dy = 0;
      let cx = target.y + target.dy - 2 * target.dy * j / height;
      let cy = target.x - target.dx + 2 * target.dx * i / width;
      temp = cx * cx + cy * cy;
      cx = cx / temp - 1;
      cy = -cy / temp;

      while (iteration++ < maxIteration && (!preventEscape || xx + yy < escapeSqr)) {
        x = (xx - yy) + cx;
        y = (xy + xy) + cy;
        xx = x * x;
        yy = y * y;
        xy = x * y;

        if (colorAlgo > 1) {
          temp = 2 * (x * dx - y * dy) + 1;
          dy = 2 * (x * dy + y * dx);
          dx = temp;
        }
      }

      colorizeNextPixel(iteration - 1, xx + yy, x, y, dx, dy);
    }
  }
}

//z -> z^2 + 1/(conj(c) - 0.5) - 3/4
function strap(target, width, height) {
  pixelColorId = 0;
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {

      let iteration = 0, x = 0, y = 0, xx = 0, xy = 0, yy = 0;
      let temp = 0, dx = 0, dy = 0;
      let cx = (target.y + target.dy - 2 * target.dy * j / height) - 0.5;
      let cy = -(target.x - target.dx + 2 * target.dx * i / width);
      temp = cx * cx + cy * cy;
      cx = cx / temp - 3/4;
      cy = cy / temp;

      while (iteration++ < maxIteration && (!preventEscape || xx + yy < escapeSqr)) {
        x = xx - yy + cx;
        y = xy + xy + cy;
        xx = x * x;
        yy = y * y;
        xy = x * y;

        if (colorAlgo > 1) {
          temp = 2 * (x * dx - y * dy) + 1;
          dy = 2 * (x * dy + y * dx);
          dx = temp;
        }
      }

      colorizeNextPixel(iteration - 1, xx + yy, x, y, dx, dy);
    }
  }
}