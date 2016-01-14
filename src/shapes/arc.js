function Arc() {
  var args = Origami.args(([].slice.call(arguments) || []), 
      ['x', 'y', 'r', 'sAngle', 'eAngle']),
    style = (args.style || {}),
    def = Origami.defaults.arc;

  if (style.border) {
    style.border = style.border.split(' ');
    style.border[0] = style.border[0].replace(/[^0-9]/g, '');
  }

  kami.ctx.beginPath();
  kami.ctx.arc(args.x, args.y, (args.r || def.radius), (args.sAngle || 0), (args.eAngle || 2 * Math.PI));
  kami.ctx.fillStyle = (style.background || style.bg) ? (style.background || style.bg) : def.background;
  kami.ctx.fill();
  kami.ctx.lineWidth = (style.border) ? style.border[0] : def.lineWidth;
  kami.ctx.strokeStyle = (style.border) ? style.border[1] : def.strokeStyle;
  kami.ctx.stroke();
  kami.ctx.closePath();
  return this;
}
