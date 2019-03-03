"use strict"
var mongoose = require('mongoose');
var async    = require('async');
var jwt = require('jwt-simple');
var moment = require('moment');
var events = require('events');
var user = require('./../schema/user');
var follower = require('./../schema/follower');
var document = require('./../schema/document');
var userpreference = require('./../schema/userpreference');
var post = require('./../schema/post');
var encode_lib = require('./../libs/encode');

var fs = require("fs");
var ObjectId = mongoose.Schema.Types.ObjectId;
var events = require('events');
var ObjectId = require('mongoose').Types.ObjectId; 

var history = require('./history');
var config = require('./../config');

exports.login = function(req, res, next){
  console.log("req: ", req.body); 
  var email = req.body.emailId;
  var password = req.body.password;
  var userSchema = mongoose.model('user');
  user.getOne({emailId:email, password:password},{
      userName:1, emailId:1, firstName:1, middleName:1,
      lastName:1, dob:1, height:1, gender:1, faceColor:1, 
      abtyourself:1, profession:1, religion:1, caste:1,
      subcaste:1, phoneNumber:1,  state:1, country:1, 
      profilePic:1, requestSentFriend:1, friends:1
    },function(err, data){
     if(err){
        console.log('Error: ', err);
     }
     console.log('data: ', data);
     if(data != null){
        console.log('record found: ', data);
         delete data.password; // not working
         var user = {};
         user.email = data.emailId;
         user.pwd = data.password;
         user.createdTime = moment().unix(),
         user.expireAt = moment().add(14, 'days').unix();
         var token = jwt.encode(user, req.app.config.superSecret);
         res.json({msgType:"success", user:data, token:token});
     }else{
         res.json({msgType:"false", message:"email id does not exist"});
     }
  });
};

exports.forgetpassword = function(req, res, next){
  var emailId = req.body.emailId;
  user.getOne({emailId:emailId},{userName:1, firstName:1, lastName:1}, function(err, userData){
    if(err){
      throw new Error(err);
    }
    if(userData == null){
      res.json({status:"failed", "message":"User does not exist!"});
    }else{
      var dataToEncrypt = {emailId: emailId, userName:userData.userName, id:userData.id, createdTime: new Date()};
      var encodedStr = encode_lib.encrypt(JSON.stringify(dataToEncrypt));
      var msgSub = 'Request Password link at freemarriage.learn2earnbyrajnish.com';
      var msgcontent = 'Hi '+ userData.firstName + ' '+ userData.lastName + ',\n Please go to below link \n http://freemarriage.learn2earnbyrajnish.com/#/resetpassword/'+encodedStr +' . If you are not one , please ignore this mail.';
      var msg = {emailSendTo:emailId, emailMsg: msgcontent, emailSub:msgSub};
      encode_lib.sendEmail(msg, function(err, msgData){
        if(err){
          throw new Error(err);
        }else{
          var msg;
          if(msgData.status == "success"){
            msg = "Successfully sent a link to your email id to reset your password."
          }else{
            msg = "Something went wrong.Please try it again.";
          }
          res.json({status: msgData.status, message: msg});
        }
      });
    }
  });
};

exports.resetpassword = function(req, res){
  var usertoken = req.body.token;
  try{
    var decodedStr = encode_lib.decrypt(usertoken);
    var userinfo = JSON.parse(decodedStr);  
  }catch(exec){
    console.log('Exception: ', exec);
    res.json({status:"failed", message:"Invalid Token"});
  }
  
  if(userinfo){
    var tenMiliSec = 10*60*1000;
    if(new Date(userinfo.createdTime).getTime() + tenMiliSec < new Date().getTime()){
      res.json({status:"failed", message:"Token has been expired"});
    }else{
      user.update({emailId:userinfo.emailId, userName: userinfo.userName, _id: new ObjectId(userinfo.id)},{password: req.body.newpassword}, function(err, userData){
        if(err){
          throw new Error(err); 
        }

        if(!userData){
          res.json({status:"failed", message:"Invalid Token."});
        }

        if(userData){
          res.json({status:"success", message:"Successfully reset your password."});
        }

      });  
    }  
  }
  
};

