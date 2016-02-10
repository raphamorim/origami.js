function LineShape(params) {
  var def = config.defaults.line,
      style = params.style,
      pointA = params.pointA,
      pointB = params.pointB;

  this.paper.ctx.beginPath();
  this.paper.ctx.setLineDash(style.borderStyle);
  this.paper.ctx.moveTo((pointA.x || 0), (pointA.y || 0));
  this.paper.ctx.lineTo((pointB.x || 0), (pointB.y || 0));

  this.paper.ctx.lineWidth = (style.borderSize) ? style.borderSize : def.lineWidth;
  this.paper.ctx.strokeStyle = (style.borderColor) ? style.borderColor : def.strokeStyle;
  this.paper.ctx.stroke();
  this.paper.ctx.setLineDash([]);
  this.paper.ctx.closePath();
}

Screen.prototype.line = LineShape;

Origami.line = function(pointA, pointB, style) {
  style = normalizeStyle(style);

  queue('line', {
    pointA: pointA,
    pointB: pointB,
    style: style
  });
  return this;
};
