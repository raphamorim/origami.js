function TextShape(params) {
  var def = config.defaults.text,
    text = params.text,
    x = params.x,
    y = params.y,
    style = params.style;

  this.paper.ctx.beginPath();
  this.paper.ctx.lineWidth = (style.border) ? style.border[0] : def.lineWidth;
  this.paper.ctx.strokeStyle = (style.border) ? style.border[1] : def.strokeStyle;
  this.paper.ctx.font = (style.font || def.font);
  this.paper.ctx.fillStyle = (style.color || def.color);
  this.paper.ctx.textAlign = (style.align || def.align);
  this.paper.ctx.fillText(text, x, y);
  this.paper.ctx.strokeText(text, x, y);
  this.paper.ctx.fill();
  this.paper.ctx.stroke();
  this.paper.ctx.closePath();
}

Screen.prototype.text = TextShape;

Origami.text = function(text, x, y, style) {
  if (!style)
    style = {};

  if (style.border) {
    style.border = style.border.split(' ');
    style.border[0] = style.border[0].replace(/[^0-9]/g, '');
  }

  queue('text', {
    text: text,
    x: x,
    y: y,
    style: style
  });
  return this;
};
