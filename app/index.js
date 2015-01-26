'use strict';
var y = require('yeoman-generator');
var util = require('util');
var utils = require('../Utils');
var path = require('path');

var Generator = module.exports = function Generator(args, options){
  y.generators.Base.apply(this, arguments);

  this.on('end', function () {
    console.info('end');
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
        jsModule: false,  //todo: file bug and fix for false
        'skip-install-npm': true,
        'skip-install-bower': true,
        'skip-install': true
      },
      arguments: this.arguments
  }, {local: require.resolve('generator-kraken/app')}, function(){
    this.log('****************************************');
    this.log('* Finished kraken files                *');
    this.log('****************************************');
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
    this.log('****************************************');
    this.log('* Finished cg-angular files            *');
    this.log('****************************************');
    next();
  }.bind(this), this);
};

proto.mergeMagic = function() {
  this.log('merging here...');
};
