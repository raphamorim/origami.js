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

Origami._createKami = function(el) {
    if (el.canvas) {
        el = el.canvas;
    } else {
        el = document.querySelector(el);
    }

    if (!el)
        this.error('Please use a valid selector or canvas context');

    var existentContext = exists(el, config.contexts);
    if (existentContext) {
        kami = existentContext;
        return;
    }

    if (!el.getContext)
        this.error('Please verify if it\'s a valid canvas element');

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