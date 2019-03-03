'use strict'; 
exports = module.exports = function(app, mongoose) {
   var Schema   = mongoose.Schema;

   var Todo = new Schema({
       postId    : {'type': mongoose.Schema.Types.ObjectId, ref:'post'},
       createdBy :{'type': mongoose.Schema.Types.ObjectId, ref:'user'},
       createdDate : {type:Date,default:new Date()}
   });
   var history = mongoose.model( 'history', Todo );

  exports.getHistoryTableRef = function(){
    return history;
  };
  
  exports.addHistory = function(dataToInsert, callback){
    var historySchema = mongoose.model('history');
    var history = new historySchema(dataToInsert);
    history.save(function(err, data){
     if(err){
        console.log("error: ", err);
        callback(err);
     }
     console.log('successfully save record', data);
     callback(null, data);
    });
  };
  
  exports.getOneById = function (Id, returnfieldList,  done) {
      var query = history.findById(Id, returnfieldList);
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
      var query = history.findOne(queryCondition, returnfieldList).populate('friends');
      query.exec( function (err, data) {
          if(err){
              console.log("Error: ", err);
              done(err);
          }else{
              done(null, data)
          }
      });
  };

  exports.getAllHistories = function (done) {
        history.find({}, function (err, data) {
            if(err){
                done(err);
            }else{
                done(null, data);
            }
        });
    };
  
  exports.getRecordByPagination = function(data, callback){
    console.log('query: ', data.query);
    var histRef = history.find(data.query).skip(parseInt(data.skipNo)).limit(parseInt(data.limitNo)).populate('postId').populate('createdBy', {'firstName':1, lastName :1, userName:1, profilePic:1}).sort({ createdDate : -1});
    histRef.lean().exec(function(err, historiesData) { 
      if(err){
        callback(err);
      }else{
        callback(null, historiesData);
      }
    });
  };
};
