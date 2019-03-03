angular.module('freeMarriage')
  .controller('navMenuCtrl', function($scope, $rootScope, $state, sessionService, socket, $http, broadcastToCtlr){
    console.log("welcome to navbar menu");


    $scope.signOut = function(){
      console.log("sign out called");
      //signOut.logOut();
      socket.disconnect();
      sessionService.removeToken();
      $rootScope.userInfo = undefined;
      $state.go('home');
    };
    
    $scope.showChats = function(){
      $('.drop-down-submenu').show();
      $http.get('/chatlist?userId='+$rootScope.userInfo._id).then(function(data){
        console.log('data: ', data);
        $scope.messageList = data.data.msg;
      }, function(err){
        console.log('error: ', err);
      });
    };
    
    $scope.setSenderId = function(userId, userName){
      var data = {
        userName: userName,
        userId: userId
      };
      broadcastToCtlr.broadcastUserSelectedForChat(data);  
    }
    
      
});