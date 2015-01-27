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
        'skip-install-npm': false,
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

proto.showWarning = function() {
  this.log('****************************************');
  this.log('*                                      *');
  this.log('* The next several operations will     *');
  this.log('* cause conflicts to happen. This is   *');
  this.log('* because we are merging the two       *');
  this.log('* generators together. Hit \'y\' in the  *');
  this.log('* coming prompts.                      *');
  this.log('*                                      *');
  this.log('****************************************');
};

proto.mergingItTogether = function() {

  //bower cleanup
  this.fs.move('public/bower.json', 'bower.json');
  this.fs.delete('.bowerrc'); //we will replace this later

  //merge package.json...
  var pkgKraken = this.fs.readJSON('package.json');
  var pkgAngular = this.fs.readJSON('public/package.json');

  //merge dev dependencies, use kraken dep versions as base
  for(var dep in pkgAngular.devDependencies) {
    if(!pkgKraken.devDependencies[dep]) {
      pkgKraken.devDependencies[dep] = pkgAngular.devDependencies[dep];
    }
  }

  //overwrite base package json and delete cg-angular's
  this.fs.writeJSON('package.json', pkgKraken);
  this.fs.delete('public/package.json');

  //push static additions to the project
  this.directory('main/', './')

  
};
