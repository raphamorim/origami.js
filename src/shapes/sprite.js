function Sprite(x, y, config) {
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

    // sprite properties
    var sprite = {
      image: image,
      posX: 0,
      posY: 0,
      frame: frames,
      loop: loop,
      width: dw,
      height: height,
      dx: x,
      speed: speed,
      dy: y,
      totalWidth: width,
      anim: null
    };

    drawSprite(sprite);
  }, false);
  return this;
}

function drawSprite(sprite) {
  if (sprite.posX === sprite.totalWidth) {
    if (sprite.loop === false) {
      window.cancelAnimationFrame(sprite.anim);
      return;
    }
    sprite.posX = 0;
  }

  kami.ctx.clearRect(sprite.dx, sprite.dy, sprite.width, sprite.height);
  
  kami.ctx.beginPath();
  kami.ctx.drawImage(sprite.image, sprite.posX, sprite.posY,
    sprite.width, sprite.height, sprite.dx, sprite.dy,
    sprite.width, sprite.height);
  kami.ctx.closePath();

  sprite.posX = sprite.posX + sprite.width;

  setTimeout(function() {
    sprite.anim = window.requestAnimationFrame(drawSprite.bind(this, sprite));
  }, sprite.speed);
}