function SpriteShape(params) {
  var props = params.properties,
    dw = params.width / props.frames.total,
    frames = props.frames,
    posX = 0;

  if (frames.current && frames.current <= frames.total)
    posX = dw * (frames.current - 1)

  drawSprite.call(this, {
    image: params.image,
    posX: posX,
    posY: 0,
    frames: props.frames,
    animation: props.animation,
    loop: props.loop,
    width: dw,
    widthTotal: params.width,
    height: params.height,
    dx: params.x,
    dy: params.y,
    speed: props.speed,
    update: null
  });
}

function drawSprite(sprite) {
  var self = this;

  if (sprite.posX === sprite.widthTotal) {
    if (sprite.loop !== true) {
      window.cancelAnimationFrame(sprite.update);
      return;
    }
    sprite.posX = 0;
  }

  self.paper.ctx.clearRect(sprite.dx, sprite.dy, sprite.width, sprite.height);

  self.paper.ctx.beginPath();
  self.paper.ctx.drawImage(sprite.image, sprite.posX, sprite.posY,
    sprite.width, sprite.height, sprite.dx, sprite.dy,
    sprite.width, sprite.height);
  self.paper.ctx.closePath();

  if (sprite.animation !== false) {
    sprite.posX = sprite.posX + sprite.width;
  }

  setTimeout(function() {
    sprite.update = window.requestAnimationFrame(drawSprite.bind(self, sprite));
  }, sprite.speed);
}

Screen.prototype.sprite = SpriteShape;

Origami.sprite = function(x, y, properties) {
  var self = this,
    framesConfig = properties.frames;

  if (!properties || !properties.src || !framesConfig.total)
    return this;

  var image = new Image();
  image.src = properties.src;

  // normalize properties
  properties.speed = properties.speed || 10;

  var item = {
    x: x,
    y: y,
    image: image,
    properties: properties,
    width: 0,
    height: 0
  };

  if (image.complete) {
    item.width = image.naturalWidth;
    item.height = image.naturalHeight;
    queue('sprite', item);
    return self;
  }

  queue('sprite', item, false);
  var reference = (self.paper.queue.length - 1),
    currentQueue = config.contexts[this.paper.index].queue[reference];

  image.addEventListener('load', function() {
    if (!currentQueue)
      return false;
    currentQueue.params.width = image.naturalWidth;
    currentQueue.params.height = image.naturalHeight;
    currentQueue.loaded = true;
  });

  image.addEventListener('error', function() {
    if (!currentQueue)
      return false;
    currentQueue.failed = true;
  })

  return this;
};