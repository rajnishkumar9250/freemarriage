angular.module('freeMarriage')
.controller('profileCtrl', function($scope, $location, $routeParams, $stateParams, $http, $rootScope, $state, userInfo, _, broadcastToCtlr){
  console.log(1+"profile js %d", 2);
  console.log("routeparams: ", $stateParams);
  var profileUsername = $stateParams.username;
  var profile_menu_selected = $location.search().menu;
  console.log("user info: ", $rootScope.userInfo);
  
  
  $scope.user_profile = {};
  $scope.activeMenu = 'about';
  $scope.files = {};
  $scope.files.addImage = [];
  $scope.files.addAlbum = [];
  $scope.album = {};
  
  $http.get('/getUserDetails/'+profileUsername).then(function (data) {

    $scope.profileUserInfo = data.data.userInfo;
    
     userpreference();
     $scope.userintro  = $scope.profileUserInfo ;
    
     $scope.profilepic = userInfo.getProfilePic($scope.profileUserInfo);
     /*if($scope.profileUserInfo.profilePic){
       $scope.profilepic = 'images/' + $scope.profileUserInfo._id + '/profile.jpg';
     }else{
       $scope.profilepic = 'images/default_user.png';
     }*/
    
     if($scope.profileUserInfo.coverPic){
       $scope.profileCoverPic = 'images/' + $scope.profileUserInfo._id + '/coverpic.jpg';
     }else{
       $scope.profileCoverPic = "./../../images/coverPic.jpeg";

     }
     $scope.friends = $scope.profileUserInfo.friends;
     var frdListId = [];
     for(var i=0;i<$rootScope.userInfo.friends.length; i++){
       frdListId.push($rootScope.userInfo.friends[i]._id);
     }
     console.log("profile user info: ", $scope.profileUserInfo);
     console.log('frds list: ', frdListId);
     console.log('profile frds: ',$scope.profileUserInfo._id);
     console.log('already frds: ', frdListId.indexOf($scope.profileUserInfo._id));
     if($scope.profileUserInfo._id == $rootScope.userInfo._id){
       $scope.frdRequestStatus = "myself";
       console.log("myself");
     }else if(frdListId.indexOf($scope.profileUserInfo._id) > -1){
       $scope.frdRequestStatus = "friend";
       console.log("myfriend");
     }else if($rootScope.userInfo.requestSentFriend && $rootScope.userInfo.requestSentFriend.indexOf($scope.profileUserInfo._id) > -1){
       $scope.frdRequestStatus = "friendRequestAlreadySent";
       console.log("already frd request sent");
     }else if($scope.profileUserInfo.requestSentFriend && $scope.profileUserInfo.requestSentFriend.indexOf($rootScope.userInfo._id) > -1){
       $scope.frdRequestStatus = "acceptFriendRequest";
       console.log("accept frd request");
     }else {
       $scope.frdRequestStatus = "addFriend";
       console.log("add friend");
     }

     console.log("get user details in profile: ", $scope.userInfo);
     $scope.getImageList();
     $scope.getAlbumList();
  }, function (err) {
     console.log("Something went wrong! please try again");
  });



  function isFollowingToUser(followToUsername){
    $http.get('api/friend/'+ $rootScope.userInfo._id +'/isfollowingUser?followToUsername='+followToUsername).then(function(following){
      console.log('data following: ', following.data);
      $scope.following = following.data.isFollowing;
          
    }, function(err){
      console.log('Error: ', err);
    });
  }
  
  isFollowingToUser(profileUsername);

  $scope.unfollowToUser = function(){
    var dataToSend = {follower: $rootScope.userInfo._id, followTo: $scope.profileUserInfo._id};
    $http.delete('/api/friend/followToUser', {params: dataToSend}).then(function(followData){
      $scope.following = followData.data.isFollowing;
    }, function(err){
      console.log('Error: ', err);
    });

  };

  $scope.followToUser = function(){
    var dataToSend = {follower: $rootScope.userInfo._id, followTo: $scope.profileUserInfo._id};
    $http.post('/api/friend/followToUser', dataToSend).then(function(followData){
      console.log('followdata: ', followData);
      $scope.following = followData.data.isFollowing;
      console.log('following: ', $scope.following);
    }, function(err){
      console.log('Error: ', err);
    });
  };
    

  $scope.sendFriendRequest = function(){
    var dataToSend = {userId: $rootScope.userInfo._id, friendId : $scope.profileUserInfo._id};
    $http.post('/friend/sendFriendRequest', dataToSend).then(function(data){
      $scope.refresh();
    },
    function(err){
      console.log('something went wrong');
    });
  };
  
  $scope.acceptFriendRequest = function(){
    var dataToSend = {userId: $rootScope.userInfo._id, friendId : $scope.profileUserInfo._id};
    $http.post('/friend/acceptFriendRequest', dataToSend).then(function(data){
      console.log("Now you become a friend");
      $scope.refresh();
    },
    function(err){
      console.log('something went wrong');
    });  
    
  };
  
  $scope.unFriend = function(){
    var dataToSend = {
                userId: $rootScope.userInfo._id, 
                friendId : $scope.profileUserInfo._id
              };
    $http.post('/friend/unFriend', dataToSend).then(function(data){
      $scope.refresh();
    },
    function(err){
      console.log('something went wrong');
    });
  };
  
  console.log(" menu selected option: ",profile_menu_selected);
  /*if(profile_menu_selected == "intro"){
    $scope.profile_menu_option_selected =  "./../views/profile/profile_intro.html";
  } else*/ 
  var activetab;
  if(profile_menu_selected == "preference"){
    activetab = $('#profilePref');
    $scope.profile_menu_option_selected = "./../views/profile/profile_preference.html";
  } else if(profile_menu_selected == "images"){
    activetab = $('#profileImage');
    $scope.profile_menu_option_selected =  "./../views/profile/profile_images.html";
  } else if(profile_menu_selected == "facebook"){
    activetab = $('#profileFacebook');
    $scope.profile_menu_option_selected =  "./../views/profile/profile_facebook.html";
  } else if(profile_menu_selected == "linkedIn"){
    activetab = $('#profileLinkedIn');
    $scope.profile_menu_option_selected =  "./../views/profile/profile_linkedIn.html";
  } else if(profile_menu_selected == "twitter"){
    activetab = $('#profileTwitter');
    $scope.profile_menu_option_selected =  "./../views/profile/profile_twitter.html";
  }else{
    $scope.user_profile.useredit = false;
    activetab = $('#profileIntro');//.addClass('selected');
    $scope.profile_menu_option_selected =  "./../views/profile/profile_intro.html";
  }
  console.log('selected submenu: ', activetab);
  activetab.addClass('selected');
  
  $scope.selectedMenu = function(menu){
    $scope.activeMenu = menu;
    console.log('selected menu: ',$scope.activeMenu);
  };
  
  $scope.uploadDocument = function ($files, imgType) {
    formdata = new FormData();
    $scope.newimageData = {};
    $scope.files.profilePic = {};
    $scope.files.profilePic.data = {};
    $scope.files.profilePic.files = [];
    angular.forEach($files, function (value, key) {
        console.log("values: ", value);
        formdata.append(key, value);
        $scope.files.profilePic.files.push(value);
        //$scope.newimageData[key] = {};
        $scope.files.profilePic.data.userid = $scope.profileUserInfo._id;  
        
        var reader = new FileReader();

        reader.onload = function (e) {
            $scope.profilepic = e.target.result;
            //$scope.newimageData[key].data = e.target.result;
            $scope.submitProfilePic();
        };

        reader.readAsDataURL(value);
    });
  };
  
  $scope.addphoto = function ($files, imgType) {
    $scope.$apply(function(){
      $scope.addImage = true;  
    });
    
    angular.forEach($files, function (value, key) {
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
  
  $scope.closeUploadImageOption = function(){
    //$scope.$apply(function(){
      $scope.addImage = false;  
    //});
  }
  
  $scope.submitAddImage = function(){
    $scope.user = {};
    $scope.user.id = $scope.profileUserInfo._id;
    $http({  
            method: 'POST',  
            url: "/api/addImage",  
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
            data: { model: $scope.user, files: $scope.files.addImage }  
        }).  
        success(function (data, status, headers, config) {  
          console.log('data: ', data);
          var msg;
          $scope.files.addImage = [];// clear selected image for add image
		  /*if(data.status == 'success'){
            msg = ' New Images added successfully';
            console.log('Data: ', data);
            $scope.files.addImage = [];// clear selected image for add image
          }else{
            msg = 'something went wrong:'+ data.user.data.message;
          }*/
          $scope.addImage = false;
          $scope.getImageList();
          console.log('successfully updated cover pic: ');
          //userInfo.showNotificationMessage(msg);
        }).  
        error(function (data, status, headers, config) {  
            alert("failed!");  
        });
    
  }
  
  $scope.createalbum = function ($files, imgType) {
    $scope.$apply(function(){
      $scope.addAlbum = true;
    });
    angular.forEach($files, function (value, key) {
        $scope.files.addAlbum.push(value);
        var reader = new FileReader();

        reader.onload = function (e) {
            
            var profilepic = e.target.result;
            var imgDiv = '<div class="albumdiv"><img src="'+profilepic+'"></div>';
            $('.addMoreAlbum').before(imgDiv);
        };

        reader.readAsDataURL(value);
    });
  };
  
  $scope.closeUploadAlbumOption = function(){
    $scope.addAlbum = false;
  };

  $scope.submitAddAlbum = function(){
    $scope.user = {};
    $scope.user.id = $scope.profileUserInfo._id;
    $scope.user.title = $scope.album.albumtitle;
    console.log('album title: ', $scope.user.title);
    $http({  
            method: 'POST',  
            url: "/api/addAlbum",  
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
            data: { model: $scope.user, files: $scope.files.addAlbum }  
        }).  
        success(function (data, status, headers, config) {  
          console.log('data: ', data);
          var msg;
          $scope.files.addAlbum = [];// clear selected image for add image
		  /*if(data.status == 'success'){
            msg = ' New Images added successfully';
            console.log('Data: ', data);
            $scope.files.addImage = [];// clear selected image for add image
          }else{
            msg = 'something went wrong:'+ data.user.data.message;
          }*/
          $scope.addAlbum = false;
          $scope.getImageList();
          $scope.getAlbumList();
          console.log('successfully updated cover pic: ');
          //userInfo.showNotificationMessage(msg);
        }).  
        error(function (data, status, headers, config) {  
            alert("failed!");  
        });
  };
  
  $scope.submitProfilePic = function(){
    //$scope.files.profilePic
   /* $http.post('/api/uploadnewprofilepic', $scope.newimageData).then(function(data){
       console.log('Successfully uploaded profile pic: ', data);
    }, function(err){
       console.log('Something went wrong: ', err);
    });*/
    
    
    $http({  
            method: 'POST',  
            url: "/api/uploadnewprofilepic",  
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
            data: { model: $scope.files.profilePic.data, files: $scope.files.profilePic.files }  
        }).  
        success(function (data, status, headers, config) {  
          console.log('data: ', data);
          var msg;
		  if(data.status == 'success'){
            msg = ' User added successfully';
            //$state.go('manageuser', {activemenu:$scope.usertype});
          }else{
            msg = 'something went wrong:'+ data.user.data.message;
          }
          console.log('successfully updated cover pic: ', msg);
          //userInfo.showNotificationMessage(msg);
        }).  
        error(function (data, status, headers, config) {  
            alert("failed!");  
        });
  }
  
  
  $scope.uploadCoverPic = function ($files, imgType) {
    $scope.files = [];
    angular.forEach($files, function (value, key) {
        console.log("values: ", value);
        $scope.files.push(value);
        var reader = new FileReader();

        reader.onload = function (e) {
            $scope.profileCoverPic = e.target.result;
            submitCoverPic();
        };

        reader.readAsDataURL(value);
    });
  };
  
  
  function submitCoverPic(){
    $scope.user = {};
    $scope.user.id = $scope.profileUserInfo._id;
    $http({  
            method: 'POST',  
            url: "/api/uploadnewcoverpic",  
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
            data: { model: $scope.user, files: $scope.files }  
        }).  
        success(function (data, status, headers, config) {  
          console.log('data: ', data);
          var msg;
		  if(data.status == 'success'){
            msg = ' User added successfully';
            //$state.go('manageuser', {activemenu:$scope.usertype});
          }else{
            msg = 'something went wrong:'+ data.user.data.message;
          }
          console.log('successfully updated cover pic: ', msg);
          //userInfo.showNotificationMessage(msg);
        }).  
        error(function (data, status, headers, config) {  
            alert("failed!");  
        });
    
    
  }
  // profile intro
  $scope.updateUserIntro = function(){
    var dataToSend = {};
    dataToSend.userId = $scope.userintro._id;
    dataToSend.firstName = $scope.userintro.firstName;
    dataToSend.middleName = $scope.userintro.middleName;
    dataToSend.lastName = $scope.userintro.lastName ;
    dataToSend.dob = $scope.userintro.dob;
    dataToSend.gender = $scope.userintro.gender;
    dataToSend.emailId = $scope.userintro.emailId;
    dataToSend.phoneNumber = $scope.userintro.phoneNumber;
    dataToSend.currentcity = $scope.userintro.currentcity;
    dataToSend.profession = $scope.userintro.profession;
    dataToSend.hometown = $scope.userintro.hometown;
    dataToSend.abtyourself = $scope.userintro.abtyourself;
    dataToSend.height = $scope.userintro.height;
    dataToSend.caste = $scope.userintro.caste;
    dataToSend.subcaste = $scope.userintro.subcaste;
    dataToSend.religion = $scope.userintro.religion;
    dataToSend.faceColor = $scope.userintro.faceColor;
    dataToSend.motherTongue = $scope.userintro.motherTongue;
    
    $http.put('/api/updateuserintro', dataToSend).then(function(data){
      console.log('updated user info: ', data);
      $scope.user_profile.useredit = false;
    }, function(err){
      console.log('Error while updating user info: ', err);
    });
  }
  
  
  
  // profile preference 
  function userpreference(){
    $scope.user_preference = {};
    $scope.user_preference.useredit = false;
    $http.get('/api/userreference?userid='+$scope.profileUserInfo._id).then(function(data){
      console.log('updated user info: ', data);
      $scope.userpreference = data.data.userpreference;
      if($scope.userpreference == null){
        $scope.userpreference = {};
        $scope.userpreference.userid = $scope.profileUserInfo._id;
      }
    }, function(err){
      console.log('Error while updating user info: ', err);
      alert('something went wrong while getting user  preference');
    });  
  }
  
  
  
  $scope.updateUserPreference = function(){
    console.log('Userpreference: ', $scope.userpreference);
    $http.put('/api/userreference', $scope.userpreference).then(function(data){
      console.log('updated user info: ', data);
      $scope.user_preference.useredit = false;
      alert('successfully updated user preferences');
    }, function(err){
      console.log('Error while updating user info: ', err);
      alert('something went wrong while updating user  preference');
    });
  };
  
  
  $scope.getImageList = function(){
    console.log('userid: ', $scope.profileUserInfo._id);
    $http.get('/api/getImagelistforuser?userid='+$scope.profileUserInfo._id).then(function(data){
      console.log('image list: ', data);
      $scope.imglist = data.data.imagelist;
      console.log('img list: ', $scope.imglist);
    }, function(err){
      console.log('image list err: ', err);
    });
  };
  
  $scope.getAlbumList = function(){
    console.log('userid: ', $scope.profileUserInfo._id);
    $http.get('/api/getAlubmlistforuser?userid='+$scope.profileUserInfo._id).then(function(data){
      console.log('image list: ', data);
      $scope.albumlist = data.data.albumlist;
      console.log('img list: ', $scope.imglist);
    }, function(err){
      console.log('image list err: ', err);
    });  
  };
  
  $scope.refresh = function(){
    /*$state.transitionTo($state.current, $stateParams, { 
      reload: true, inherit: false, notify: true
    });*/
    $state.transitionTo($state.current, $stateParams, {
          reload: true,
          inherit: false,
          notify: true
      });
    //$state.reload();
  };
  
  $scope.imageSelected = function(img, selectedImg, imgType){
    console.log('selected img: ', img, ' selectedImg: ', selectedImg);
    var data = {
      img: img,
      selectedImg: selectedImg,
      imgType: imgType,
      userId: $scope.profileUserInfo._id
    };
    broadcastToCtlr.broadcastImageSelected(data);
  };
  
});