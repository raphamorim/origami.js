/*!
 * Origami.js 0.4.7
 * https://origamijs.com/
 *
 * Copyright Raphael Amorim 2016
 * Released under the GPL-4.0 license
 *
 * Date: 2016-04-12T03:12Z
 */

(function( window ) {

/**
 * Config object: Maintain internal state
 * Later exposed as Origami.config
 * `config` initialized at top of scope
 */

var Origami = {
  // Current Paper
  paper: null
};

var config = {
  // All contexts saved
  contexts: [],

  // Origami Shapes Defaults
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
      strokeStyle: 'rgba(0, 0, 0, 0)',
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

var prefix = "[origami.js]";

Origami.warning = function warning(message, obj){
    if (console && console.warn)
        console.warn(prefix, message, obj);
};

Origami.error = function error(message){
    throw new Error(prefix.concat(' ' + message));
};
Origami.init = function(el) {
  if (el.canvas) {
    el = el.canvas;
  } else {
    el = document.querySelector(el);
  }

  if (!el)
    this.error('Please use a valid selector or canvas context');

  var existentContext = exists(el, config.contexts);
  if (existentContext) {
    this.paper = existentContext;
    return this;
  }

  if (!el.getContext)
    this.error('Please verify if it\'s a valid canvas element');

  var context = el.getContext('2d');
  var current = {
    element: el,
    queue: [],
    index: config.contexts.length,
    flip: false,
    frame: null,
    ctx: context,
    width: el.width,
    height: el.height,
  };

  config.contexts.push(current);
  this.paper = current;
  return this;
}

Origami.getPaper = function() {
  return this.paper;
}

Origami.canvasCtx = function() {
  return this.paper.ctx;
}

Origami.getContexts = function() {
  return config.contexts;
}

Origami.cleanContexts = function() {
  config.contexts = [];
}

Origami.draw = function(delay) {
  var self = this;
  var abs = new Screen(self.paper),
    queueList = self.paper.queue;

  setTimeout(function() {
    for (var i = 0; i < queueList.length; i++) {
      if (queueList[i].loaded === false || queueList[i].failed) {
        Origami.warning('couldn\'t able to load:', queueList[i].params)
      }
      abs[queueList[i].assign](queueList[i].params);
    }
    self.paper.queue = [];
  }, delay);

  return self;
}

Origami.load = function(fn) {
  var mOrigami = clone(this);
  mOrigami.paper = this.paper;
  var loadInterval = setInterval(function() {
    var dataLoad = mOrigami.paper.queue.filter(function(item) {
      return (item.loaded === false && !item.failed);
    });

    // When already loaded
    if (!dataLoad.length) {
      clearInterval(loadInterval);
      fn.bind(mOrigami, mOrigami)();
    }
  }, 200);
}

function Queue(assign, params, loaded) {
  this.paper.queue.push({
    assign: assign,
    params: params,
    loaded: loaded
  });
}

var queue = Queue.bind(Origami);
// Utilities.js

var hasOwn = Object.prototype.hasOwnProperty;

/**
 * Check if element exists in a Array of NodeItems
 * @param {NodeItem} current nodeItem to check
 * @param {Array} array of NodeItems
 * @returns {NodeItem} NodeItem exitent in array
 */
function exists(el, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].element.isEqualNode(el))
      return arr[i];
  }
  return false;
}

/**
 * Filter arguments by rules
 * @param {Array} methods arguments
 * @param {Object} rules to apply
 * @returns {Object} arguments filtered
 */
function argsByRules(argsArray, rules) {
  var params = rules || ['x', 'y', 'width', 'height'],
    args = {};

  for (var i = 0; i < argsArray.length; i++) {
    if (typeof(argsArray[i]) === "object")
      args["style"] = argsArray[i];
    else
    if (params.length)
      args[params.shift()] = argsArray[i];
  }

  args.style = normalizeStyle(args.style);

  if ((typeof(args.x) === 'string') && (typeof(args.y) === 'string'))
    args = smartCoordinates(args);

  return args;
}

