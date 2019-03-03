'use strict'; 
exports = module.exports = function(app, mongoose) {
   var Schema   = mongoose.Schema;

   var Todo = new Schema({
       follower    : {'type': mongoose.Schema.Types.ObjectId, ref:'user'},
       followTo :{'type': mongoose.Schema.Types.ObjectId, ref:'user'},
       createdDate : {type:Date,default:new Date()},
       modifiedDate : {type:Date,default:new Date()}
   });
   var follower = mongoose.model( 'follower', Todo );

  exports.getHistoryTableRef = function(){
    return follower;
  };
  
  exports.followToList = function(query, callback){
    follower.find(query, function (err, data) {
        if(err){
            callback(err);
        }else{
            callback(null, data);
        }
    });
  };

  exports.followToUser = function(dataToSave, callback){
    var follower = mongoose.model( 'follower');
    follower = new follower(dataToSave);
    follower.save(function(err, followerData){
        if(err){
            callback(err);
        }
        callback(null, followerData);
    });
  };

  exports.isFollowingUser = function(query, callback){
    follower.findOne(query, function (err, data) {
        if(err){
            callback(err);
        }else{
            callback(null, data);
        }
    });
  };

  exports.unfollowToUser = function(query, callback){
    console.log('query to remove follow: ', query);
    follower.remove(query, function (err, data) {
        if(err){
            callback(err);
        }else{
            console.log('Data: ', data);
            callback(null, data);
        }
    });
  };
  
};
