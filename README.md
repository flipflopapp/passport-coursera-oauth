# Passport-Coursera-OAuth

[Passport](http://passportjs.org/) strategies for authenticating with [Coursera](http://www.coursera.org/)
using OAuth 2.0.

Coursera APIs are quite basic. The user profile information only includes a id (user id), timezone, locale
and privacy.

I personally found the APIs only useful for checking the users enrollments (https://api.coursera.org/api/users/v1/me/enrollments).

This module lets you authenticate using Coursera in your Node.js applications.
By plugging into Passport, Coursera authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

The client id and client secret needed to authenticate with Coursera can be set up from the developer's console [Coursera Developer's Console](https://accounts.coursera.org/console/).

## Install

    $ npm install passport-coursera-oauth

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'coursera'` strategy, to
authenticate requests.

Authentication with Coursera requires an extra scope parameter.  For information, go [here](https://tech.coursera.org/app-platform/).

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```Javascript
app.get('/auth/coursera',
  passport.authenticate('coursera', { scope: ['view_profile'] }));

app.get('/auth/coursera/callback', 
  passport.authenticate('coursera', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## Usage of OAuth 2.0

#### Configure Strategy

The Coursera OAuth 2.0 authentication strategy authenticates users using a Coursera
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

```Javascript
var CourseraStrategy = require('passport-coursera-oauth').OAuth2Strategy;

passport.use(new CourseraStrategy({
    clientID: COURSERA_CLIENT_ID,
    clientSecret: COURSERA_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/coursera/callback",
    profileFields: [ 'timezone', 'locale', 'privacy']
  },
  function(accessToken, profile, done) {
    User.findOrCreate({ courseraId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'coursera'` strategy, to
authenticate requests.
Authentication with Coursera requires an extra scope parameter.  For information, go [here](https://tech.coursera.org/app-platform/).

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```Javascript
app.get('/auth/coursera',
  passport.authenticate('coursera', { scope: ['view_profile'] }));

app.get('/auth/coursera/callback', 
  passport.authenticate('coursera', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## Examples

For a complete, working example, refer to the [OAuth 2.0 example](https://github.com/flipflopapp/passport-coursera-oauth/tree/master/examples/oauth2).

## Tests

    $ npm install --dev
    $ make test

## Credits

  - [Naval Saini](http://github.com/flipflopapp)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015-2016 Naval Saini <[http://flipflopapp.com/](http://flipflopapp.com/)>
