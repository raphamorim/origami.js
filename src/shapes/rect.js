function RectShape(params) {
  var def = config.defaults.rect,
    style = params.style,
    args = params.args;

  paper.ctx.beginPath();
  paper.ctx.fillStyle = (style.background) ? style.background : def.background;
  paper.ctx.fillRect(args.x, args.y, args.width, (args.height || args.width));

  paper.ctx.lineWidth = (style.border) ? style.border[0] : def.lineWidth;
  paper.ctx.strokeStyle = (style.border) ? style.border[1] : def.strokeStyle;
  paper.ctx.strokeRect(args.x, args.y, args.width, (args.height || args.width));
  paper.ctx.closePath();
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