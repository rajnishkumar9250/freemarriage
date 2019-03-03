var user = require('./freeMarriage/user');
var message = require('./freeMarriage/message');
var history = require('./freeMarriage/history');

exports = module.exports = function(route, app) {
  app.get('/',require('./routes/index').index);
  app.get('/getUserDetailsByToken', require('./freeMarriage/user').getUserDetailsForByTokenId);
  app.post('/api/createMarriageCount',  require('./freeMarriage/user').createMarriageCount);
  app.post('/login', require('./freeMarriage/user').login);

  app.post('/forgetpassword', user.forgetpassword);
  app.post('/resetpassword', user.resetpassword);
  app.get('/getunfriendlist/:userid/:gendertype', require('./freeMarriage/user').getAllUnfriend);
  app.post('/friend/sendFriendRequest', require('./freeMarriage/user').sendFriendRequest);
  app.post('/friend/acceptFriendRequest',  require('./freeMarriage/user').acceptFriendRequest);
  app.post('/friend/unFriend', require('./freeMarriage/user').unfriend);
  app.get('/getUserDetails/:profileUsername', require('./freeMarriage/user').getUserInfo);
  app.post('/api/uploadnewprofilepic', require('./freeMarriage/user').uploadnewprofilepic);
  app.post('/api/uploadnewcoverpic', require('./freeMarriage/user').uploadnewcoverpic);
  app.put('/api/updateuserintro', require('./freeMarriage/user').updateuserintro);
  app.get('/api/userreference', require('./freeMarriage/user').getuserreference);
  app.put('/api/userreference', require('./freeMarriage/user').updateuserreference);
  app.post('/api/friend/followToUser',  user.followToUser);
  app.get('/api/friend/:userId/isfollowingUser',  user.isFollowingUser);
  app.delete('/api/friend/followToUser',  user.unfollowToUser);



  app.get('/getoldmessageoftwouser', require('./freeMarriage/message').getOldMessageOfTwoUser);

  app.get('/chatlist', message.chatlist);
  app.post('/api/addImage', require('./freeMarriage/user').addImage);
  app.get('/api/getImagelistforuser', require('./freeMarriage/user').getImagelistforuser);
  app.post('/api/addAlbum', require('./freeMarriage/user').addAlbum);
  app.get('/api/getAlubmlistforuser', require('./freeMarriage/user').getAlbumList);
  app.get('/api/getImagelistforalbum', require('./freeMarriage/user').getImagelistforAlbum);
  app.post('/api/post/addStatus', require('./freeMarriage/user').addStatus);


  
  app.get('/api/historyList', history.historiesList);
};
