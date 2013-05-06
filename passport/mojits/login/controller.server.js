/*global YUI: false */
YUI.add('login', function (Y, NAME) {

 /**
  * The login module.
  *
  * @module login
  */

 /**
  * Constructor for the Controller class.
  *
  * @class Controller
  * @constructor
  */
  Y.namespace('mojito.controllers')[NAME] = {

    // Method corresponding to the 'index' action.
    //
    // @param ac {Object} The ActionContext that provides access
    //        to the Mojito API.
    //
    index: function (ac) {
      ac.done({
        status: 'Mojito is working.'
      });

    },

    submit: function (ac) {
      var
        http = ac.http,
        req = ac.http.getRequest(),
        res = ac.http.getResponse(),
        passport = req.passport;

      // you can do whatever you want here with the
      // passport reference

      passport.authenticate('local', function (err, user, info) {
        if (err) {
          ac.error(err);
          return;
        }

        if (!user) {
          // Incorrect username
          Y.log('Login failed', 'error', 'login.submit()');
          Y.log(info.message);
          //req.flash('error', info.message);
          return http.redirect('/login');
        }

        req.logIn(user, function (err) {
          if (err) {
            ac.error(err);
            return;
          }

          Y.log('Session info: ' + Y.dump(req.session), 'info', 'login.submit()');
          Y.log('User ID logged in: ' + user.id, 'info', 'login.submit()');
          return http.redirect('/');
        });
      })(req, res, function (req, res) {
        Y.log('Username logged in: ' + req.user.name, 'info', 'login.submit()');
        ac.http.redirect('/');
      });
    }
  };
}, '0.0.1', {requires: ['mojito',  'passport', 'mojito-http-addon']});
