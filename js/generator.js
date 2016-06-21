$(function () {
  var patternSize = $('#pattern-size').val();
  var gridSizeX = $('#grid-size-x').val();
  var gridSizeY = $('#grid-size-y').val();
  var svgField = $('#svg');
  var colors = ['#E0533B', '#EBB54A', '#94ED6B', '#73A6FC', '#FFFFFF'];

  function setupListeners() {
    $('form :input').change(function (e) {
      switch (e.target.id) {
        case 'pattern-size':
          patternSize = e.target.value;
          break;
        case 'grid-size-x':
          gridSizeX = e.target.value;
          break;
        case 'grid-size-y':
          gridSizeY = e.target.value;
          break;
        default:
          break;
      }
      draw();
    });
  }

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

      for (var j = 0; j < numVer; j++) {
        for (var i = 0; i < numHor; i++) {
          var rotated = Math.round(Math.random());
          var x = i * triangleWidth;
          var y = j * triangleWidth;
          var color = randomColor();


          drawTriangle(ctx, x, y, triangleWidth, color, false, rotated);
          polys.push(buildPoly(x, y, triangleWidth, color, false, rotated));

          // Draw second part of square
          color = randomColor();
          drawTriangle(ctx, x, y, triangleWidth, color, true, rotated);
          polys.push(buildPoly(x, y, triangleWidth, color, true, rotated));
        }
      }
    }
    var svg = addSVGHeader(polys);
    svgField.val(svg);
  }

  function drawTriangle(ctx, x, y, width, color, flipped, rotated) {
    var pi = 3.14159265;
    var rad;

    ctx.save();
    // Move origin for rotation
    ctx.translate(x + width / 2, y + width / 2);

    // Define rotation
    if (!flipped) {
      if (rotated) {
        // ◺
        rad = 270 * pi / 180;
      } else {
        // ◸
        rad = 0;
      }
    } else {
      if (rotated) {
        // ◹
        rad = 90 * pi / 180;
      } else {
        // ◿
        rad = pi;
      }
    }

    // Rotate and restore canvas position
    ctx.rotate(rad);
    ctx.translate(-(x + width / 2), -(y + width / 2));

    // Draw triangle
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x, y + width);
    ctx.fill();

    // Restore canvas
    ctx.restore();

  }

  function buildPoly(x, y, width, color, flipped, rotated) {
    var points = [[x, y], [x + width, y], [x, y + width]];
    var pointsStr = [];

    for (var i = 0; i < points.length; i++) {
      // Move to origin to rotate
      points[i][0] -= x + width / 2;
      points[i][1] -= y + width / 2;

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
      points[i][0] += x + width / 2;
      points[i][1] += y + width / 2;

      pointsStr.push(points[i][0].toString() + ',' + points[i][1])
    }

    return '<polygon fill="' + color + '" points="' + pointsStr.join(' ') + '"></polygon>';
  }

  function randomColor() {
    return colors[Math.round(Math.random() * (colors.length - 1))]
  }

  function addSVGHeader(polys) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="svg" x="0" y="0" >\n';
    svg += polys.join('\n');
    svg += '\n</svg>';
    return svg;
  }

  setupListeners();
  draw();
});
