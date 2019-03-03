angular.module('freeMarriage')
  .controller('loginCtrl', function($scope, login, sessionService,  $state, $rootScope,
                                    socket){
     console.log("welcome to login");
   $scope.user = {};
   $scope.login = function(){
     console.log("email id: ", $scope.user.emailId);
     console.log("password: ", $scope.user.password);
     login.save($scope.user,function(res){
        if(res && res.msgType == "success"){
          console.log("successfully logged In",res );
          $rootScope.userInfo = res.user;
          sessionService.setToken(res.token); 
          socket.reconnect();
          $state.go("home");
          console.log("userinfo: ", $rootScope.userInfo);
        }else{
          console.log("something went wrong.", res);
          alert("Email or password is not correct");
        }
         
     }, function (err) {
         console.log("something went wrong.please try again.");
         alert("something went wrong.please try again.");
     });
   };
});