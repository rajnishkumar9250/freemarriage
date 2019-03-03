angular.module('freeMarriage')
  .controller('unfriendCtrl', function($scope, $state, $rootScope, $http){
        console.log("welcome to unfriend list ");
        var userId = $rootScope.userInfo._id;
        $http.get('/getunfriendlist/'+userId+'/female').then(function (res) {
            $scope.unfriendlist = res.data.friends;
            console.log("unfrds: ", $scope.unfriendlist);
        }, function (err) {
            console.log("Error: ", err);
        });

      $scope.removeFrdProfile = function ($event) {
          console.log("This: ",$event);
          $event.stopPropagation();
          console.log("This: ",$event.target );
          //$event.target.remove();
          console.log("Parent ref: ", $event);
          $($event.currentTarget).remove();

          //$event.toElement.parentElement.outerHTML.remove();
          /*var target = angular.element($event.target);
          console.log("parent ele: ", target.parent())
          target.parent().remove();*/
      };

      $scope.sendFrdRequest = function (frdId) {
          var dataToSend = {};
          dataToSend.userId = $rootScope.userInfo._id;
          dataToSend.friendId = frdId;
          console.log("Data To Send: ", dataToSend);
          $http.post('/sendFriendRequest', dataToSend).then(function (res) {
              $scope.unfriendlist = res.data.friends;
          }, function (err) {
              console.log("Error: ", err);
          });
      }
});