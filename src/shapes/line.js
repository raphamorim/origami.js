function Line(pointA, pointB, style) {
  var def = Origami.defaults.line;
  if (style.border) {
    style.border = style.border.split(' ');
    style.border[0] = style.border[0].replace(/[^0-9]/g, '');
  }

  kami.ctx.beginPath();
  kami.ctx.moveTo((pointA.x || 0), (pointA.y || 0));
  kami.ctx.lineTo((pointB.x || 0), (pointB.y || 0));

  kami.ctx.lineWidth = (style.border) ? style.border[0] : def.lineWidth;
  kami.ctx.strokeStyle = (style.border) ? style.border[1] : def.strokeStyle;
  kami.ctx.stroke();
  kami.ctx.closePath();
  return this;
}
