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
          .rect('center', 'center', 50, {
            background: 'blue'
          })
          // .arc('left', 'bottom', 50, {
          //   background: 'blue'
          // })
          .rect('right', 'top', 50, {
            background: 'blue'
          })
          .draw();

        var ctx2 = canvas2.getContext('2d');
        ctx2.beginPath();
        ctx2.rect(Math.floor(canvas2.width / 2 - 50/2), Math.floor(canvas2.height / 2 - 50/2), 50, 50);
        // ctx2.arc(50, 450, 50, 0, (2 * Math.PI))
        ctx2.rect(Math.floor(canvas2.width - 50), 0, 50, 50);
        ctx2.fillStyle = 'blue';
        ctx2.fill();
        ctx2.strokeStyle = 'rgba(0, 0, 0, 0)';
        ctx2.stroke();
        ctx2.setLineDash([]);
        ctx2.closePath();

        setTimeout(function() {
          var isEqual = imagediff.equal(canvas1, canvas2);
          expect(isEqual).to.eql(true);

          done();
        }, 700);
      });
    });
  });
});
