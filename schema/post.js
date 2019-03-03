'use strict'; 
exports = module.exports = function(app, mongoose) {
   var Schema   = mongoose.Schema;

   var Todo = new Schema({
       //_id    : String,
       title    : String,
       statusMsg : String,
       type: String, // uploadprofilepic, uploadcoverpic, status, uploadimage, uploadalbum,
       userId   : {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
       createdBy : {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
       createdDate : {type:Date,default:new Date()}
   });
   var post = mongoose.model( 'post', Todo);
  
   exports.insertDoc = function(fieldtoinsert, callback){
     var pos = new post(fieldtoinsert);
     pos.save(function (err) {
        if (err) {
          callback(err);
        }else {
          console.log("Post saved");
          var data = {_id : pos._id};
          callback(null, data);
        }
     });
   };
  
   exports.getOne = function(query, done){
     post.findOne(query, function(err, data){
        if(err){
          console.log('Error:', err);
          done(err);
        }else{
          done(null, data);
        }
     });
   };
  
   exports.getAll = function(query, fieldToGet, done){
     post.find(query, fieldToGet, function(err, data){
        if(err){
          console.log('Error:', err);
          done(err);
        }else{
          done(null, data);
        }
     });
   };
  
  
   exports.update = function(query, fieldToUpdate, done){
      console.log('query condition: ', query);
      console.log('field to set: ', fieldToUpdate);
      post.update(query, {$set:fieldToUpdate}, { upsert: true }, function (err, data) {
        if(err){
            done(err);
        }else{
            done(null, data);
        }
      })
   };
};