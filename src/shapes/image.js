function ImageShape(image, x, y, width, height, sx, sy, sw, sh) {
  if (!image)
    return this;

  if (typeof(image) === 'string') {
    var img = new Image();
    img.src = image;
    image = img;
  }

  image.addEventListener('load', function() {
    if (!width) 
      width = image.naturalWidth;
    if (!height) 
      height = image.naturalHeight;
    
    kami.ctx.save();

    if (kami.flip) {
      if (kami.flip === 'horizontal') {
        kami.ctx.scale(-1, 1);
        width = width * -1;
      }
      if (kami.flip === 'vertical') {
        kami.ctx.scale(1, -1);
        height = height * -1;
      }
    }

    kami.ctx.beginPath();
    kami.ctx.drawImage(image, Math.floor((x || 0)), Math.floor((y || 0)), width, height);
    kami.ctx.closePath();
    kami.ctx.restore();
  }, false);
  return this;
}