describe("Draw method", function() {

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
            border: '1px gold'
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
        ctx2.closePath();

        setTimeout(function() {
          var isEqual = imagediff.equal(canvas1, canvas2);
          expect(isEqual).to.eql(true);

          done();
        }, 1500);
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
      it("should create a canvas with setted image", function(done) {
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
        }, 1500);
      });
    });
  });
});
