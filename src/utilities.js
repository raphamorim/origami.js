// Utilities.js

var hasOwn = Object.prototype.hasOwnProperty;

/**
 * Check if element exists in a Array of NodeItems
 * @private
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
 * @private
 * @param {Array} methods arguments
 * @param {Object} rules to apply
 * @returns {Object} arguments filtered
 */
function argsByRules(argsArray, rules) {
    var params = ['x', 'y', 'width', 'height'],
        args = {};

    if (rules)
        params = rules;

    for (var i = 0; i < argsArray.length; i++) {
        if (typeof(argsArray[i]) === "object")
            args["style"] = argsArray[i];
        else
        if (params.length)
            args[params.shift()] = argsArray[i];
    }

    if (!args.style) {
        args.style = {};
    }

    if (args.style.border) {
        args.style.border = args.style.border.split(' ');
        args.style.border[0] = args.style.border[0].replace(/[^0-9]/g, '');
    }

    return args;
}

/**
 * Return all documentStyles to a especified origami context
 * @private
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
 * @private
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
 * @private
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
 * Fake check to verify if image already have be loaded
 * @private
 * @param {String} image source
 * @returns {Boolean} image load status
 */
function isCached(src) {
    var image = new Image();
    image.src = src;
    return image.complete;
}