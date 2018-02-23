Origami.draw = function(options) {
  var self = this,
    customRender = false,
    ctx = self.paper.ctx;

  if (typeof(options) === 'string') {
    customRender = new origami.fn[options](self.paper);
    self.paper['ctx'] = customRender;
  }

  var abs = new Screen(self.paper),
    queueList = self.paper.queue;

  for (var i = 0; i < queueList.length; i++) {
    if (queueList[i].loaded === false || queueList[i].failed) {
      Origami.warning('wasn\'t able to load:', queueList[i].params)
    }
    abs[queueList[i].assign](queueList[i].params);
  }
  self.paper.queue = [];

  if (customRender) {
    customRender.draw();
    self.paper.ctx = ctx;
  }

  if (typeof(options) === 'function')
    options();
}

Origami.load = function(fn) {
  var mOrigami = clone(this);
  mOrigami.paper = this.paper;
  var loadInterval = setInterval(function() {
    var dataLoad = mOrigami.paper.queue.filter(function(item) {
      return (item.loaded === false && !item.failed);
    });

    // When already loaded
    if (!dataLoad.length) {
      clearInterval(loadInterval);
      fn.bind(mOrigami, mOrigami)();
    }
  }, 1);
}

function Queue(assign, params, loaded) {
  this.paper.queue.push({
    assign: assign,
    params: params,
    loaded: loaded
  });
}

var queue = Queue.bind(Origami);
