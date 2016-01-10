![seishu Logo](https://raw.githubusercontent.com/raphamorim/seishu.js/master/logos/logo-seishu.jpg)

> HTML5 Canvas for Humans

Initially it's a tool for teaching geometry, web and javascript in schools. Currently it's a powerful library to create using HTML5 Canvas

# Why?

Learn the canvas API for many developers has been an additional task. But it might be easier, for simple reasons: chainable canvas, stylize objects using the same notation CSS, easy access to the context using selector.

The Seishu began as a project to teach javascript and geometry to children and today has been used to simplify the way we work with canvas (currently only in the context 2d, but in the future will also support WebGL).

## Usage

### rect

```javascript

seishu('.canvas')
  .rect(10, 10, 50, 100, {
    background: 'lightblue',
    border: '4px #999'
  })
  .rect(50, 10, 40, {
    background: 'lightgreen',
    border: '10px green'  
  });       

```

###### Result:

![rect](https://raw.githubusercontent.com/raphamorim/seishu.js/master/images/examples/rect.png)

### line

```javascript

seishu('.one')
  .line({x: 10, y: 10}, {x: 150, y: 200}, {
    background: '#888' })

```

###### Result:

![line](https://raw.githubusercontent.com/raphamorim/seishu.js/master/images/examples/line.png)

### arc

```javascript
seishu('.element')
  .arc(100, 75, 50, {
    background: '#2A80B9',
    border: '4px gold' })

```

###### Result:

![arc](https://raw.githubusercontent.com/raphamorim/seishu.js/master/images/examples/arc.png)

### polygon

```javascript

seishu('.one')
  .polygon({x: 100, y: 110}, {x: 200, y: 10}, {x: 300, y: 110}, {
    background: '#2A80B9' })

```

###### Result:

![polygon](https://raw.githubusercontent.com/raphamorim/seishu.js/master/images/examples/polygon.png)

### text

```javascript

seishu('.one')
  .text("Nice!", 100, 100, {
    color: '#000',
    font: '70px Helvetica',
    align: 'center',
    border: '2px gold'
  })

```

###### Result:

![text](https://raw.githubusercontent.com/raphamorim/seishu.js/master/images/examples/text.png)

### image

```javascript

var img = document.querySelector('#my-image');
seishu('.canvas').image(img, 10, 10, width, height)

// OR

seishu('.canvas').image('images/dog.jpg', 10, 10)

```

### clear

```javascript

seishu('.one').clear()

```

### canvasBackground

```javascript

seishu('#demo-1').canvasBackground('#2A80B9')

```

### getContext

```javascript

var ctx = seishu('#canvas').getContext(); // CanvasRenderingContext2Dcanvas

// You can use Seishu with contextObject too :)
seishu(ctx).canvasBackground('blue');

```

### repeat

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

### globalComposite

Similar to globalCompositeOperation

Default: `source-over`

```javascript

seishu('#my-canvas').globalCompositeOperation('source-in')

```

### translate

Adicional Options: 

- `center` (apply in canvas center)
- `reset` (apply in canvas `x: 0, y: 0` coordinates)

```javascript

seishu('#my-canvas').translate('center');

// OR

seishu('#my-canvas').translate(10, 50);

// OR

seishu('#my-canvas').translate(); // Equals: reset

```

### flip

Alert: Experimental feature

Default: `horizontal`

Options: `horizontal`, `vertical`

```javascript

seishu('#demo-1')
  .flip('horizontal')
  .image('images/person.jpg', 0, 0, 200, 200)

```

###### Original Image

![Person](https://raw.githubusercontent.com/raphamorim/seishu.js/master/images/person.jpg)

###### Result

![Person](https://raw.githubusercontent.com/raphamorim/seishu.js/master/images/examples/flip.png)

### rotate

```javascript

seishu('#my-canvas').rotate(degrees);

```

### restore

```javascript

seishu('#my-canvas').restore();

```

### save

```javascript

seishu('#my-canvas').save();

```

## Animation

### sprite

`frames`: required

`src`: required

`speed`: optional

`loop`: optional (default: `true`)

```javascript

seishu('#demo-1')
  .canvasBackground('#2A80B9')
  .sprite(40, 30, {
    src: 'images/coin-sprite.png',
    frames: 10,
    speed: 60,
    loop: true
  })

```

###### Result:

![Sprite Example](https://raw.githubusercontent.com/raphamorim/seishu.js/master/images/coin-sprite.gif)

### nextFrame

Causes execution of a callback (through requestAnimationFrame)

```javascript

seishu('#demo-1').nextFrame(frame)

```

### stopFrame

Stop frame animation

```javascript

seishu('#demo-1').stop(frame)

```

### First Example:

```javascript

var rotation = 0;
function draw() {
    rotation = rotation + 0.1;
    seishu('#demo-1')
        .clear()
        .arc(150, 150, 100)
        .save()
        .translate(150, 150)
        .rotate(rotation)
        .arc(18, 50, 5, {
            background: 'darkred'})
        .restore()
        .nextFrame(draw) }

```

##### Result:

![Circle Rotate](https://raw.githubusercontent.com/raphamorim/seishu.js/master/images/circle-rotate.gif)


### Second Example:

Rewrite [example of MDN on translation and rotation]() using Seishu.js

#### Original Code:

```javascript

var sun = new Image();
var earth = new Image();
function init(){
  sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
  earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
  window.requestAnimationFrame(draw);
}

function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');

  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0,0,300,300); // clear canvas

  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.strokeStyle = 'rgba(0,153,255,0.4)';
  ctx.save();
  ctx.translate(150,150);

  // Earth
  var time = new Date();
  ctx.rotate( ((2*Math.PI)/60)*time.getSeconds() + ((2*Math.PI)/60000)*time.getMilliseconds() );
  ctx.translate(105,0);
  ctx.fillRect(0,-12,50,24); // Shadow
  ctx.drawImage(earth,-12,-12);

  ctx.restore();
  
  ctx.beginPath();
  ctx.arc(150,150,105,0,Math.PI*2,false); // Earth orbit
  ctx.stroke();
  ctx.drawImage(sun,0,0,300,300);
  window.requestAnimationFrame(draw);
}

init();

```

#### Rewrited Code with Seishu.js:

```javascript

function draw() {
    seishu('#canvas')
        .globalComposite('destination-over')
        .clear()
        .save()
        .translate(150,150)
        .rotate(((2*Math.PI)/60)*new Date().getSeconds() + 
            ((2*Math.PI)/60000)*new Date().getMilliseconds())
        .translate(105,0)
        .image('images/Canvas_earth.png', -12, -12)
        .restore()
        .arc(150,150,105, {
            'border': '1px #FFF'
        })
        .image('images/Canvas_sun.png')
        .nextFrame(draw) }

```

##### Result:

![Earth Rotate](https://raw.githubusercontent.com/raphamorim/seishu.js/master/images/earth-rotate.gif)


## Roadmap:

- Next Release
 - line (2d) [CHECKED]
 - rect (2d) [CHECKED]
 - polygon (2d) [CHECKED]
 - arc (2d) [CHECKED]
 - image (2d) [CHECKED]
 - text (2d) [CHECKED]
 - getContext [CHECKED]
 - rotate [CHECKED]
 - translate [CHECKED]
 - stop animation [CHECKED]
 - sprite [CHECKED]
 - scale [CHECKED]
 - mirror (horizontal and vertical) [CHECKED]
 - use seishu by context instead selector [CHECKED]
 - on (event) 
 - quadraticCurveTo
 - compute CSS style to canvas objects
    - e.g: `seishu('#element-id').rect(50, 10, 40).style('.square-class')`
 - write tests :)
 - centerOf
 - docs with examples and tutorial
 - docs with examples by other users
 - docs with live console
 - write tests :)

## Future Releases

- animation based on CSS
- own create gradient to use
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
