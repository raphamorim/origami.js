describe("Components", function() {
    context('Using createComponent', function() {
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


        context('Creating a simple Title component', function() {
            it("should create a Title component", function(done) {
                var canvas1 = document.querySelector('#canvas1'),
                    canvas2 = document.querySelector('#canvas2');

                expect(origami('#canvas1').Header).to.eql(undefined);

                var expectedText = 'Batman Rocks!';
                origami.createComponent('Header', function(octx, props) {
                    var style = {
                        color: '#000',
                        font: '70px Helvetica',
                        align: 'center',
                        border: '2px solid gold'
                    };

                    octx.text(props.text, 200, 100, style);
                });

                expect(typeof(origami('#canvas1').Header)).to.eql('function');

                origami('#canvas1').Header({
                    text: expectedText
                }).draw();

                var ctx2 = canvas2.getContext('2d');

                ctx2.beginPath();
                ctx2.setLineDash([]);
                ctx2.lineWidth = 2;
                ctx2.strokeStyle = 'gold';
                ctx2.font = '70px Helvetica';
                ctx2.fillStyle = '#000';
                ctx2.textAlign = 'center';
                ctx2.fillText(expectedText, 200, 100);
                ctx2.strokeText(expectedText, 200, 100);
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
});