/**
 * Created by Bellus4 on 15-10-2016.
 */
/**
 * Created by Admin on 10/14/2016.
 */
var db = require('./../../db');
var moment = require('moment');

exports.createTable = function (done) {
    var query = "CREATE TABLE message ("+
        "id int NOT NULL AUTO_INCREMENT,"+
        "message VARCHAR(255) ,"+
        "sendby VARCHAR(50) NOT NULL,"+
        "sendto VARCHAR(50) NOT NULL," +
        "senddate datetime NOT NULL," +
        "PRIMARY KEY (id))";
     db.get().query(query, function (err, result) {
         if(err){
             done(err);
         }else {
             done(null, result);
         }
     })
}
exports.InsertMessage = function(data, done) {     
    var dataToInsert = {message:data.message, sendby:data.sendBy, sendto:data.sendTo, senddate: moment().format('YYYY-MM-DD HH:m:s')};
    console.log('data to insert: ', dataToInsert);
    db.get().query('INSERT INTO message SET ?', dataToInsert, function(err, result) {
        if (err) {
            return done(err);
        }
        done(null, result);
    });
};

exports.getOldMessageOfTwoUser = function(data, done) {
    db.get().query('SELECT * FROM message where (sendby = ? AND sendto = ? ) OR (sendby = ? AND sendto = ?) LIMIT ?', data, function (err, rows) {
        if (err){
            return done(err);
        }
        done(null, rows)
    });
};

exports.getChatList = function(data, done) {
    console.log('query data: ', data);
    db.get().query('SELECT t1.* FROM message t1 JOIN (SELECT MAX(id) as max_id FROM message GROUP BY sendby, sendto) t2 ON t1.id = t2.max_id WHERE sendby = ? OR sendto = ? ORDER by senddate desc', data, function (err, rows) {
        if (err) return done(err)
        done(null, rows)
    });
};

exports.getAllByUserName = function(userName, done) {
    var listData = [userName];
    db.get().query('SELECT * FROM admin WHERE username = ? ', listData, function (err, rows) {
        if (err) return done(err)
        done(null, rows)
    });
};
