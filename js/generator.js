$(function () {
  var patternSize = $('#pattern-size').val();
  var gridSizeX = $('#grid-size-x').val();
  var gridSizeY = $('#grid-size-y').val();
  var svgField = $('#svg-text');
  var colors = ['#E0533B', '#EBB54A', '#94ED6B', '#73A6FC', '#FFFFFF'];
  var useSVG = 1;

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

      if (useSVG) {
        var svg = setupSVG();
        drawSVG(svg);
      } else {
        drawCanvas();
      }
    });
  }

  function setupSVG() {
    var svg = d3.select('#svg')
      .html('')
      .append('svg')
      .attr('width', patternSize * gridSizeX)
      .attr('height', patternSize * gridSizeY);

    svg.on('click', function () {
      if (d3.event.ctrlKey) {
        rotateTriangle(d3.event.target);
      } else {
        changeColor(d3.event.target);
      }
      svgField.val(svg[0][0].outerHTML);
    });

    return svg;
  }

  function drawSVG(svg) {
    var numHor = gridSizeX * 4,
      numVer = gridSizeY * 4,
      triangleWidth = patternSize / 4,
      polys = [];

    for (var j = 0; j < numVer; j++) {
      for (var i = 0; i < numHor; i++) {
        var rotated = Math.round(Math.random());
        var x = i * triangleWidth;
        var y = j * triangleWidth;
        var color = randomColor();

        var points = getSVGPoints(x, y, triangleWidth, false, rotated);
        var g = svg.append('g');
        g.append('polygon')
          .attr('points', points)
          .attr('fill', color);
        polys.push(buildPoly(points, color));

        // Draw second part of square
        color = randomColor();
        points = getSVGPoints(x, y, triangleWidth, true, rotated);
        g.append('polygon')
          .attr('points', points)
          .attr('fill', color);
        polys.push(buildPoly(points, color));
      }
    }
    svgField.val(svg[0][0].outerHTML);
  }

  function drawCanvas() {
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
    // Add 1 pixel overlap to first of 2 triangles to fix aliasing issue
    if (!flipped) {
      ctx.lineTo(x + width + 1, y);
      ctx.lineTo(x, y + width + 1);
    } else {
      ctx.lineTo(x + width, y);
      ctx.lineTo(x, y + width);
    }
    ctx.fill();

    // Restore canvas
    ctx.restore();

  }

  function getSVGPoints(x, y, width, flipped, rotated) {
    var points;
    // Add 1 pixel overlap to first of 2 triangles to fix aliasing issue
    if (!flipped) {
      points = [[x, y], [x + width, y], [x, y + width]];
    } else {
      points = [[x, y], [x + width, y], [x, y + width]];
    }

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
    }
    return pointsToString(points);
  }

  function buildPoly(points, color) {
    return '<polygon fill="' + color + '" points="' + points + '"></polygon>';
  }

  function changeColor(target) {
    var currentColor = d3.select(target).attr('fill'),
      color;

    for (var i = 0; i < colors.length; i++) {
      if (i === colors.length - 1) {
        color = colors[0];
        break;
      } else if (colors[i] === currentColor) {
        color = colors[i + 1];
        break;
      }
    }

    d3.select(target)
      .attr('fill', color);
  }

  function rotateTriangle(target) {
    var currentTriangle = d3.select(target),
      thisPoints = stringToPoints(currentTriangle.attr('points')),
      firstElement = false;

    var otherTriangle = d3.select(target.previousElementSibling);
    if (otherTriangle.empty()) {
      otherTriangle = d3.select(target.nextElementSibling);
      firstElement = true;
    }
    var otherPoints = stringToPoints(otherTriangle.attr('points'));

    var width = Math.max(Math.abs(thisPoints[0][0] - thisPoints[1][0]), Math.abs(thisPoints[0][0] - thisPoints[2][0])),
      x, y;

    if (firstElement) {
      x = Math.min(thisPoints[0][0], thisPoints[1][0], thisPoints[2][0]);
      y = Math.min(thisPoints[0][1], thisPoints[1][1], thisPoints[2][1]);
    } else {
      x = Math.min(otherPoints[0][0], otherPoints[1][0], otherPoints[2][0]);
      y = Math.min(otherPoints[0][1], otherPoints[1][1], otherPoints[2][1]);
    }

    console.log(x, y);

    for (var i = 0; i < thisPoints.length; i++) {
      thisPoints[i][0] -= x + width / 2;
      thisPoints[i][1] -= y + width / 2;
      otherPoints[i][0] -= x + width / 2;
      otherPoints[i][1] -= y + width / 2;

      [thisPoints[i][0], thisPoints[i][1]] = [-thisPoints[i][1], thisPoints[i][0]];
      [otherPoints[i][0], otherPoints[i][1]] = [-otherPoints[i][1], otherPoints[i][0]];

      thisPoints[i][0] += x + width / 2;
      thisPoints[i][1] += y + width / 2;
      otherPoints[i][0] += x + width / 2;
      otherPoints[i][1] += y + width / 2;
    }

    thisPoints = pointsToString(thisPoints);
    otherPoints = pointsToString(otherPoints);
    currentTriangle.attr('points', thisPoints);
    otherTriangle.attr('points', otherPoints);
  }

  function pointsToString(points) {
    var pointsStr = '';
    for (var i = 0; i < points.length; i++) {
      pointsStr += points[i].join(',') + ' ';
    }
    return pointsStr.trim();
  }

  function stringToPoints(str) {
    var points = str.split(' ');
    for (var i = 0; i < points.length; i++) {
      points[i] = points[i].split(',').map(Number);
    }
    return points;
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
  if (useSVG) {
    var svg = setupSVG();
    drawSVG(svg);
  } else {
    drawCanvas();
  }

});
