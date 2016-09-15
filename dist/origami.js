/*!
 * Origami.js 0.4.7
 * https://origamijs.com/
 *
 * Copyright Raphael Amorim 2016
 * Released under the GPL-4.0 license
 *
 * Date: 2016-09-14T23:58Z
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
var STYLES, CanvasGradient, CanvasPattern, namedEntities;

//helper function to format a string
function format(str, args) {
    var keys = Object.keys(args),
        i;
    for (i = 0; i < keys.length; i++) {
        str = str.replace(new RegExp("\\{" + keys[i] + "\\}", "gi"), args[keys[i]]);
    }
    return str;
}

//helper function that generates a random string
function randomString(holder) {
    var chars, randomstring, i;
    if (!holder) {
        throw new Error("cannot create a random attribute name for an undefined object");
    }
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    randomstring = "";
    do {
        randomstring = "";
        for (i = 0; i < 12; i++) {
            randomstring += chars[Math.floor(Math.random() * chars.length)];
        }
    } while (holder[randomstring]);
    return randomstring;
}

//helper function to map named to numbered entities
function createNamedToNumberedLookup(items, radix) {
    var i, entity, lookup = {},
        base10, base16;
    items = items.split(',');
    radix = radix || 10;
    // Map from named to numbered entities.
    for (i = 0; i < items.length; i += 2) {
        entity = '&' + items[i + 1] + ';';
        base10 = parseInt(items[i], radix);
        lookup[entity] = '&#' + base10 + ';';
    }
    //FF and IE need to create a regex from hex values ie &nbsp; == \xa0
    lookup["\\xa0"] = '&#160;';
    return lookup;
}

//helper function to map canvas-textAlign to svg-textAnchor
function getTextAnchor(textAlign) {
    //TODO: support rtl languages
    var mapping = {
        "left": "start",
        "right": "end",
        "center": "middle",
        "start": "start",
        "end": "end"
    };
    return mapping[textAlign] || mapping.start;
}

//helper function to map canvas-textBaseline to svg-dominantBaseline
function getDominantBaseline(textBaseline) {
    //INFO: not supported in all browsers
    var mapping = {
        "alphabetic": "alphabetic",
        "hanging": "hanging",
        "top": "text-before-edge",
        "bottom": "text-after-edge",
        "middle": "central"
    };
    return mapping[textBaseline] || mapping.alphabetic;
}

// Unpack entities lookup where the numbers are in radix 32 to reduce the size
// entity mapping courtesy of tinymce
namedEntities = createNamedToNumberedLookup(
    '50,nbsp,51,iexcl,52,cent,53,pound,54,curren,55,yen,56,brvbar,57,sect,58,uml,59,copy,' +
    '5a,ordf,5b,laquo,5c,not,5d,shy,5e,reg,5f,macr,5g,deg,5h,plusmn,5i,sup2,5j,sup3,5k,acute,' +
    '5l,micro,5m,para,5n,middot,5o,cedil,5p,sup1,5q,ordm,5r,raquo,5s,frac14,5t,frac12,5u,frac34,' +
    '5v,iquest,60,Agrave,61,Aacute,62,Acirc,63,Atilde,64,Auml,65,Aring,66,AElig,67,Ccedil,' +
    '68,Egrave,69,Eacute,6a,Ecirc,6b,Euml,6c,Igrave,6d,Iacute,6e,Icirc,6f,Iuml,6g,ETH,6h,Ntilde,' +
    '6i,Ograve,6j,Oacute,6k,Ocirc,6l,Otilde,6m,Ouml,6n,times,6o,Oslash,6p,Ugrave,6q,Uacute,' +
    '6r,Ucirc,6s,Uuml,6t,Yacute,6u,THORN,6v,szlig,70,agrave,71,aacute,72,acirc,73,atilde,74,auml,' +
    '75,aring,76,aelig,77,ccedil,78,egrave,79,eacute,7a,ecirc,7b,euml,7c,igrave,7d,iacute,7e,icirc,' +
    '7f,iuml,7g,eth,7h,ntilde,7i,ograve,7j,oacute,7k,ocirc,7l,otilde,7m,ouml,7n,divide,7o,oslash,' +
    '7p,ugrave,7q,uacute,7r,ucirc,7s,uuml,7t,yacute,7u,thorn,7v,yuml,ci,fnof,sh,Alpha,si,Beta,' +
    'sj,Gamma,sk,Delta,sl,Epsilon,sm,Zeta,sn,Eta,so,Theta,sp,Iota,sq,Kappa,sr,Lambda,ss,Mu,' +
    'st,Nu,su,Xi,sv,Omicron,t0,Pi,t1,Rho,t3,Sigma,t4,Tau,t5,Upsilon,t6,Phi,t7,Chi,t8,Psi,' +
    't9,Omega,th,alpha,ti,beta,tj,gamma,tk,delta,tl,epsilon,tm,zeta,tn,eta,to,theta,tp,iota,' +
    'tq,kappa,tr,lambda,ts,mu,tt,nu,tu,xi,tv,omicron,u0,pi,u1,rho,u2,sigmaf,u3,sigma,u4,tau,' +
    'u5,upsilon,u6,phi,u7,chi,u8,psi,u9,omega,uh,thetasym,ui,upsih,um,piv,812,bull,816,hellip,' +
    '81i,prime,81j,Prime,81u,oline,824,frasl,88o,weierp,88h,image,88s,real,892,trade,89l,alefsym,' +
    '8cg,larr,8ch,uarr,8ci,rarr,8cj,darr,8ck,harr,8dl,crarr,8eg,lArr,8eh,uArr,8ei,rArr,8ej,dArr,' +
    '8ek,hArr,8g0,forall,8g2,part,8g3,exist,8g5,empty,8g7,nabla,8g8,isin,8g9,notin,8gb,ni,8gf,prod,' +
    '8gh,sum,8gi,minus,8gn,lowast,8gq,radic,8gt,prop,8gu,infin,8h0,ang,8h7,and,8h8,or,8h9,cap,8ha,cup,' +
    '8hb,int,8hk,there4,8hs,sim,8i5,cong,8i8,asymp,8j0,ne,8j1,equiv,8j4,le,8j5,ge,8k2,sub,8k3,sup,8k4,' +
    'nsub,8k6,sube,8k7,supe,8kl,oplus,8kn,otimes,8l5,perp,8m5,sdot,8o8,lceil,8o9,rceil,8oa,lfloor,8ob,' +
    'rfloor,8p9,lang,8pa,rang,9ea,loz,9j0,spades,9j3,clubs,9j5,hearts,9j6,diams,ai,OElig,aj,oelig,b0,' +
    'Scaron,b1,scaron,bo,Yuml,m6,circ,ms,tilde,802,ensp,803,emsp,809,thinsp,80c,zwnj,80d,zwj,80e,lrm,' +
    '80f,rlm,80j,ndash,80k,mdash,80o,lsquo,80p,rsquo,80q,sbquo,80s,ldquo,80t,rdquo,80u,bdquo,810,dagger,' +
    '811,Dagger,81g,permil,81p,lsaquo,81q,rsaquo,85c,euro', 32);


//Some basic mappings for attributes and default values.
STYLES = {
    "strokeStyle": {
        svgAttr: "stroke", //corresponding svg attribute
        canvas: "#000000", //canvas default
        svg: "none", //svg default
        apply: "stroke" //apply on stroke() or fill()
    },
    "fillStyle": {
        svgAttr: "fill",
        canvas: "#000000",
        svg: null, //svg default is black, but we need to special case this to handle canvas stroke without fill
        apply: "fill"
    },
    "lineCap": {
        svgAttr: "stroke-linecap",
        canvas: "butt",
        svg: "butt",
        apply: "stroke"
    },
    "lineJoin": {
        svgAttr: "stroke-linejoin",
        canvas: "miter",
        svg: "miter",
        apply: "stroke"
    },
    "miterLimit": {
        svgAttr: "stroke-miterlimit",
        canvas: 10,
        svg: 4,
        apply: "stroke"
    },
    "lineWidth": {
        svgAttr: "stroke-width",
        canvas: 1,
        svg: 1,
        apply: "stroke"
    },
    "globalAlpha": {
        svgAttr: "opacity",
        canvas: 1,
        svg: 1,
        apply: "fill stroke"
    },
    "font": {
        //font converts to multiple svg attributes, there is custom logic for this
        canvas: "10px sans-serif"
    },
    "shadowColor": {
        canvas: "#000000"
    },
    "shadowOffsetX": {
        canvas: 0
    },
    "shadowOffsetY": {
        canvas: 0
    },
    "shadowBlur": {
        canvas: 0
    },
    "textAlign": {
        canvas: "start"
    },
    "textBaseline": {
        canvas: "alphabetic"
    },
    "lineDash": {
        svgAttr: "stroke-dasharray",
        canvas: [],
        svg: null,
        apply: "stroke"
    }
};

/**
 *
 * @param gradientNode - reference to the gradient
 * @constructor
 */
