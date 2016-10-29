/*!
 * Origami.js 0.5.1
 * https://origamijs.com/
 *
 * Copyright (C) 2016  Raphael Amorim
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Date: 2016-10-29T20:51Z
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
  // Document Styles
  documentStyles: [],

  // Virtual Styles
  virtualStyles: {},

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

  el.width = el.clientWidth;
  el.height = el.clientHeight;
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

Origami.styles = function() {
  if (!config.virtualStyles.length)
    defineDocumentStyles(config);

  var selectors = arguments;
  if (!selectors.length) {
    config.virtualStyles['empty'] = true;
    return this;
  }

  for (var i = 0; i < selectors.length; i++) {
    var style = styleRuleValueFrom(selectors[i], (config.documentStyles[0] || []));
    config.virtualStyles[selectors[i]] = style;
  }
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

Origami.createComponent = function(component, fn) {
  Origami[component] = function(props) {
    fn.bind(this, this, props)();
    return this;
  };
}

Origami.fn = {};

Origami.draw = function(options) {
  var self = this,
    customRender = false,
    ctx = self.paper.ctx;

  if (typeof(options) === 'string') {
    customRender = new origami.fn[options](self.paper);
    self.paper['ctx'] = customRender;
  }

  var abs = new Screen(self.paper),
    queueList = self.paper.queue;

  for (var i = 0; i < queueList.length; i++) {
    if (queueList[i].loaded === false || queueList[i].failed) {
      Origami.warning('couldn\'t able to load:', queueList[i].params)
    }
    abs[queueList[i].assign](queueList[i].params);
  }
  self.paper.queue = [];

  if (customRender) {
    customRender.draw();
    self.paper.ctx = ctx;
  }

  if (typeof(options) === 'function')
    options();
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
  }, 1);
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

function getBorderStyleObject(prop) {
  return normalizeStyle({border: prop});
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
 * Return all documentStyles to a especified origami context
 * @returns undefined
 */
function defineDocumentStyles() {
  for (var i = 0; i < document.styleSheets.length; i++) {
    var mysheet = document.styleSheets[i],
      myrules = mysheet.cssRules ? mysheet.cssRules : mysheet.rules;
    config.documentStyles.push(myrules);
  }
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
 * Get Style Rule from a specified element
 * @param {String} selector from element
 * @param {Array} Document Style Rules
 * @returns {Object} Merged values of defaults and options
 */
function styleRuleValueFrom(selector, documentStyleRules) {
  for (var j = 0; j < documentStyleRules.length; j++) {
    if (documentStyleRules[j].selectorText && documentStyleRules[j].selectorText.toLowerCase() === selector) {
      return documentStyleRules[j].style;
    }
  }
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

Screen.prototype.clear = function() {
  this.paper.ctx.clearRect(0, 0, this.paper.width, this.paper.height);
}

Screen.prototype.opacity = function(params) {
  this.paper.ctx.globalAlpha = params.opacity;
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
      width: this.paper.width,
      height: this.paper.height
    }
  });
  return this;
}

function CSSShape(style) {
  var self = this,
    style = config.virtualStyles[style];

  if (!style)
    return self;

  // TODO: Draw in all canvas
  var data = '<svg xmlns="http://www.w3.org/2000/svg" width="' +
    self.paper.width + 'px" height="' + self.paper.height + 'px">' +
    '<foreignObject width="100%" height="100%">' +
    '<div xmlns="http://www.w3.org/1999/xhtml">' +
    '<div style="' + style.cssText + '"></div>' +
    '</div></foreignObject>' +
    '</svg>';

  var DOMURL = window.URL || window.webkitURL || window,
    img = new Image(),
    svg = new Blob([data], {
      type: 'image/svg+xml;charset=utf-8'
    });

  var url = DOMURL.createObjectURL(svg);
  img.src = url;

  img.addEventListener('load', function() {
    self.paper.ctx.beginPath();
    self.paper.ctx.drawImage(img, 0, 0);
    DOMURL.revokeObjectURL(url);
    self.paper.ctx.closePath();
  });

  return self;
}

Screen.prototype.CSSShape = CSSShape;

Origami.shape = function(style) {
  queue('CSSShape', style);
  return this;
};

function SpriteShape(params) {
  var props = params.properties,
    dw = params.width / props.frames.total,
    frames = props.frames,
    posX = 0;

  if (frames.current && frames.current <= frames.total)
    posX = dw * (frames.current - 1)

  drawSprite.call(this, {
    image: params.image,
    posX: posX,
    posY: 0,
    frames: props.frames,
    animation: props.animation,
    loop: props.loop,
    width: dw,
    widthTotal: params.width,
    height: params.height,
    dx: params.x,
    dy: params.y,
    speed: props.speed,
    update: null
  });
}

