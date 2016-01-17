function Shape(style) {
    var style = Origami.virtualStyles[style];
    if (!style)
        return this;
    
    // TODO: Dont draw in all canvas
    var data = '<svg xmlns="http://www.w3.org/2000/svg" width="' + kami.width + 'px" height="' + kami.height + 'px">' +
        '<foreignObject width="100%" height="100%">' +
            '<div xmlns="http://www.w3.org/1999/xhtml">' +
            '<div style="' + style.cssText + '"></div>' +
        '</div></foreignObject>' +
        '</svg>';

    var DOMURL = window.URL || window.webkitURL || window,
        img = new Image(),
        svg = new Blob([data], {
            type: 'image/svg+xml;charset=utf-8'
        });

    var url = DOMURL.createObjectURL(svg);
    img.src = url;

    img.addEventListener('load', function() {
        kami.ctx.beginPath();
        kami.ctx.drawImage(img, 0, 0);
        DOMURL.revokeObjectURL(url);
        kami.ctx.closePath();
    });

    return this;
}