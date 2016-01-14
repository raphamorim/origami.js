function Polygon() {
  var args = ([].slice.call(arguments) || []),
    points = [],
    style = {},
    def = Origami.defaults.polygon;

  for (var i = 0; i < args.length; i++) {
    if (!args[i]) 
      break;

    if (args[i].x && args[i].y)
      points.push(args[i]);
    else
      style = args[i];
  }

  if (style.border) {
    style.border = style.border.split(' ');
    style.border[0] = style.border[0].replace(/[^0-9]/g, '');
  }

  kami.ctx.beginPath();
  kami.ctx.fillStyle = (style.background) ? style.background : def.background;
  kami.ctx.lineWidth = (style.border) ? style.border[0] : def.lineWidth;
  kami.ctx.strokeStyle = (style.border) ? style.border[1] : def.strokeStyle;
  
  for (var p = 0; p < points.length; p++) {
    if (p)
      kami.ctx.lineTo(points[p].x, points[p].y);
    else
      kami.ctx.moveTo(points[p].x, points[p].y);
  }
  
  kami.ctx.stroke();
  kami.ctx.fill();
  kami.ctx.closePath();
  return this;
}
