![seishu Logo](https://raw.githubusercontent.com/raphamorim/seishu.js/master/logos/logo-seishu.jpg)

> HTML5 Canvas for Humans

Initially it's a tool for teaching geometry, web and javascript in schools. Currently it's a powerful library to create using HTML5 Canvas

# Why?

Learn the canvas API for many developers has been an additional task. But it might be easier, for simple reasons: chainable canvas, stylize objects using the same notation CSS, easy access to the context using selector.

The Seishu began as a project to teach javascript and geometry to children and today has been used to simplify the way we work with canvas (currently only in the context 2d, but in the future will also support WebGL).

## Usage

### Rect

```javascript

seishu('.canvas')
    .rect(10, 10, 50, 100, {
        background: '#888',
        border: '4px #999'
    })
    .rect(50, 10, 40, {
        background: '#000',
        border: '4px gold'  
    });    

```

### Line

```javascript

seishu('.one')
    .line({x: 10, y: 10}, {x: 10, y: 200}, {
        background: '#888',
        border: '4px #111'
    })

```

### Arc

```javascript
seishu('.element')
    .arc(100, 75, 50, {
        background: '#000',
        border: '4px gold'  
    })

```

### Polygon

```javascript

seishu('.one')
    .polygon({x: 100, y: 110}, {x: 200, y: 10}, {x: 300, y: 110}, {
        background: '#888',
        border: '4px #000'
    })

```

### Text

```javascript

seishu('.one')
    .text("Hello World", 100, 100, {
        color: '#000',
        font: '70px Helvetica',
        align: 'center',
        border: '10px gold'
    })

```

### Image

```javascript

var img = document.querySelector('#my-image');
seishu('.canvas').image(img, 10, 10)

// OR

seishu('.canvas').image('images/dog.jpg', 10, 10)

```

### Clear

```javascript

seishu('.one').clear()

```

### getContext

```javascript

var ctx = seishu('#canvas').getContext(); // CanvasRenderingContext2Dcanvas

```

### Repeat

```javascript

seishu('#demo-1')
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

## Roadmap APIs:

- Next Release
 - line (2d) [CHECKED]
 - rect (2d) [CHECKED]
 - triangle (2d)
 - arc (2d) [CHECKED]
 - image (2d) [CHECKED]
 - text (2d) [CHECKED]
 - getContext [CHECKED]
 - play
 - pause
 - sprite
 - quadraticCurveTo
 - create gradient to use
 - mirror (horizontal and vertical)
 - compute CSS style to canvas objects
    - e.g: `seishu('#element-id').rect(50, 10, 40).style('.square-class')
 - write tests :)
 - animation
 - on (event)
 - rotate
 - centerOf
 - gh-page with examples and tutorial
 - gh-page with examples by other users
 - write tests :)

## Future Releases

- render with textures
- switch to WebGL
- cube (3d)
- cone (3d)
- cylinder (3d)

Suggestions:
    interpolation D3 (animation) tween

## Contributing

Want to contribute? [Follow these recommendations](https://github.com/raphamorim/seishu.js/blob/master/CONTRIBUTING.md).

## License

[![CC0](https://i.creativecommons.org/l/by/4.0/88x31.png)](http://creativecommons.org/licenses/by/4.0/)
