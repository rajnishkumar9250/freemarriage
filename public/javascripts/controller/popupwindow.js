angular.module('freeMarriage')
  .controller('popupWindowCtrl', function($scope, $rootScope){
     console.log("welcome to popup window ctrl");
     $scope.closePopupWindow = function(){
            console.log("close popup");
            $rootScope.popupWrap = false;
        }
});