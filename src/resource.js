Origami.translate = function(x, y) {
  if (x === undefined || x === null) {
    x = 'reset';
  }

  if (typeof(x) === 'string') {
    if (x === 'center') {
      x = kami.width / 2;
      y = kami.height / 2;
    }
    if (x === 'reset') {
      x = -kami.width / 2;
      y = -kami.height / 2;
    }
  }

  kami.ctx.translate(x, y);
  return this;
}

Origami.canvasBackground = function(color) {
  kami.element.style.backgroundColor = color;
  return this;
}

Origami._getContexts = function() {
  return Origami.contexts;
}

Origami.restore = function() {
  kami.ctx.restore();
  return this;
}

Origami.save = function() {
  kami.ctx.save();
  return this;
}

Origami.globalComposite = function(param) {
  kami.ctx.globalCompositeOperation = param;
  return this;
}

Origami.rotate = function(degrees) {
  kami.ctx.rotate(degrees);
  return this;
}

Origami.stop = function() {
  window.cancelAnimationFrame(kami.frame);
  kami.frame = false;
  return this;
}

Origami.nextFrame = function(fn) {
  kami.frame = window.requestAnimationFrame(fn);
  return this;
}

Origami.repeat = function(times, fn) {
  var repeatSets = JSON.parse(JSON.stringify(this.settings));
  for (var i = 1; i < times; i++) {
    repeatSets.inc = (this.settings.inc * i);
    fn.call(this, repeatSets);
  }
  return this;
}

Origami.setInc = function(value) {
  if (value) settings.inc = value;
  return this;
}

Origami.getContext = function() {
  return kami.ctx;
}

Origami.scale = function(width, height) {
  kami.ctx.scale(width, height);
  return this;
}

Origami.flip = function(type) {
  kami.flip = 'horizontal';
  if (type && typeof(type) === 'string')
    kami.flip = type;
  return this;
}

Origami.flipEnd = function() {
  kami.flip = false;
  return this;
}

Origami.clear = function() {
  kami.ctx.clearRect(0, 0, kami.width, kami.height);
  return this;
}

Origami.on = function(ev, fn) {
  kami.element.addEventListener(ev, fn);
  return this;
}