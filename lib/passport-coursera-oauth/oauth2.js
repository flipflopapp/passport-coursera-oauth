/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Coursera authentication strategy authenticates requests by delegating to
 * Coursera using the OAuth 2.0 protocol.
 *
 * Applications must supply following query parameters
 *   - `response_type`   (default: code)
 *   - `client_id`       your client id you obtained from the Coursera Developer Console
 *   - `redirect_uri`    one of the URIs listed for your application in the developer console.
 *   - `scope`           space delimited list of requested permissions.
 *   - `state`           any string (any state useful to your application)
 *
 * Options:
 *   - `clientID`      your coursera application's client id
 *   - `clientSecret`  your coursera application's client secret
 *   - `callbackURL`   URL to which coursera will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new CourseraStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/coursera/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://accounts.coursera.org/oauth2/v1/auth';
  options.tokenURL = options.tokenURL || 'https://accounts.coursera.org/oauth2/v1/token';

  OAuth2Strategy.call(this, options,
    function(accessToken, dummyvar_refresh_token,  profile, done) {
      verify(accessToken, profile, done);
    }
  );
  this.name = 'coursera';

  this._profileURL = options.profileURL || 'https://www.coursera.org/api/externalBasicProfiles.v1?q=me';
  if(options.profileFields && options.profileFields.length > 0){
    this._profileURL += '&fields=' + options.profileFields.join(',');
  }
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Coursera.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `coursera`
 *   - `id`
 *   - `username`
 *   - `displayName`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(this._profileURL, accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }

    try {
      var json = JSON.parse(body);
      var element = json.elements[0]; // TODO are there more than one elements

      var profile = { provider: 'coursera' };
      profile.id = element.id;
      
      if(element.language){
        profile.language = element.language;
      }
      if(element.locale){
        profile.locale = element.locale;
      }
      if(element.timezone){
        profile.timezone = element.timezone;
      }

      profile._raw = body;
      profile._json = json;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
