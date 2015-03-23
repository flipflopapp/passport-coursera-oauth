var vows = require('vows');
var assert = require('assert');
var util = require('util');
var CourseraStrategy = require('passport-coursera-oauth/oauth2');


vows.describe('CourseraStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new CourseraStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
    },
    
    'should be named coursera': function (strategy) {
      assert.equal(strategy.name, 'coursera');
    },
  },

  'strategy when loading user profile': {
    topic: function() {
      var strategy = new CourseraStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2.get = function(url, accessToken, callback) {
        var body = '{ \
 "elements": [{\
 "id": "111111111111111111111",\
 "language": "en",\
 "locale": "en_US",\
 "privacy": "-1",\
 "timezone": "America/Los_Angeles"\
 }]\
}';

        callback(null, body, undefined);
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'coursera');
        assert.equal(profile.id, '111111111111111111111');
        assert.equal(profile.language, 'en');
        assert.equal(profile.locale, 'en_US');
        assert.equal(profile.privacy, '-1');
        assert.equal(profile.timezone, 'America/Los_Angeles');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      },
    },
  },
  
  'strategy when loading user profile and encountering an error': {
    topic: function() {
      var strategy = new CourseraStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2.get = function(url, accessToken, callback) {
        callback(new Error('something-went-wrong'));
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },
      
      'should error' : function(err, req) {
        assert.isNotNull(err);
      },
      'should wrap error in InternalOAuthError' : function(err, req) {
        assert.equal(err.constructor.name, 'InternalOAuthError');
      },
      'should not load profile' : function(err, profile) {
        assert.isUndefined(profile);
      },
    },
  }
  
}).export(module);
