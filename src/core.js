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

Origami.fn = {};
