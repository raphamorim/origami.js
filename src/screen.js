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

Screen.prototype.stopFrame = function() {
  var cancelAnimationFrame = window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame;
  cancelAnimationFrame(this.paper.frame);
  this.paper.frame = false;
}

Screen.prototype.runFrame = function(params) {
  var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  this.paper.frame = requestAnimationFrame(params.fn);
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

Screen.prototype.clear = function() {
  this.paper.ctx.clearRect(0, 0, this.paper.width, this.paper.height);
}

Screen.prototype.on = function(params) {
  this.paper.element.addEventListener(params.ev, params.fn);
}