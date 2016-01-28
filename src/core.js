Origami.init = function(el) {
  if (el.canvas) {
    el = el.canvas;
  } else {
    el = document.querySelector(el);
  }

  if (!el)
    this.error('Please use a valid selector or canvas context');

  var existentContext = exists(el, this.contexts);
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
    index: this.contexts.length,
    flip: false,
    frame: null,
    ctx: context,
    width: el.width,
    height: el.height,
  };

  this.contexts.push(current);
  this.paper = current;

  return this;
}

Origami.styles = function() {
  if (!this.documentStyles)
    defineDocumentStyles(Origami);

  var selectors = arguments;
  if (!selectors.length)
    return this;

  for (var i = 0; i < selectors.length; i++) {
    var style = styleRuleValueFrom(selectors[i], (this.documentStyles[0] || []));
    Origami.virtualStyles[selectors[i]] = style;
  }
  return this;
}

Origami.getContexts = function() {
  return this.contexts;
}

Origami.getPaper = function() {
  return this.paper;
}

Origami.canvasCtx = function() {
  return this.paper.ctx;
}