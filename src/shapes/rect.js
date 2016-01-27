function RectShape(params) {
  var def = config.defaults.rect,
    style = params.style,
    args = params.args;

  this.paper.ctx.beginPath();
  this.paper.ctx.fillStyle = (style.background) ? style.background : def.background;
  this.paper.ctx.fillRect(args.x, args.y, args.width, (args.height || args.width));

  this.paper.ctx.lineWidth = (style.border) ? style.border[0] : def.lineWidth;
  this.paper.ctx.strokeStyle = (style.border) ? style.border[1] : def.strokeStyle;
  this.paper.ctx.strokeRect(args.x, args.y, args.width, (args.height || args.width));
  this.paper.ctx.closePath();
}

Screen.prototype.rect = RectShape;

Origami.rect = function() {
  var args = [].slice.call(arguments);
  args = argsByRules(args);

  queue('rect', {
    style: args.style,
    args: arguments
  });
  return this;
};