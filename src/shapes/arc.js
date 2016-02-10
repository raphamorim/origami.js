function ArcShape(params) {
  var args = params.args,
    style = args.style,
    def = config.defaults.arc;

  this.paper.ctx.beginPath();
  this.paper.ctx.setLineDash(style.borderStyle);
  this.paper.ctx.arc(args.x, args.y, (args.r || def.radius), (args.sAngle || 0), (args.eAngle || 2 * Math.PI));
  this.paper.ctx.fillStyle = (style.background || style.bg) ? (style.background || style.bg) : def.background;
  this.paper.ctx.fill();
  this.paper.ctx.lineWidth = (style.borderSize) ? style.borderSize : def.lineWidth;
  this.paper.ctx.strokeStyle = (style.borderColor) ? style.borderColor : def.strokeStyle;
  this.paper.ctx.stroke();
  this.paper.ctx.setLineDash([]);
  this.paper.ctx.closePath();
}

Screen.prototype.arc = ArcShape;

Origami.arc = function() {
  var args = [].slice.call(arguments);
  args = argsByRules(args, ['x', 'y', 'r', 'sAngle', 'eAngle']);

  queue('arc', {
    args: args
  });
  return this;
};
