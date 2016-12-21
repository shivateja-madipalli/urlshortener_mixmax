let express = require('express');
let Client = require("node-rest-client").Client;
let bodyParser = require('body-parser');
let config = require('../config.json');
let ACCESSTOKEN = config.key;
let BILTYENDPOINT = config.bitly_endpoint;

let Promise = require('promise');
let client = new Client();
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let shortenURL = function(bitlyRequest){
  return new Promise(function(resolve, reject) {
    let bitlyRes = client.get(bitlyRequest, function(data, response) {
      console.log("sent",bitlyRequest);

      if(Buffer.isBuffer(data)) {
        data = data.toString('utf8');
      }
      console.log("data,res ",data,response);
      if(response.statusCode == '200') {
        console.log("received ,",data);
        resolve(data);
      }
    }).on('error', function (err) {
        reject(err);
    });
  });
};

// The API that returns the in-email representation.
module.exports = function(req, res) {
  console.log("here");
  let original_url = req.query.text.trim();
    let getURLShortened = BITLY_ENDPOINT;
    let originalURLEncoded = formatOriginalURL(originalURL);
    getURLShortened += '/v3/shorten?access_token=' +
                          ACCESS_TOKEN +
                          '&longUrl=' +
                          originalURLEncoded +
                          '&format=txt';
    //resolved here
    shortenURL(getURLShortened).then(function(data){
      console.log("data in resolve",data);
      let anchorTag = '<a href="' + data + '">' + data + '</a>';
      res.status(200).json({
        body: anchorTag,
        raw: true
      });
    });
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
