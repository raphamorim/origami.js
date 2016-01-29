describe("Initialize: ", function() {
    var canvas = document.createElement("canvas");
        canvas.id = "canvas";
        canvas.width = 500;
        canvas.height = 500;
        document.body.appendChild(canvas);

    var myCanvas = document.getElementById('canvas');
    context('Behavior', function() {
        it("canvas is in the DOM", function() {
            expect(myCanvas).to.not.equal(null);
        });

        it("canvas is a child of the body", function() {
            expect(myCanvas.parentElement).to.equal(document.body);
        });

        it("origami exists in context", function() {
            expect(origami).to.exist;
        });

        it("origami should be a function", function() {
            expect(origami).to.be.a('function');
        });

        it("origami with valid selector must return Object", function() {
            var origamiStatus = origami(canvas.id);
            expect(origamiStatus).to.be.a('object');
        });

        it("origami with invalid selector must throw error", function() {
            var expectedMessage = "[origami.js] Please use a " +
                "valid selector or canvas context";
            expect(origami.bind(this, 'a')).to.throw(expectedMessage);
        });

        it("origami with valid selector, but not a canvas must throw error", function() {
            var expectedMessage = "[origami.js] Please verify if it\'s a " +
                "valid canvas element";
            expect(origami.bind(this, 'body')).to.throw(expectedMessage);
        });

    });

    context('Contexts', function() {
        it("check if has created origami context", function() {
            origami(canvas.id);
            var contexts = origami.getContexts();

            expect(contexts.length).to.be.equal(1);
            expect(contexts[0]).to.be.a('object');
            expect(contexts[0]).to.have
                .all.keys('element', 'flip', 'index', 'queue',
                    'frame', 'ctx', 'width', 'height');

            expect(contexts[0].flip).to.eql(false);
            expect(contexts[0].frame).to.eql(null);
            expect(contexts[0].width).to.eql(canvas.width);
            expect(contexts[0].height).to.eql(canvas.width);
            expect(contexts[0].element).to.eql(canvas);
            expect(contexts[0].ctx).to.eql(canvas.getContext('2d'));
        });
    });

    after(function(){
        document.body.removeChild(myCanvas);
        origami.cleanContexts();
    });
});