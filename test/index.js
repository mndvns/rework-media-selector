/*
 * Module dependencies.
 */

var should = require('should');
var rework = require('rework');
var readdir = require('fs').readdirSync;
var read = require('fs').readFileSync;

describe('media-selectors', function(){
  readdir('test/cases').forEach(function(file){
    if (~file.indexOf('.out')) return;
    var exec = /([a-z-]+)\./.exec(file);          // foo-bar.css
    var split = exec[1].split('-');               // ['foo', 'bar']
    var full = exec[1];                           // 'foo-bar'
    var base = split[0]                           // 'foo'
    var title = split.join(' ') + ' should work'; // 'foo bar should work'
    it(title, function(){
      var raw = read('test/cases/' + full + '.css', 'utf8').trim();
      var out = read('test/cases/' + base + '.out.css', 'utf8').trim();
      var css = process(raw, split);
      css.should.equal(out);
    });
  });
});

/**
 * Modifiers for testing alongside other plugins.
 */

var modifiers = {
  'media': require('..'),
  'extend': require('rework').extend
}

/**
 * Various selectors.
 */

var selectors = {
  'media-at': {selector: '@media'},
  'media-colon': {selector: ':media'},
  'media-dash': {selector: '-media'},
  'media-tag': {selector: 'media'},
  'media-underscore': {selector: '_media'}
}

/**
 * Get modifiers, selectors from file and render rework css accordingly.
 * @param {String} str
 * @param {Array} mods
 */

function process(str, mods) {
  var css = rework(str);
  mods.forEach(function(mod, i){
    var modifier = modifiers[mod];
    if (!modifier) return;
    var args = selectors[mod + '-' + mods[i + 1]] || {};
    css.use(modifier(args));
  })
  if (!~mods.join('').indexOf('media')) css.use(require('..')());
  return css.toString();
}
