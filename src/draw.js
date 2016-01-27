Origami.draw = function(delay) {
  var abs = new Screen(paper),
    queueList = paper.queue;

  setTimeout(function() {
    for (var i = 0; i < queueList.length; i++) {
      if (queueList[i].loaded === false)
        Origami.warning('couldn\'t able to load:', queueList[i].params)
      abs[queueList[i].assign](queueList[i].params);
    }
    paper.queue = [];
  }, delay);

  return this;
}

Origami.load = function(fn) {
  var self = this;
  var loadInterval = setInterval(function() {
    var dataLoad = paper.queue.filter(function(item) {
      return (item.loaded === false);
    });

    // When already loaded
    if (!dataLoad.length) {
      clearInterval(loadInterval);
      fn.bind(self, self)();
    }
  }, 200);
}

function queue(assign, params, loaded) {
  paper.queue.push({
    assign: assign,
    params: params,
    loaded: loaded
  });
}