CanvasGradient = function(gradientNode, ctx) {
    this.__root = gradientNode;
    this.__ctx = ctx;
};

/**
 * Adds a color stop to the gradient root
 */
CanvasGradient.prototype.addColorStop = function(offset, color) {
    var stop = this.__ctx.__createElement("stop"),
        regex, matches;
    stop.setAttribute("offset", offset);
    if (color.indexOf("rgba") !== -1) {
        //separate alpha value, since webkit can't handle it
        regex = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d?\.?\d*)\s*\)/gi;
        matches = regex.exec(color);
        stop.setAttribute("stop-color", format("rgb({r},{g},{b})", {
            r: matches[1],
            g: matches[2],
            b: matches[3]
        }));
        stop.setAttribute("stop-opacity", matches[4]);
    } else {
        stop.setAttribute("stop-color", color);
    }
    this.__root.appendChild(stop);
};

CanvasPattern = function(pattern, ctx) {
    this.__root = pattern;
    this.__ctx = ctx;
};

/**
 * The mock canvas context
 * @param o - options include:
 * width - width of your canvas (defaults to 500)
 * height - height of your canvas (defaults to 500)
 * enableMirroring - enables canvas mirroring (get image data) (defaults to false)
 * document - the document object (defaults to the current document)
 */
function SVG(o) {

    var defaultOptions = {
            width: 500,
            height: 500,
            enableMirroring: false
        },
        options;

    //keep support for this way of calling C2S: new C2S(width,height)
    if (arguments.length > 1) {
        options = defaultOptions;
        options.width = arguments[0];
        options.height = arguments[1];
    } else if (!o) {
        options = defaultOptions;
    } else {
        options = o;
    }

    if (!(this instanceof SVG)) {
        //did someone call this without new?
        return new SVG(options);
    }

    //setup options
    this.width = options.width || defaultOptions.width;
    this.height = options.height || defaultOptions.height;
    this.enableMirroring = options.enableMirroring !== undefined ? options.enableMirroring : defaultOptions.enableMirroring;

    this.canvas = this; ///point back to this instance!
    this.__document = options.document || document;
    this.__canvas = this.__document.createElement("canvas");
    this.__ctx = this.__canvas.getContext("2d");

    this.__setDefaultStyles();
    this.__stack = [this.__getStyleState()];
    this.__groupStack = [];

    //the root svg element
    this.__root = this.__document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.__root.setAttribute("version", 1.1);
    this.__root.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    this.__root.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    this.__root.setAttribute("width", this.width);
    this.__root.setAttribute("height", this.height);

    //make sure we don't generate the same ids in defs
    this.__ids = {};

    //defs tag
    this.__defs = this.__document.createElementNS("http://www.w3.org/2000/svg", "defs");
    this.__root.appendChild(this.__defs);

    //also add a group child. the svg element can't use the transform attribute
    this.__currentElement = this.__document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.__root.appendChild(this.__currentElement);
};