exports.getUserDetailsForByTokenId = function(req, res){
  var tokenId = req.header('Authorization');
  var decoded = jwt.decode(tokenId, req.app.config.superSecret);
  console.log("decoded: ", decoded);
  var emailId = decoded.email;
  //var userSchema = mongoose.model('user');
  console.log("email id: ", emailId);
  user.getOne({emailId:emailId},{                                 
                        userName:1, emailId:1, firstName:1, middleName:1,
                        lastName:1, dob:1, height:1, gender:1, faceColor:1, 
                        abtyourself:1, profession:1, religion:1, caste:1,
                        subcaste:1, phoneNumber:1,  state:1, country:1, 
                        profilePic:1, coverPic:1, requestSentFriend:1, friends:1
                    },function(err, user){
     if(err){
        console.log('Error: ', err);
     }else{
          console.log("user details: ", user);
          res.json({user:user}); 
     }
  });
  
};

// create a marriage account
exports.createMarriageCount = function(req, res){
   console.log('req for create an account:', req);
   var userSchema = mongoose.model('user');
   var datatosave = {
      emailId    : req.body.emailId,
      userName   : req.body.emailId,
      password   : req.body.password,
      gender     : req.body.gender,
      phoneNumber : req.body.phoneNumber
      
   };
   var user = new userSchema(datatosave);
   user.save(function(err, data){
     if(err){
        console.log("error: ", err); 
     }
     console.log('successfully save record', data);
     res.end();
   });
};

exports.getAllUnfriend = function (req, res, next) {
    var ObjectID = require('mongodb').ObjectID;
    var genderType = req.params.gendertype;
    var userId = req.params.userid;
  
    var eventEmitter = new events.EventEmitter();
  
    eventEmitter.on('getUserInfo', function(){
      var fieldToReturn = {userName:1, emailId:1, firstName:1, lastName:1,
                        phoneNumber:1, gender:1, state:1, country:1,
                        requestSentFriend:1, friends:1};
      user.getOneById( userId, fieldToReturn, function (err, data) {
         if(err){
             throw err;
         } else {
             if(data == null){
                 res.json({msg:"user does not exist", msgType:"error"});
             }else{
                 eventEmitter.emit('getUnfriendList', data);
             }
         }
      });    
      
    });
  
    eventEmitter.on('getUnfriendList', function(data){
      var alreadyfrdrequestsent = data.requestSentFriend;
      console.log('data id: ', data._id);
      console.log('object data id: ',new ObjectID(data._id));
      alreadyfrdrequestsent.push(new ObjectID(data._id));
      var friendlist = [];
      friendlist.push(new ObjectID(data._id));
      console.log('frds: ', friendlist);
      var querycondition = {_id: {$nin:alreadyfrdrequestsent}, friends: {$nin:friendlist}, requestSentFriend: {$nin:friendlist}};
      console.log("query condition: ", querycondition);
      user.getAllUnfriends(querycondition, function (err, data) {
          if(err){
              console.log("Error: ", err);
              throw err;
          }else{
              res.json({friends: data});
          }
      });
    });
  
  eventEmitter.emit('getUserInfo');
    
};

exports.sendFriendRequest = function (req, res, next) {
    var userId = req.body.userId;
    var friendId = req.body.friendId;
    user.addFriendRequest(userId, friendId, function (err, data) {
       if(err){
         throw err;
       } else {
           console.log("result: ", data);
           res.end();
       }
    });


};

exports.acceptFriendRequest = function (req, res, next) {
    var userId = req.body.userId;
    var friendId = req.body.friendId;
    console.log('userid ', userId , ' friendid: ', friendId);
    var eventEmitter = new events.EventEmitter();
    eventEmitter.on('addFriendToAcceptedBy', function () {
        user.addFriendList(userId, friendId, function (err, data) {
            if(err){
                throw err;
            }else{
                eventEmitter.emit('addFriendToSentBy');
            }
        });
    });

    eventEmitter.on('addFriendToSentBy', function () {
        user.addFriendList( friendId, userId, function (err, data) {
            if(err){
                throw err;
            }else{
                eventEmitter.emit('removeFriendRequestFromFriendRequestSentBy');
            }
        });
    });

    eventEmitter.on('removeFriendRequestFromFriendRequestSentBy', function () {
        var dataToDelete = { requestSentFriend: userId };
        // Removing friendid from frd request sent by
        user.removeFromArray( friendId, dataToDelete, function (err, data) {
            if(err){
                throw err;
            }else{
                res.json({msg:"successfully added as a friend"});
            }
        });
    });

    eventEmitter.emit('addFriendToAcceptedBy');


};

