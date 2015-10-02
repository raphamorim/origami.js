# Scribble.js

> HTML5 Canvas for Humans

## Usage

Application Usage??

Gradient Cases??

Select element??

Read Css convert in canvas style?? (Can use css module, I guess)

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

## Clear

```javascript

scribble.clear('.one') 

```

Roadmap APIs:

- Next Release
 - line (2d) [CHECKED] 
 - square (2d) [CHECKED]
 - rectangule (2d) [CHECKED]
 - triangule (2d)
 - circle (2d)
 - image (2d)
 - text (2d)

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
