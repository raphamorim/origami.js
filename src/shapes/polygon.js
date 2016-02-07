function PolygonShape(params) {
  var args = params.args,
    style = params.style,
    def = config.defaults.polygon;

  this.paper.ctx.beginPath();
  this.paper.ctx.fillStyle = (style.background) ? style.background : def.background;
  this.paper.ctx.lineWidth = (style.border) ? style.border[0] : def.lineWidth;
  this.paper.ctx.strokeStyle = (style.border) ? style.border[1] : def.strokeStyle;

  for (var p = 0; p < args.length; p++) {
    if (!args[p].x)
      continue;

    if (p)
      this.paper.ctx.lineTo(args[p].x, args[p].y);
    else
      this.paper.ctx.moveTo(args[p].x, args[p].y);
  }

  this.paper.ctx.fill();
  this.paper.ctx.stroke();
  this.paper.ctx.closePath();
}

Screen.prototype.polygon = PolygonShape;

Origami.polygon = function() {
  var args = [].slice.call(arguments),
    settedArgs = argsByRules(args);

  queue('polygon', {
    style: settedArgs.style,
    args: args
  });
  return this;
};