function normalizeStyle(style) {
  if (!style)
    style = {};

  var borderSize = (style.borderSize || null),
    borderColor = (style.borderColor || null),
    borderStyle = (style.borderStyle || []);

  if (style.border) {
    var border = [],
      borderString = style.border;

    // 0 - Size: [0-9]px
    border = border.concat(style.border.match(/[0-9]*\.?[0-9]px?/i));
    borderString = borderString.replace(/[0-9]*\.?[0-9]px?/i, '');

    // 1 - Style
    border = border.concat(borderString.match(/solid|dashed|dotted/i));
    borderString = borderString.replace(/solid|dashed|dotted/i, '');

    // 2 - Color
    border = border.concat(borderString.match(/[^\s]+/i));

    if (!borderSize)
      borderSize = border[0];
    if (!borderColor)
      borderColor = border[2];

    borderStyle = border[1];
  }

  if (borderSize)
    borderSize = borderSize.replace(/[^0-9]/g, '');

  if (typeof(borderStyle) === 'string') {
    if (borderStyle === 'dashed')
      borderStyle = [12];
    else if (borderStyle === 'dotted')
      borderStyle = [3];
    else
      borderStyle = [];
  }

  style['borderSize'] = borderSize;
  style['borderStyle'] = borderStyle;
  style['borderColor'] = borderColor;
  return style;
}

/**
 * Return args object with new coordinates based on behavior
 * @returns {Object} args
 */
function smartCoordinates(args) {
  var x = args.x,
    y = args.y;

  var paper = Origami.getPaper(),
    elmWidth = paper.element.width,
    elmHeight = paper.element.height,
    radius = (args.r || 0);

  var width = (args.width || radius),
    height = (args.height || width);

  var axis = {
    x: [ 'right', 'center', 'left' ],
    y: [ 'top', 'center', 'bottom' ]
  };

  if (axis.x.indexOf(x) !== -1) {
    if (x === 'right')
      x = Math.floor(elmWidth - width);
    else if (x === 'center')
      if (radius)
        x = Math.floor(elmWidth / 2)
      else
        x = Math.floor((elmWidth / 2) - (width / 2));
    else if (x === 'left')
      x = radius;
  } else if ((x + '').substr(-1) === '%') {
    x = (elmWidth * parseInt(x, 10)) / 100;
  } else {
    x = 0;
  }

  if (axis.y.indexOf(y) !== -1) {
    if (y === 'top')
      y = radius;
    else if (y === 'center')
      if (radius)
        y = Math.floor(elmHeight / 2);
      else
        y = Math.floor((elmHeight / 2) - (height / 2));
    else if (y === 'bottom')
      y = Math.floor(elmHeight - height);
  } else if ((y + '').substr(-1) === '%') {
    y = (elmHeight * parseInt(y, 10)) / 100;
  } else {
    y = 0;
  }

  args.y = y;
  args.x = x;
  return args;
}

/**
 * Merge defaults with user options
 * @param {Object} defaults Default settings
 * @param {Object} options User options
 * @returns {Object} Merged values of defaults and options
 */
function extend(a, b, undefOnly) {
  for (var prop in b) {
    if (hasOwn.call(b, prop)) {

      // Avoid "Member not found" error in IE8 caused by messing with window.constructor
      // This block runs on every environment, so `global` is being used instead of `window`
      // to avoid errors on node.
      if (prop !== "constructor" || a !== global) {
        if (b[prop] === undefined) {
          delete a[prop];
        } else if (!(undefOnly && typeof a[prop] !== "undefined")) {
          a[prop] = b[prop];
        }
      }
    }
  }
  return a;
}

/**
 * Clone a object
 * @param {Object} object
 * @returns {Object} cloned object
 */
function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

function Screen(currentContext) {
  this.paper = currentContext;
}

Screen.prototype.translate = function(params) {
  this.paper.ctx.translate(params.x, params.y)
}

Screen.prototype.background = function(params) {
  this.paper.element.style.backgroundColor = params.color;
}

Screen.prototype.restore = function() {
  this.paper.ctx.restore();
}

Screen.prototype.save = function() {
  this.paper.ctx.save();
}

Screen.prototype.composition = function(params) {
  this.paper.ctx.globalCompositeOperation = params.globalComposite;
}

Screen.prototype.rotate = function(params) {
  this.paper.ctx.rotate(params.degrees);
}

Screen.prototype.stop = function() {
  window.cancelAnimationFrame(this.paper.frame);
  this.paper.frame = false;
}

