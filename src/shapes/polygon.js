function Polygon() {
  var originalArgs = arguments;
  var args = argumentsByRules([].slice.call(originalArgs) || []),
    points = [],
    style = args.style,
    def = Origami.defaults.polygon;

  for (var i = 0; i < originalArgs.length; i++) {
    if (originalArgs[i].x && originalArgs[i].y)
      points.push(originalArgs[i]);
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