/*
 * Module dependencies.
 */

var clone = require('clone-component');

/**
 * Expose `media`.
 */

module.exports = media;

/**
 * Define rework plugin `media`.
 * @param {Object} options
 */

function media(options) {
  options = options || {};
  var Sel = options.selector = options.selector || '_media';

  return function (style) {
    var rules = style.rules;

    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      var sels = rule.selectors;
      if (!sels || !~sels.join(' ').indexOf(' ' + Sel)) continue;

      var media_sels = [];
      var selectors = [];
      for (var ii = 0; ii < sels.length; ii++) {
        var select = sels[ii];
        var split = sels[ii].split(' ' + Sel + ' ');
        var sel = split[0];
        if (!split[1]) selectors.push(sel)
        if (split[1]) {
          var query = split[1];
          media_sels.push(sel);
        }
      }

      if (media_sels.length) {
        var media_rule = clone(rule);
        media_rule.selectors = media_sels;
        var media_out = {
          type: 'media',
          media: query,
          rules: [media_rule]
        };
        rules.splice(i, 1, media_out)
      }

      if (selectors.length) {
        var standard = clone(rule);
        standard.selectors = selectors;
        rules.splice(i, 0, standard)
      }

      i--;
    }
  }
}
