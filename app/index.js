'use strict';
var y = require('yeoman-generator');
var util = require('util');
var utils = require('../Utils');
var path = require('path');

var Generator = module.exports = function Generator(args, options){
  y.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({
      skipMessage: true,
      skipInstall: false,
      callback: function () {
        this.emit(this.options.namespace + ':installDependencies');
      }.bind(this)
    });
  });
};

util.inherits(Generator, y.generators.Base);
var proto = Generator.prototype;


proto.composeKrakenApp = function () {
  var next = this.async();

  //we are being much more influential here regarding choices with kraken
  utils.composeWith('kraken:app', {
      options: {
        //appName: '', todo: need to be able to influence the app name here
        templateModule: 'dustjs',
        UIPackageManager: 'bower',
        cssModule: 'less',
        jsModule: false,  //todo: we need to actually file bug and fix the 'when' resolver in prompts.js to false is a valid value
        'skip-install-npm': true,
        'skip-install-bower': true,
        'skip-install': true
      },
      arguments: this.arguments
  }, {local: require.resolve('generator-kraken/app')}, function(){
    next();
  }.bind(this), this);
};

proto.preAngularPrep = function () {

  //change root to public for angular
  var appRoot = this.appRoot = path.join(this.destinationRoot(), 'public');
  this.mkdir(appRoot);
  process.chdir(appRoot);
};

proto.composeAngularApp = function () {
  var next = this.async();

  utils.composeWith('cg-angular:app', {
    options: {
      //appName: '', todo: need to be able to influence the app name here
      'skip-install': true
    },
    arguments: this.arguments
  }, {local: require.resolve('generator-cg-angular/app')}, function(){
    next();
  }.bind(this), this);
};

proto.postAngular = function () {

  //change root to public for angular
  var appRoot = this.appRoot = path.join(this.destinationRoot(), '../');
  this.mkdir(appRoot);
  process.chdir(appRoot);

};

proto.mergeMagic = function() {
  //todo
};
