/**
 * Config object: Maintain internal state
 * Later exposed as Origami.config
 * `config` initialized at top of scope
 */

var config = {
  // Current Paper
  kami: null,

  // All contexts saved
  contexts: [],

  // All settings
  settings: {
    inc: 0,
    sum: 0,
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
        strokeStyle: null,
        lineWidth: null,
      },
      text: {
        font: '14px Helvetica',
        strokeStyle: 'rgba(0, 0, 0, 0)',
        color: '#000',
        lineWidth: null,
      }
    }
  }
};
