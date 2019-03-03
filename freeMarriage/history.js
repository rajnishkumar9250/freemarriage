var events = require('events');
var async    = require('async');


var config = require('./../config');
var history = require('./../schema/history');
var follower = require('./../schema/follower');
var document = require('./../schema/document');




exports.addRecord = function(dataToInsert, callback){
  history.addHistory(dataToInsert, function(err, res){
    if(err){
      console.log('err: ', err);
      callback(err);
    }else{      
      callback(null, res);
    }
  });
}

exports.historiesList = function(req, res){
  var eventEmitter = new events.EventEmitter();
  var dataToQuery = {};
  dataToQuery.userId = req.query.userId;
  dataToQuery.skipNo = req.query.skipNo;
  dataToQuery.limitNo = config.historyLimit; //req.query.limitNo ;
  
  
  
  eventEmitter.on('followToList', function(userId){
    var query = { follower: userId};
    follower.followToList(query , function(err, followToData){
      if(err){
        return new Error(err);
      }
      
      if(followToData){
        console.log('followTo: ', followToData);
        var followTo = [];
        for(var i=0; i<followToData.length; i++){
          followTo.push(followToData[i].followTo);
        }
        dataToQuery.query = {"createdBy" : { $in: followTo}};
        eventEmitter.emit('historyList');
      }
    });
  });
  
  eventEmitter.on('historyList', function(){
    history.getRecordByPagination(dataToQuery, function(err, historiesData){
      if(err){
        throw new Error(err);
      }else{

        async.forEach(historiesData, function (historyData, callback){ 
          console.log();
          if(historyData.postId.type !== 'uploadalbum' && historyData.postId.type !== 'uploadstatus'
           && historyData.postId.type !== 'uploadimage'){
            callback();
          }else{
            console.log('history Data: ', historyData);
            var query = {postId:historyData.postId._id};
            var fieldToGet = {'postId':1, 'filepath':1, 'createdby':1};
            document.getAll(query, fieldToGet, function(err, docu){
              if(err){
                throw new Error(err);
              }
              console.log("doc: ", docu);
              console.log('post doc: ', historyData.postId);
              historyData.postId.document = docu;
              callback();
            });
          }
          
        }, function(err){
            if(err){
              console.log('Error: ', err); 
            }          
            res.json({posts:historiesData});
        });







        
      }
    });  
  });
  
  eventEmitter.emit('followToList', dataToQuery.userId);
};