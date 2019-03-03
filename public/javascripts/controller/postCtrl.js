angular.module('freeMarriage')
.controller('postCtrl', function($scope, $http, $rootScope){
  console.log('Post ctrl');
  $scope.postList = [];
  $scope.post = {};
  $scope.post.id = $rootScope.userInfo._id;
  $scope.files = {};
  $scope.files.addImage = [];
  $http.get('/api/historyList?userId='+$rootScope.userInfo._id + '&skipNo='+0).then(function(data){
    console.log('post data: ', data.data.posts);
    for(var i=0; i<data.data.posts.length; i++){
      $scope.postList.push(data.data.posts[i]);  
    }
    
  }, function(err){
    console.log('Error: ', err);
    alert('Something went wrong. Try again after some times');
  });

  $scope.addphoto = function ($files, imgType) {
    $scope.$apply(function(){
      $scope.addImage = true;  
    });
    
    angular.forEach($files, function (value, key) {
        console.log("values: ", value);
        console.log('images: ', $scope.files.addImage);
        $scope.files.addImage.push(value);
        var reader = new FileReader();

        reader.onload = function (e) {
            var profilepic = e.target.result;
            var imgDiv = '<div class="photodiv"><img src="'+profilepic+'"></div>';
            $('.addMoreImage').before(imgDiv);
        };

        reader.readAsDataURL(value);
    });
  };


  $scope.addStatus = function(){
    if(!$scope.post.id){
      $scope.post.id = $rootScope.userInfo._id;
    }
    $http({  
      method: 'POST',  
      url: "/api/post/addStatus",  
      headers: { 'Content-Type': undefined },  
       
      transformRequest: function (data) {  
          var formData = new FormData();  
          formData.append("model", angular.toJson(data.model));
          if(data.files){
            for (var i = 0; i < data.files.length; i++) {  
                formData.append("file" + i, data.files[i]);  
            }  
          }
            
          return formData;  
      },  
      data: { model: $scope.post, files: $scope.files.addImage }  
  }).  
  success(function (data, status, headers, config) {  
    console.log('data: ', data);
    var msg;
    $scope.files.addImage = [];
    $scope.addImage = false;
    $scope.post = {};
    console.log('successfully updated cover pic: ');
    //userInfo.showNotificationMessage(msg);
  }).  
  error(function (data, status, headers, config) {  
      alert("failed!");  
  });


  };



});