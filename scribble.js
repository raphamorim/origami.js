var scribble = (function() {
  this.contexts = [];
  this.allContexts = [];
  this.settings = {
    inc: 0,
    defaults: {
      circle: {
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
      text: {}
    }
  };
  this.on = function() {
    [].slice.call(arguments);
    contexts = [];
    for (var i = 0; i < arguments.length; i++) {
      this._createCanvasContext(arguments[i]);
    }
    return this;
  }

  this.set = function(config) {
    if(!config) return this;
    if(config.inc) settings.inc = config.inc;
    if (config.circle) {
      if (config.circle.background)
        settings.defaults.circle['background'] = config.circle.background;
      if (config.circle.radius)
        settings.defaults.circle['radius'] = config.circle.radius;
      if (config.circle.border) {
        config.circle.border = config.circle.border.split(' ');
        settings.defaults.circle['strokeStyle'] = config.circle.border[0].replace(/[^0-9]/g, '');
        settings.defaults.circle['lineWidth'] = config.circle.border[1];
      }
    }
    return this;
  }

  this.setInc = function(value) {
    if(value) settings.inc = value;
    return this;
  }

  this._existsContext = function(sel) {
    for (var i = 0; i < allContexts.length; i++) {
      if (allContexts[i].sel === sel) return allContexts[i];
    }
    return false;
  }

  this._createCanvasContext = function(el) {    
    var existentContext = this._existsContext(el);
    if (existentContext) {
      this.contexts.push(existentContext)
      return;
    }
    var canvas = document.querySelector(el),
      context = canvas.getContext('2d'),
      current = {
        sel: el,
        ctx: (context || false),
        width: (canvas.width || null),
        height: (canvas.height || null),
      };

    this.allContexts.push(current)
    this.contexts.push(current)
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
      style = (args.style || {});
    
    if (style.border) {
      style.border = style.border.split(' ');
      style.border[0] = style.border[0].replace(/[^0-9]/g, '');
    }

    for (var i = 0; i < contexts.length; i++) {
      contexts[i].ctx.beginPath();
      contexts[i].ctx.fillStyle = (style.background)? style.background : "rgba(0, 0, 0, 0)";
      contexts[i].ctx.fillRect(args.x, args.y, args.width, (args.height || args.width));

      contexts[i].ctx.lineWidth = (style.border)? style.border[0] : null;
      contexts[i].ctx.strokeStyle = (style.border)? style.border[1] : null;
      contexts[i].ctx.strokeRect(args.x, args.y, args.width, (args.height || args.width));
      contexts[i].ctx.closePath();
    }
    return this;
  }

  this.line = function(pointA, pointB, style) {
    if (style.border) {
      style.border = style.border.split(' ');
      style.border[0] = style.border[0].replace(/[^0-9]/g, '');
    }

    for (var i = 0; i < contexts.length; i++) {
      contexts[i].ctx.beginPath();
      contexts[i].ctx.moveTo((pointA.x || 0), (pointA.y || 0));
      contexts[i].ctx.lineTo((pointB.x || 0), (pointB.y || 0));

      contexts[i].ctx.lineWidth = (style.border)? style.border[0] : null;
      contexts[i].ctx.strokeStyle = (style.border)? style.border[1] : null;
      contexts[i].ctx.stroke();
      contexts[i].ctx.closePath();
    }
    return this;
  }

  this.circle = function() {
    var args = this.args(([].slice.call(arguments) || []), 
        ['x', 'y', 'r', 'sAngle', 'eAngle']),
      style = (args.style || {}),
      def = this.settings.defaults.circle;

    if (style.border) {
      style.border = style.border.split(' ');
      style.border[0] = style.border[0].replace(/[^0-9]/g, '');
    }

    for (var i = 0; i < contexts.length; i++) {
      contexts[i].ctx.beginPath();
      contexts[i].ctx.arc(args.x, args.y, (args.r || def.radius), (args.sAngle || 0), (args.eAngle || 2*Math.PI));
      contexts[i].ctx.fillStyle = (style.background)? style.background : def.background;
      contexts[i].ctx.fill();
      contexts[i].ctx.lineWidth = (style.border)? style.border[0] : def.lineWidth;
      contexts[i].ctx.strokeStyle = (style.border)? style.border[1] : def.strokeStyle;      
      contexts[i].ctx.stroke();
      contexts[i].ctx.closePath();
    }
    return this;
  }

  this.polygon = function() {
    var args = ([].slice.call(arguments) || []),
      points = [],
      style = {};

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

    for (var i = 0; i < contexts.length; i++) {
      contexts[i].ctx.beginPath();
      contexts[i].ctx.fillStyle = (style.background)? style.background : "rgba(0, 0, 0, 0)";
      contexts[i].ctx.lineWidth = (style.border)? style.border[0] : null;
      contexts[i].ctx.strokeStyle = (style.border)? style.border[1] : null;
      for (var p = 0; p < points.length; p++) {
        if (p)
          contexts[i].ctx.lineTo(points[p].x, points[p].y);
        else
          contexts[i].ctx.moveTo(points[p].x, points[p].y);
      }
      contexts[i].ctx.stroke();
      contexts[i].ctx.fill();
      contexts[i].ctx.closePath();
    }
  }

  this.image = function(image, x, y, width, height) {
    var readyToDraw = setInterval(function() {
    if (document.readyState === 'complete') {
        clearInterval(readyToDraw);
        if (!width) width = image.naturalWidth;
        if (!height) height = image.naturalHeight;
        for (var i = 0; i < contexts.length; i++) {
          contexts[i].ctx.drawImage(image, x, y, width, height);
        }
      }
    }, 10);
    return this;
  }

  this.text = function(text, x, y, style) {
    if (!style.font)
      style.font = '14px Helvetica';

    if (style.border) {
      style.border = style.border.split(' ');
      style.border[0] = style.border[0].replace(/[^0-9]/g, '');
    }

    for (var i = 0; i < contexts.length; i++) {
      contexts[i].ctx.lineWidth = (style.border)? style.border[0] : null;
      contexts[i].ctx.strokeStyle = (style.border)? style.border[1] : null;
      contexts[i].ctx.font = style.font;
      contexts[i].ctx.fillStyle = style.color;
      contexts[i].ctx.textAlign = style.align;
      contexts[i].ctx.fillText(text, x, y);
      contexts[i].ctx.strokeText(text, x, y);

      contexts[i].ctx.fill();
      contexts[i].ctx.stroke();
    }

    return this;
  }

  this.repeat = function(times, cb) {
    var repeatSets = JSON.parse(JSON.stringify(this.settings));
    for (var i = 1; i < times; i++) {
      repeatSets.inc = (this.settings.inc * i);
      cb.call(this, repeatSets);      
    }
    return this;
  }

  this.clear = function() {
    for (var i = 0; i < this.contexts.length; i++) {
      contexts[i].ctx.clearRect(0, 0, contexts[i].width, contexts[i].height);
    }
    return this;
  }

  return {
    on: this.on.bind(this)
  }
})();