function Rect() {
  var args = argumentsByRules(([].slice.call(arguments) || [])),
    style = (args.style || {}),
    def = Origami.defaults.rect;

  kami.ctx.beginPath();
  kami.ctx.fillStyle = (style.background) ? style.background : def.background;
  kami.ctx.fillRect(args.x, args.y, args.width, (args.height || args.width));

  kami.ctx.lineWidth = (style.border) ? style.border[0] : def.lineWidth;
  kami.ctx.strokeStyle = (style.border) ? style.border[1] : def.strokeStyle;
  kami.ctx.strokeRect(args.x, args.y, args.width, (args.height || args.width));
  kami.ctx.closePath();
  
  return this;
}