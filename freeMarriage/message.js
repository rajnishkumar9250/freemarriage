var mysql_msg = require('./../schema/mysql/messge');
var mongo_user = require('./../schema/user');

exports.insertMessage = function(dataToInsert){
  mysql_msg.InsertMessage(dataToInsert, function(err, data){
    if(err){
      console.log('Error: ', err);
      throw err;
    }else{
      console.log('message inserted into table: ', data);
    }
  })
};

exports.getOldMessageOfTwoUser = function(req, res, next){
  var user1 = req.query.user1;
  var user2 = req.query.user2;
  
  var msgLimit = 20;
  var reqData = [user1, user2, user2, user1, msgLimit];
  
  
  mysql_msg.getOldMessageOfTwoUser(reqData, function(err, data){
    if(err){
      console.log('Error: ', err);
      throw err;
    }else{
      console.log('message inserted into table: ', data);
      res.json({message: data});
    }
  })
    
}

exports.chatlist = function(req, res, next){
  var userId = req.query.userId;
  var reqData = [userId, userId];
  mysql_msg.getChatList(reqData, function(err, data){
    if(err){
      console.log('Error: ', err);
      throw err;
    }else{
      console.log('Data: ', data);
      var friendsIds = [];
      var msgList = [];
      var frdId;
      console.log('total msg: ', data.length);
      for(var i=0; i<data.length; i++){
        console.log('value of i: ', i);
        if(data[i].sendto != userId){
          console.log('sender frd');
          frdId = data[i].sendto;
        }else{
          console.log('user frd');
          frdId = data[i].sendby;
        }
        if(friendsIds.indexOf(frdId) == -1){
          friendsIds.push(frdId);
          msgList.push(data[i]);
        }
      }
      console.log('unique msg list: ', msgList);
      mongo_user.getUserlistByIds(friendsIds, function(err, userData){
        if(err){
          console.log('error: ', err);
          throw err;
        }else{
          console.log('User data', userData);
          // add friend info into msg list 
          for(var j=0; j<msgList.length ; j++){
              for(var k=0; k<userData.length; k++){
                if(msgList[j].sendto == userData[k]._id || msgList[j].sendby == userData[k]._id){
                  msgList[j].friendInfo = userData[k];
                }
              }
          }
          res.json({msg:msgList});
        }
      });
      
    }
  });
}