Screen.prototype.nextFrame = function(params) {
  this.paper.frame = window.requestAnimationFrame(params.fn);
}

Screen.prototype.scale = function(params) {
  this.paper.ctx.scale(params.width, params.height);
}

Screen.prototype.flip = function(params) {
  this.paper.flip = 'horizontal';
  if (params.type && typeof(params.type) === 'string')
    this.paper.flip = params.type;
}

Screen.prototype.flipEnd = function() {
  this.paper.flip = false;
}

Screen.prototype.clear = function(){
  this.paper.ctx.clearRect(0, 0, this.paper.width, this.paper.height);
}

Screen.prototype.on = function(params) {
  this.paper.element.addEventListener(params.ev, params.fn);
}

function ArcShape(params) {
  var args = params.args,
    style = args.style,
    def = config.defaults.arc;

  this.paper.ctx.beginPath();
  this.paper.ctx.setLineDash(style.borderStyle);
  this.paper.ctx.arc(args.x, args.y, (args.r || def.radius), (args.sAngle || 0), (args.eAngle || 2 * Math.PI));
  this.paper.ctx.fillStyle = (style.background || style.bg) ? (style.background || style.bg) : def.background;
  this.paper.ctx.fill();
  this.paper.ctx.lineWidth = (style.borderSize) ? style.borderSize : def.lineWidth;
  this.paper.ctx.strokeStyle = (style.borderColor) ? style.borderColor : def.strokeStyle;
  this.paper.ctx.stroke();
  this.paper.ctx.setLineDash([]);
  this.paper.ctx.closePath();
}

Screen.prototype.arc = ArcShape;

Origami.arc = function() {
  var args = [].slice.call(arguments);
  args = argsByRules(args, ['x', 'y', 'r', 'sAngle', 'eAngle']);

  queue('arc', {
    args: args
  });
  return this;
};

function ImageShape(params) {
  var image = params.image,
    x = params.x,
    y = params.y,
    width = params.width,
    height = params.height;

  this.paper.ctx.save();
  if (this.paper.flip) {
    if (this.paper.flip === 'horizontal') {
      this.paper.ctx.scale(-1, 1);
      width = width * -1;
      x = x * -1;
    }
    if (this.paper.flip === 'vertical') {
      this.paper.ctx.scale(1, -1);
      height = height * -1;
      y = y * -1;
    }
  }

  this.paper.ctx.beginPath();
  this.paper.ctx.drawImage(image, Math.floor((x || 0)), Math.floor((y || 0)), width, height);
  this.paper.ctx.closePath();
  this.paper.ctx.restore();
}

Screen.prototype.image = ImageShape;

Origami.image = function(image, x, y, width, height) {
  var self = this;
  if (!image)
    return this;

  if (typeof(image) === 'string') {
    var img = new Image();
    img.src = image;
    image = img;
  }

  var item = {
    image: image,
    x: x,
    y: y,
    width: width,
    height: height
  };

  if ((typeof(item.x) === 'string') && (typeof(item.y) === 'string'))
    item = smartCoordinates(item);

  if (image.complete) {
    item.width = width || image.naturalWidth;
    item.height = height || image.naturalHeight;

    queue('image', item);
    return self;
  }

  queue('image', item, false);
  var reference = (self.paper.queue.length - 1),
    currentQueue = config.contexts[this.paper.index].queue[reference];

  image.addEventListener('load', function() {
    if (!currentQueue)
      return false;
    currentQueue.params.width = (item.width || image.naturalWidth);
    currentQueue.params.height = (item.height || image.naturalHeight);
    currentQueue.loaded = true;
  });

  image.addEventListener('error', function() {
    if (!currentQueue)
      return false;
    currentQueue.failed = true;
  })

  return self;
};

function LineShape(params) {
  var def = config.defaults.line,
      style = params.style,
      pointA = params.pointA,
      pointB = params.pointB;

  this.paper.ctx.beginPath();
  this.paper.ctx.setLineDash(style.borderStyle);
  this.paper.ctx.moveTo((pointA.x || 0), (pointA.y || 0));
  this.paper.ctx.lineTo((pointB.x || 0), (pointB.y || 0));

  this.paper.ctx.lineWidth = (style.borderSize) ? style.borderSize : def.lineWidth;
  this.paper.ctx.strokeStyle = (style.borderColor) ? style.borderColor : def.strokeStyle;
  this.paper.ctx.stroke();
  this.paper.ctx.setLineDash([]);
  this.paper.ctx.closePath();
}

