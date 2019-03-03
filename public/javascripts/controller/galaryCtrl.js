angular.module('freeMarriage')
  .controller('galaryCtrl', function($scope, $state, $rootScope, $http){
  $scope.galary = {};
  $scope.galary.active = false;
  
  console.log('galary ctrl');
  
  $scope.$on('imageSelected', function(event, args, selectedImg){
    console.log('images: ', args);
    $scope.galary.args = args;
    $scope.galary.active = true;
    $scope.galary.imageList = args.img;
    $scope.galary.selectedImage = args.selectedImg;
    if(args.imgType){
      $scope.galary.selectedImageUrl = selectedImageForProfile(args.selectedImg, args.userId);
    }else{
      $scope.galary.selectedImageUrl = $scope.galary.imageList[$scope.galary.selectedImage];
        
    }
    
  });
  
  $scope.closeGalary = function(){
    $scope.galary.active = false;
  };
  
  $scope.nextPrevSelectImage = function(selectedImg){
    console.log('selectedImg: ', selectedImg);
    $scope.galary.selectedImage = selectedImg;
    if($scope.galary.args.imgType){
      $scope.galary.selectedImageUrl = selectedImageForProfile(selectedImg, $scope.galary.args.userId);
    }else{
      $scope.galary.selectedImageUrl = $scope.galary.imageList[selectedImg];
    }
  }
  
  function selectedImageForProfile(selectedImg, userId){
    var imgObj = $scope.galary.imageList[selectedImg];
    var selectedImgUrl = imgObj.postId?('images/'+userId+'/image/'+imgObj.postId+'/'+imgObj.filepath):('images/'+userId+'/image/'+imgObj.filepath);
    return selectedImgUrl;
  }
  
});