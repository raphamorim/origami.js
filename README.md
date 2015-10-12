# Scribble.js

> HTML5 Canvas for Humans

## Usage

```javascript

scribble.on('.className', '#ElementId')
   .square(4, 50, 120) // (x, y, size)
   .circle(31, 32, 120) // (x, y, height, width, radius)
   .draw();

```

## Rect (square && rectangule)

```javascript

scribble.on('.canvas')
    .rect(10, 10, 50, 100, {
        background: '#888', 
        border: '4px #999'
    })
    .rect(50, 10, 40, {
        background: '#000', 
        border: '4px gold'  
    });    

```

## Line

```javascript

scribble.on('.one')
    .line({x: 10, y: 10}, {x: 10, y: 200}, {
        background: '#888', 
        border: '4px #111'
    })

```

## Circle

```javascript
scribble.on('.element')
    .circle(100, 75, 50, {
        background: '#000', 
        border: '4px gold'  
    })

```

## Polygon 

```javascript

scribble.on('.one')
    .polygon({x: 100, y: 110}, {x: 200, y: 10}, {x: 300, y: 110}, {
        background: '#888', 
        border: '4px #000'
    })
    
```

## Text

```javascript

scribble.on('.one')
    .text("Hello World", 100, 100, {
        color: '#000',
        font: '70px Helvetica',
        align: 'center',
        border: '10px gold'
    })

```


## Image

```javascript

var img = document.querySelector('#my-image');
scribble.on('.canvas')
    .image(img, 10, 10)

```

## Clear

```javascript

scribble.clear('.one') 

```

## Repeat

```javascript
    
    scribble
        .on('#demo-1')
        .set({
            inc: 35,
            circle: {
                border: "1px #000",
                radius: "30"
            }
        })
        .repeat(15, function(set){
            circle(0, set.inc)
            repeat(15, function(def){
                circle(def.inc, (set.inc-35))  
            })
        })

```

Roadmap APIs:

- Next Release
 - line (2d) [CHECKED] 
 - square (2d) [CHECKED]
 - rectangule (2d) [CHECKED]
 - triangle (2d)
    ?? qual o problema com a borda ??
 - circle (2d) [CHECKED]
    ?? qual o problema com a borda ??
 - image (2d) [CHECKED]
 - text (2d) 
 - gradient Cases
 - animation
 - rotate
 - gh-page with examples and tutorial 
 - write tests :)

- Future Releases
 - render with textures
 - switch to WebGL 
 - cube (3d)
 - cone (3d)
 - cylinder (3d)

Canvas html5 animation
How it will work??

Suggestions: 
    interpolação D3 (animação) tween


```javascript
var i = 1;
setInterval(function() {
    scribble.on(".one", ".two")
        .square(100, 10, i++)
}, 30);
```