/**
 * Creates the specified svg element
 * @private
 */
SVG.prototype.__createElement = function(elementName, properties, resetFill) {
    if (typeof properties === "undefined") {
        properties = {};
    }

    var element = this.__document.createElementNS("http://www.w3.org/2000/svg", elementName),
        keys = Object.keys(properties),
        i, key;
    if (resetFill) {
        //if fill or stroke is not specified, the svg element should not display. By default SVG's fill is black.
        element.setAttribute("fill", "none");
        element.setAttribute("stroke", "none");
    }
    for (i = 0; i < keys.length; i++) {
        key = keys[i];
        element.setAttribute(key, properties[key]);
    }
    return element;
};

/**
 * Applies default canvas styles to the context
 * @private
 */
SVG.prototype.__setDefaultStyles = function() {
    //default 2d canvas context properties see:http://www.w3.org/TR/2dcontext/
    var keys = Object.keys(STYLES),
        i, key;
    for (i = 0; i < keys.length; i++) {
        key = keys[i];
        this[key] = STYLES[key].canvas;
    }
};

/**
 * Applies styles on restore
 * @param styleState
 * @private
 */
SVG.prototype.__applyStyleState = function(styleState) {
    var keys = Object.keys(styleState),
        i, key;
    for (i = 0; i < keys.length; i++) {
        key = keys[i];
        this[key] = styleState[key];
    }
};

/**
 * Gets the current style state
 * @return {Object}
 * @private
 */
SVG.prototype.__getStyleState = function() {
    var i, styleState = {},
        keys = Object.keys(STYLES),
        key;
    for (i = 0; i < keys.length; i++) {
        key = keys[i];
        styleState[key] = this[key];
    }
    return styleState;
};

/**
 * Apples the current styles to the current SVG element. On "ctx.fill" or "ctx.stroke"
 * @param type
 * @private
 */
SVG.prototype.__applyStyleToCurrentElement = function(type) {
    var keys = Object.keys(STYLES),
        i, style, value, id, regex, matches;
    for (i = 0; i < keys.length; i++) {
        style = STYLES[keys[i]];
        value = this[keys[i]];
        if (style.apply) {
            //is this a gradient or pattern?
            if (style.apply.indexOf("fill") !== -1 && value instanceof CanvasPattern) {
                //pattern
                if (value.__ctx) {
                    //copy over defs
                    while (value.__ctx.__defs.childNodes.length) {
                        id = value.__ctx.__defs.childNodes[0].getAttribute("id");
                        this.__ids[id] = id;
                        this.__defs.appendChild(value.__ctx.__defs.childNodes[0]);
                    }
                }
                this.__currentElement.setAttribute("fill", format("url(#{id})", {
                    id: value.__root.getAttribute("id")
                }));
            } else if (style.apply.indexOf("fill") !== -1 && value instanceof CanvasGradient) {
                //gradient
                this.__currentElement.setAttribute("fill", format("url(#{id})", {
                    id: value.__root.getAttribute("id")
                }));
            } else if (style.apply.indexOf(type) !== -1 && style.svg !== value) {
                if ((style.svgAttr === "stroke" || style.svgAttr === "fill") && value.indexOf("rgba") !== -1) {
                    //separate alpha value, since illustrator can't handle it
                    regex = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d?\.?\d*)\s*\)/gi;
                    matches = regex.exec(value);
                    this.__currentElement.setAttribute(style.svgAttr, format("rgb({r},{g},{b})", {
                        r: matches[1],
                        g: matches[2],
                        b: matches[3]
                    }));
                    //should take globalAlpha here
                    var opacity = matches[4];
                    var globalAlpha = this.globalAlpha;
                    if (globalAlpha != null) {
                        opacity *= globalAlpha;
                    }
                    this.__currentElement.setAttribute(style.svgAttr + "-opacity", opacity);
                } else {
                    var attr = style.svgAttr;
                    if (keys[i] === 'globalAlpha') {
                        attr = type + '-' + style.svgAttr;
                        if (this.__currentElement.getAttribute(attr)) {
                            //fill-opacity or stroke-opacity has already been set by stroke or fill.
                            continue;
                        }
                    }
                    //otherwise only update attribute if right type, and not svg default
                    this.__currentElement.setAttribute(attr, value);


                }
            }
        }
    }

};

