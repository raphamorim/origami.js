Origami.draw = function() {
    var abs = new Abstract(paper),
        queueList = paper.queue;

    for (var i = 0; i < queueList.length; i++) {
        abs[queueList[i].assign](queueList[i].params);
        queueList.shift();
    }
    return this;
}

function queue(assign, params) {
    paper.queue.push({
        assign: assign,
        params: params
    });
}
