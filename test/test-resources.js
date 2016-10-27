/*
  Supporting canvas newest native functions in Phantomjs
*/

CanvasRenderingContext2D.prototype.setLineDash = function(dash) {
  if (this.$setLineDash) {
    this.$setLineDash(dashList);
  }
}

// Mocked only for test
window.requestAnimationFrame = function(callback, element) {
    return window.setTimeout(function() { callback(); }, 60);
};

/*
  Test Settings
*/

var defaultStyleObject = {
  "borderStyle": [],
  "borderSize": null,
  "borderColor": null,
};

var borderStyle = {
  solid: [],
  dotted: [3],
  dashed: [12]
};
