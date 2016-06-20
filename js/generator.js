$(function () {
  var patternSize = $('#pattern-size').val();
  var gridSizeX = $('#grid-size-x').val();
  var gridSizeY = $('#grid-size-y').val();
  var colors = ['#E0533B', '#EBB54A', '#94ED6B', '#73A6FC', '#FFFFFF'];

  function draw() {
    var canvas = document.getElementById('ctx');
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      var numHor = gridSizeX * 4;
      var numVer = gridSizeY * 4;
      var triangleWidth = patternSize / 4;

      var polys = [];

      ctx.canvas.width = patternSize * gridSizeX;
      ctx.canvas.height = patternSize * gridSizeY;

      for (var j = 0; j < numHor; j++) {
        for (var i = 0; i < numVer; i++) {
          var rotated = Math.round(Math.random());
          var offsetX = i * triangleWidth;
          var offsetY = j * triangleWidth;
          var color = randomColor();


          drawTriangle(ctx, offsetX, offsetY, triangleWidth, color, false, rotated);
          polys.push(buildPoly(offsetX, offsetY, triangleWidth, color, false, rotated));

          // Draw second part of square
          color = randomColor();
          drawTriangle(ctx, offsetX, offsetY, triangleWidth, randomColor(), true, rotated);
          polys.push(buildPoly(offsetX, offsetY, triangleWidth, color, true, rotated));
        }
      }
    }
    return polys;
  }

  function drawTriangle(ctx, offsetX, offsetY, width, color, flipped, rotated) {

    ctx.beginPath();
    ctx.fillStyle = color;
    if (!flipped) {
      if (rotated) {
        // ◺
        ctx.moveTo(offsetX, offsetY + width);
        ctx.lineTo(offsetX, offsetY);
        ctx.lineTo(offsetX + width, offsetY + width);
        // ◸
      } else {
        ctx.moveTo(offsetX, offsetY);
        ctx.lineTo(offsetX + width, offsetY);
        ctx.lineTo(offsetX, offsetY + width);
      }
    } else {
      if (rotated) {
        // ◹
        ctx.moveTo(offsetX + width, offsetY);
        ctx.lineTo(offsetX + width, offsetY + width);
        ctx.lineTo(offsetX, offsetY);
      } else {
        // ◿
        ctx.moveTo(offsetX + width, offsetY + width);
        ctx.lineTo(offsetX, offsetY + width);
        ctx.lineTo(offsetX + width, offsetY);
      }
    }

    ctx.fill();
  }

  function buildPoly(offsetX, offsetY, width, color, flipped, rotated) {
    var points = [[offsetX, offsetY], [offsetX + width, offsetY], [offsetX, offsetY + width]];
    var pointsStr = [];

    for (var i = 0; i < points.length; i++) {
      // Move to origin to rotate
      points[i][0] -= offsetX + (width / 2);
      points[i][1] -= offsetY + (width / 2);

      if (!flipped) {
        if (rotated) {
          // Rotate 270 degrees
          [points[i][0], points[i][1]] = [points[i][1], -points[i][0]]
        } else {
          // Do nothing, default form
        }
      } else {
        if (rotated) {
          // Rotate 90 degrees
          [points[i][0], points[i][1]] = [-points[i][1], points[i][0]]
        } else {
          // Rotate 180 degrees
          [points[i][0], points[i][1]] = [-points[i][0], -points[i][1]]
        }
      }
      points[i][0] += offsetX + (width / 2);
      points[i][1] += offsetY + (width / 2);

      pointsStr.push(points[i][0].toString() + ',' + points[i][1])
    }

    return '<polygon fill="' + color + '" points="' + pointsStr.join(' ') + '"></polygon>';
  }

  function randomColor() {
    return colors[Math.round(Math.random() * (colors.length - 1))]
  }

  function addSVGHeader(polys) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="svg" x="0" y="0" >';
    svg += polys.join('');
    svg += '</svg>';
    return svg;
  }

  var polys = draw();
  var svg = addSVGHeader(polys);
  console.log(svg.toString());
});
