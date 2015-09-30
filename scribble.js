var scribble = (function() {
  this.contexts = [];
  this.on = function() {
    [].slice.call(arguments);
    for (var i = 0; i < arguments.length; i++) {
      this.createCanvasContext(arguments[i]);
    }
    return this;
  }

  this.createCanvasContext = function(el) {
    var canvas = document.querySelector(el),
      context = canvas.getContext('2d');

    this.contexts.push((context || false));
  }

  //#TODO: Remove this hack
  this.args = function(argsArray) {
    var argsPattern = ['x', 'y', 'width', 'height'],
      args = new Object();
    for (var i = 0; i < argsArray.length; i++) {
      if (!argsPattern.length)
        break;
      if (typeof(argsArray[i]) === "object")
        args["style"] = argsArray[i];
      else {
        args[argsPattern[0]] = argsArray[i];
        argsPattern = argsPattern.slice(1);
      }
    }
    return args;
  }

  this.square = function(x, y, size) {
    var args = this.args(([].slice.call(arguments) || [])),
      style = (args.style || {});
    
    if (style.border) {
      style.border = style.border.split(' ');
      style.border[0] = style.border[0].replace(/[^0-9]/g, '');
    }

    console.log(args);
    for (var i = 0; i < contexts.length; i++) {
      contexts[i].beginPath();
      contexts[i].fillStyle = (style.background)? style.background : null;
      contexts[i].fillRect(args.x, args.y, args.width, args.width);

      contexts[i].lineWidth = (style.border)? style.border[0] : null;
      contexts[i].strokeStyle = (style.border)? style.border[1] : null;
      contexts[i].strokeRect(args.x, args.y, args.width, args.width);

    }
    return this;
  }

  return {
    on: this.on.bind(this)
  }
})();