function ImageShape(params) {
  var image = params.image,
    x = params.x,
    y = params.y,
    width = params.width,
    height = params.height;

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
}

Screen.prototype.image = ImageShape;

Origami.image = function(image, x, y, width, height) {
  if (!image)
    return this;

  if (typeof(image) === 'string') {
    var img = new Image();
    img.src = image;
    image = img;
  }

  var item = {
    image: image,
    x: x,
    y: y,
    width: width,
    height: height
  };

  if (isCached(img.src)) {
    queue('image', item);
    return this;
  }

  queue('image', item, false);
  var reference = (paper.queue.length - 1);
  image.addEventListener('load', function() {
    if (!paper.queue[reference])
      return false;
    paper.queue[reference].params.width = (item.width || image.naturalWidth);
    paper.queue[reference].params.height = (item.height || image.naturalHeight);
    paper.queue[reference].loaded = true;
  });

  return this;
};