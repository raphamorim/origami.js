describe("Test CSSShape drawing - CSS to Canvas", function() {

  // Simple CSS "pacman"
  context('Simple Shapes', function() {
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
    });

    context('using red square css class', function() {
      it("should create a red square in canvas", function(done) {
        var canvas1 = document.querySelector('#canvas1'),
          canvas2 = document.querySelector('#canvas2');

        // Drawing
        this.timeout(5000);

        origami('#canvas1')
          .styles('.red-square')
          .shape('.red-square')
          .draw();

        var ctx2 = canvas2.getContext('2d');
        ctx2.beginPath();
        ctx2.setLineDash([]);
        ctx2.fillStyle = 'red';
        ctx2.fillRect(50, 50, 100, 100);
        ctx2.setLineDash([]);
        ctx2.closePath();

        setTimeout(function() {
          var isEqual = imagediff.equal(canvas1, canvas2);
          expect(isEqual).to.eql(true);

          done();
        }, 600);
      });
    });
  });
});
