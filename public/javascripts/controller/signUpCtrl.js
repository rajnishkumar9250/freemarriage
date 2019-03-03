angular.module('freeMarriage')
.controller('signupCtrl', function($scope, $http, $state){
    console.log("welcome to sign up");
    $scope.signup = function(){
       console.log('user data:', $scope.user);
       $http.post('/api/createMarriageCount', $scope.user).
       then(function(data){
          console.log('success:', data);
           $state.go('login');
       }, function(error){
          console.log('success:', error);
       });
    }
});