/**
 * Will return the closest group or svg node. May return the current element.
 * @private
 */
SVG.prototype.__closestGroupOrSvg = function(node) {
    node = node || this.__currentElement;
    if (node.nodeName === "g" || node.nodeName === "svg") {
        return node;
    } else {
        return this.__closestGroupOrSvg(node.parentNode);
    }
};

/**
 * Returns the serialized value of the svg so far
 * @param fixNamedEntities - Standalone SVG doesn't support named entities, which document.createTextNode encodes.
 *                           If true, we attempt to find all named entities and encode it as a numeric entity.
 * @return serialized svg
 */
SVG.prototype.getSerializedSvg = function(fixNamedEntities) {
    var serialized = new XMLSerializer().serializeToString(this.__root),
        keys, i, key, value, regexp, xmlns;

    //IE search for a duplicate xmnls because they didn't implement setAttributeNS correctly
    xmlns = /xmlns="http:\/\/www\.w3\.org\/2000\/svg".+xmlns="http:\/\/www\.w3\.org\/2000\/svg/gi;
    if (xmlns.test(serialized)) {
        serialized = serialized.replace('xmlns="http://www.w3.org/2000/svg', 'xmlns:xlink="http://www.w3.org/1999/xlink');
    }

    if (fixNamedEntities) {
        keys = Object.keys(namedEntities);
        //loop over each named entity and replace with the proper equivalent.
        for (i = 0; i < keys.length; i++) {
            key = keys[i];
            value = namedEntities[key];
            regexp = new RegExp(key, "gi");
            if (regexp.test(serialized)) {
                serialized = serialized.replace(regexp, value);
            }
        }
    }

    return serialized;
};


/**
 * Returns the root svg
 * @return
 */
SVG.prototype.getSvg = function() {
    return this.__root;
};
/**
 * Will generate a group tag.
 */
SVG.prototype.save = function() {
    var group = this.__createElement("g"),
        parent = this.__closestGroupOrSvg();
    this.__groupStack.push(parent);
    parent.appendChild(group);
    this.__currentElement = group;
    this.__stack.push(this.__getStyleState());
};
/**
 * Sets current element to parent, or just root if already root
 */
SVG.prototype.restore = function() {
    this.__currentElement = this.__groupStack.pop();
    //Clearing canvas will make the poped group invalid, currentElement is set to the root group node.
    if (!this.__currentElement) {
        this.__currentElement = this.__root.childNodes[1];
    }
    var state = this.__stack.pop();
    this.__applyStyleState(state);

};

/**
 * Helper method to add transform
 * @private
 */
SVG.prototype.__addTransform = function(t) {

    //if the current element has siblings, add another group
    var parent = this.__closestGroupOrSvg();
    if (parent.childNodes.length > 0) {
        var group = this.__createElement("g");
        parent.appendChild(group);
        this.__currentElement = group;
    }

    var transform = this.__currentElement.getAttribute("transform");
    if (transform) {
        transform += " ";
    } else {
        transform = "";
    }
    transform += t;
    this.__currentElement.setAttribute("transform", transform);
};

/**
 *  scales the current element
 */
SVG.prototype.scale = function(x, y) {
    if (y === undefined) {
        y = x;
    }
    this.__addTransform(format("scale({x},{y})", {
        x: x,
        y: y
    }));
};

/**
 * rotates the current element
 */
SVG.prototype.rotate = function(angle) {
    var degrees = (angle * 180 / Math.PI);
    this.__addTransform(format("rotate({angle},{cx},{cy})", {
        angle: degrees,
        cx: 0,
        cy: 0
    }));
};

/**
 * translates the current element
 */
SVG.prototype.translate = function(x, y) {
    this.__addTransform(format("translate({x},{y})", {
        x: x,
        y: y
    }));
};

/**
 * applies a transform to the current element
 */
SVG.prototype.transform = function(a, b, c, d, e, f) {
    this.__addTransform(format("matrix({a},{b},{c},{d},{e},{f})", {
        a: a,
        b: b,
        c: c,
        d: d,
        e: e,
        f: f
    }));
};

/**
 * Create a new Path Element
 */
SVG.prototype.beginPath = function() {
    var path, parent;

    // Note that there is only one current default path, it is not part of the drawing state.
    // See also: https://html.spec.whatwg.org/multipage/scripting.html#current-default-path
    this.__currentDefaultPath = "";
    this.__currentPosition = {};

    path = this.__createElement("path", {}, true);
    parent = this.__closestGroupOrSvg();
    parent.appendChild(path);
    this.__currentElement = path;
};

/**
 * Helper function to apply currentDefaultPath to current path element
 * @private
 */
