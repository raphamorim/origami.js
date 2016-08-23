/**
 * @author mrdoob / http://mrdoob.com/
 * @co-author raphamorim
 */

function html2canvas(element) {
  var range = document.createRange();

  function getRect(rect) {
    return {
      left: rect.left - offset.left - 0.5,
      top: rect.top - offset.top - 0.5,
      width: rect.width,
      height: rect.height
    };
  }

  function drawText(style, x, y, string) {
    context.font = style.fontSize + ' ' + style.fontFamily;
    context.textBaseline = 'top';
    context.fillStyle = style.color;
    context.fillText(string, x, y);
  }

  function drawBorder(style, which, x, y, width, height) {
    var borderWidth = style[which + 'Width'];
    var borderStyle = style[which + 'Style'];
    var borderColor = style[which + 'Color'];

    if (borderWidth !== '0px' && borderStyle !== 'none') {
      context.strokeStyle = borderColor;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + width, y + height);
      context.stroke();
    }
  }

  function drawElement(element, style) {
    var rect;
    if (element.nodeType === 3) {
      // text
      range.selectNode(element);
      rect = getRect(range.getBoundingClientRect());
      drawText(style, rect.left, rect.top, element.nodeValue.trim());
    } else {
      rect = getRect(element.getBoundingClientRect());
      style = window.getComputedStyle(element);

      context.fillStyle = style.backgroundColor;
      context.fillRect(rect.left, rect.top, rect.width, rect.height);

      drawBorder(style, 'borderTop', rect.left, rect.top, rect.width, 0);
      drawBorder(style, 'borderLeft', rect.left, rect.top, 0, rect.height);
      drawBorder(style, 'borderBottom', rect.left, rect.top + rect.height, rect.width, 0);
      drawBorder(style, 'borderRight', rect.left + rect.width, rect.top, 0, rect.height);

      if (element.type === 'color' || element.type === 'text') {
        drawText(style, rect.left + parseInt(style.paddingLeft), rect.top + parseInt(style.paddingTop), element.value);
      }
    }

    for (var i = 0; i < element.childNodes.length; i++) {
      drawElement(element.childNodes[i], style);
    }
  }

  var offset = element.getBoundingClientRect();
  var context = this.paper.ctx;
  drawElement(element);
}

Screen.prototype.html2canvas = html2canvas;

Origami.shape = function(selector) {
  var element =  document.querySelector(selector);

  if (!element)
    this.error('Please use a valid selector in shape argument');
  else
    queue('html2canvas', element);

  return this;
};
