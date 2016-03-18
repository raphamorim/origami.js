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

  if (style.border) {
    style.border = style.border.split(' ');
    if (!style.borderSize)
      style.borderSize = style.border[0];
    if (!style.borderStyle)
      style.borderStyle = style.border[1];
    if (!style.borderColor)
      style.borderColor = style.border[2];
  }

  if (style.borderSize)
    style.borderSize = style.borderSize.replace(/[^0-9]/g, '');

  if (style.borderStyle) {
    if (style.borderStyle === 'solid')
      style.borderStyle = [];
    else if (style.borderStyle === 'dashed')
      style.borderStyle = [12];
    else if (style.borderStyle === 'dotted')
      style.borderStyle = [3];
  } else {
    style.borderStyle = [];
  }

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
