function TextShape(params) {
  var def = config.defaults.text,
    text = params.text,
    x = params.x,
    y = params.y,
    style = params.style;

  if (!style)
    style = {};

  if (style.border) {
    style.border = style.border.split(' ');
    style.border[0] = style.border[0].replace(/[^0-9]/g, '');
  }

  paper.ctx.beginPath();
  paper.ctx.lineWidth = (style.border) ? style.border[0] : def.lineWidth;
  paper.ctx.strokeStyle = (style.border) ? style.border[1] : def.strokeStyle;
  paper.ctx.font = (style.font || def.font);
  paper.ctx.fillStyle = (style.color || def.color);
  paper.ctx.textAlign = (style.align || def.align);
  paper.ctx.fillText(text, x, y);
  paper.ctx.strokeText(text, x, y);
  paper.ctx.fill();
  paper.ctx.stroke();
  paper.ctx.closePath();
}

Screen.prototype.text = TextShape;

Origami.text = function(text, x, y, style) {
  queue('text', {
    text: text,
    x: x,
    y: y,
    style: style
  });
  return this;
};