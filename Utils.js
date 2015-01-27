'use strict';
var y = require('yeoman-generator');
var util = require('util');
var path = require('path');

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


utils.quickComposer = function(generatorModule, generator, inDir){

  var Generator = module.exports = function Generator(args, options){
    y.generators.Base.apply(this, arguments);
  };

  util.inherits(Generator, y.generators.Base);
  var proto = Generator.prototype;

  if(inDir) {
    proto.changeRoot = function () {

      this.log('This ' + generator + ' will be created in ' + inDir + '/');

      //change root to public for angular
      var appRoot = this.appRoot = path.join(this.destinationRoot(), inDir);
      this.mkdir(appRoot);
      process.chdir(appRoot);

    };
  }

  proto.composeKrakenApp = function () {
    var next = this.async();

    //we are being much more influential here regarding choices with kraken
    utils.composeWith(generatorModule + ':' + generator, {
      options: {},
      arguments: this.arguments
    }, {local: require.resolve('generator-' + generatorModule + '/' + generator)}, function(){
      next();
    }.bind(this), this);
  };

  return Generator;
};
