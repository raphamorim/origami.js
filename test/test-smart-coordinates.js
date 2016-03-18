describe("Test Smart Coordinates", function() {

  // Using Axis
  context('Using axis', function() {
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

    context('All axis in mixed shapes', function() {
      it("should create shapes with a valid axis coordinates", function(done) {
        var canvas1 = document.querySelector('#canvas1'),
          canvas2 = document.querySelector('#canvas2');

        // Drawing
        this.timeout(5000);

        origami('#canvas1')
          .rect('left', 'bottom', 50, {
            background: 'red'
          })
          .rect('right', 'top', 50, {
            background: 'red'
          })
          .image('../images/firefox.png', 'center', 'center', 200, 200)
          .load(function(canvas) {
            canvas.draw();
          });

        var ctx2 = canvas2.getContext('2d');
        ctx2.beginPath();
        ctx2.rect(0, Math.floor(canvas2.height - 50), 50, 50);
        ctx2.rect(Math.floor(canvas2.width - 50), 0, 50, 50);
        ctx2.fillStyle = 'red';
        ctx2.fill();
        ctx2.lineWidth = 1;
        ctx2.strokeStyle = 'rgba(0, 0, 0, 0)';
        ctx2.stroke();
        ctx2.setLineDash([]);
        ctx2.closePath();

        var img = new Image();
        img.src = '../images/firefox.png';
        img.addEventListener('load', function() {
          ctx2.beginPath();
          ctx2.drawImage(img, Math.floor((canvas2.height / 2) - (200 / 2)), Math.floor((canvas2.width / 2) - (200 / 2)), 200, 200);
          ctx2.closePath();
        });

        setTimeout(function() {
          var isEqual = imagediff.equal(canvas1, canvas2);
          expect(isEqual).to.eql(true);

          done();
        }, 300);
      });
    });
  });


  // Using Percentage
  context('Using pencentage', function() {
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

    context('All axis in mixed shapes', function() {
      it("should create shapes with a valid axis coordinates", function(done) {
        var canvas1 = document.querySelector('#canvas1'),
          canvas2 = document.querySelector('#canvas2');

        // Drawing
        this.timeout(5000);

        origami('#canvas1')
          .rect('10%', '50%', 50, {
            background: 'red'
          })
          .rect('40%', '8%', 50, {
            background: 'red'
          })
          .image('../images/firefox.png', '1%', '100%', 200, 200)
          .load(function(canvas) {
            canvas.draw();
          });

        var ctx2 = canvas2.getContext('2d');
        ctx2.beginPath();
        ctx2.rect(((10 / 100) * canvas2.width), ((50 / 100) * canvas2.height), 50, 50);
        ctx2.rect(((40 / 100) * canvas2.width), ((8 / 100) * canvas2.height), 50, 50);
        ctx2.fillStyle = 'red';
        ctx2.fill();
        ctx2.lineWidth = 1;
        ctx2.strokeStyle = 'rgba(0, 0, 0, 0)';
        ctx2.stroke();
        ctx2.setLineDash([]);
        ctx2.closePath();

        var img = new Image();
        img.src = '../images/firefox.png';
        img.addEventListener('load', function() {
          ctx2.beginPath();
          ctx2.drawImage(img, ((1 / 100) * canvas2.width), ((100 / 100) * canvas2.height), 200, 200);
          ctx2.closePath();
        });

        setTimeout(function() {
          var isEqual = imagediff.equal(canvas1, canvas2);
          expect(isEqual).to.eql(true);

          done();
        }, 300);
      });
    });
  });
});
