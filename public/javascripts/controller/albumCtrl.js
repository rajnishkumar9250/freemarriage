angular.module('freeMarriage')
.controller('albumCtrl', function($scope, $state, $rootScope, $http, $stateParams, broadcastToCtlr){
  console.log('albumCtrl');
  
  $scope.userId = $stateParams.userid;
  $scope.currentAlbumId = $stateParams.albumid;
  $scope.getImageList = function(){
    console.log('userid: ', $scope.userId);
    $http.get('/api/getImagelistforalbum?albumid='+$scope.currentAlbumId+ '&userid='+$scope.userId).then(function(data){
      console.log('image list: ', data);
      $scope.imglist = data.data.imagelist;
      console.log('img list: ', $scope.imglist);
    }, function(err){
      console.log('image list err: ', err);
    });
  };
  $scope.getImageList();     
  $scope.getAlbumList = function(){
    console.log('userid: ', $scope.userId);
    $http.get('/api/getAlubmlistforuser?userid='+$scope.userId).then(function(data){
      console.log('image list: ', data);
      $scope.albumlist = data.data.albumlist;
      console.log('img list: ', $scope.imglist);
    }, function(err){
      console.log('image list err: ', err);
    });  
  };
  $scope.getAlbumList();
  
  $scope.imageSelected = function(img, selectedImg, imgType){
    console.log('selected img: ', img, ' selectedImg: ', selectedImg);
    var data = {
      img: img,
      selectedImg: selectedImg,
      imgType: imgType,
      userId: $scope.userId
    };
    broadcastToCtlr.broadcastImageSelected(data);
  };
});