exports.unfriend = function(req, res, next){
  var userId = req.body.userId;
  var friendId = req.body.friendId;
  var eventEmitter = new events.EventEmitter();
  
  eventEmitter.on('removeFriendIdFromInitializedby', function(){
     // remove friend id from unfriend initialized by
    user.removeFromArray( userId, { friends: friendId }, function (err, data) {
        if(err){
            throw err;
        }else{
            eventEmitter.emit('removeFriendIdFromMakingUnfriend');
        }
    });
  });
  
  eventEmitter.on('removeFriendIdFromMakingUnfriend', function(){
    user.removeFromArray( friendId, { friends: userId }, function (err, data) {
        if(err){
            throw err;
        }else{
            res.json({msg:"successfully remove from friend list."});
        }
    });
  });
 
  eventEmitter.emit('removeFriendIdFromInitializedby');
}

exports.followToUser = function(req, res){
  var followerUser =  req.body.follower;
  var followTo = req.body.followTo;
  var dataToSave = {follower: followerUser, followTo: followTo};
  follower.followToUser(dataToSave, function(err, followerData){
    if(err){
      throw new Error(err);
    }
    res.json({success:'success', msg:"successfully following now", isFollowing:true});
  });

};

exports.isFollowingUser = function(req, res){
  var followerUser = req.params.userId;
  var followToUsername = req.query.followToUsername;
  var eventEmitter = new events.EventEmitter();
  

  eventEmitter.on('getFollowToId', function(followerUser, followToUsername){
    var query = {userName: followToUsername};
    var returnfieldList = {};
    user.getOne(query, returnfieldList, function(err, followerUserData){
      if(err){
        throw new Error(err);
      }
      var followTo = followerUserData._id;
      console.log('followTo: ', followerUserData);
      eventEmitter.emit('isFollowingUser', followerUser, followTo);
    });
  });

  eventEmitter.on('isFollowingUser', function(followerUser, followTo){
    var query = {follower: followerUser, followTo: followTo};
    follower.isFollowingUser(query, function(err, followerData){
      if(err){
        throw new Error(err);
      }
      var isFollowing = false;
      if(followerData){
        isFollowing = true;
      }
      res.json({success:'success', isFollowing:isFollowing});
    });
  });

  eventEmitter.emit('getFollowToId', followerUser, followToUsername);  
};

exports.unfollowToUser = function(req, res){
  var followerUser = req.query.follower;
  var followTo = req.query.followTo;
  var query = {follower: followerUser, followTo: followTo};
  follower.unfollowToUser(query, function(err, followerData){
    if(err){
      throw new Error(err);
    }
    
    res.json({success:'success', isFollowing:false});
  });
};


exports.getUserInfo = function (req, res, next) {
    var username = req.params.profileUsername;
    var query = {userName:username};
    var fieldToReturn = {userName:1, emailId:1, firstName:1, middleName:1,
                        lastName:1, dob:1, height:1, gender:1, faceColor:1, 
                        abtyourself:1, profession:1, religion:1, caste:1,
                        subcaste:1, phoneNumber:1,  state:1, country:1, 
                        profilePic:1, coverPic:1, requestSentFriend:1, friends:1};
    user.getOne( query, fieldToReturn, function (err, data) {
       if(err){
           throw err;
       } else {
           if(data == null){
               res.json({msg:"user does not exist", msgType:"error"});
           }else{
               res.json({userInfo : data});
           }
       }
    });
}

