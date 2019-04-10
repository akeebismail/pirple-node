/*
* Helpers for various tasks
 */
// Dependencies
var config = require('./config');
var crypto = require('crypto');
var https = require('https');
var queryString = require('querystring');

// Container for all the helpers
var helpers = {};

// Parse a JSON string to object in all cases, without throwing
helpers.parseJsonToObject = function(str) {
  try {
      var obj = JSON.parse(str);
      return obj;
  }  catch (e) {
      return {}
  }
};

// Create a SHA256 hash
helpers.hash = function(str) {
    if (typeof (str) === 'string' && str.length > 0) {
        var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function(strLenght) {
    strLenght = typeof (strLenght) === 'number' && strLenght > 0 ? strLenght : false;
    if (strLenght) {
        // Define all the possible characters that could go into a string
        var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        var string = '';
        for (i = 1; i <= strLenght; i++) {
            var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))
            string+=randomCharacter;
        }

        return string;
    }
}
module.exports = helpers;