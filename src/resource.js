// Resource.js

Origami.background = function(color) {
  queue('background', {
    color: color
  });
  return this;
}

Origami.restore = function() {
  queue('restore');
  return this;
}

Origami.save = function() {
  queue('save');
  return this;
}

Origami.composition = function(globalComposite) {
  queue('composition', {
    globalComposite: globalComposite
  })
  return this;
}

Origami.translate = function(x, y) {
  if (x === undefined || x === null) {
    x = 'reset';
  }

  if (typeof(x) === 'string') {
    if (x === 'center') {
      x = context.width / 2;
      y = context.height / 2;
    }
    if (x === 'reset') {
      x = -context.width / 2;
      y = -context.height / 2;
    }
  }

  queue('translate', {
    x: x,
    y: y
  });
  return this;
}

Origami.rotate = function(degrees) {
  if (typeof(degrees) === 'undefined')
    degrees = 'slow';

  if (typeof(degrees) === 'string') {
    // Slow
    if (degrees === 'slow')
      degrees = ((2 * Math.PI) / 60) * new Date().getSeconds() +
      ((2 * Math.PI) / 60000) * new Date().getMilliseconds();

    // Normal
    else if (degrees === 'normal')
      degrees = ((2 * Math.PI) / 30) * new Date().getSeconds() +
      ((2 * Math.PI) / 30000) * new Date().getMilliseconds();

    // Fast
    else if (degrees === 'fast')
      degrees = ((2 * Math.PI) / 6) * new Date().getSeconds() +
      ((2 * Math.PI) / 6000) * new Date().getMilliseconds();
  }

  queue('rotate', {
    degrees: degrees
  })
  return this;
}

Origami.stopRender = function() {
  window.cancelAnimationFrame(this.paper.frame);
  this.paper.frame = false;
}

Origami.play = function() {
  this.paper.frame = 1;
  return this;
}

Origami.startRender = function(fn) {
  var self = this;
  if (self.paper.frame === false)
    return;

  self.draw(function() {
    self.paper.frame = window.requestAnimationFrame(fn.bind(this));
  });
}

Origami.scale = function(width, height) {
  queue('scale', {
    width: width,
    height: height
  })
  return this;
}

Origami.flip = function(type) {
  queue('flip', {
    type: type
  })
  return this;
}

Origami.flipEnd = function() {
  queue('flipEnd')
  return this;
}

Origami.clear = function() {
  queue('clear')
  return this;
}

Origami.on = function(ev, fn) {
  this.paper.element.addEventListener(ev, fn);
  return this;
}
