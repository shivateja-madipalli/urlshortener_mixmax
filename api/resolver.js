let express = require('express');
let Client = require("node-rest-client").Client;
let bodyParser = require('body-parser');
let config = require('../config.json');

let Promise = require('promise');

const BITLY_ENDPOINT = config.bitly_endpoint;
const ACCESS_TOKEN = config.key;

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
    let get_url_shortened = BITLY_ENDPOINT;
    let original_url_encoded = formatOriginalURL(original_url);

    get_url_shortened += '/v3/shorten?access_token=' +
                          ACCESS_TOKEN +
                          '&longUrl=' +
                          original_url_encoded +
                          '&format=txt';

    //resolved here
    shortenURL(get_url_shortened).then(function(data){
      console.log("data in resolve",data);
      let anchor_tag = '<a href="' + data + '">' + data + '</a>';
      res.status(200).json({
        body: anchor_tag,
        raw: true
      });

    });
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
