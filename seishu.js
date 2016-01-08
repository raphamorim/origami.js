;(function() {
  this.sb = null;
  this.contexts = [];
  this.settings = {
    inc: 0,
    sum: 0,
    defaults: {
      arc: {
        background: 'rgba(0, 0, 0, 0)',
        strokeStyle: null,
        lineWidth: null,
      },
      rect: {
        background: 'rgba(0, 0, 0, 0)',
        strokeStyle: null,
        lineWidth: null,
      },
      polygon: {
        background: 'rgba(0, 0, 0, 0)',
        strokeStyle: null,
        lineWidth: null,
      },
      line: {
        strokeStyle: null,
        lineWidth: null,
      },
      text: {
        font: '14px Helvetica',
        strokeStyle: null,
        lineWidth: null,
      }
    }
  };

  this.init = function(el) {
    this.sb = null;
    this._createCanvasContext(el);
    return this;
  }

  this.set = function(config) {
    if (!config) return this;
    if (config.inc) settings.inc = config.inc;
    if (config.sum) settings.sum = config.sum;
    // set Work for rect, line, polygon, text 
    if (config.arc) {
      if (config.arc.background)
        settings.defaults.arc['background'] = config.arc.background;
      if (config.arc.radius)
        settings.defaults.arc['radius'] = config.arc.radius;
      if (config.arc.border) {
        config.arc.border = config.arc.border.split(' ');
        settings.defaults.arc['lineWidth'] = config.arc.border[0].replace(/[^0-9]/g, '');
        settings.defaults.arc['strokeStyle'] = config.arc.border[1];
      }
    }
    return this;
  }

  this.setInc = function(value) {
    if (value) settings.inc = value;
    return this;
  }

  this._existsContext = function(sel) {
    for (var i = 0; i < contexts.length; i++) {
      if (contexts[i].sel === sel) return contexts[i];
    }
    return false;
  }

  this._createCanvasContext = function(el) {
    var existentContext = this._existsContext(el);
    if (existentContext) {
      this.sb = existentContext;
      return;
    }
    var canvas = document.querySelector(el);
    if (!canvas.getContext)
      return console.log('Error: Please check if your browser support canvas and verify if it\'s a valid canvas element.');
    var context = canvas.getContext('2d'),
      current = {
        sel: el,
        element: canvas,
        ctx: (context || false),
        width: (canvas.width || null),
        height: (canvas.height || null),
      };

    this.contexts.push(current);
    this.sb = current;
  }

  this._list = function() {
    console.log('All Contexts Saved: ', this.allContexts)
    console.log('Current Contexts: ', this.contexts)
    return this;
  }

  this.args = function(argsArray, rules) {
    var params = ['x', 'y', 'width', 'height'],
      args = new Object();

    if (rules) params = rules;
    for (var i = 0; i < argsArray.length; i++) {
      if (typeof(argsArray[i]) === "object")
        args["style"] = argsArray[i];
      else
        if (params.length)
          args[params.shift()] = argsArray[i];
    }
    return args;
  }

  this.rect = function() {
    var args = this.args(([].slice.call(arguments) || [])),
      style = (args.style || {}),
      def = this.settings.defaults.rect;

    if (style.border) {
      style.border = style.border.split(' ');
      style.border[0] = style.border[0].replace(/[^0-9]/g, '');
    }

    sb.ctx.beginPath();
    sb.ctx.fillStyle = (style.background)? style.background : def.background;
    sb.ctx.fillRect(args.x, args.y, args.width, (args.height || args.width));

    sb.ctx.lineWidth = (style.border)? style.border[0] : def.lineWidth;
    sb.ctx.strokeStyle = (style.border)? style.border[1] : def.strokeStyle;
    sb.ctx.strokeRect(args.x, args.y, args.width, (args.height || args.width));
    sb.ctx.closePath();
    return this;
  }

  this.line = function(pointA, pointB, style) {
    var def = this.settings.defaults.line;
    if (style.border) {
      style.border = style.border.split(' ');
      style.border[0] = style.border[0].replace(/[^0-9]/g, '');
    }

    sb.ctx.beginPath();
    sb.ctx.moveTo((pointA.x || 0), (pointA.y || 0));
    sb.ctx.lineTo((pointB.x || 0), (pointB.y || 0));

    sb.ctx.lineWidth = (style.border)? style.border[0] : def.lineWidth;
    sb.ctx.strokeStyle = (style.border)? style.border[1] : def.strokeStyle;
    sb.ctx.stroke();
    sb.ctx.closePath();
    return this;
  }

  this.arc = function() {
    var args = this.args(([].slice.call(arguments) || []),
        ['x', 'y', 'r', 'sAngle', 'eAngle']),
      style = (args.style || {}),
      def = this.settings.defaults.arc;

    if (style.border) {
      style.border = style.border.split(' ');
      style.border[0] = style.border[0].replace(/[^0-9]/g, '');
    }

    sb.ctx.beginPath();
    sb.ctx.arc(args.x, args.y, (args.r || def.radius), (args.sAngle || 0), (args.eAngle || 2*Math.PI));
    sb.ctx.fillStyle = (style.background)? style.background : def.background;
    sb.ctx.fill();
    sb.ctx.lineWidth = (style.border)? style.border[0] : def.lineWidth;
    sb.ctx.strokeStyle = (style.border)? style.border[1] : def.strokeStyle;
    sb.ctx.stroke();
    sb.ctx.closePath();
    return this;
  }

  this.polygon = function() {
    var args = ([].slice.call(arguments) || []),
      points = [],
      style = {},
      def = this.settings.defaults.polygon;

    for (var i = 0; i < args.length; i++) {
      if (!args[i]) break;
      if (args[i].x && args[i].y)
        points.push(args[i]);
      else
        style = args[i];
    }

    if (style.border) {
      style.border = style.border.split(' ');
      style.border[0] = style.border[0].replace(/[^0-9]/g, '');
    }

    sb.ctx.beginPath();
    sb.ctx.fillStyle = (style.background)? style.background : def.background;
    sb.ctx.lineWidth = (style.border)? style.border[0] : def.lineWidth;
    sb.ctx.strokeStyle = (style.border)? style.border[1] : def.strokeStyle;
    for (var p = 0; p < points.length; p++) {
      if (p)
        sb.ctx.lineTo(points[p].x, points[p].y);
      else
        sb.ctx.moveTo(points[p].x, points[p].y);
    }
    sb.ctx.stroke();
    sb.ctx.fill();
    sb.ctx.closePath();
    return this;
  }

  this.image = function(image, x, y, width, height) {
    if (typeof(image) === 'string') {
      var img = new Image();
      img.src = image;
      image = img;
    }
    if (!width) width = image.naturalWidth;
    if (!height) height = image.naturalHeight;
    sb.ctx.drawImage(image, (x || 0), (y || 0), width, height);
    return this;
  }

  this.translate = function(x, y){
    if (typeof(x) === 'string') {
      if (x === 'center') {
        x = sb.width / 2;
        y = sb.height / 2;
      }
      if (x === 'reset') {
        x = -sb.width / 2;
        y = -sb.height / 2;
      }
    }
    sb.ctx.translate(x, y);
    return this;
  }

  this.restore = function() {
    sb.ctx.restore();
    return this;
  }

  this.save = function() {
    sb.ctx.save();
    return this;
  }

  this.globalCompositeOperation = function(param) {
    sb.ctx.globalCompositeOperation = param;
    return this;
  }

  this.rotate = function(degrees){
    sb.ctx.rotate(degrees);
    return this;
  }

  this.nextFrame = (function(callback) {
    return window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame || 
    window.oRequestAnimationFrame || 
    window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
  })();

  this.text = function(text, x, y, style) {
    var def = this.settings.defaults.text;
    if (style.border) {
      style.border = style.border.split(' ');
      style.border[0] = style.border[0].replace(/[^0-9]/g, '');
    }

    sb.ctx.lineWidth = (style.border)? style.border[0] : def.lineWidth;
    sb.ctx.strokeStyle = (style.border)? style.border[1] : def.strokeStyle;
    sb.ctx.font = (style.font || def.font);
    sb.ctx.fillStyle = style.color;
    sb.ctx.textAlign = style.align;
    sb.ctx.fillText(text, x, y);
    sb.ctx.strokeText(text, x, y);
    sb.ctx.fill();
    sb.ctx.stroke();
    return this;
  }

  this.repeat = function(times, fn) {
    var repeatSets = JSON.parse(JSON.stringify(this.settings));
    for (var i = 1; i < times; i++) {
      repeatSets.inc = (this.settings.inc * i);
      fn.call(this, repeatSets);
    }
    return this;
  }

  this.getContext = function() {
    return sb.ctx;
  }

  this.clear = function() {
    sb.ctx.clearRect(0, 0, sb.width, sb.height);
    return this;
  }

  if (typeof window === "object")
    window.seishu = this.init.bind(this);
  if (typeof module === "object" && typeof module.exports === "object")
    module.exports = this.init.bind(this);
}());
