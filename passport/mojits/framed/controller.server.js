YUI.add('framed', function(Y, NAME) {
  Y.namespace('mojito.controllers')[NAME] = {

    index: function(ac) {
      req = ac.http.getRequest();
      var
        name = "what's-your-name";

      if(req.user){
        name = req.user.givenName;
      }

      ac.done({
        app_name:'Is there a user info object ' + Y.dump(req.user),
        name: name
      });
    }
  };
}, '0.0.1', {requires: ['mojito','mojito-intl-addon', 'mojito-url-addon', 'mojito-http-addon', 'dump']});
