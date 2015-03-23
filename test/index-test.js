var vows = require('vows');
var assert = require('assert');
var util = require('util');
var coursera = require('passport-coursera-oauth');


vows.describe('passport-coursera-oauth').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(coursera.version);
    },
    'should export OAuth strategy': function (x) {
      assert.isFunction(coursera.Strategy);
      assert.isFunction(coursera.OAuth2Strategy);
      assert.equal(coursera.Strategy, coursera.OAuth2Strategy);
    },
  },
  
}).export(module);