exports.uploadnewprofilepic = function(req, res, next){ 
  var eventEmitter = new events.EventEmitter;
  let profilePicFile = req.files.file0;
  
  var model = JSON.parse(req.body.model);
  var userid = model.userid;
  var imagePath = __dirname + '/../public/images/'+ userid;
  
  eventEmitter.on('checkFolderExist', function(profilePicFile, imagePath, userid){
    if (!fs.existsSync(imagePath)){
      fs.mkdirSync(imagePath);
    }
    imagePath += '/profile.jpg';
    eventEmitter.emit('saveImageToDisk', profilePicFile, imagePath, userid);
  });
  
  eventEmitter.on('saveImageToDisk', function(profilePicFile, imagePath, userid){
    saveImageToDisk(profilePicFile, imagePath, function(err, data){
      if(err){
        return console.log('Error: ', err);
      }else{
        
        var query = {_id: userid};
        var dataToUpdate = {profilePic: true};
        eventEmitter.emit('updateUserSchema', query, dataToUpdate);
      }
    });
  });
  
  
  /*
     var query = {_id: profiledata.userid};
        var dataToUpdate = {profilePic: true};
        user.update(query, dataToUpdate, function(err, data){
          if(err){
            console.log('Error while updating profile image: ', err);
          }else{
            console.log('updated successfully: ', data);
            res.end();
          }
        });
  */
  
  eventEmitter.on('updateUserSchema', function(query, dataToUpdate){
    updateUserSchema(query, dataToUpdate, function(err, userData){
          if(err){
            throw new Error(err);
          }else{
          eventEmitter.emit('addPost',query._id);
          }
    });
  });
  
  eventEmitter.on('addPost', function(userid){
    var fieldtoinsert = {
       type: config.uploadProfilePicType,
       userId   : userid,
       createdBy : userid
   }
    post.insertDoc(fieldtoinsert,  function(err, postData){
       if(err){
         throw new Error(err);
       }else{
         console.log('PostData: ', postData);
         eventEmitter.emit('addHistory', postData, userid);
       }
    });
  });
  
  eventEmitter.on('addHistory', function(postData, userid){
    var dataToSave = {
              postId   : postData._id,
              createdBy: userid
            };
    history.addRecord(dataToSave, function(err, historyData){
      if(err){
        throw new Error(err);
      }else{
        res.send(historyData);
      }
    });
  });
  
 eventEmitter.emit('checkFolderExist', profilePicFile, imagePath, userid);
  
  
};


exports.uploadnewcoverpic = function(req, res, next){ 
  var BodyData = req.body.model;
  console.log('req: ', req);
  console.log('req files: ', req.files);
  let coverPicFile = req.files.file0;
  
  console.log('userid: ', req.body.model);
  var model = JSON.parse(req.body.model);
  var userid = model.id;
  console.log('userid: ', userid);
  var imagePath = __dirname + '/../public/images/'+ userid;
  console.log('img path: ', imagePath);
  var query = {_id: userid};
  var dataToUpdate = {coverPic: true};
  var eventEmitter = new events.EventEmitter();
  
  eventEmitter.on('checkFolderExist', function(coverPicFile, imagePath){
    if (!fs.existsSync(imagePath)){
      fs.mkdirSync(imagePath);
    }
    imagePath += '/coverpic.jpg';
    eventEmitter.emit('saveImageToDisk', coverPicFile, imagePath);
  });
  
  eventEmitter.on('saveImageToDisk', function(coverPicFile, imagePath){
    saveImageToDisk(coverPicFile, imagePath, function(err, data){
      if(err){
        return console.log('Error: ', err);
      }else{
        eventEmitter.emit('updateUserSchema', query, dataToUpdate);
      }
    });
  });
  
  eventEmitter.on('updateUserSchema', function(query, dataToUpdate){
    updateUserSchema(query, dataToUpdate, function(err, userData){
          if(err){
            throw new Error(err);
          }else{
          eventEmitter.emit('addPost',userid);
          }
    });
  });
  
  eventEmitter.on('addPost', function(userid){
    var fieldtoinsert = {
       type: config.uploadCoverPicType,
       userId   : userid,
       createdBy : userid
   }
    post.insertDoc(fieldtoinsert,  function(err, postData){
       if(err){
         throw new Error(err);
       }else{
         console.log('PostData: ', postData);
         eventEmitter.emit('addHistory', postData);
       }
    });
  });
  
  eventEmitter.on('addHistory', function(postData){
    var dataToSave = {
              postId   : postData._id,
              createdBy: userid
            };
    history.addRecord(dataToSave, function(err, historyData){
      if(err){
        throw new Error(err);
      }else{
        res.send(historyData);
      }
    });
  });
  
  eventEmitter.emit('checkFolderExist', coverPicFile, imagePath);  
};

