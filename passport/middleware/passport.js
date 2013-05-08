/*jslint indent: 2, sloppy: true */
/*global require: false, module: false, console: false */

var
  passport = require('passport'),
  LocalStrategy = require("passport-local").Strategy,
  LDAPStrategy = require("passport-ldap").Strategy,
  initialize;

var users = {
  bob: {uid: 'bob', username: 'bob', password: 'bob', email: 'bob@example.com'},
  joe: {uid: 'joe', username: 'joe', password: 'joe', email: 'joe@example.com'}
};

function findById(uid, fn) {
  if (users[uid]) {
    fn(null, users[uid]);
  } else {
    fn(new Error('User ' + uid + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  console.log('username: ' + username);
  var user;
  if (users[username]) {
    user = users[username];
    console.log("middleware/passport/findByUserName(): found username: " + username);
    return fn(null, user);
  }
  return fn(null, null);
}


// Passport session setup.

//   To support persistent login sessions, Passport needs to be able to
//   serialize users into the session and deserialize them out of it.
//   Typically, this will be as simple as storing the user ID when serializing,
//   and finding the user by ID when deserializing.

passport.serializeUser(function (user, done) {
  console.log('middleware/passport/passport.serializeUser(): User ID ' + user.uid + ' in serializeUser, done = '  + done.toString());
  done(null, user.uid);
});

passport.deserializeUser(function (uid, done) {
  findById(uid, function (err, user) {
    done(err, user);
  });
});


passport.use(new LocalStrategy(function (username, password, done) {
  // Find the user by username.  If there is no user with the given
  // username, or the password is not correct, set the user to `false` to
  // indicate failure and set a flash message.  Otherwise, return the
  // authenticated `user`.
  findByUsername(username, function (err, user) {
    console.log('middleware/passport/LocalStrategy/findByUsername callback: Trying to authenticate ' + username);
    if (err) {
      return done(err);
    }
    if (!user) {
      console.log("middleware/passport/findByUserName(): bad username: " + username);
      return done(null, false, {
        message: 'Unknown user ' + username
      });
    }
    if (user.password !== password) {
      console.log("middleware/passport/findByUserName(): bad password: " + password);
      return done(null, false, {
        message: 'Invalid password'
      });
    }
    console.log('middleware/passport/LocalStrategy/findByUsername():    password OK');
    return done(null, user);
  });
}));

passport.use(new LDAPStrategy(
  {
    server: {
      url: 'ldap://localhost:389'
    },
    base: 'o=demo,dc=uchicago-stat,dc=org',
    search: {
      // filter: '(&(l=Seattle)(email=*@foo.com))'
      filter: '(uid=*)'
    }
  },
  function (profile, done) {
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
