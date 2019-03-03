angular.module('freeMarriage')
  .controller('resetpasswordCtrl', function($scope, $cookies, $http, $stateParams, $state){
     $scope.user = {};
     var token = $stateParams.token;
     $scope.resetpassword = function(){
       var dataToSend = {};
       dataToSend.newpassword = $scope.user.newpassword;
       dataToSend.token = token;
       $http.post('/resetpassword', dataToSend).then(function(data){
         if(data.data.status == "failed"){
           console.log('error res: ', data);
         }else if(data.data.status == "success"){
           console.log('success res: ', data);
           $state.go('login');
         }
       },function(err){
         console.log('Error: ', err);
       });

     };
});