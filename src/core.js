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
    paper = existentContext;
    return;
  }

  if (!el.getContext)
    this.error('Please verify if it\'s a valid canvas element');

  var context = el.getContext('2d');
  var current = {
    element: el,
    queue: [],
    flip: false,
    frame: null,
    ctx: (context || false),
    width: (el.width || null),
    height: (el.height || null),
  };

  config.contexts.push(current);
  paper = current;

  return this;
}

Origami.styles = function() {
  if (!config.documentStyles)
    defineDocumentStyles(Origami);

  var selectors = arguments;
  if (!selectors.length)
    return this;

  for (var i = 0; i < selectors.length; i++) {
    var style = styleRuleValueFrom(selectors[i], (config.documentStyles[0] || []));
    Origami.virtualStyles[selectors[i]] = style;
  }
  return this;
}

Origami.contexts = function() {
  return config.contexts;
}

Origami.currentCanvasContext = function() {
  return paper.ctx;
}