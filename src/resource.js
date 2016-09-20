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
      degrees = ((2*Math.PI)/60)*new Date().getSeconds() +
        ((2*Math.PI)/60000)*new Date().getMilliseconds();

    // Normal
    else if (degrees === 'normal')
      degrees = ((2*Math.PI)/30)*new Date().getSeconds() +
        ((2*Math.PI)/30000)*new Date().getMilliseconds();

    // Fast
    else if (degrees === 'fast')
      degrees = ((2*Math.PI)/6)*new Date().getSeconds() +
        ((2*Math.PI)/6000)*new Date().getMilliseconds();
  }

  queue('rotate', {
    degrees: degrees
  })
  return this;
}

Origami.stopFrame = function() {
  console.log(1000);
  queue('stopFrame')
  this.draw();
  return this;
}

Origami.runFrame = function(fn) {
  queue('runFrame', {
    fn: fn
  })
  this.draw();
  return this;
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
  queue('on', {
    ev: ev,
    fn: fn
  })
  return this;
}
