function ImageShape(params) {
  var image = params.image,
    x = params.x,
    y = params.y,
    width = params.width,
    height = params.height;

  if (!image)
    return this;

  if (typeof(image) === 'string') {
    var img = new Image();
    img.src = image;
    image = img;
  }

  image.addEventListener('load', function() {
    width = (width || image.naturalWidth);
    height = (height || image.naturalHeight);
    this.paper.ctx.save();

    if (this.paper.flip) {
      if (this.paper.flip === 'horizontal') {
        this.paper.ctx.scale(-1, 1);
        width = width * -1;
      }
      if (this.paper.flip === 'vertical') {
        this.paper.ctx.scale(1, -1);
        height = height * -1;
      }
    }

    this.paper.ctx.beginPath();
    this.paper.ctx.drawImage(image, Math.floor((x || 0)), Math.floor((y || 0)), width, height);
    this.paper.ctx.closePath();
    this.paper.ctx.restore();
  }, false);
}

Screen.prototype.image = ImageShape;

Origami.image = function(image, x, y, width, height) {
  queue('image', {
    image: image,
    x: x,
    y: y,
    width: width,
    height: height
  });
  return this;
};