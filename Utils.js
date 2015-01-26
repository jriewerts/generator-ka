'use strict';

var utils = module.exports = {};

utils.composeWith = function composeWith(namespace, options, settings, cb, that) {
  settings = settings || {};
  var generator;
  if (settings.local) {
    var Generator = require(settings.local);
    Generator.resolved = require.resolve(settings.local);
    Generator.namespace = namespace;
    generator = that.env.instantiate(Generator, options);
  } else {
    generator = that.env.create(namespace, options);
  }

  if (that._running) {
    generator.run(cb);
  } else {
    that._composedWith.push(generator);
  }
  return that;
};
