'use strict'; 
exports = module.exports = function(app, mongoose) {
   var Schema   = mongoose.Schema;

   var Todo = new Schema({
       //_id    : String,
       emailId    : {type: String,unique:true},
       firstName : String,
       middleName : String,
       lastName : String,
       dob : Date,       
       height : String,
       gender : String,
       faceColor : String,
       abtyourself : String,
       profession : String,
       religion : String,
       caste : String,
       subcaste : String,
       motherTongue : String,
       qualification : String,
       annualIncomeRange : String,
       phoneNumber : {type: String,unique:true},
       city : String,
       state : String,
       pincode : String,
       country : String,       
       userName : {type: String,unique:true},
       password : String,
       salt : String,
       profilePic : Boolean,
       coverPic : Boolean,
       requestSentFriend : [{'type': mongoose.Schema.Types.ObjectId, ref:'user'}],
       friends : [{'type': mongoose.Schema.Types.ObjectId, ref:'user'}],
       createdDate : {type:Date,default:new Date()},
       ModifiedDate : {type:Date,default:new Date()}
   });
   var user = mongoose.model( 'user', Todo );

  exports.getUserTableRef = function(){
    return user;
  };
    exports.getOneById = function (Id, returnfieldList,  done) {
        var query = user.findById(Id, returnfieldList);
        query.exec(function (err, data) {
            if(err){
                done(err);
            }else{
                done(null, data)
            }
        });
    };

    exports.getOne = function (queryCondition, returnfieldList,  done) {
        console.log("query condition: ", queryCondition," return field: ", returnfieldList);
        var query = user.findOne(queryCondition, returnfieldList).populate('friends');
        query.exec( function (err, data) {
            if(err){
                console.log("Error: ", err);
                done(err);
            }else{
                done(null, data)
            }
        });
    };

    exports.getAllUsers = function (done) {
        user.find({}, function (err, data) {
            if(err){
                done(err);
            }else{
                done(null, data);
            }
        })
    };

    exports.update = function (queryCondition, updateFieldList,  done) {
        console.log('query condition: ', queryCondition);
        console.log('field to set: ', updateFieldList);
        user.update(queryCondition, {$set:updateFieldList}, function (err, data) {
            if(err){
                done(err);
            }else{
                done(null, data);
            }
        })
    };

    exports.getAllUnfriends = function (queryCondition, done) {
        user.find(queryCondition, function (err, data) {
            if(err){
                done(err);
            }else{
                done(null, data);
            }
        });
    }

    exports.addFriendRequest = function (userId, frdId, done) {
        console.log("Userid: ", userId, " frdId:", frdId);
        user.update({_id:userId}, {$push: { requestSentFriend: frdId }}, function (err, data) {
            if(err){
                done(err);
            }else{
                done(null, data);
            }
        });
    };

    exports.addFriendList = function (userId, frdId, done) {
        console.log("Userid: ", userId, " frdId:", frdId);
        user.update({_id:userId}, {$push: { friends: frdId }}, function (err, data) {
            if(err){
                done(err);
            }else{
                done(null, data);
            }
        });
    };

    // pop from requestSentFriend array
    exports.removeFromArray = function (userId, dataToDelete, done) {
        console.log("Userid: ", userId, " condition :", dataToDelete);
        user.update({_id:userId}, {$pop: dataToDelete}, function (err, data) {
            if(err){
                done(err);
            }else{
                done(null, data);
            }
        });
    };
  
    exports.getUserlistByIds = function(userIds, done){
      console.log('userIds: ', userIds);
      user.find({_id:{$in:userIds}}, function (err, data) {
          if(err){
              done(err);
          }else{
              done(null, data);
          }
      });
    }
};