Screen.prototype.line = LineShape;

Origami.line = function(pointA, pointB, style) {
  style = normalizeStyle(style);

  queue('line', {
    pointA: pointA,
    pointB: pointB,
    style: style
  });
  return this;
};

function PolygonShape(params) {
  var args = params.args,
    style = params.style,
    def = config.defaults.polygon;

  this.paper.ctx.beginPath();
  this.paper.ctx.setLineDash(style.borderStyle);
  this.paper.ctx.fillStyle = (style.background) ? style.background : def.background;
  this.paper.ctx.lineWidth = (style.borderSize) ? style.borderSize : def.lineWidth;
  this.paper.ctx.strokeStyle = (style.borderColor) ? style.borderColor : def.strokeStyle;

  for (var p = 0; p < args.length; p++) {
    if (!args[p].x)
      continue;

    if (p)
      this.paper.ctx.lineTo(args[p].x, args[p].y);
    else
      this.paper.ctx.moveTo(args[p].x, args[p].y);
  }

  this.paper.ctx.fill();
  this.paper.ctx.stroke();
  this.paper.ctx.setLineDash([]);
  this.paper.ctx.closePath();
}

Screen.prototype.polygon = PolygonShape;

Origami.polygon = function() {
  var args = [].slice.call(arguments),
    settedArgs = argsByRules(args);

  queue('polygon', {
    style: settedArgs.style,
    args: args
  });
  return this;
};

function RectShape(params) {
  var def = config.defaults.rect,
    style = params.style,
    args = params.args;

  this.paper.ctx.beginPath();
  this.paper.ctx.setLineDash(style.borderStyle);
  this.paper.ctx.fillStyle = (style.background) ? style.background : def.background;
  this.paper.ctx.fillRect(args.x, args.y, args.width, (args.height || args.width));

  this.paper.ctx.lineWidth = (style.borderSize) ? style.borderSize : def.lineWidth;
  this.paper.ctx.strokeStyle = (style.borderColor) ? style.borderColor : def.strokeStyle;
  this.paper.ctx.strokeRect(args.x, args.y, args.width, (args.height || args.width));
  this.paper.ctx.setLineDash([]);
  this.paper.ctx.closePath();
}

Screen.prototype.rect = RectShape;

Origami.rect = function() {
  var args = [].slice.call(arguments);
  args = argsByRules(args);

  queue('rect', {
    style: args.style,
    args: args
  });
  return this;
};

Origami.border = function() {
  var args = [].slice.call(arguments);
  args = argsByRules(args);

  queue('rect', {
    style: args.style,
    args: {
      x: 0,
      y: 0,
      width: this.paper.ctx.canvas.clientWidth,
      height: this.paper.ctx.canvas.clientHeight
    }
  });
  return this;
}

/**
 * @author mrdoob / http://mrdoob.com/
 * @co-author raphamorim
 */

function html2canvas(element) {
  var range = document.createRange();

  function getRect(rect) {
    return {
      left: rect.left - offset.left - 0.5,
      top: rect.top - offset.top - 0.5,
      width: rect.width,
      height: rect.height
    };
  }

  function drawText(style, x, y, string) {
    context.font = style.fontSize + ' ' + style.fontFamily;
    context.textBaseline = 'top';
    context.fillStyle = style.color;
    context.fillText(string, x, y);
  }

  function drawBorder(style, which, x, y, width, height) {
    var borderWidth = style[which + 'Width'];
    var borderStyle = style[which + 'Style'];
    var borderColor = style[which + 'Color'];

    if (borderWidth !== '0px' && borderStyle !== 'none') {
      context.strokeStyle = borderColor;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + width, y + height);
      context.stroke();
    }
  }

  function drawElement(element, style) {
    var rect;
    if (element.nodeType === 3) {
      // text
      range.selectNode(element);
      rect = getRect(range.getBoundingClientRect());
      drawText(style, rect.left, rect.top, element.nodeValue.trim());
    } else {
      rect = getRect(element.getBoundingClientRect());
      style = window.getComputedStyle(element);

      context.fillStyle = style.backgroundColor;
      context.fillRect(rect.left, rect.top, rect.width, rect.height);

      drawBorder(style, 'borderTop', rect.left, rect.top, rect.width, 0);
      drawBorder(style, 'borderLeft', rect.left, rect.top, 0, rect.height);
      drawBorder(style, 'borderBottom', rect.left, rect.top + rect.height, rect.width, 0);
      drawBorder(style, 'borderRight', rect.left + rect.width, rect.top, 0, rect.height);

      if (element.type === 'color' || element.type === 'text') {
        drawText(style, rect.left + parseInt(style.paddingLeft), rect.top + parseInt(style.paddingTop), element.value);
      }
    }

    for (var i = 0; i < element.childNodes.length; i++) {
      drawElement(element.childNodes[i], style);
    }
  }

  var offset = element.getBoundingClientRect();
  var context = this.paper.ctx;
  drawElement(element);
}

