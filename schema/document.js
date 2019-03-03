'use strict'; 
exports = module.exports = function(app, mongoose) {
   var Schema   = mongoose.Schema;

   var Todo = new Schema({
       //_id    : String,
       title    : String,
       belongsTo : [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
       postId : {type: mongoose.Schema.Types.ObjectId, ref: 'post'},
       filepath : String,
       createdby : {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
       createdDate : {type:Date,default:new Date()}
   });
   var document = mongoose.model( 'document', Todo);
  
   exports.insertDoc = function(fieldtoinsert, callback){
     var doc = new document(fieldtoinsert);
     doc.save(function (err) {
        if (err) {
          callback(err);
        }else {
          console.log("Post saved");
          callback(null);
        }
     });
   };
  
   exports.getOne = function(query, done){
     document.findOne(query, function(err, data){
        if(err){
          console.log('Error:', err);
          done(err);
        }else{
          done(null, data);
        }
     });
   };
  
   exports.getAll = function(query, fieldToGet, done){
     document.find(query, fieldToGet, function(err, data){
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
      document.update(query, {$set:fieldToUpdate}, { upsert: true }, function (err, data) {
        if(err){
            done(err);
        }else{
            done(null, data);
        }
      })
   };
};