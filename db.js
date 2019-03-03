/**
 * Created by Admin on 10/14/2016.
 */

var mysql = require('mysql');
var PRODUCTION_DB = 'free'
    , TEST_DB = 'free';

exports.MODE_TEST = 'mode_test';
exports.MODE_PRODUCTION = 'mode_production';

var con; // database connection
exports.connect = function(mode, done) {
    con = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        //password: 'qWDhpVskeHyvk89U',
        password: 'xxxxxx',
        database: mode === exports.MODE_PRODUCTION ? PRODUCTION_DB : TEST_DB
    });
    done()
};

exports.get = function() {
    return con;
}