function saveImageToDisk(coverPicFile, pathToSave, callback){
  // Use the mv() method to place the file somewhere on your server 
  coverPicFile.mv(pathToSave, function(err) {
    if (err)
      return callback(err, null);
 
    callback(null, 'successfully save to disk');
  });
}


function updateUserSchema(query, dataToUpdate, callback){
  
  user.update(query, dataToUpdate, function(err, data){
    if(err){
      console.log('Error while updating profile image: ', err);
      callback(err);
    }else{
      console.log('updated successfully: ', data);
      
      callback(null, data);
    }
  });
}

function copyimageAndUpdateDb(profiledata, imagePath, res){
  copyToFolder(profiledata.data, imagePath, function(err, data){
      if(err){
        console.log('Error while copy image: ',err); 
      }else{
        var query = {_id: profiledata.userid};
        var dataToUpdate = {profilePic: true};
        user.update(query, dataToUpdate, function(err, data){
          if(err){
            console.log('Error while updating profile image: ', err);
          }else{
            console.log('updated successfully: ', data);
            res.end();
          }
        });
      }
    });
}

function copyToFolder(profiledata, imagePath, callback){
  var base64Data = profiledata.replace(/^data:image\/jpeg;base64,/, "");
  fs.writeFile(imagePath, base64Data, 'base64', function(err) {
    if(err){
      console.log('Error while copy image: ',err); 
      callback(err, null);
    }else{
      callback(null, true);
    }
    
  });
}

exports.updateuserintro = function(req, res, next){
  var userId = req.body.userId;
  var query = {_id: userId};
  var dataToUpdate = req.body;
  delete dataToUpdate.userId;
  user.update(query, dataToUpdate, function(err, data){
    if(err){
      console.log('Error while updating profile image: ', err);
    }else{
      console.log('updated successfully: ', data);
      res.end();
    }
  });
}

exports.getuserreference = function(req, res, next){
  var userid = req.query.userid;
  var query = {userid: userid};
  userpreference.getOne(query, function(err,data){
    if(err){
      throw err;
    }else{
      res.json({userpreference:data});
    }
  })
  
};


exports.updateuserreference = function(req, res, next){
  var userid = req.body.userid;
  console.log('body to set: ', req.body);
  var query = {userid: userid};
  var fieldToSet = req.body;
  userpreference.update(query, fieldToSet, function(err,data){
    if(err){
      throw err;
    }else{
      console.log('updated data: ', data);
      res.json({userpreference:data});
    }
  });
  
};

exports.addImage = function(req, res, next){


  var eventEmitter = new events.EventEmitter();
  var BodyData = req.body.model;
  console.log('req files: ', req.files);
  let imgFiles = req.files;
  
  console.log('userid: ', req.body.model);
  var model = JSON.parse(req.body.model);
  var userid = model.id;
  console.log('userid: ', userid);
  
  
  
  
  
  eventEmitter.on('createPost', function(){
    var dataToInsert = { type: config.uploadImageType, userId : userid, createdBy: userid};
    post.insertDoc(dataToInsert, function(err, albumData){
      if(err){
        throw err;
      }else{
        console.log('successfully added image post', albumData);
        eventEmitter.emit('checkFolderExist', albumData);
      }
    });
  });

  eventEmitter.on('checkFolderExist', function(albumData){
    var imagePath = __dirname + '/../public/images/'+ userid + '/image'+'/'+albumData._id;
    console.log('Image path: ', imagePath);
    if (!fs.existsSync(imagePath)){
      console.log('creating folder');
      fs.mkdirSync(imagePath);
    }
    eventEmitter.emit('saveImageToDisk', albumData);
  });
  
  eventEmitter.on('saveImageToDisk', function(albumData){
    var imagePath = __dirname + '/../public/images/'+ userid + '/image'+'/'+albumData._id;    
    console.log('saving images folder: ', imagePath);
    async.forEach(Object.keys(imgFiles), function (imgfile, callback){ 
      console.log();
      var filename = moment().format("DD_MM_YYYY_h_mm_ss") + randomNumber(1000, 10000)+ '.jpg';
      var filepath = imagePath + '/'+ filename;
      saveImageToDisk(imgFiles[imgfile], filepath, function(err, data){
        if(err){
          return console.log('Error: ', err);
        }else{
          var fieldtoinsert = {title:model.title, belongsTo:[model.id], postId: albumData._id, filepath:filename, createdby: model.id};
          document.insertDoc(fieldtoinsert, function(err){
            if(err){
              throw err;
            }else{
              callback();    
            }
          });
          
          
        }
      });
      
    }, function(err){
        if(err){
          console.log('Error: ', err); 
        }          
        eventEmitter.emit('addHistory',albumData);
    });
  });
  
  eventEmitter.on('addHistory', function(postData){
    var dataToSave = {
              postId   : postData._id,
              createdBy: userid
            };
    history.addRecord(dataToSave, function(err, historyData){
      if(err){
        throw new Error(err);
      }else{
        res.send(historyData);
      }
    });
  });
  
  eventEmitter.emit('createPost');
  
};

