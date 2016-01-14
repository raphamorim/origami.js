function TextShape(text, x, y, style) {
  if (!style)
    style = {};

  var def = Origami.defaults.text;
  if (style.border) {
    style.border = style.border.split(' ');
    style.border[0] = style.border[0].replace(/[^0-9]/g, '');
  }

  kami.ctx.beginPath();
  kami.ctx.lineWidth = (style.border) ? style.border[0] : def.lineWidth;
  kami.ctx.strokeStyle = (style.border) ? style.border[1] : def.strokeStyle;
  kami.ctx.font = (style.font || def.font);
  kami.ctx.fillStyle = (style.color || def.color);
  kami.ctx.textAlign = (style.align || def.align);
  kami.ctx.fillText(text, x, y);
  kami.ctx.strokeText(text, x, y);
  kami.ctx.fill();
  kami.ctx.stroke();
  kami.ctx.closePath();
  return this;
}