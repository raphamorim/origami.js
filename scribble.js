var scribble = (function() {
  this.contexts = [];
  this.on = function() {
    [].slice.call(arguments);
    for (var i = 0; i < arguments.length; i++) {
      this.createCanvasContext(arguments[i]);
    }
    return this;
  }

  this.existsContext = function(sel) {
    for (var i = 0; i < contexts.length; i++) {
      if (contexts[i].sel === sel) return true;
    }
    return false;
  }

  this.createCanvasContext = function(el) {
    if (this.existsContext(el))
      return;
    var canvas = document.querySelector(el),
      context = canvas.getContext('2d');
  
    this.contexts.push({
      sel: el,
      ctx: (context || false),
      width: (canvas.width || null),
      height: (canvas.height || null),
    });
  }

  this._list = function() {
    console.log(this.contexts)
    return this;
  }

  this.args = function(argsArray) {
    var params = ['x', 'y', 'width', 'height'],
      args = new Object();
    for (var i = 0; i < argsArray.length; i++) {
      if (typeof(argsArray[i]) === "object")
        args["style"] = argsArray[i];
      else
        if (params.length)
          args[params.shift()] = argsArray[i];
    }
    return args;
  }

  this.rect = function() {
    var args = this.args(([].slice.call(arguments) || [])),
      style = (args.style || {});
    
    if (style.border) {
      style.border = style.border.split(' ');
      style.border[0] = style.border[0].replace(/[^0-9]/g, '');
    }

    console.log("Rect: ", args);
    for (var i = 0; i < contexts.length; i++) {
      contexts[i].ctx.beginPath();
      contexts[i].ctx.fillStyle = (style.background)? style.background : null;
      contexts[i].ctx.fillRect(args.x, args.y, args.width, (args.height || args.width));

      contexts[i].ctx.lineWidth = (style.border)? style.border[0] : null;
      contexts[i].ctx.strokeStyle = (style.border)? style.border[1] : null;
      contexts[i].ctx.strokeRect(args.x, args.y, args.width, (args.height || args.width));
    }
    return this;
  }

  this.line = function(pointA, pointB, style) {
    if (style.border) {
      style.border = style.border.split(' ');
      style.border[0] = style.border[0].replace(/[^0-9]/g, '');
    }

    for (var i = 0; i < contexts.length; i++) {
      contexts[i].ctx.beginPath();
      contexts[i].ctx.moveTo((pointA.x || 0), (pointA.y || 0));
      contexts[i].ctx.lineTo((pointB.x || 0), (pointB.y || 0));

      contexts[i].ctx.lineWidth = (style.border)? style.border[0] : null;
      contexts[i].ctx.strokeStyle = (style.border)? style.border[1] : null;
      contexts[i].ctx.stroke();
    }
    return this;
  }

  this.clear = function() {
    for (var i = 0; i < this.contexts.length; i++) {
      contexts[i].ctx.clearRect(0, 0, contexts[i].width, contexts[i].height);
    }
    return this;
  }

  return {
    on: this.on.bind(this)
  }
})();