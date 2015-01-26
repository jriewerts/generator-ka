'use strict';


var path = require('path'),
  assert = require('yeoman-generator').assert,
  helpers = require('yeoman-generator').test,
  testutil = require('./utils');


describe('kraken:app', function () {


  it('scaffolds dot files', function (done) {
    var base = testutil.makeBase('app');

    base.options['skip-install-bower'] = true;
    base.options['skip-install-npm'] = true;
    base.prompt['dependency:UIPackageManager'] = 'bower';

    testutil.run(base, function (err) {
      helpers.assertFile([
        '.bowerrc',
        '.editorconfig',
        '.gitignore',
        '.jshintignore',
        '.jshintrc',
        '.nodemonignore'
      ]);

      done(err);
    });
  });
});
