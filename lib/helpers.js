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
    } else {
        return false;
    }
};

helpers.sendTwilioSms = function(phone, msg, callback) {
  // Validate parameters
  phone = typeof(phone) === 'string' && phone.trim().length === 10? phone.trim() : false;
  msg = typeof (msg) === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
  if (phone && msg) {
      // Configure the request payload
      var payload = {
          'From': config.twilio.fromPhone,
          'To': '+234'+phone,
          'Body': msg
      };
      var stringPayload = queryString.stringify(payload);
      var requestDetails = {
          'protocol' : 'https:',
          'hostname' : 'api.twilio.com',
          'method' : 'POST',
          'path' : '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
          'auth' : config.twilio.accountSid+':'+config.twilio.authToken,
          'headers' : {
              'Content-Type' : 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(stringPayload)
          }
      };
      // Instantiate the request object
      var req = https.request(requestDetails, function (res) {
          // Grab the status of the sent request
          var status = res.statusCode;
          if (status === 200 || status === 201) {
              callback(false);
          }else {
              callback('Status code was ' + status);
          }
      });

      // Bind to the error event so it doesn't get thrown
      req.on('error', function (e) {
          callback(e)
      });

      // Add the payload
      req.write(stringPayload);
      //End the request
      req.end();
  } else {
      callback('Given parameters were missing or invalid');
  }
};

//
module.exports = helpers;