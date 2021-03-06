/*global YUI: false */
YUI.add('foo', function (Y, NAME) {

  /**
   * The foo module.
   *
   * @module foo
   */

  /**
   * Constructor for the Controller class.
   *
   * @class Controller
   * @constructor
   */

  Y.log('----- adding foo -------', 'info', 'foo.controller');
  Y.namespace('mojito.controllers')[NAME] = {

    /**
     * Method corresponding to the 'index' action.
     *
     * @param ac {Object} The ActionContext that provides access
     *        to the Mojito API.
     */
    index: function (ac) {
      Y.log('*************** foo.index() **************', 'info', 'foo.index()');
      var req = ac.http.getRequest(),
      passport = req.passport;
      // you can do whatever you want here with the
      // passport reference.
      ac.done({
        // TBD
      });
    }
  };
}, '0.0.1', {requires: ['mojito', 'mojito-http-addon']});
