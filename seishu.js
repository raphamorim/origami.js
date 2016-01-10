;(function() {
  this.sb = null;
  this.contexts = [];
  this.settings = {
    inc: 0,
    sum: 0,
    defaults: {
      arc: {
        background: 'rgba(0, 0, 0, 0)',
        strokeStyle: 'rgba(0, 0, 0, 0)',
        lineWidth: null,
      },
      rect: {
        background: 'rgba(0, 0, 0, 0)',
        strokeStyle: 'rgba(0, 0, 0, 0)',
        lineWidth: null,
      },
      polygon: {
        background: 'rgba(0, 0, 0, 0)',
        strokeStyle: 'rgba(0, 0, 0, 0)',
        lineWidth: null,
      },
      line: {
        strokeStyle: null,
        lineWidth: null,
      },
      text: {
        font: '14px Helvetica',
        strokeStyle: 'rgba(0, 0, 0, 0)',
        color: '#000',
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

  this._existsContext = function(el) {
    for (var i = 0; i < contexts.length; i++) {
      if (contexts[i].element.isEqualNode(el)) 
        return contexts[i];
    }
    return false;
  }

  this._createCanvasContext = function(el) {
    if (el.canvas)
      el = el.canvas;
    else
      el = document.querySelector(el);
    
    var existentContext = this._existsContext(el);
    if (existentContext) {
      this.sb = existentContext;
      return;
    }
    
    if (!el.getContext)
      return console.log('Error: Please check if your browser support canvas and verify if it\'s a valid canvas element.');

    var context = el.getContext('2d'),
      current = {
        element: el,
        flip: false,
        frame: null,
        ctx: (context || false),
        width: (el.width || null),
        height: (el.height || null),
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
    sb.ctx.fillStyle = (style.background || style.bg)? (style.background || style.bg) : def.background;
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

  this.image = function(image, x, y, width, height, sx, sy, sw, sh) {
    if (!image)
      return this;
    if (typeof(image) === 'string') {
      var img = new Image();
      img.src = image;
      image = img;
    }
    image.addEventListener('load', function() {
      if (!width) width = image.naturalWidth;
      if (!height) height = image.naturalHeight;
      sb.ctx.save();
      if (sb.flip) {
        if (sb.flip === 'horizontal') {
          sb.ctx.scale(-1, 1);
          width = width* -1;
        }
        if (sb.flip === 'vertical') {
          sb.ctx.scale(1, -1);
          height = height* -1;
        }
      }

      sb.ctx.beginPath();
      sb.ctx.drawImage(image, (x || 0), (y || 0), width, height);
      sb.ctx.closePath();
      sb.ctx.restore();
    }, false);
    return this;
  }

  this.translate = function(x, y){
    if (x === 'center') {
      x = sb.width / 2;
      y = sb.height / 2;
    }
    if (x === 'reset' || (x == null && y == null)) {
      x = -sb.width / 2;
      y = -sb.height / 2;
    }
    sb.ctx.translate(x, y);
    return this;
  }

  this.canvasBackground = function(color){
    sb.element.style.backgroundColor = color;
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

  this.globalComposite = function(param) {
    sb.ctx.globalCompositeOperation = param;
    return this;
  }

  this.rotate = function(degrees){
    sb.ctx.rotate(degrees);
    return this;
  }

  this.stop = function(){
    window.cancelAnimationFrame(sb.frame);
    sb.frame = false;
    return this;
  }

  this.nextFrame = function(fn){
    sb.frame = window.requestAnimationFrame(fn);
    return this;
  }

  this.text = function(text, x, y, style){
    if (!style) style = {};
    var def = this.settings.defaults.text;
    if (style.border) {
      style.border = style.border.split(' ');
      style.border[0] = style.border[0].replace(/[^0-9]/g, '');
    }

    sb.ctx.beginPath();
    sb.ctx.lineWidth = (style.border)? style.border[0] : def.lineWidth;
    sb.ctx.strokeStyle = (style.border)? style.border[1] : def.strokeStyle;
    sb.ctx.font = (style.font || def.font);
    sb.ctx.fillStyle = (style.color || def.color);
    sb.ctx.textAlign = (style.align || def.align);
    sb.ctx.fillText(text, x, y);
    sb.ctx.strokeText(text, x, y);
    sb.ctx.fill();
    sb.ctx.stroke();
    sb.ctx.closePath();
    return this;
  }

  this.repeat = function(times, fn){
    var repeatSets = JSON.parse(JSON.stringify(this.settings));
    for (var i = 1; i < times; i++) {
      repeatSets.inc = (this.settings.inc * i);
      fn.call(this, repeatSets);
    }
    return this;
  }

  this.getContext = function(){
    return sb.ctx;
  }

  this.scale = function(width, height){
    sb.ctx.scale(width, height);
    return this;
  }

  this.flip = function(type){
    sb.flip = 'horizontal';
    if (type && typeof(type) === 'string')
      sb.flip = type;
    return this;
  }

  this.flipEnd = function(){
    sb.flip = false;
    return this;
  }

  this.sprite = function(x, y, config){
    if (!config || !config.src) 
      return this;

    var self = this,
        image  = new Image(),
        frames = (config.frames || 0),
        loop   = (config.loop || true),
        speed  = (config.speed || 10);
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

      self._drawSprite(sprite);
    }, false);
    return this;
  }

  this._drawSprite = function(sprite){
    if (sprite.posX === sprite.totalWidth) {
      if (sprite.loop === false) {
        window.cancelAnimationFrame(sprite.anim);
        return;
      }
      sprite.posX = 0;
    }

    sb.ctx.clearRect(sprite.dx, sprite.dy, sprite.width, sprite.height);
    sb.ctx.beginPath();
    sb.ctx.drawImage(sprite.image, sprite.posX, sprite.posY, 
      sprite.width, sprite.height, sprite.dx, sprite.dy, 
      sprite.width, sprite.height);
    sb.ctx.closePath();
    sprite.posX = sprite.posX + sprite.width;
    setTimeout(function(){ 
      sprite.anim = window.requestAnimationFrame(this._drawSprite.bind(this, sprite));
    }, sprite.speed);
  }

  this.clear = function(){
    sb.ctx.clearRect(0, 0, sb.width, sb.height);
    return this;
  }

  if (typeof window === "object")
    window.seishu = this.init.bind(this);
  if (typeof module === "object" && typeof module.exports === "object")
    module.exports = this.init.bind(this);
}());
