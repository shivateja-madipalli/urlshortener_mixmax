var validUrl = require('valid-url');

// The Type Ahead API.
module.exports = function(req, res) {
  var term = req.query.text.trim();
  if (!term) {
    res.json([{
      title: '<i>(Enter Original URL)</i>',
      text: ''
    }]);
    return;
  }

  var response;

  if (validUrl.isUri(term)) {
    console.log('Looks like an URL');
    response=[{
      title: '<p>Please Press Enter</p>',
      text: term
    }];
  } else {
    console.log('Not a URI');
    response=[{
      title: '<p>Not a valid URL</p>',
      text: ''
    }];
  }

  res.json(response);
};
