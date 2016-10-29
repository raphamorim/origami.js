describe("Test Draw Shapes", function() {

  // Arc Draw
  context('arc', function() {
    beforeEach(function() {
      var canvas = document.createElement("canvas");
      canvas.id = 'canvas1';
      canvas.width = 500;
      canvas.height = 500;
      document.body.appendChild(canvas);

      var canvasMock = document.createElement("canvas");
      canvasMock.id = 'canvas2';
      canvasMock.width = 500;
      canvasMock.height = 500;
      document.body.appendChild(canvasMock);
    });

    afterEach(function() {
      document.body.removeChild(document.querySelector('#canvas1'));
      document.body.removeChild(document.querySelector('#canvas2'));
      origami.cleanContexts();
    })

    context('with blue background', function() {
      it("should create a circle with a blue background", function(done) {
        var canvas1 = document.querySelector('#canvas1'),
          canvas2 = document.querySelector('#canvas2');

        // Drawing
        this.timeout(5000);

        origami('#canvas1')
          .arc(300, 100, 50, {
            background: 'blue',
            border: '1px solid gold'
          })
          .draw();

        var ctx2 = canvas2.getContext('2d');
        ctx2.beginPath();
        ctx2.arc(300, 100, 50, 0, (2 * Math.PI));
        ctx2.fillStyle = 'blue';
        ctx2.fill();
        ctx2.lineWidth = 1;
        ctx2.strokeStyle = 'gold';
        ctx2.stroke();
        ctx2.setLineDash([]);
        ctx2.closePath();

        setTimeout(function() {
          var isEqual = imagediff.equal(canvas1, canvas2);
          expect(isEqual).to.eql(true);

          done();
        }, 400);
      });
    });
  });

  // Image Draw
  context('image', function() {
    beforeEach(function() {
      var canvas = document.createElement("canvas");
      canvas.id = 'canvas1';
      canvas.width = 500;
      canvas.height = 500;
      document.body.appendChild(canvas);

      var canvasMock = document.createElement("canvas");
      canvasMock.id = 'canvas2';
      canvasMock.width = 500;
      canvasMock.height = 500;
      document.body.appendChild(canvasMock);
    });

    afterEach(function() {
      document.body.removeChild(document.querySelector('#canvas1'));
      document.body.removeChild(document.querySelector('#canvas2'));
      origami.cleanContexts();
    })

    context('with a valid image', function() {
      it("should draw the setted image", function(done) {
        var canvas1 = document.querySelector('#canvas1'),
          canvas2 = document.querySelector('#canvas2');
        var imageSource = '../images/firefox.png';

        origami('#canvas1')
          .image(imageSource, 10, 10)
          .load(function(canvas) {
            canvas.draw();
          });

        var ctx2 = canvas2.getContext('2d');
        var img = new Image();
        img.src = imageSource;

        img.addEventListener('load', function() {
          ctx2.beginPath();
          ctx2.drawImage(img, 10, 10, img.naturalWidth, img.naturalHeight);
          ctx2.closePath();
        })

        setTimeout(function() {
          var isEqual = imagediff.equal(canvas1, canvas2);
          expect(isEqual).to.eql(true);

          done();
        }, 400);
      });
    });
  });

  // Line Draw
  context('line', function() {
    beforeEach(function() {
      var canvas = document.createElement("canvas");
      canvas.id = 'canvas1';
      canvas.width = 500;
      canvas.height = 500;
      document.body.appendChild(canvas);

      var canvasMock = document.createElement("canvas");
      canvasMock.id = 'canvas2';
      canvasMock.width = 500;
      canvasMock.height = 500;
      document.body.appendChild(canvasMock);
    });

    afterEach(function() {
      document.body.removeChild(document.querySelector('#canvas1'));
      document.body.removeChild(document.querySelector('#canvas2'));
      origami.cleanContexts();
    })

    context('with a line with border', function() {
      it("should draw a line in canvas", function(done) {
        var canvas1 = document.querySelector('#canvas1'),
          canvas2 = document.querySelector('#canvas2');

        origami('#canvas1')
          .line({
            x: 10,
            y: 10
          }, {
            x: 150,
            y: 200
          }, {
            borderSize: '1px',
            borderColor: '#888',
            borderStyle: 'dashed'
          })
          .draw();

        var ctx2 = canvas2.getContext('2d');
        ctx2.beginPath();
        ctx2.setLineDash(borderStyle['dashed']);
        ctx2.moveTo(10, 10);
        ctx2.lineTo(150, 200);
        ctx2.lineWidth = 1;
        ctx2.strokeStyle = '#888';
        ctx2.stroke();
        ctx2.setLineDash([]);
        ctx2.closePath();

        setTimeout(function() {
          var isEqual = imagediff.equal(canvas1, canvas2);
          expect(isEqual).to.eql(true);

          done();
        }, 100);
      });
    });
  });

  // Polygon Draw
  context('polygon', function() {
    beforeEach(function() {
      var canvas = document.createElement("canvas");
      canvas.id = 'canvas1';
      canvas.width = 500;
      canvas.height = 500;
      document.body.appendChild(canvas);

      var canvasMock = document.createElement("canvas");
      canvasMock.id = 'canvas2';
      canvasMock.width = 500;
      canvasMock.height = 500;
      document.body.appendChild(canvasMock);
    });

    afterEach(function() {
      document.body.removeChild(document.querySelector('#canvas1'));
      document.body.removeChild(document.querySelector('#canvas2'));
      origami.cleanContexts();
    })

    context('with a valid polygon', function() {
      it("should create a polygon in canvas", function(done) {
        var canvas1 = document.querySelector('#canvas1'),
          canvas2 = document.querySelector('#canvas2');

        origami('#canvas1')
          .polygon({
            x: 100,
            y: 110
          }, {
            x: 200,
            y: 10
          }, {
            x: 300,
            y: 110
          }, {
            background: '#2A80B9',
            border: '2px dotted #000'
          })
          .draw();

        var ctx2 = canvas2.getContext('2d');
        ctx2.beginPath();
        ctx2.setLineDash(borderStyle['dotted']);
        ctx2.fillStyle = '#2A80B9';
        ctx2.lineWidth = 2;
        ctx2.strokeStyle = '#000';
        ctx2.lineTo(100, 110);
        ctx2.lineTo(200, 10);
        ctx2.lineTo(300, 110);
        ctx2.fill();
        ctx2.stroke();
        ctx2.setLineDash([]);
        ctx2.closePath();

        setTimeout(function() {
          var isEqual = imagediff.equal(canvas1, canvas2);
          expect(isEqual).to.eql(true);

          done();
        }, 100);
      });
    });
  });

  // Rect Draw
  context('rect', function() {
    beforeEach(function() {
      var canvas = document.createElement("canvas");
      canvas.id = 'canvas1';
      canvas.width = 500;
      canvas.height = 500;
      document.body.appendChild(canvas);

      var canvasMock = document.createElement("canvas");
      canvasMock.id = 'canvas2';
      canvasMock.width = 500;
      canvasMock.height = 500;
      document.body.appendChild(canvasMock);
    });

    afterEach(function() {
      document.body.removeChild(document.querySelector('#canvas1'));
      document.body.removeChild(document.querySelector('#canvas2'));
      origami.cleanContexts();
    })

    context('with a valid rect', function() {
      it("should create a rect in canvas", function(done) {
        var canvas1 = document.querySelector('#canvas1'),
          canvas2 = document.querySelector('#canvas2');

        origami('#canvas1')
          .rect(10, 10, 50, 100, {
            background: 'lightblue',
            borderSize: '4px',
            borderColor: '#999',
            borderStyle: 'dotted'
          })
          .rect(50, 10, 40, {
            background: 'lightgreen',
            border: '10px solid green'
          })
          .draw();

        var ctx2 = canvas2.getContext('2d');

        // First Rect
        ctx2.beginPath();
        ctx2.setLineDash(borderStyle['dotted']);
        ctx2.fillStyle = 'lightblue';
        ctx2.fillRect(10, 10, 50, 100);
        ctx2.lineWidth = 4;
        ctx2.strokeStyle = '#999';
        ctx2.strokeRect(10, 10, 50, 100);
        ctx2.setLineDash([]);
        ctx2.closePath();

        // Second Rect
        ctx2.beginPath();
        ctx2.setLineDash([]);
        ctx2.fillStyle = 'lightgreen';
        ctx2.fillRect(50, 10, 40, 40);
        ctx2.lineWidth = 10;
        ctx2.strokeStyle = 'green';
        ctx2.strokeRect(50, 10, 40, 40);
        ctx2.setLineDash([]);
        ctx2.closePath();

        setTimeout(function() {
          var isEqual = imagediff.equal(canvas1, canvas2);
          expect(isEqual).to.eql(true);

          done();
        }, 100);
      });

      it("should create a border in canvas", function(done) {
        var canvas1 = document.querySelector('#canvas1'),
          canvas2 = document.querySelector('#canvas2');

        origami('#canvas1')
          .border({
            borderType: 'solid',
            borderSize: '1px',
            borderColor: 'black',
            background: 'rgba(0,0,0,0)'
          })
          .draw();

        var ctx2 = canvas2.getContext('2d');

        ctx2.beginPath();
        ctx2.setLineDash(borderStyle['solid']);
        ctx2.fillStyle = 'rgba(0,0,0,0)';
        ctx2.fillRect(0, 0, ctx2.canvas.clientWidth, ctx2.canvas.clientHeight);
        ctx2.lineWidth = 1;
        ctx2.strokeStyle = 'black';
        ctx2.strokeRect(0, 0, ctx2.canvas.clientWidth, ctx2.canvas.clientHeight);
        ctx2.setLineDash([]);
        ctx2.closePath();

        setTimeout(function() {
          var isEqual = imagediff.equal(canvas1, canvas2);
          expect(isEqual).to.eql(true);
          done();
        }, 100);
      });
    });
  });

  // Text Draw
  context('text', function() {
    beforeEach(function() {
      var canvas = document.createElement("canvas");
      canvas.id = 'canvas1';
      canvas.width = 500;
      canvas.height = 500;
      document.body.appendChild(canvas);

      var canvasMock = document.createElement("canvas");
      canvasMock.id = 'canvas2';
      canvasMock.width = 500;
      canvasMock.height = 500;
      document.body.appendChild(canvasMock);
    });

    afterEach(function() {
      document.body.removeChild(document.querySelector('#canvas1'));
      document.body.removeChild(document.querySelector('#canvas2'));
      origami.cleanContexts();
    })

    context('with a valid text', function() {
      it("should create a text in canvas", function(done) {
        var canvas1 = document.querySelector('#canvas1'),
          canvas2 = document.querySelector('#canvas2');

        origami('#canvas1')
          .text("Nice!", 100, 100, {
            color: '#000',
            font: '70px Helvetica',
            align: 'center',
            border: '2px dotted gold'
          })
          .draw();

        var ctx2 = canvas2.getContext('2d');

        ctx2.beginPath();
        ctx2.setLineDash(borderStyle['dotted']);
        ctx2.lineWidth = 2;
        ctx2.textBaseline = 'middle';
        ctx2.strokeStyle = 'gold';
        ctx2.font = '70px Helvetica';
        ctx2.fillStyle = '#000';
        ctx2.textAlign = 'center';
        ctx2.fillText('Nice!', 100, 100);
        ctx2.strokeText('Nice!', 100, 100);
        ctx2.fill();
        ctx2.stroke();
        ctx2.setLineDash([]);
        ctx2.closePath();

        setTimeout(function() {
          var isEqual = imagediff.equal(canvas1, canvas2);
          expect(isEqual).to.eql(true);

          done();
        }, 100);
      });
    });
  });

  // Flip Effect
  context('Flip', function() {
    beforeEach(function() {
      var canvas = document.createElement("canvas");
      canvas.id = 'canvas1';
      canvas.width = 500;
      canvas.height = 500;
      document.body.appendChild(canvas);

      var canvasMock = document.createElement("canvas");
      canvasMock.id = 'canvas2';
      canvasMock.width = 500;
      canvasMock.height = 500;
      document.body.appendChild(canvasMock);
    });

    afterEach(function() {
      document.body.removeChild(document.querySelector('#canvas1'));
      document.body.removeChild(document.querySelector('#canvas2'));
      origami.cleanContexts();
    })

    context('flip and flipEnd in multiple images', function() {
      it("should apply flip effect", function(done) {
        var imageSource = 'resources/person.jpg';
        var canvas1 = document.querySelector('#canvas1'),
          canvas2 = document.querySelector('#canvas2');

        origami('#canvas1')
          .image(imageSource, 0, 0, 200, 200)
          .flip('horizontal')
          .image(imageSource, 0, 220, 200, 200)
          .flipEnd()
          .flip('vertical')
          .image(imageSource, 220, 0)
          .flipEnd()
          .load(function(canvas) {
            canvas.draw();
          })

        var ctx2 = canvas2.getContext('2d');
        var img = new Image();
        img.src = imageSource;

        img.addEventListener('load', function() {
          ctx2.beginPath();
          ctx2.drawImage(img, 0, 0, 200, 200);
          ctx2.closePath();
          ctx2.save();
          ctx2.scale(-1, 1);
          ctx2.drawImage(img, -0, 220, -200, 200);
          ctx2.restore();
          ctx2.save();
          ctx2.scale(1, -1);
          ctx2.drawImage(img, 220, -0, img.naturalWidth, -(img.naturalHeight));
          ctx2.restore();
        });

        setTimeout(function() {
          var isEqual = imagediff.equal(canvas1, canvas2);
          expect(isEqual).to.eql(true);

          done();
        }, 250);
      });
    });
  });

  // Sprite draw
  context('sprite', function() {
    beforeEach(function() {
      var canvas = document.createElement("canvas");
      canvas.id = 'result';
      canvas.width = 500;
      canvas.height = 500;
      document.body.appendChild(canvas);

      var canvasMock = document.createElement("canvas");
      canvasMock.id = 'expected';
      canvasMock.width = 500;
      canvasMock.height = 500;
      document.body.appendChild(canvasMock);
    });

    afterEach(function() {
      document.body.removeChild(document.querySelector('#result'));
      document.body.removeChild(document.querySelector('#expected'));
      origami.cleanContexts();
    });

    context('draw sprite frame', function() {
      it('should draw the third frame', function(done) {
        var result = document.querySelector('#result'),
          expected = document.querySelector('#expected');

        var options = {
          src: 'resources/walk.png',
          frames: {
            total: 6,
            current: 3
          },
          animation: false
        };

        origami('#result')
          .sprite(0, 0, {
            src: options.src,
            frames: options.frames,
            animation: options.animation,
          }).load(function(octx) {
            octx.draw();
          });

        var expectedContext = expected.getContext('2d');
        var sprite = new Image();
        sprite.src = options.src;

        sprite.addEventListener('load', function() {
          expectedContext.beginPath();
          var dw = sprite.naturalWidth / options.frames.total;
          var posX = dw * (options.frames.current - 1),
            posY = 0;
          expectedContext.drawImage(sprite, posX, posY,
            dw, sprite.naturalHeight, 0, 0, dw, sprite.naturalHeight);
          expectedContext.closePath();
        });

        setTimeout(function() {
          var isEqual = imagediff.equal(result, expected);
          expect(isEqual).to.eql(true);
          done();
        }, 800);
      });
    });

  });
});