function drawSprite(sprite) {
  var self = this;

  if (sprite.posX === sprite.widthTotal) {
    if (sprite.loop !== true) {
      window.cancelAnimationFrame(sprite.update);
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

  if (sprite.animation !== false) {
    sprite.posX = sprite.posX + sprite.width;
  }

  setTimeout(function() {
    sprite.update = window.requestAnimationFrame(drawSprite.bind(self, sprite));
  }, sprite.speed);
}

Screen.prototype.sprite = SpriteShape;

Origami.sprite = function(x, y, properties) {
  var self = this,
    framesConfig = properties.frames;

  if (!properties || !properties.src || !framesConfig.total)
    return this;

  var image = new Image();
  image.src = properties.src;

  // normalize properties
  properties.speed = properties.speed || 10;

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
  this.paper.ctx.textBaseline = 'middle';
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

function ChartLine(config) {
  var ctx = this.paper.ctx,
    width = this.paper.width,
    height = this.paper.height;

  if (config.frame)
    ctx.clearRect(0, 0, this.paper.width, this.paper.height);

  var lineVariance = 2;

  var animation = config.animation;

  if (!config.props) {
    config['props'] = {
      alpha: 1
    }
  }

  var xPadding = 40;
  var yPadding = 40;
  var sets = config.datasets;

  var gridLines = {
    vertical: true,
    horizontal: true
  };

  var gridLinesColor = '#e7e7e7';
  if (config.gridLinesColor) {
    gridLinesColor = config.gridLinesColor;
  }

  if (config.gridLines) {
    if (config.gridLines.vertical === false)
      gridLines.vertical = false;

    if (config.gridLines.horizontal === false)
      gridLines.horizontal = false;
  }

  ctx.fillStyle = '#5e5e5e';
  if (config.labelColor) {
    ctx.fillStyle = config.labelColor;
  }

  ctx.font = 'normal 11px Helvetica';
  ctx.globalAlpha = 1;

  // Labels
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  for (var i = 0; i < config.labels.length; i++) {
    if (gridLines.vertical) {
      ctx.beginPath();
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = gridLinesColor;
      ctx.moveTo(getXPixel(i), height - yPadding + 10);
      ctx.lineTo(getXPixel(i), yPadding / lineVariance);
      ctx.stroke();
    }

    ctx.fillText(config.labels[i], getXPixel(i) - config.labels[i].length * 2.5, height - yPadding + 22);
  }

  // Data
  ctx.textAlign = "right"
  ctx.textBaseline = "middle";
  var maxY = getMaxY();
  var gridItems = 10;
  var variance = Math.round(Math.round(maxY / gridItems) / 10) * 10;

  for (var i = 0; i < maxY; i += variance) {
    if (gridLines.horizontal) {
      ctx.beginPath();
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = gridLinesColor;
      ctx.moveTo(xPadding - 5, getYPixel(i));
      ctx.lineTo(width - (xPadding / lineVariance + 30), getYPixel(i));
      ctx.stroke();
    }
    ctx.fillText(i, xPadding - 10, getYPixel(i));
  }

  function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
  }

  function getMaxY() {
    var max = 0;

    for (var i = 0; i < sets.length; i++) {
      var m = getMaxOfArray(sets[i].data);
      if (m > max) {
        max = m;
      }
    }
    max += yPadding - max % 10;
    return max;
  }

  function getXPixel(val) {
    return ((width - xPadding) / config.labels.length) * val + xPadding;
  }

  function getYPixel(val) {
    return height - (((height - yPadding) / getMaxY()) * val) - yPadding;
  }

  if (animation) {
    if (animation === 'fade' && config.props.alpha === 1) {
      config.props.alpha = 0.0025;
    }
  }

  ctx.lineWidth = 0.8;
  ctx.strokeStyle = '#999';
  ctx.font = 'normal 12px Helvetica';
  ctx.fillStyle = '#5e5e5e';
  ctx.textAlign = "center";

  ctx.beginPath();
  ctx.moveTo(xPadding, yPadding / lineVariance);
  ctx.lineTo(xPadding, height - yPadding);
  ctx.lineTo(width - (xPadding / lineVariance + 30), height - yPadding);
  ctx.stroke()

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Draw Lines
  for (var i = 0; i < sets.length; i++) {
    ctx.globalAlpha = config.props.alpha;
    config.props.alpha += config.props.alpha / getRandomArbitrary(10, 50);

    var set = sets[i],
      line = getBorderStyleObject(set.line || "1px solid #000");

    ctx.beginPath();
    ctx.lineWidth = line.borderSize;
    ctx.setLineDash(line.borderStyle);
    ctx.strokeStyle = line.borderColor;
    ctx.moveTo(getXPixel(0), getYPixel(set.data[0]));

    for (var x = 1; x < set.data.length; x++) {
      ctx.lineTo(getXPixel(x), getYPixel(set.data[x]));
    }

    ctx.stroke();
    ctx.setLineDash([]);
    if (config.fill) {
      ctx.lineTo(getXPixel(set.data.length - 1), getYPixel(0));
      ctx.lineTo(xPadding, getYPixel(0));
      ctx.closePath();
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = line.borderColor;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    if (set.points) {
      for (var z = 0; z < set.data.length; z++) {
        ctx.beginPath();
        ctx.fillStyle = (set.pointsColor) ? set.pointsColor : 'rgb(75,75,75)';
        ctx.arc(getXPixel(z), getYPixel(set.data[z]), 4, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = '#FFF';
        ctx.arc(getXPixel(z), getYPixel(set.data[z]), 2, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();
      }
    }
  }

  if (animation) {
    if (config.props.alpha < 1) {
      config['frame'] = requestAnimationFrame(ChartLine.bind(this, config));
    } else {
      cancelAnimationFrame(config.frame);
    }
  }
}

Screen.prototype.chartLine = ChartLine;

Origami.chartLine = function(config) {
  queue('chartLine', config);
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

Origami.opacity = function(opacity) {
  queue('opacity', {opacity: opacity});
  return this;
}

var factory = extend(Origami.init.bind(this), Origami)

// For consistency with CommonJS environments' exports
if ( typeof module !== "undefined" && module && module.exports ){
    module.exports = factory;
}

// For CommonJS with exports, but without module.exports, like Rhino
else if ( typeof exports !== "undefined" && exports ) {
    exports.origami = factory;
}

// For browser, export only select globals
else if ( typeof window === "object" ) {
    window.origami = extend(Origami.init.bind(Origami), Origami);
}

// Get a reference to the global object
}( (function() {
    return this;
})() ));