SVG.prototype.__applyCurrentDefaultPath = function() {
    if (this.__currentElement.nodeName === "path") {
        var d = this.__currentDefaultPath;
        this.__currentElement.setAttribute("d", d);
    } else {
        throw new Error("Attempted to apply path command to node " + this.__currentElement.nodeName);
    }
};

/**
 * Helper function to add path command
 * @private
 */
SVG.prototype.__addPathCommand = function(command) {
    this.__currentDefaultPath += " ";
    this.__currentDefaultPath += command;
};

/**
 * Adds the move command to the current path element,
 * if the currentPathElement is not empty create a new path element
 */
SVG.prototype.moveTo = function(x, y) {
    if (this.__currentElement.nodeName !== "path") {
        this.beginPath();
    }

    // creates a new subpath with the given point
    this.__currentPosition = {
        x: x,
        y: y
    };
    this.__addPathCommand(format("M {x} {y}", {
        x: x,
        y: y
    }));
};

/**
 * Closes the current path
 */
SVG.prototype.closePath = function() {
    this.__addPathCommand("Z");
};

/**
 * Adds a line to command
 */
SVG.prototype.lineTo = function(x, y) {
    this.__currentPosition = {
        x: x,
        y: y
    };
    if (this.__currentDefaultPath.indexOf('M') > -1) {
        this.__addPathCommand(format("L {x} {y}", {
            x: x,
            y: y
        }));
    } else {
        this.__addPathCommand(format("M {x} {y}", {
            x: x,
            y: y
        }));
    }
};

/**
 * Add a bezier command
 */
SVG.prototype.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
    this.__currentPosition = {
        x: x,
        y: y
    };
    this.__addPathCommand(format("C {cp1x} {cp1y} {cp2x} {cp2y} {x} {y}", {
        cp1x: cp1x,
        cp1y: cp1y,
        cp2x: cp2x,
        cp2y: cp2y,
        x: x,
        y: y
    }));
};

/**
 * Adds a quadratic curve to command
 */
SVG.prototype.quadraticCurveTo = function(cpx, cpy, x, y) {
    this.__currentPosition = {
        x: x,
        y: y
    };
    this.__addPathCommand(format("Q {cpx} {cpy} {x} {y}", {
        cpx: cpx,
        cpy: cpy,
        x: x,
        y: y
    }));
};


/**
 * Return a new normalized vector of given vector
 */
var normalize = function(vector) {
    var len = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
    return [vector[0] / len, vector[1] / len];
};

/**
 * Adds the arcTo to the current path
 *
 * @see http://www.w3.org/TR/2015/WD-2dcontext-20150514/#dom-context-2d-arcto
 */
SVG.prototype.arcTo = function(x1, y1, x2, y2, radius) {
    // Let the point (x0, y0) be the last point in the subpath.
    var x0 = this.__currentPosition && this.__currentPosition.x;
    var y0 = this.__currentPosition && this.__currentPosition.y;

    // First ensure there is a subpath for (x1, y1).
    if (typeof x0 == "undefined" || typeof y0 == "undefined") {
        return;
    }

    // Negative values for radius must cause the implementation to throw an IndexSizeError exception.
    if (radius < 0) {
        throw new Error("IndexSizeError: The radius provided (" + radius + ") is negative.");
    }

    // If the point (x0, y0) is equal to the point (x1, y1),
    // or if the point (x1, y1) is equal to the point (x2, y2),
    // or if the radius radius is zero,
    // then the method must add the point (x1, y1) to the subpath,
    // and connect that point to the previous point (x0, y0) by a straight line.
    if (((x0 === x1) && (y0 === y1)) || ((x1 === x2) && (y1 === y2)) || (radius === 0)) {
        this.lineTo(x1, y1);
        return;
    }

    // Otherwise, if the points (x0, y0), (x1, y1), and (x2, y2) all lie on a single straight line,
    // then the method must add the point (x1, y1) to the subpath,
    // and connect that point to the previous point (x0, y0) by a straight line.
    var unit_vec_p1_p0 = normalize([x0 - x1, y0 - y1]);
    var unit_vec_p1_p2 = normalize([x2 - x1, y2 - y1]);
    if (unit_vec_p1_p0[0] * unit_vec_p1_p2[1] === unit_vec_p1_p0[1] * unit_vec_p1_p2[0]) {
        this.lineTo(x1, y1);
        return;
    }

    // Otherwise, let The Arc be the shortest arc given by circumference of the circle that has radius radius,
    // and that has one point tangent to the half-infinite line that crosses the point (x0, y0) and ends at the point (x1, y1),
    // and that has a different point tangent to the half-infinite line that ends at the point (x1, y1), and crosses the point (x2, y2).
    // The points at which this circle touches these two lines are called the start and end tangent points respectively.

    // note that both vectors are unit vectors, so the length is 1
    var cos = (unit_vec_p1_p0[0] * unit_vec_p1_p2[0] + unit_vec_p1_p0[1] * unit_vec_p1_p2[1]);
    var theta = Math.acos(Math.abs(cos));

    // Calculate origin
    var unit_vec_p1_origin = normalize([
        unit_vec_p1_p0[0] + unit_vec_p1_p2[0],
        unit_vec_p1_p0[1] + unit_vec_p1_p2[1]
    ]);
    var len_p1_origin = radius / Math.sin(theta / 2);
    var x = x1 + len_p1_origin * unit_vec_p1_origin[0];
    var y = y1 + len_p1_origin * unit_vec_p1_origin[1];

    // Calculate start angle and end angle
    // rotate 90deg clockwise (note that y axis points to its down)
    var unit_vec_origin_start_tangent = [-unit_vec_p1_p0[1],
        unit_vec_p1_p0[0]
    ];
    // rotate 90deg counter clockwise (note that y axis points to its down)
    var unit_vec_origin_end_tangent = [
        unit_vec_p1_p2[1], -unit_vec_p1_p2[0]
    ];
    var getAngle = function(vector) {
        // get angle (clockwise) between vector and (1, 0)
        var x = vector[0];
        var y = vector[1];
        if (y >= 0) { // note that y axis points to its down
            return Math.acos(x);
        } else {
            return -Math.acos(x);
        }
    };
    var startAngle = getAngle(unit_vec_origin_start_tangent);
    var endAngle = getAngle(unit_vec_origin_end_tangent);

    // Connect the point (x0, y0) to the start tangent point by a straight line
    this.lineTo(x + unit_vec_origin_start_tangent[0] * radius,
        y + unit_vec_origin_start_tangent[1] * radius);

    // Connect the start tangent point to the end tangent point by arc
    // and adding the end tangent point to the subpath.
    this.arc(x, y, radius, startAngle, endAngle);
};

