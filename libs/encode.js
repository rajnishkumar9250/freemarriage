var crypto = require('crypto');
var PythonShell = require('python-shell');

var config = require('../config');

var ENCRYPTION_KEY = config.ENCRYPTION_KEY; // Must be 256 bytes (32 characters)

exports.encrypt = function(text) {
  var cipher = crypto.createCipher('aes-256-cbc',ENCRYPTION_KEY)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

exports.decrypt = function(text) {
  var decipher = crypto.createDecipher('aes-256-cbc',ENCRYPTION_KEY)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

exports.sendEmail = function(data, callback){
  var msg = {status:'success'};
  var emailSendTo = data.emailSendTo;
  var emailMsg = data.emailMsg;
  var emailSubject = data.emailSub;
  var options = {
    args: [emailSendTo, emailSubject, emailMsg]
  };
  PythonShell.run('./libs/sendemail.py', options, function (err) {
    if (err) throw err;
    callback(null, msg);
  });
}