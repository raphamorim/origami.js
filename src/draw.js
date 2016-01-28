Origami.draw = function(delay) {
  var self = this;
  var abs = new Screen(self.paper),
    queueList = self.paper.queue;

  setTimeout(function() {
    for (var i = 0; i < queueList.length; i++) {
      if (queueList[i].loaded === false)
        Origami.warning('couldn\'t able to load:', queueList[i].params)
      abs[queueList[i].assign](queueList[i].params);
    }
    self.paper.queue = [];
  }, delay);

  return self;
}

Origami.load = function(fn) {
  var mOrigami = clone(this);
  mOrigami.paper = this.paper;
  console.log('ida', mOrigami.getPaper());
  var loadInterval = setInterval(function() {
    var dataLoad = mOrigami.paper.queue.filter(function(item) {
      return (item.loaded === false);
    });

    // When already loaded
    if (!dataLoad.length) {
      clearInterval(loadInterval);
      fn.bind(mOrigami, mOrigami)();
    }
  }, 200);
}

function Queue(assign, params, loaded) {
  this.paper.queue.push({
    assign: assign,
    params: params,
    loaded: loaded
  });
}

var queue = Queue.bind(Origami);