'use strict'; 
exports = module.exports = function(app, mongoose) {
   var Schema   = mongoose.Schema;

   var Todo = new Schema({
       //_id    : String,
       userid : {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
       faceColor    : String,
       heightRange : String,
       ageRange : String,
       caste : String,
       subcaste : String,       
       motherTongue : String,
       qualification : String,
       annualIncomeRange : String,
       createdDate : {type:Date,default:new Date()},
       ModifiedDate : {type:Date,default:new Date()}
   });
   var userreference = mongoose.model( 'userpreference', Todo);
  
   exports.getOne = function(query, done){
     userreference.findOne(query, function(err, data){
        if(err){
          console.log('Error:', err);
          done(err);
        }else{
          done(null, data);
        }
     });
   };
  
   exports.getAll = function(query, fieldToGet, done){
     userreference.find(query, fieldToGet, function(err, data){
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
      userreference.update(query, {$set:fieldToUpdate}, { upsert: true }, function (err, data) {
        if(err){
            done(err);
        }else{
            done(null, data);
        }
      })
   };
};