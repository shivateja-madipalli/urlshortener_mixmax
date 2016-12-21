var access_token = require('../utils/key');
var bitly_endpoint = require('../utils/bitlyendpoint');
var express = require('express');
var Client = require("node-rest-client").Client;
var bodyParser = require('body-parser');

var client = new Client();
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// The API that returns the in-email representation.
module.exports = function(req, res) {
  let original_url = req.query.text.trim();
  try {
    let get_url_shortened = bitly_endpoint;
    let original_url_encoded = formatOriginalURL(original_url);

    get_url_shortened += '/v3/shorten?access_token=' +
                          access_token +
                          '&longUrl=' +
                          original_url_encoded +
                          '&format=txt';

    let bitlyRes = client.get(get_url_shortened, function(data, response) {
      if(Buffer.isBuffer(data)) {
        data = data.toString('utf8');
      }
      if(response.statusCode == '200') {
        let anchor_tag = '<a href="' + data + '">' + data + '</a>';
        res.status(response.statusCode).json({
          body: anchor_tag,
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


let formatOriginalURL = function(original_url) {
  /*
  2) Long URLs should not contain spaces:
  any longUrl with spaces will be rejected.
  All spaces should be either percent encoded %20 or plus encoded +.
  Note that tabs, newlines and trailing spaces are all indications of errors.
  Please remember to strip leading and trailing
  whitespace from any user input before shortening.
  */

  original_url = original_url.split(' ').join('+');

  /*
  1) Long URLs should be URL-encoded.
  You can not include a longUrl in the request that has &, ?, #,
  or other reserved parameters without first encoding it.
  */

  original_url = encodeURIComponent(original_url);

  return original_url;
}
