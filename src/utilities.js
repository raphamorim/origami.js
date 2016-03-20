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
 * Return object with structured coordinate
 * @returns {Object} structed coordinate
 */
function parseSmartCoordinates(coordinate, axis) {
  var pattern = {
        smart: new RegExp('('+axis.join('|')+')'),
        numeric: /(\-|\+){0,1}([0-9\.]+)(\%){0,1}/,
        spaces: /\s*/g
      };

  coordinate = coordinate.replace(pattern.spaces, '');
  
  if (axis.indexOf(coordinate) !== -1) {
    return {
      smart: coordinate,
      numeric: false
    };
  }

  var smart = coordinate.split(pattern.smart)
                .filter(function(i){
                  return i !== undefined && axis.indexOf(i) !== -1;
                });

  if(smart.length)
    smart = smart[0];
  else
    smart = false;

  var numeric = coordinate.split(pattern.numeric)
                  .filter(function(i){
                    return i !== undefined && i.length && i !== smart;
                  });
  
  var numericLen = numeric.length;

  if (numericLen) {
    if (numericLen === 2) {
      if(!parseInt(numeric[0]))
        numeric = [numeric[0], numeric[1], 'px'];
      else if(!parseInt(numeric[1]))
        numeric = ['+', numeric[0], numeric[1]];
    } else if(numericLen === 3 && parseInt(numeric[0])) {
      numeric = ['+', numeric[0], numeric[1]];
    }
    
    numeric = {
      value: parseInt(numeric[0] + numeric[1], 10),
      isPercent: numeric[2] !== undefined && numeric[2] === '%'
    };
  } else {
    numeric = false;
  }
  
  return {
    smart: smart,
    numeric: numeric
  };
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

  var px = parseSmartCoordinates(x, axis.x),
      py = parseSmartCoordinates(y, axis.y);

  x = 0;
  y = 0;

  if (px.smart || px.numeric) {
    if (px.numeric) {
      if (px.numeric.isPercent) 
        x = (elmWidth * px.numeric.value) / 100;
      else 
        x = px.numeric.value;
    }

    if (px.smart) {
      px = px.smart;
      if (px === 'right')
        x += Math.floor(elmWidth - width);
      else if (px === 'center')
        if (radius)
          x += Math.floor(elmWidth / 2);
        else
          x += Math.floor((elmWidth / 2) - (width / 2));
      else if (px === 'left')
        x += radius;
    }
  }

  if (py.smart || py.numeric) {
    if (py.numeric) {
      if (py.numeric.isPercent)
        y = (elmHeight * py.numeric.value) / 100;
      else
        y = py.numeric.value;
    }

    if (py.smart) {
      py = py.smart;
      if (py === 'top')
        y += radius;
      else if (py === 'center')
        if (radius)
          y += Math.floor(elmHeight / 2);
        else
          y += Math.floor((elmHeight / 2) - (height / 2));
      else if (py === 'bottom')
        y += Math.floor(elmHeight - height);
    }
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
