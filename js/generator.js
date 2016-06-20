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

      ctx.canvas.width = patternSize * gridSizeX;
      ctx.canvas.height = patternSize * gridSizeY;

      for (var i = 0; i < numHor; i++) {
        for (var j = 0; j < numVer; j++) {
          drawTriangle(ctx, i * triangleWidth, j * triangleWidth, triangleWidth, randomColor(), false);

          drawTriangle(ctx, i * triangleWidth, j * triangleWidth, triangleWidth, randomColor(), true);
        }
      }
    }
  }

  function drawTriangle(ctx, offsetX, offsetY, width, color, flipped) {
    ctx.beginPath();
    ctx.fillStyle = color;
    if (flipped) {
      ctx.moveTo(offsetX, offsetY);
      ctx.lineTo(offsetX + width, offsetY);
      ctx.lineTo(offsetX, offsetY + width);
    } else {
      ctx.moveTo(offsetX + width, offsetY + width);
      ctx.lineTo(offsetX + width, offsetY);
      ctx.lineTo(offsetX, offsetY + width);
    }

    ctx.fill();
  }

  function randomColor() {
    return colors[Math.round(Math.random() * (colors.length - 1))]
  }

  draw();
});
