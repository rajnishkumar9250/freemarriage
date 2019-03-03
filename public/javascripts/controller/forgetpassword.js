angular.module('freeMarriage')
  .controller('forgetpasswordCtrl', function($scope, $cookies, $http){
   $scope.user = {};
   $scope.forgetpassword = function(){
     console.log("email id: ", $scope.user.emailId);
     var dataToSend = {emailId: $scope.user.emailId};
     $http.post('/forgetpassword', dataToSend).then(function(data){
       if(data.data.status == "failed"){
         console.log('Error message: ', dataToSend.message);
       }else if(data.data.status == "success"){
         console.log('Success message: ', dataToSend.message);
       }
     }, function(err){
         console.log('Error: ', err);
     });
     
   };
});