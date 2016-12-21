let express = require('express');
let Client = require("node-rest-client").Client;
let bodyParser = require('body-parser');
let config = require('../config.json');
let ACCESSTOKEN = config.key;
let BILTYENDPOINT = config.bitly_endpoint;

let client = new Client();
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// The API that returns the in-email representation.
module.exports = function(req, res) {
  let originalURL = req.query.text.trim();
  try {
    let getURLShortened = BILTYENDPOINT;
    let originalURLEncoded = formatOriginalURL(originalURL);

    getURLShortened += '/v3/shorten?access_token=' +
                          ACCESSTOKEN +
                          '&longUrl=' +
                          originalURLEncoded +
                          '&format=txt';

    let bitlyRes = client.get(getURLShortened, function(data, response) {
      if(Buffer.isBuffer(data)) {
        data = data.toString('utf8');
      }
      if(response.statusCode == '200') {
        let anchorTag = '<a href="' + data + '">' + data + '</a>';
        res.status(response.statusCode).json({
          body: anchorTag,
          raw: true
        });
      }
    }).on('error', function (err) {
      res.status(500).send('Error');
    });
  }
  catch(e) {
    console.log('Exception: ', e);
    res.status(500).send('Error');
  }
};


let formatOriginalURL = function(originalURL) {
  /*
  Long URLs should not contain spaces:
  any longUrl with spaces will be rejected.
  All spaces should be either percent encoded %20 or plus encoded +.
  Note that tabs, newlines and trailing spaces are all indications of errors.
  Please remember to strip leading and trailing
  whitespace from any user input before shortening.
  */

  originalURL = originalURL.split(' ').join('+');

  /*
  Long URLs should be URL-encoded.
  You can not include a longUrl in the request that has &, ?, #,
  or other reserved parameters without first encoding it.
  */

  originalURL = encodeURIComponent(originalURL);

  return originalURL;
}
