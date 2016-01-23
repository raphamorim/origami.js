describe("Rect Shape: ", function () {
    context('Check DOM State', function() {
        it("canvas is not be in the DOM", function() {
            var canvas = document.querySelector("canvas");
            expect(canvas).to.equal(null);
        });
    });

    context('Drawing tests...', function() {
        beforeEach(function(){
            var canvas = document.createElement("canvas");
            canvas.id = "canvas";
            canvas.width = 500;
            canvas.height = 500;
            document.body.appendChild(canvas);
        });

        context('Rect (x:10, y:10, w:50, {bg: "blue"})', function() {
            it("should draw a cube", function() {
                var canvas = document.querySelector("canvas");
                expect(canvas).to.not.equal(null);
            });
        });
    })
});