exports.getImagelistforuser = function(req, res, next){
  var userid = req.query.userid;
  console.log('', userid);
  var query = {belongsTo: {$in:[userid]}};
  var fieldToGet = {title:1, filepath:1, createdby:1, createdDate:1, postId:1};
  document.getAll(query, fieldToGet, function(err, data){
    if(err){
      throw err;
    }else{
      res.json({imagelist:data});
    }
  });
  
};

exports.addAlbum = function(req, res, next){
  var eventEmitter = new events.EventEmitter();
  var BodyData = req.body.model;
  console.log('req files: ', req.files);
  let imgFiles = req.files;
  
  console.log('userid: ', req.body.model);
  var model = JSON.parse(req.body.model);
  var userid = model.id;
  var title = model.title;
  console.log('userid: ', userid);
  
  
  
  
  
  eventEmitter.on('createPost', function(){
    var dataToInsert = {title: title, type: config.uploadAlbumType, userId : userid, createdBy: userid};
    post.insertDoc(dataToInsert, function(err, albumData){
      if(err){
        throw err;
      }else{
        console.log('successfully added album', albumData);
        eventEmitter.emit('checkFolderExist', albumData);
      }
    });
  });

  eventEmitter.on('checkFolderExist', function(albumData){
    var imagePath = __dirname + '/../public/images/'+ userid + '/image'+'/'+albumData._id;
    if (!fs.existsSync(imagePath)){
      fs.mkdirSync(imagePath);
    }
    eventEmitter.emit('saveImageToDisk', albumData);
  });
  
  eventEmitter.on('saveImageToDisk', function(albumData){
    var imagePath = __dirname + '/../public/images/'+ userid + '/image'+'/'+albumData._id;    
    async.forEach(Object.keys(imgFiles), function (imgfile, callback){ 
      console.log();
      var filename = moment().format("DD_MM_YYYY_h_mm_ss") + randomNumber(1000, 10000)+ '.jpg';
      var filepath = imagePath + '/'+ filename;
      saveImageToDisk(imgFiles[imgfile], filepath, function(err, data){
        if(err){
          return console.log('Error: ', err);
        }else{
          var fieldtoinsert = {title:model.title, belongsTo:[model.id], postId: albumData._id, filepath:filename, createdby: model.id};
          document.insertDoc(fieldtoinsert, function(err){
            if(err){
              throw err;
            }else{
              callback();    
            }
          });
          
          
        }
      });
      
    }, function(err){
        if(err){
          console.log('Error: ', err); 
        }          
        eventEmitter.emit('addHistory',albumData);
    });
  });
  
  eventEmitter.on('addHistory', function(postData){
    var dataToSave = {
              postId   : postData._id,
              createdBy: userid
            };
    history.addRecord(dataToSave, function(err, historyData){
      if(err){
        throw new Error(err);
      }else{
        res.send(historyData);
      }
    });
  });
  
  eventEmitter.emit('createPost');
}

