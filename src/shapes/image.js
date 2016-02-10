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
  var self = this;
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

  if (image.complete) {
    item.width = width || image.naturalWidth;
    item.height = height || image.naturalHeight;

    queue('image', item);
    return self;
  }

  queue('image', item, false);
  var reference = (self.paper.queue.length - 1),
    currentQueue = config.contexts[this.paper.index].queue[reference];

  image.addEventListener('load', function() {
    if (!currentQueue)
      return false;
    currentQueue.params.width = (item.width || image.naturalWidth);
    currentQueue.params.height = (item.height || image.naturalHeight);
    currentQueue.loaded = true;
  });

  image.addEventListener('error', function() {
    if (!currentQueue)
      return false;
    currentQueue.failed = true;
  })

  return self;
};
