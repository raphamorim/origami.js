function CSSShape(style) {
  var self = this,
    style = config.virtualStyles[style];

  if (!style)
    return self;

  // TODO: Draw in all canvas
  var data = '<svg xmlns="http://www.w3.org/2000/svg" width="' +
    self.paper.width + 'px" height="' + self.paper.height + 'px">' +
    '<foreignObject width="100%" height="100%">' +
    '<div xmlns="http://www.w3.org/1999/xhtml">' +
    '<div style="' + style.cssText + '"></div>' +
    '</div></foreignObject>' +
    '</svg>';

  var DOMURL = window.URL || window.webkitURL || window,
    img = new Image(),
    svg = new Blob([data], {
      type: 'image/svg+xml;charset=utf-8'
    });

  var url = DOMURL.createObjectURL(svg);
  img.src = url;

  img.addEventListener('load', function() {
    self.paper.ctx.beginPath();
    self.paper.ctx.drawImage(img, 0, 0);
    DOMURL.revokeObjectURL(url);
    self.paper.ctx.closePath();
  });

  return self;
}

Screen.prototype.CSSShape = CSSShape;

Origami.shape = function(style) {
  queue('CSSShape', style);
  return this;
};