/**
 * Sets the stroke property on the current element
 */
SVG.prototype.stroke = function() {
    if (this.__currentElement.nodeName === "path") {
        this.__currentElement.setAttribute("paint-order", "fill stroke markers");
    }
    this.__applyCurrentDefaultPath();
    this.__applyStyleToCurrentElement("stroke");
};

/**
 * Sets fill properties on the current element
 */
SVG.prototype.fill = function() {
    if (this.__currentElement.nodeName === "path") {
        this.__currentElement.setAttribute("paint-order", "stroke fill markers");
    }
    this.__applyCurrentDefaultPath();
    this.__applyStyleToCurrentElement("fill");
};

/**
 *  Adds a rectangle to the path.
 */
SVG.prototype.rect = function(x, y, width, height) {
    if (this.__currentElement.nodeName !== "path") {
        this.beginPath();
    }
    this.moveTo(x, y);
    this.lineTo(x + width, y);
    this.lineTo(x + width, y + height);
    this.lineTo(x, y + height);
    this.lineTo(x, y);
    this.closePath();
};


/**
 * adds a rectangle element
 */
SVG.prototype.fillRect = function(x, y, width, height) {
    var rect, parent;
    rect = this.__createElement("rect", {
        x: x,
        y: y,
        width: width,
        height: height
    }, true);
    parent = this.__closestGroupOrSvg();
    parent.appendChild(rect);
    this.__currentElement = rect;
    this.__applyStyleToCurrentElement("fill");
};

/**
 * Draws a rectangle with no fill
 * @param x
 * @param y
 * @param width
 * @param height
 */
SVG.prototype.strokeRect = function(x, y, width, height) {
    var rect, parent;
    rect = this.__createElement("rect", {
        x: x,
        y: y,
        width: width,
        height: height
    }, true);
    parent = this.__closestGroupOrSvg();
    parent.appendChild(rect);
    this.__currentElement = rect;
    this.__applyStyleToCurrentElement("stroke");
};


/**
 * Clear entire canvas:
 * 1. save current transforms
 * 2. remove all the childNodes of the root g element
 */
SVG.prototype.__clearCanvas = function() {
    var current = this.__closestGroupOrSvg(),
        transform = current.getAttribute("transform");
    var rootGroup = this.__root.childNodes[1];
    var childNodes = rootGroup.childNodes;
    for (var i = childNodes.length - 1; i >= 0; i--) {
        if (childNodes[i]) {
            rootGroup.removeChild(childNodes[i]);
        }
    }
    this.__currentElement = rootGroup;
    //reset __groupStack as all the child group nodes are all removed.
    this.__groupStack = [];
    if (transform) {
        this.__addTransform(transform);
    }
};

/**
 * "Clears" a canvas by just drawing a white rectangle in the current group.
 */
SVG.prototype.clearRect = function(x, y, width, height) {
    //clear entire canvas
    if (x === 0 && y === 0 && width === this.width && height === this.height) {
        this.__clearCanvas();
        return;
    }
    var rect, parent = this.__closestGroupOrSvg();
    rect = this.__createElement("rect", {
        x: x,
        y: y,
        width: width,
        height: height,
        fill: "#FFFFFF"
    }, true);
    parent.appendChild(rect);
};

/**
 * Adds a linear gradient to a defs tag.
 * Returns a canvas gradient object that has a reference to it's parent def
 */
SVG.prototype.createLinearGradient = function(x1, y1, x2, y2) {
    var grad = this.__createElement("linearGradient", {
        id: randomString(this.__ids),
        x1: x1 + "px",
        x2: x2 + "px",
        y1: y1 + "px",
        y2: y2 + "px",
        "gradientUnits": "userSpaceOnUse"
    }, false);
    this.__defs.appendChild(grad);
    return new CanvasGradient(grad, this);
};

/**
 * Adds a radial gradient to a defs tag.
 * Returns a canvas gradient object that has a reference to it's parent def
 */
