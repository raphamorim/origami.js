function TextShape(params) {
  var def = config.defaults.text,
    text = params.text,
    x = params.x,
    y = params.y,
    style = params.style;

  this.paper.ctx.beginPath();
  this.paper.ctx.setLineDash(style.borderStyle);
  this.paper.ctx.textBaseline = 'middle';
  this.paper.ctx.lineWidth = (style.borderSize) ? style.borderSize : def.lineWidth;
  this.paper.ctx.strokeStyle = (style.borderColor) ? style.borderColor : def.strokeStyle;
  this.paper.ctx.font = (style.font || def.font);
  this.paper.ctx.fillStyle = (style.color || def.color);
  this.paper.ctx.textAlign = (style.align || def.align);
  this.paper.ctx.fillText(text, x, y);
  this.paper.ctx.strokeText(text, x, y);
  this.paper.ctx.fill();
  this.paper.ctx.stroke();
  this.paper.ctx.setLineDash([]);
  this.paper.ctx.closePath();
}

Screen.prototype.text = TextShape;

Origami.text = function(text, x, y, style) {
  style = normalizeStyle(style);

  var item = {
    text: text,
    x: x,
    y: y,
    style: style
  };

  if ((typeof(item.x) === 'string') && (typeof(item.y) === 'string'))
    item = smartCoordinates(item);

  queue('text', item);
  return this;
};
