/*!
 * HTML5 Canvas SVG Alpha 2.0
 * http://specinnovations.com/
 *
 * Copyright 2011, SPEC Innovations
 * Dual licensed under the MIT or Apache 2.0.
 * http://code.google.com/p/html5-canvas-svg/
 * Alex Rhea, Chris Ritter
 *
 * Date: Tue Aug 09 2011 -0400
 */

(function( window , document , undefined ) { 

// current path template
var currentPath = {
	type : "path",
	points : new Array(),
	style : {}
}

// canvas DOM element
var canvas = null;

// canvas context
var ctx = null;

// elements drawn to the canvas
var elements = [];

var SVGCanvas = (function() { 
	
	var SVGCanvas = function( id ) {
		canvas = document.getElementById( id );
		ctx = canvas.getContext( "2d" );
		
		/* Settings */
		this.strokeStyle = "black";
		this.lineWidth = 1;
		this.lineCap = "butt";
		this.lineJoin = "miter";
		this.miterLimit = 10;
		this.fillStyle = "black";
		this.shadowOffsetX = 0;
		this.shadowOffsetY = 0;
		this.shadowBlur = 0;
		this.shadowColor = "transparent black";
		this.font = "10px sans-serif";
		this.textAlign = "start";
		this.textBaseline = "alphabetic";
		this.globalAlpha = 1.0;
		this.globalCompositeOperation = "source-over";
		
		this.util = {
			
			updateCanvasSettings : function() {
				for( key in this ) { ctx[key] = this[key]; }
			},
			  
			pushToStack : function() {
				if( currentPath.points.length > 0 ) {
					elements.push( currentPath );
					currentPath = {
						type : "path",
						points : new Array(),
						style : {}
					}
				}
			},
			
			generateSVG : function() {
			
				var xml = "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg width=\"100%\" height=\"100%\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">";
				
				for( var i=0; i<elements.length; i++ ) {
					var elem = elements[i];
					var style ="";
					for( var attr in elem.style ) {
						style += attr+":"+elem.style[attr]+"; ";
					}
					if(elem.type == "text") {
						xml += '<text x="'+elem.x+'" y="'+elem.y+'" style="'+style+'" >'+ elem.text +'</text>';
					} else if(elem.type == "path") {
						var points = "";
						for( var j=0; j<elem.points.length; j++ ) {
							var point = elem.points[j];
							if( point.action == "move" ) {
								points += "M"+point.x+" "+point.y+" ";
							} else if( point.action == "line" ) {
								points += "L"+point.x+" "+point.y+" ";	
							} else if( point.action == "quadratic" ) {
								points += "Q"+point.x1+" "+point.y1+" "+point.x+" "+point.y+" ";	
							} else if( point.action == "bezier" ) {
								points += "C"+point.x2+" "+point.y2+" "+point.x1+" "+point.y1+" "+point.x+" "+point.y+" ";	
							}
						}
						
						xml += '<path d="'+points+'" style="'+style+'" />';
					}
				}
				
				xml += "</svg>"
				
				return xml;
				
			}
		}
	}
	
	SVGCanvas.fn = SVGCanvas.prototype = {
		constructor : SVGCanvas,
		getCanvas : function() { return canvas; },
		getContext : function() { return ctx; },
		
		beginPath : function() {
			this.util.pushToStack();
			ctx.beginPath();
		},
		
		closePath : function() {
			this.util.pushToStack();
			ctx.closePath();
		},
		
		moveTo : function( x , y ) {
			currentPath.points.push({ "action" : "move" , "x" : x , "y" : y });
			ctx.moveTo( x , y );
		},
		
		lineTo : function( x , y ) {
			currentPath.points.push({ "action" : "line" , "x" : x , "y" : y });
			ctx.lineTo( x , y );
		},
		
		quadraticCurveTo : function( cpx, cpy, x, y ) {
			currentPath.points.push({ "action" : "quadratic" , "x" : x , "y" : y , "x1" :  cpx, "y1" : cpy });
			ctx.quadraticCurveTo( cpx, cpy, x, y );
		},
		
		bezierCurveTo : function( cp1x, cp1y, cp2x, cp2y, x, y ) {
			currentPath.points.push({ "action" : "bezier" , "x" : x , "y" : y , "x1" :  cp1x, "y1" : cp1y , "x2" : cp2x, "y2" : cp2y  } );
			ctx.bezierCurveTo( cp1x, cp1y, cp2x, cp2y, x, y ) ;
		},
		
		arcTo : function( x1, y1, x2, y2, radius ) {
			currentPath.points.push({ "action" : "move" , "x" : x1 , "y" : y1 });
			this.bezierCurveTo( x1 , (y1+radius) , x2 , (y2+radius) );
			ctx.arcTo( x1, y1, x2, y2, radius );
		},
		
		arc : function( x, y, radius, startAngle, endAngle, anticlockwise ) {
			ctx.arc( x, y, radius, startAngle, endAngle, anticlockwise );
		},
		
		rect : function( x , y , width , height ) {
			currentPath.points.push({ "action" : "move" , "x" : x , "y" : y });
			currentPath.points.push({ "action" : "line" , "x" : x+width , "y" : y });
			currentPath.points.push({ "action" : "line" , "x" : x+width , "y" : y+height });
			currentPath.points.push({ "action" : "line" , "x" : x , "y" : y+height });
			currentPath.points.push({ "action" : "line" , "x" : x , "y" : y });
			ctx.rect( x , y , width , height );
		},
		
		clearRect : function( x , y , width , height ) {
			currentPath.points.push({ "action" : "move" , "x" : x , "y" : y });
			currentPath.points.push({ "action" : "line" , "x" : x+width , "y" : y });
			currentPath.points.push({ "action" : "line" , "x" : x+width , "y" : y+height });
			currentPath.points.push({ "action" : "line" , "x" : x , "y" : y+height });
			currentPath.points.push({ "action" : "line" , "x" : x , "y" : y });
			ctx.clearRect( x , y , width , height );
		},
		
		fillRect : function( x , y , width , height )  {
			this.util.pushToStack();
			var rect = { type : "path" , style : {} };
			rect.points = new Array();
			rect.points.push({ "action" : "move" , "x" : x , "y" : y });
			rect.points.push({ "action" : "line" , "x" : x+width , "y" : y });
			rect.points.push({ "action" : "line" , "x" : x+width , "y" : y+height });
			rect.points.push({ "action" : "line" , "x" : x , "y" : y+height });
			rect.points.push({ "action" : "line" , "x" : x , "y" : y });
			rect.style["fill"] = ctx.fillStyle = this.fillStyle;
			elements.push( rect );
			this.util.updateCanvasSettings();
			ctx.fillRect( x , y , width , height );
		},
		
		strokeRect : function( x , y , width , height )  {
			this.util.pushToStack();
			var rect = { type : "path" , style : {} };
			rect.points = new Array();
			rect.points.push({ "action" : "move" , "x" : x , "y" : y });
			rect.points.push({ "action" : "line" , "x" : x+width , "y" : y });
			rect.points.push({ "action" : "line" , "x" : x+width , "y" : y+height });
			rect.points.push({ "action" : "line" , "x" : x , "y" : y+height });
			rect.points.push({ "action" : "line" , "x" : x , "y" : y });
			rect.style["stroke"] = ctx.strokeStyle = this.strokeStyle;
			rect.style["stroke-width"] = ctx.lineWidth = this.lineWidth;
			rect.style["stroke-linecap"] = ctx.lineCap = this.lineCap;
			rect.style["stroke-miterlimit"] = ctx.miterLimit = this.miterLimit;
			rect.style["stroke-linejoin"] = ctx.lineJoin = this.lineJoin;
			elements.push( rect );
			this.util.updateCanvasSettings();
			ctx.strokeRect( x , y , width , height );
		},
		
		isPointInPath : function( x, y ) {
			return ctx.isPointInPath( x , y );
		},
		
		stroke : function() {
			var path;
			if( currentPath.points.length > 0 ) {
				path = currentPath;
			} else {
				path = elements[elements.length-1];
			}
			path.style["stroke"] = ctx.strokeStyle = this.strokeStyle;
			path.style["stroke-width"] = ctx.lineWidth = this.lineWidth;
			path.style["stroke-linecap"] = ctx.lineCap = this.lineCap;
			path.style["stroke-miterlimit"] = ctx.miterLimit = this.miterLimit;
			path.style["stroke-linejoin"] = ctx.lineJoin = this.lineJoin;
			this.util.updateCanvasSettings();
			ctx.stroke();
		},
		
		fill : function() {
			var path;
			if( currentPath.points.length > 0 ) {
				path = currentPath;
			} else {
				path = elements[elements.length-1];
			}
			path.style["fill"] = ctx.fillStyle = this.fillStyle;
			console.log();
			this.util.updateCanvasSettings();
			ctx.fill();
		},
		
		strokeText : function( text , x , y ) {
			ctx.font = this.font;
			elements.push( { "type" : "text" , "text" : text , "x" : x , "y" : y , style : { "font" : this.font , "text-align" : this.textAlign , "alignment-baseline" : this.textBaseline, "fill" : this.strokeStyle } } );
			this.util.updateCanvasSettings();
			ctx.strokeText( text , x , y );
		},
		
		fillText : function( text , x , y ) {
			ctx.font = this.font;
			elements.push( { "type" : "text" , "text" : text , "x" : x , "y" : y , style : { "font" : this.font , "text-align" : this.textAlign , "alignment-baseline" : this.textBaseline, "fill" : this.fillStyle } } );
			this.util.updateCanvasSettings();
			ctx.fillText( text , x , y );
		},
		
		measureText : function( text ) {
			return ctx.measureText( text );
		},
		
		clip : function() {
			this.util.updateCanvasSettings();
			ctx.clip();
		},
		
		save : function() {
			ctx.save();
		},
		
		restore : function() {
			ctx.restore();
		},
		
		createLinearGradient : function( x0, y0, x1, y1 ) {
			return ctx.createLinearGradient( x0, y0, x1, y1 );
		},
		
		createRadialGradient : function( x0, y0, r0, x1, y1, r1 ) {
			return ctx.createRadialGradient( x0, y0, r0, x1, y1, r1 );
		},
		
		createPattern : function( image, repetition ) {
			return ctx.createPattern( image, repetition );
		},
		
		createImageData : function( sw, sh ) {
			return (arguments.length == 1 ? ctx.createImageData( imageData ) : ctx.createImageData( sw, sh ));
		},
		
		createImageData : function( imageData ) {
			return ctx.createImageData( imageData );
		},
		
		getImageData : function( sx, sy, sw, sh ) {
			return ctx.getImageData( sx, sy, sw, sh );
		},
		
		putImageData : function( imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight ) {
			return ctx.putImageData( imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight );
		},
		
		drawImage : function() {
			return ( arguments.length > 5 ) ? 
				ctx.drawImage( arguments[0].value , arguments[1].value , arguments[2].value , arguments[3].value, arguments[4].value ) :
				ctx.drawImage( arguments[0].value , arguments[1].value , arguments[2].value , arguments[3].value, arguments[4].value, arguments[5].value , arguments[6].value, arguments[7].value, arguments[8].value );
		},
		
		scale : function( x , y ) {
			ctx.scale( x , y );
		},
		
		rotate : function( angle ) {
			ctx.rotate( angle );
		},
		
		translate : function( amount ) {
			ctx.translate( amount );	
		},
		
		transform : function( m11, m12, m21, m22, dx, dy ) {
			ctx.transform( m11, m12, m21, m22, dx, dy );
		},
		
		setTransform : function( m11, m12, m21, m22, dx, dy ) {
			ctx.setTransform( m11, m12, m21, m22, dx, dy );
		},
		
		toDataURL : function( type , args ) {
			if( type == "image/svg+xml" ) {
				return this.util.generateSVG();
			} else {
				return ctx.toDataURL( type , args );
			}
			
		}
	
	}
	
	return SVGCanvas;
	
})();

window.SVGCanvas = SVGCanvas;
	
})( window , document );
