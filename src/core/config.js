/**
 * Config object: Maintain internal state
 * Later exposed as Origami.config
 * `config` initialized at top of scope
 */

var Origami = {
  // Current Paper
  paper: null
};

var config = {
  // All contexts saved
  contexts: [],

  // Origami Shapes Defaults
  defaults: {
    arc: {
      background: 'rgba(0, 0, 0, 0)',
      strokeStyle: 'rgba(0, 0, 0, 0)',
      lineWidth: null,
    },
    rect: {
      background: 'rgba(0, 0, 0, 0)',
      strokeStyle: 'rgba(0, 0, 0, 0)',
      lineWidth: null,
    },
    polygon: {
      background: 'rgba(0, 0, 0, 0)',
      strokeStyle: 'rgba(0, 0, 0, 0)',
      lineWidth: null,
    },
    line: {
      strokeStyle: 'rgba(0, 0, 0, 0)',
      lineWidth: null,
    },
    text: {
      font: '14px Helvetica',
      strokeStyle: 'rgba(0, 0, 0, 0)',
      color: '#000',
      lineWidth: null,
    }
  }
};
