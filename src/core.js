Origami.init = function(el) {
    kami = null;
    Origami._createKami(el);
    defineDocumentStyles(Origami);
    return this;
}

Origami.styles = function() {
    var selectors = arguments;
    if (!selectors.length)
        return this;

    for (var i = 0; i < selectors.length; i++) {
        var style = Origami._getStyleRuleValue(selectors[i]);
        Origami.virtualStyles[selectors[i]] = style;
    } 
    return this;
}

Origami._getStyleRuleValue = function(selector) {
    var styleRules = (Origami.documentStyles[0] || []);
    for (var j = 0; j < styleRules.length; j++) {
        if (styleRules[j].selectorText && styleRules[j].selectorText.toLowerCase() === selector) {
            return styleRules[j].style;
        }
    }
}

Origami.on = function(ev, fn) {
    kami.element.addEventListener(ev, fn);
}

Origami._createKami = function(el) {
    if (el.canvas)
        el = el.canvas;
    else
        el = document.querySelector(el);

    var existentContext = exists(el, config.contexts);
    if (existentContext) {
        kami = existentContext;
        return;
    }

    if (!el.getContext)
        return this.warning('Error: Please check if your browser support canvas and verify if it\'s a valid canvas element.');

    var context = el.getContext('2d'),
        current = {
            element: el,
            flip: false,
            frame: null,
            ctx: (context || false),
            width: (el.width || null),
            height: (el.height || null),
        };

    Origami.contexts.push(current);
    kami = current;
}

Origami.set = function(config) {
    if (!config)
        return this;
    if (config.inc)
        settings.inc = config.inc;
    if (config.sum)
        settings.sum = config.sum;
    // TODO: set Work for rect, line, polygon, text 
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

Origami.style = function() {
    var args = Origami.args(([].slice.call(arguments) || []), 
      ['x', 'y', 'r', 'sAngle', 'eAngle']);
}