exports.getAlbumList = function(req, res, next){
  var userId = req.query.userid;
  var postref = mongoose.model( 'post');
  var documentref = mongoose.model( 'document');
  var eventEmitter = new events.EventEmitter();
  eventEmitter.on('albumlist', function(){
    postref.find({userId:userId, type:config.uploadAlbumType}).lean().exec(function(err, data){
      if(err){
        throw err;
      }
      console.log('Data: ', data);
      
      eventEmitter.emit('imagelistofalbum', data);
    });
  });
  
  eventEmitter.on('imagelistofalbum', function(albumlist){
    async.forEach(albumlist, function(item, callback){
      console.log('item: '. item);
      documentref.find({postId: item._id}, function(err, data){
        if(err){
          console.log('doc err: ', err);
        }
        console.log('doc for post: ', data);
        item.documents = data;
        callback();
      })
    }, function(err){
      if(err){
        console.log('error: ', err);
      }
      console.log('result: ', albumlist);
      res.json({albumlist:albumlist});
    });
  });
  eventEmitter.emit('albumlist');
};

exports.getImagelistforAlbum = function(req, res, next){
  var userid = req.query.userid;
  var albumid = req.query.albumid;
  console.log('postId: ', albumid);
  var query = {postId: albumid};
  var fieldToReturn = {};
  document.getAll(query, fieldToReturn, function(err, data){
    if(err){
      console.error('Error: ', err);
      throw err;
    }
    console.log('Data: ', data);
    res.json({imagelist: data});
  });
}


exports.addStatus = function(req, res, next){
  var eventEmitter = new events.EventEmitter();
  var BodyData = req.body.model;
  console.log('req files: ', req.files);
  let imgFiles = req.files;
  
  console.log('userid: ', req.body.model);
  var model = JSON.parse(req.body.model);
  var userid = model.id;
  var status = model.status;
  console.log('userid: ', userid);
  
  
  
  
  
  eventEmitter.on('createPost', function(){
    var dataToInsert = {statusMsg: status, type: config.uploadStatusType, userId : userid, createdBy: userid};
    post.insertDoc(dataToInsert, function(err, albumData){
      if(err){
        throw err;
      }else{
        console.log('successfully added status', albumData);
        eventEmitter.emit('checkFolderExist', albumData);
      }
    });
  });

  eventEmitter.on('checkFolderExist', function(albumData){
    var imagePath = __dirname + '/../public/images/'+ userid + '/image'+'/'+albumData._id;
    console.log('Image path: ', imagePath);
    if (!fs.existsSync(imagePath)){
      console.log('creating folder');
      fs.mkdirSync(imagePath);
    }
    eventEmitter.emit('saveImageToDisk', albumData);
  });
  
  eventEmitter.on('saveImageToDisk', function(albumData){
    var imagePath = __dirname + '/../public/images/'+ userid + '/image'+'/'+albumData._id;    
    console.log('saving images folder: ', imagePath);
    async.forEach(Object.keys(imgFiles), function (imgfile, callback){ 
      console.log();
      var filename = moment().format("DD_MM_YYYY_h_mm_ss") + randomNumber(1000, 10000)+ '.jpg';
      var filepath = imagePath + '/'+ filename;
      saveImageToDisk(imgFiles[imgfile], filepath, function(err, data){
        if(err){
          return console.log('Error: ', err);
        }else{
          var fieldtoinsert = {title:model.title, belongsTo:[model.id], postId: albumData._id, filepath:filename, createdby: model.id};
          document.insertDoc(fieldtoinsert, function(err){
            if(err){
              throw err;
            }else{
              callback();    
            }
          });
          
          
        }
      });
      
    }, function(err){
        if(err){
          console.log('Error: ', err); 
        }          
        eventEmitter.emit('addHistory',albumData);
    });
  });
  
  eventEmitter.on('addHistory', function(postData){
    var dataToSave = {
              postId   : postData._id,
              createdBy: userid
            };
    history.addRecord(dataToSave, function(err, historyData){
      if(err){
        throw new Error(err);
      }else{
        res.send(historyData);
      }
    });
  });
  
  eventEmitter.emit('createPost');
}

function randomNumber(min, max){
  var min = Math.ceil(min);
  var max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}