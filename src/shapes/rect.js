function RectShape(params) {
  var def = config.defaults.rect,
    style = params.style,
    args = params.args;

  this.paper.ctx.beginPath();
  this.paper.ctx.setLineDash(style.borderStyle);
  this.paper.ctx.fillStyle = (style.background) ? style.background : def.background;
  this.paper.ctx.fillRect(args.x, args.y, args.width, (args.height || args.width));

  this.paper.ctx.lineWidth = (style.borderSize) ? style.borderSize : def.lineWidth;
  this.paper.ctx.strokeStyle = (style.borderColor) ? style.borderColor : def.strokeStyle;
  this.paper.ctx.strokeRect(args.x, args.y, args.width, (args.height || args.width));
  this.paper.ctx.setLineDash([]);
  this.paper.ctx.closePath();
}

Screen.prototype.rect = RectShape;

Origami.rect = function() {
  var args = [].slice.call(arguments);
  args = argsByRules(args);

  queue('rect', {
    style: args.style,
    args: args
  });
  return this;
};

Origami.border = function() {
  var args = [].slice.call(arguments);
  args = argsByRules(args);

  queue('rect', {
    style: args.style,
    args: {
      x: 0,
      y: 0,
      width: this.paper.width,
      height: this.paper.height
    }
  });
  return this;
}