Screen.prototype.html2canvas = html2canvas;

Origami.shape = function(selector) {
  var element =  document.querySelector(selector);

  if (!element)
    this.error('Please use a valid selector in shape argument');
  else
    queue('html2canvas', element);

  return this;
};

function SpriteShape(params) {
  var properties = params.properties,
    dw = params.width / properties.frames;

  drawSprite.call(this, {
    image: params.image,
    posX: 0,
    posY: 0,
    frame: properties.frames,
    loop: properties.loop,
    width: dw,
    widthTotal: params.width,
    height: params.height,
    dx: params.x,
    dy: params.y,
    speed: properties.speed,
    animation: null
  });
}

function drawSprite(sprite) {
  var self = this;

  if (sprite.posX === sprite.widthTotal) {
    if (sprite.loop === false) {
      window.cancelAnimationFrame(sprite.animation);
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

  sprite.posX = sprite.posX + sprite.width;

  setTimeout(function() {
    sprite.animation = window.requestAnimationFrame(drawSprite.bind(self, sprite));
  }, sprite.speed);
}

Screen.prototype.sprite = SpriteShape;

Origami.sprite = function(x, y, properties) {
  var self = this;

  if (!properties || !properties.src)
    return this;

  var image = new Image(),
    frames = (properties.frames || 0),
    loop = (properties.loop || true),
    speed = (properties.speed || 10);

  image.src = properties.src;

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

function TextShape(params) {
  var def = config.defaults.text,
    text = params.text,
    x = params.x,
    y = params.y,
    style = params.style;

  this.paper.ctx.beginPath();
  this.paper.ctx.setLineDash(style.borderStyle);
  this.paper.ctx.lineWidth = (style.borderSize) ? style.borderSize : def.lineWidth;
  this.paper.ctx.strokeStyle = (style.borderColor) ? style.borderColor : def.strokeStyle;
  this.paper.ctx.font = (style.font || def.font);
  this.paper.ctx.fillStyle = (style.color || def.color);
  this.paper.ctx.textAlign = (style.align || def.align);
  this.paper.ctx.fillText(text, x, y);
  this.paper.ctx.strokeText(text, x, y);
  this.paper.ctx.fill();
  this.paper.ctx.stroke();
  this.paper.ctx.setLineDash([]);
  this.paper.ctx.closePath();
}

Screen.prototype.text = TextShape;

Origami.text = function(text, x, y, style) {
  style = normalizeStyle(style);

  var item = {
    text: text,
    x: x,
    y: y,
    style: style
  };

  if ((typeof(item.x) === 'string') && (typeof(item.y) === 'string'))
    item = smartCoordinates(item);

  queue('text', item);
  return this;
};

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

Origami.stop = function() {
  queue('stop')
  return this;
}

Origami.nextFrame = function(fn) {
  queue('nextFrame', {
    fn: fn
  })
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

// For consistency with CommonJS environments' exports
if ( typeof module !== "undefined" && module && module.exports ){
    module.exports = extend(Origami.init.bind(this), Origami);
}

// For CommonJS with exports, but without module.exports, like Rhino
if ( typeof exports !== "undefined" && exports ) {
    exports.origami = extend(Origami.init.bind(this), Origami);
}

// For browser, export only select globals
if ( typeof window === "object" ) {
    window.origami = extend(Origami.init.bind(Origami), Origami);
}

// Get a reference to the global object
}( (function() {
    return this;
})() ));
