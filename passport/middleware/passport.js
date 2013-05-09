/*jslint indent: 2, sloppy: true */
/*global require: false, module: false, console: false */

var
  passport = require('passport'),
  LocalStrategy = require("passport-local").Strategy,
  LDAPStrategy = require("passport-ldapauth").Strategy,
  initialize;

var users = {
  bob: {uid: 'bob', userPassword: 'bob', givenName: 'Bob', mail: 'bob@example.com'},
  joe: {uid: 'joe', userPassword: 'joe', givenName: 'Joe', mail: 'joe@example.com'}
};

function findByUid(uid, fn) {
  console.log('looking up ' + uid, 'info', 'middleware/passport.findByUid()');
  if (users[uid]) {
    fn(null, users[uid]);
  } else {
    // fn(new Error('User ' + uid + ' does not exist'));
    fn(null, false);
  }
}

// Passport session setup.

//   To support persistent login sessions, Passport needs to be able to
//   serialize users into the session and deserialize them out of it.
//   Typically, this will be as simple as storing the user ID when serializing,
//   and finding the user by ID when deserializing.

passport.serializeUser(function (user, done) {
  var serialized = [user.uid, user.givenName, user.mail].join(':');
  console.log(user);
  console.log('middleware/passport/passport.serializeUser(): User ID ' + user.uid + ' in serializeUser, done = '  + done.toString());
  done(null, serialized);
});

passport.deserializeUser(function (serialized, done) {
  // findByUid(uid, function (err, user) {
  //   done(err, user);
  // });
  var
    item = serialized.split(':'),
    user = {
      uid: item[0],
      givenName: item[1],
      mail: item[2]
    };

  done(null, user);
});


passport.use(new LocalStrategy(function (uid, password, done) {
  // Find the user by uid.  If there is no user with the given
  // uid, or the password is not correct, set the user to `false` to
  // indicate failure and set a flash message.  Otherwise, return the
  // authenticated `user`.
  findByUid(uid, function (err, user) {
    console.log(user);
    console.log('middleware/passport/LocalStrategy/findByUid callback: Trying to authenticate ' + uid);
    if (err) {
      console.error("middleware/passport/findByUid(): " + err);
      return done(err);
    }
    if (!user) {
      console.log("middleware/passport/findByUid(): bad uid: " + uid);
      return done(null, false, {
        message: 'Unknown user ' + uid
      });
    }
    if (user.userPassword !== password) {
      console.log("middleware/passport/findByUid(): bad password: " + password);
      return done(null, false, {
        message: 'Invalid password'
      });
    }
    console.log('middleware/passport/LocalStrategy/findByUid():    password OK');
    return done(null, user);
  });
}));

passport.use(new LDAPStrategy(
  {
    server: {
      url: 'ldap://localhost:389',
      searchBase: 'o=demo,dc=uchicago-stat,dc=org',
      searchFilter: '(uid={{username}})',
      adminDn: 'cn=admin,o=demo,dc=uchicago-stat,dc=org',
      adminPassword: 'OutSoon'
    }
    // usernameField: 'uid',
    // passwordField: 'userPassword'
  },
  function (profile, done) {
    console.log('LDAPStrategy callback');
    return done(null, profile);
  }
));

initialize = passport.initialize();

module.exports = function (req, res, next) {
  // we want to take control of the middleware so we can
  // initialize and also attach passport into req object
  initialize(req, res, function (err) {
    if (err) {
      return next(err);
    }

    // attaching passport object into req.passport
    // so this could be used at the controller level
    req.passport = passport;

    // returning control back to mojito flow
    next();
  });
};
