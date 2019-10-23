function ChartBar(config) {
    var ctx = this.paper.ctx,
        width = this.paper.width,
        height = this.paper.height;

    if (config.frame)
        ctx.clearRect(0, 0, this.paper.width, this.paper.height);

    var animation = config.animation;

    var xPadding = 40;
    var yPadding = 40;
    var sets = config.datasets;
  
    var gridLines = {
      vertical: true,
      horizontal: true
    };

    function getMaxOfArray(numArray) {
        return Math.max.apply(null, numArray);
    }

    function getMinOfArray(numArray) {
        return Math.min.apply(null, numArray);
    }

    function getMaxAndMin() {
        var max = 0,
            min = 0;

        for (var i = 0; i < config.datasets.length; i++) {
            var biggest, lowest;
            biggest = getMaxOfArray(config.datasets[i].data);
            lowest = getMinOfArray(config.datasets[i].data);

          if (biggest > max) {
            max = biggest;
          }
          if (lowest < min) {
            min = lowest;
        }
    }
    return {
          max: max,
          min: min
        };
    }

    var maxAndMin = getMaxAndMin();
    var maxY = Math.round(maxAndMin.max);
    var minY = Math.round(maxAndMin.min);
  
    var xScale = Math.floor((width - (xPadding*3)/2))/config.labels.length;
    
    function getXPixel(i) {
        return xPadding + xScale * i;
    }
    
    var yRange = maxY - minY;
    var unRoundedTickGap = yRange / 10;
    var magnitude = Math.ceil(Math.log10(unRoundedTickGap));
    var roundedTickGap = ( (Math.round(unRoundedTickGap / Math.pow(10,magnitude-1))/10) * Math.pow(10,magnitude));
    var lowerBound = roundedTickGap * Math.floor(minY/roundedTickGap);
    var upperBound = roundedTickGap * Math.floor(1 + maxY/roundedTickGap); 
    var yScale = (height - ((3/2)*yPadding))/(upperBound - lowerBound);
            
    function getYPixel(val) {
        return height - (yScale * (val - lowerBound) + yPadding);
    }    

    var gridLinesColor = '#e7e7e7';
    if (config.gridLinesColor) {
      gridLinesColor = config.gridLinesColor;
    }

    if (config.gridLines) {
        if (config.gridLines.vertical === false)
          gridLines.vertical = false;
    
        if (config.gridLines.horizontal === false)
          gridLines.horizontal = false;
    }
    
    ctx.fillStyle = '#5e5e5e';
    if (config.labelColor) {
        ctx.fillStyle = config.labelColor;
    }
    
    ctx.font = 'normal 11px Helvetica';
    ctx.globalAlpha = 1;

    // axes
    ctx.beginPath();
    ctx.strokeStyle=gridLinesColor;
    ctx.lineWidth = 1.6;
    ctx.moveTo(xPadding,yPadding/2);
    ctx.lineTo(xPadding,height - yPadding);
    ctx.lineTo(width - xPadding/2, height - yPadding);
    ctx.stroke();

    // vertical gridlines and label
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    for (var i=0;i<config.labels.length;i++) {
        if (gridLines.vertical) {
            ctx.beginPath();
            ctx.lineWidth = 0.8;
            ctx.strokeStyle = gridLinesColor;
            ctx.moveTo(getXPixel(i),height-yPadding + 5);
            ctx.lineTo(getXPixel(i),yPadding/2);
            ctx.stroke();
        }

        ctx.fillText(config.labels[i],(getXPixel(i) + getXPixel(i+1))/2 ,height - yPadding + 20);
    }

    // horizontal gridlines and data
    ctx.textAlign = "right"
    ctx.textBaseline = "middle";
    for (var i = lowerBound; i <= upperBound; i += roundedTickGap) {
        ctx.beginPath();
        if (i!=0)
            ctx.lineWidth = 0.8;
        else
            ctx.lineWidth = 2;
        ctx.strokeStyle = gridLinesColor;
        ctx.moveTo(xPadding - 5, getYPixel(i));
        ctx.lineTo(width - (xPadding/2), getYPixel(i));
        ctx.stroke();
        ctx.fillText(i, xPadding - 10, getYPixel(i));
    }

    var barWidth = (0.75 * (getXPixel(1) - getXPixel(0)))/(config.datasets.length);
    var barPadding = 0.05 * (getXPixel(1) - getXPixel(0));
    if (config.datasets.length > 1)
        var barSpacing = parseFloat((0.15 * (getXPixel(1) - getXPixel(0)))/(config.datasets.length - 1));
    else
        var barSpacing = 0;
    
    // drawing bars
    for (var i=0;i<config.labels.length;i++)
    {
        var x = getXPixel(i) + barPadding;
        for (var j=0;j<config.datasets.length;j++)
        {
            var value = config.datasets[j].data[i];
            ctx.beginPath();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = "orange";
            if (config.datasets[j].fillColor)
              ctx.fillStyle = config.datasets[j].fillColor
            ctx.fillRect(x,getYPixel(0),barWidth,getYPixel(value) - getYPixel(0));
            ctx.lineWidth = 2;
            if (config.datasets[j].borderWidth)
                ctx.lineWidth = config.datasets[j].borderWidth;
            ctx.strokeStyle= "orange";
            if (config.datasets[j].borderColor) {
                if (typeof(config.datasets[j].borderColor)=="string") 
                    ctx.strokeStyle = config.datasets[j].borderColor;
                else if (typeof(config.datasets[j].borderColor)=="object")
                    ctx.strokeStyle = config.datasets[j].borderColor[i];
            }
            ctx.moveTo(x,getYPixel(0));
            ctx.lineTo(x,getYPixel(value));
            ctx.lineTo(x+barWidth,getYPixel(value));
            ctx.lineTo(x+barWidth,getYPixel(0));
            ctx.stroke();
            x += barWidth + barSpacing;
        }
    }
    
}

Screen.prototype.chartBar = ChartBar;

Origami.chartBar = function(config) {
  queue('chartBar', config);
  return this;
};