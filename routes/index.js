
/*
 * GET home page.
 */

var path = require("path");

// default page loading
exports.index = function(req, res){
  res.sendfile('index.html', {'root': __dirname +'./public'});
};

exports.createMarriageCount = function(req, res, next){
   console.log("create a new account");
   var x = 3 / 0;
   y = x.d;
   console.log("value of x:", x);
};