SVG.prototype.createRadialGradient = function(x0, y0, r0, x1, y1, r1) {
    var grad = this.__createElement("radialGradient", {
        id: randomString(this.__ids),
        cx: x1 + "px",
        cy: y1 + "px",
        r: r1 + "px",
        fx: x0 + "px",
        fy: y0 + "px",
        "gradientUnits": "userSpaceOnUse"
    }, false);
    this.__defs.appendChild(grad);
    return new CanvasGradient(grad, this);

};

/**
 * Parses the font string and returns svg mapping
 * @private
 */
SVG.prototype.__parseFont = function() {
    var regex = /^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-,\'\"\sa-z]+?)\s*$/i;
    var fontPart = regex.exec(this.font);
    var data = {
        style: fontPart[1] || 'normal',
        size: fontPart[4] || '10px',
        family: fontPart[6] || 'sans-serif',
        weight: fontPart[3] || 'normal',
        decoration: fontPart[2] || 'normal',
        href: null
    };

    //canvas doesn't support underline natively, but we can pass this attribute
    if (this.__fontUnderline === "underline") {
        data.decoration = "underline";
    }

    //canvas also doesn't support linking, but we can pass this as well
    if (this.__fontHref) {
        data.href = this.__fontHref;
    }

    return data;
};

/**
 * Helper to link text fragments
 * @param font
 * @param element
 * @return {*}
 * @private
 */
SVG.prototype.__wrapTextLink = function(font, element) {
    if (font.href) {
        var a = this.__createElement("a");
        a.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", font.href);
        a.appendChild(element);
        return a;
    }
    return element;
};

/**
 * Fills or strokes text
 * @param text
 * @param x
 * @param y
 * @param action - stroke or fill
 * @private
 */
SVG.prototype.__applyText = function(text, x, y, action) {
    var font = this.__parseFont(),
        parent = this.__closestGroupOrSvg(),
        textElement = this.__createElement("text", {
            "font-family": font.family,
            "font-size": font.size,
            "font-style": font.style,
            "font-weight": font.weight,
            "text-decoration": font.decoration,
            "x": x,
            "y": y,
            "text-anchor": getTextAnchor(this.textAlign),
            "dominant-baseline": getDominantBaseline(this.textBaseline)
        }, true);

    textElement.appendChild(this.__document.createTextNode(text));
    this.__currentElement = textElement;
    this.__applyStyleToCurrentElement(action);
    parent.appendChild(this.__wrapTextLink(font, textElement));
};

/**
 * Creates a text element
 * @param text
 * @param x
 * @param y
 */
SVG.prototype.fillText = function(text, x, y) {
    this.__applyText(text, x, y, "fill");
};

/**
 * Strokes text
 * @param text
 * @param x
 * @param y
 */
SVG.prototype.strokeText = function(text, x, y) {
    this.__applyText(text, x, y, "stroke");
};

/**
 * No need to implement this for svg.
 * @param text
 * @return {TextMetrics}
 */
SVG.prototype.measureText = function(text) {
    this.__ctx.font = this.font;
    return this.__ctx.measureText(text);
};

/**
 *  Arc command!
 */
SVG.prototype.arc = function(x, y, radius, startAngle, endAngle, counterClockwise) {
    // in canvas no circle is drawn if no angle is provided.
    if (startAngle === endAngle) {
        return;
    }
    startAngle = startAngle % (2 * Math.PI);
    endAngle = endAngle % (2 * Math.PI);
    if (startAngle === endAngle) {
        //circle time! subtract some of the angle so svg is happy (svg elliptical arc can't draw a full circle)
        endAngle = ((endAngle + (2 * Math.PI)) - 0.001 * (counterClockwise ? -1 : 1)) % (2 * Math.PI);
    }
    var endX = x + radius * Math.cos(endAngle),
        endY = y + radius * Math.sin(endAngle),
        startX = x + radius * Math.cos(startAngle),
        startY = y + radius * Math.sin(startAngle),
        sweepFlag = counterClockwise ? 0 : 1,
        largeArcFlag = 0,
        diff = endAngle - startAngle;

    // https://github.com/gliffy/canvas2svg/issues/4
    if (diff < 0) {
        diff += 2 * Math.PI;
    }

    if (counterClockwise) {
        largeArcFlag = diff > Math.PI ? 0 : 1;
    } else {
        largeArcFlag = diff > Math.PI ? 1 : 0;
    }

    this.lineTo(startX, startY);
    this.__addPathCommand(format("A {rx} {ry} {xAxisRotation} {largeArcFlag} {sweepFlag} {endX} {endY}", {
        rx: radius,
        ry: radius,
        xAxisRotation: 0,
        largeArcFlag: largeArcFlag,
        sweepFlag: sweepFlag,
        endX: endX,
        endY: endY
    }));

    this.__currentPosition = {
        x: endX,
        y: endY
    };
};

/**
 * Generates a ClipPath from the clip command.
 */
