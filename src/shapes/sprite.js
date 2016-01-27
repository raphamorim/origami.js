function SpriteShape(params) {
  var x = params.x,
    y = params.y,
    config = params.config;

  if (!config || !config.src)
    return this;

  var self = this,
    image = new Image(),
    frames = (config.frames || 0),
    loop = (config.loop || true),
    speed = (config.speed || 10);

  image.src = config.src;
  image.addEventListener('load', function() {
    var width = image.naturalWidth,
      height = image.naturalHeight,
      dw = width / frames;

    drawSprite.call(this, {
      image: image,
      posX: 0,
      posY: 0,
      frame: frames,
      loop: loop,
      width: dw,
      widthTotal: width,
      height: height,
      dx: x,
      dy: y,
      speed: speed,
      animation: null
    });
  }, false);
  return this;
}

function drawSprite(sprite) {
  if (sprite.posX === sprite.widthTotal) {
    if (sprite.loop === false) {
      window.cancelAnimationFrame(sprite.animation);
      return;
    }
    sprite.posX = 0;
  }

  this.paper.ctx.clearRect(sprite.dx, sprite.dy, sprite.width, sprite.height);

  this.paper.ctx.beginPath();
  this.paper.ctx.drawImage(sprite.image, sprite.posX, sprite.posY,
    sprite.width, sprite.height, sprite.dx, sprite.dy,
    sprite.width, sprite.height);
  this.paper.ctx.closePath();

  sprite.posX = sprite.posX + sprite.width;

  setTimeout(function() {
    sprite.animation = window.requestAnimationFrame(drawSprite.bind(this, sprite));
  }, sprite.speed);
}

Screen.prototype.sprite = SpriteShape;

Origami.sprite = function(x, y, config) {
  queue('rect', {
    x: x,
    y: y,
    config: config
  });
  return this;
};