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

```javascript

scribble.on('.one')
    .square(10, 10, 100, {
        background: '#888', 
        border: '4px #111'
    })
    .square(50, 100, 40, {
        background: '#000', 
        border: '4px gold'  
    })

```

Roadmap APIs:

- Next Release
 - line (2d) ???
 - square (2d) [CHECKED]
 - triangule (2d)
 - rectangule (2d)
 - circle (2d)
 - image (2d)
 - text (2d)
- Future Releases
 - cube (3d)
 - cone (3d)
 - cylinder

Canvas html5 animation
How it will work??

```javascript
var i = 1;
setInterval(function() {
    scribble.on(".one", ".two")
        .square(100, 10, i++)
}, 30);
```
