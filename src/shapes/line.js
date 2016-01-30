function LineShape(params) {
  var def = config.defaults.line,
      style = params.style,
      pointA = params.pointA,
      pointB = params.pointB;

  this.paper.ctx.beginPath();
  this.paper.ctx.moveTo((pointA.x || 0), (pointA.y || 0));
  this.paper.ctx.lineTo((pointB.x || 0), (pointB.y || 0));

  this.paper.ctx.lineWidth = (style.border) ? style.border[0] : def.lineWidth;
  this.paper.ctx.strokeStyle = (style.border) ? style.border[1] : def.strokeStyle;
  this.paper.ctx.stroke();
  this.paper.ctx.closePath();
}

Screen.prototype.line = LineShape;

Origami.line = function(pointA, pointB, style) {
  if (!style)
    style = {};

  if (style.border) {
    style.border = style.border.split(' ');
    style.border[0] = style.border[0].replace(/[^0-9]/g, '');
  }

  queue('line', {
    pointA: pointA,
    pointB: pointB,
    style: style
  });
  return this;
};
