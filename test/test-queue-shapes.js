describe("Drawing Queues - Shapes", function() {

    // Arc Method
    context('• Arc', function() {
        beforeEach(function() {
            var canvas = document.createElement("canvas");
            canvas.width = 500;
            canvas.height = 500;
            document.body.appendChild(canvas);
        });

        afterEach(function() {
            document.body.removeChild(document.querySelector('canvas'));
            origami.cleanContexts();
        })

        context('-> (300, 100, 1000, {bg: "blue"})',
            function() {
                it("should create a expected queue object", function() {
                    var canvas = document.querySelector("canvas");
                    expect(canvas).to.not.equal(null);
                    origami('canvas').arc(300, 100, 1000, {
                        bg: 'blue'
                    });

                    var contexts = origami.getContexts();
                    expect(contexts.length).to.be.equal(1);
                    expect(contexts[0]).to.be.a('object');

                    var queue = contexts[0].queue;
                    expect(queue).to.be.a('array');
                    expect(queue.length).to.be.equal(1);

                    expect(queue[0]).to.have.all.keys(
                        'assign', 'loaded', 'params');

                    expect(queue[0].assign).to.eql("arc");
                    expect(queue[0].loaded).to.eql(undefined);

                    var params = queue[0].params;
                    expect(params).to.be.a('object');
                    expect(params.args).to.be.a('object');
                    expect(params.args.x).to.eql(300);
                    expect(params.args.y).to.eql(100);
                    expect(params.args.r).to.eql(1000);
                    expect(params.args.sAngle).to.eql(undefined);
                    expect(params.args.eAngle).to.eql(undefined);

                    var style = params.args.style;
                    expect(style).to.be.a('object');
                    expect(style.bg).to.eql('blue');
                    expect(style.border).to.eql(undefined);
                    expect(style.background).to.eql(undefined);
                });
            });
        context('-> (10, 20, 30, 320, 32)',
            function() {
                it("should create a expected queue object", function() {
                    var canvas = document.querySelector("canvas");
                    expect(canvas).to.not.equal(null);
                    origami('canvas').arc(10, 20, 30, 320, 32);

                    var contexts = origami.getContexts();
                    expect(contexts.length).to.be.equal(1);
                    expect(contexts[0]).to.be.a('object');

                    var queue = contexts[0].queue;
                    expect(queue).to.be.a('array');
                    expect(queue.length).to.be.equal(1);

                    expect(queue[0]).to.have.all.keys(
                        'assign', 'loaded', 'params');

                    expect(queue[0].assign).to.eql("arc");
                    expect(queue[0].loaded).to.eql(undefined);

                    var args = queue[0].params.args;
                    expect(args).to.be.a('object');
                    expect(args.x).to.eql(10);
                    expect(args.y).to.eql(20);
                    expect(args.r).to.eql(30);
                    expect(args.sAngle).to.eql(320);
                    expect(args.eAngle).to.eql(32);

                    var style = args.style;
                    expect(style).to.be.a('object');
                    expect(style.bg).to.eql(undefined);
                    expect(style.border).to.eql(undefined);
                    expect(style.background).to.eql(undefined);
                });
            });
    });

    // Image Method
    context('• Image', function() {
        beforeEach(function() {
            var canvas = document.createElement("canvas");
            canvas.width = 500;
            canvas.height = 500;
            document.body.appendChild(canvas);
        });

        afterEach(function() {
            document.body.removeChild(document.querySelector('canvas'));
            origami.cleanContexts();
        })

        context('-> (imageUrl, 30, 40, 50, 43) [instant check]',
            function() {
                it("should create a expected queue object", function() {
                    var canvas = document.querySelector("canvas");
                    expect(canvas).to.not.equal(null);
                    origami('canvas').image('resources/image-1.jpg',
                        30, 40, 50, 43);

                    var contexts = origami.getContexts();
                    expect(contexts.length).to.be.equal(1);
                    expect(contexts[0]).to.be.a('object');

                    var queue = contexts[0].queue;
                    expect(queue).to.be.a('array');
                    expect(queue.length).to.be.equal(1);

                    expect(queue[0]).to.have.all.keys(
                        'assign', 'loaded', 'params');

                    expect(queue[0].assign).to.eql("image");
                    expect(queue[0].loaded).to.eql(false);


                    var params = queue[0].params;
                    expect(params).to.be.a('object');
                    expect(params.x).to.eql(30);
                    expect(params.y).to.eql(40);
                    expect(params.width).to.eql(50);
                    expect(params.height).to.eql(43);
                    expect(params.style).to.eql(undefined);
                });
            });
        context('-> (imageUrl, 0, 10) [after load check]',
            function() {
                it("should create a expected queue object", function(done) {
                    var canvas = document.querySelector("canvas");
                    expect(canvas).to.not.equal(null);
                    origami('canvas').image('resources/image-1.jpg',
                        0, 10);

                    var contexts = origami.getContexts();
                    expect(contexts.length).to.be.equal(1);
                    expect(contexts[0]).to.be.a('object');

                    var queue = contexts[0].queue;
                    expect(queue).to.be.a('array');
                    expect(queue.length).to.be.equal(1);

                    expect(queue[0]).to.have.all.keys(
                        'assign', 'loaded', 'params');

                    expect(queue[0].assign).to.eql("image");
                    expect(queue[0].loaded).to.eql(false);

                    var params = queue[0].params;
                    expect(params).to.be.a('object');
                    expect(params.x).to.eql(0);
                    expect(params.y).to.eql(10);
                    expect(params.width).to.eql(undefined);
                    expect(params.height).to.eql(undefined);
                    expect(params.style).to.eql(undefined);

                    origami('canvas').load(function() {
                        contexts = origami.getContexts();
                        queue = contexts[0].queue;
                        params = queue[0].params;

                        expect(params.width).to.eql(1920);
                        expect(params.height).to.eql(1080);
                        done();
                    })
                });
            });

    });

    // Rect Method
    context('• Rect', function() {
        beforeEach(function() {
            var canvas = document.createElement("canvas");
            canvas.width = 500;
            canvas.height = 500;
            document.body.appendChild(canvas);
        });

        afterEach(function() {
            document.body.removeChild(document.querySelector('canvas'));
            origami.cleanContexts();
        })

        context('-> (10, 10, 50, 60, {bg: "blue"})',
            function() {
                it("should create a expected queue object", function() {
                    var canvas = document.querySelector("canvas");
                    expect(canvas).to.not.equal(null);
                    origami('canvas').rect(10, 10, 50, 60, {
                        bg: 'blue'
                    });

                    var contexts = origami.getContexts();
                    expect(contexts.length).to.be.equal(1);
                    expect(contexts[0]).to.be.a('object');

                    var queue = contexts[0].queue;
                    expect(queue).to.be.a('array');
                    expect(queue.length).to.be.equal(1);

                    expect(queue[0]).to.have.all.keys(
                        'assign', 'loaded', 'params');

                    var params = queue[0].params;
                    expect(queue[0].assign).to.eql("rect");
                    expect(queue[0].loaded).to.eql(undefined);
                    expect(params).to.be.a('object');
                    expect(params.args).to.be.a('object');
                    expect(params.args.x).to.eql(10);
                    expect(params.args.y).to.eql(10);
                    expect(params.args.width).to.eql(50);
                    expect(params.args.height).to.eql(60);
                    expect(params.style).to.be.a('object');
                    expect(params.style.bg).to.eql('blue');
                    expect(params.style.border).to.eql(undefined);
                    expect(params.style.background).to.eql(undefined);
                });
            });
        context('-> (100, 210, 0, {background: "red", border: "1px #FFF"})',
            function() {
                it("should create a expected queue object", function() {
                    var canvas = document.querySelector("canvas");
                    expect(canvas).to.not.equal(null);
                    origami('canvas').rect(100, 210, 0, {
                        background: 'blue',
                        border: '1px #FFF'
                    });

                    var contexts = origami.getContexts();
                    expect(contexts.length).to.be.equal(1);
                    expect(contexts[0]).to.be.a('object');

                    var queue = contexts[0].queue;
                    expect(queue).to.be.a('array');
                    expect(queue.length).to.be.equal(1);

                    expect(queue[0]).to.have.all.keys(
                        'assign', 'loaded', 'params');

                    expect(queue[0].assign).to.eql("rect");
                    expect(queue[0].loaded).to.eql(undefined);
                    var params = queue[0].params;
                    expect(params).to.be.a('object');
                    expect(params.args).to.be.a('object');
                    expect(params.args.x).to.eql(100);
                    expect(params.args.y).to.eql(210);
                    expect(params.args.width).to.eql(0);
                    expect(params.args.height).to.eql(undefined);
                    expect(params.style).to.be.a('object');
                    expect(params.style.bg).to.eql(undefined);
                    expect(params.style.background).to.eql('blue');
                    expect(params.style.border).to.be.a('array');
                    expect(params.style.border[0]).to.eql('1');
                    expect(params.style.border[1]).to.eql('#FFF');
                });
            });
    });
});