SVG.prototype.clip = function() {
    var group = this.__closestGroupOrSvg(),
        clipPath = this.__createElement("clipPath"),
        id = randomString(this.__ids),
        newGroup = this.__createElement("g");

    this.__applyCurrentDefaultPath();
    group.removeChild(this.__currentElement);
    clipPath.setAttribute("id", id);
    clipPath.appendChild(this.__currentElement);

    this.__defs.appendChild(clipPath);

    //set the clip path to this group
    group.setAttribute("clip-path", format("url(#{id})", {
        id: id
    }));

    //clip paths can be scaled and transformed, we need to add another wrapper group to avoid later transformations
    // to this path
    group.appendChild(newGroup);

    this.__currentElement = newGroup;

};

/**
 * Draws a canvas, image or mock context to this canvas.
 * Note that all svg dom manipulation uses node.childNodes rather than node.children for IE support.
 * http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-drawimage
 */
SVG.prototype.drawImage = function() {
    //convert arguments to a real array
    var args = Array.prototype.slice.call(arguments),
        image = args[0],
        dx, dy, dw, dh, sx = 0,
        sy = 0,
        sw, sh, parent, svg, defs, group,
        currentElement, svgImage, canvas, context, id;

    if (args.length === 3) {
        dx = args[1];
        dy = args[2];
        sw = image.width;
        sh = image.height;
        dw = sw;
        dh = sh;
    } else if (args.length === 5) {
        dx = args[1];
        dy = args[2];
        dw = args[3];
        dh = args[4];
        sw = image.width;
        sh = image.height;
    } else if (args.length === 9) {
        sx = args[1];
        sy = args[2];
        sw = args[3];
        sh = args[4];
        dx = args[5];
        dy = args[6];
        dw = args[7];
        dh = args[8];
    } else {
        throw new Error("Inavlid number of arguments passed to drawImage: " + arguments.length);
    }

    parent = this.__closestGroupOrSvg();
    currentElement = this.__currentElement;
    var translateDirective = "translate(" + dx + ", " + dy + ")";
    if (image instanceof ctx) {
        //canvas2svg mock canvas context. In the future we may want to clone nodes instead.
        //also I'm currently ignoring dw, dh, sw, sh, sx, sy for a mock context.
        svg = image.getSvg().cloneNode(true);
        if (svg.childNodes && svg.childNodes.length > 1) {
            defs = svg.childNodes[0];
            while (defs.childNodes.length) {
                id = defs.childNodes[0].getAttribute("id");
                this.__ids[id] = id;
                this.__defs.appendChild(defs.childNodes[0]);
            }
            group = svg.childNodes[1];
            if (group) {
                //save original transform
                var originTransform = group.getAttribute("transform");
                var transformDirective;
                if (originTransform) {
                    transformDirective = originTransform + " " + translateDirective;
                } else {
                    transformDirective = translateDirective;
                }
                group.setAttribute("transform", transformDirective);
                parent.appendChild(group);
            }
        }
    } else if (image.nodeName === "CANVAS" || image.nodeName === "IMG") {
        //canvas or image
        svgImage = this.__createElement("image");
        svgImage.setAttribute("width", dw);
        svgImage.setAttribute("height", dh);
        svgImage.setAttribute("preserveAspectRatio", "none");

        if (sx || sy || sw !== image.width || sh !== image.height) {
            //crop the image using a temporary canvas
            canvas = this.__document.createElement("canvas");
            canvas.width = dw;
            canvas.height = dh;
            context = canvas.getContext("2d");
            context.drawImage(image, sx, sy, sw, sh, 0, 0, dw, dh);
            image = canvas;
        }
        svgImage.setAttribute("transform", translateDirective);
        svgImage.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href",
            image.nodeName === "CANVAS" ? image.toDataURL() : image.getAttribute("src"));
        parent.appendChild(svgImage);
    }
};

/**
 * Generates a pattern tag
 */
SVG.prototype.createPattern = function(image, repetition) {
    var pattern = this.__document.createElementNS("http://www.w3.org/2000/svg", "pattern"),
        id = randomString(this.__ids),
        img;
    pattern.setAttribute("id", id);
    pattern.setAttribute("width", image.width);
    pattern.setAttribute("height", image.height);
    if (image.nodeName === "CANVAS" || image.nodeName === "IMG") {
        img = this.__document.createElementNS("http://www.w3.org/2000/svg", "image");
        img.setAttribute("width", image.width);
        img.setAttribute("height", image.height);
        img.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href",
            image.nodeName === "CANVAS" ? image.toDataURL() : image.getAttribute("src"));
        pattern.appendChild(img);
        this.__defs.appendChild(pattern);
    } else if (image instanceof ctx) {
        pattern.appendChild(image.__root.childNodes[1]);
        this.__defs.appendChild(pattern);
    }
    return new CanvasPattern(pattern, this);
};

SVG.prototype.setLineDash = function(dashArray) {
    if (dashArray && dashArray.length > 0) {
        this.lineDash = dashArray.join(",");
    } else {
        this.lineDash = null;
    }
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

Origami.drawSVG = function(delay) {
  var self = this;
  var abs = new SVG(self.paper.width, self.paper.width),
    queueList = self.paper.queue;

  setTimeout(function() {
    for (var i = 0; i < queueList.length; i++) {
      if (queueList[i].loaded === false || queueList[i].failed) {
        Origami.warning('couldn\'t able to load:', queueList[i].params)
      }
      abs[queueList[i].assign](queueList[i].params);
    }
    console.log(abs.getSvg());
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
