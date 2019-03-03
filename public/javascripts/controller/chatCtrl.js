angular.module('freeMarriage')
.controller('chatCtrl', function($rootScope, $scope, $http, $state, $filter, $compile){
  console.log("welcome to chat controller");
  $http.get('/chatlist?userId='+$rootScope.userInfo._id).then(function(data){
    console.log('data: ', data);
    $scope.messageList = data.data.msg;
    if($scope.messageList && $scope.messageList.length > 0){
      $scope.chatDetails($scope.messageList[0].
                       friendInfo._id, 0);  
    }
    
  }, function(err){
    console.log('error: ', err);
  });
  $scope.chatDetails = function(frdId, index){
     console.log('user data:', frdId);
     var user1 = $rootScope.userInfo._id;
     var user2 = frdId;
     $http.get('getOldMessageOfTwoUser?user1='+user1 +'&user2='+user2).
     then(function(data){
        console.log('success: ', data);
        setChatBox(index);
        showMsgInChatbox(frdId, data.data.message);
     }, function(error){
        console.log('Error: ', error);
     });
  };
  
  function setChatBox(index){
    $scope.selectedFrd = $scope.messageList[index].friendInfo;
    document.getElementsByClassName('msgbodywrap').html = '';
  }
  
  function showMsgInChatbox(senderId, data){
    var msgType;
    var messageStatus = "old";
    angular.forEach(data, function(value, key){
      console.log('msg: ', value);
      var message = value.message;
      if(value.sendto == senderId){
        msgType = 'receiver';
      }else{
        msgType = 'sender';
      }
      console.log('senderid: ',senderId ,' message: ', message, ' msgtype: ',msgType, ' sent time: ', value.senddate);
      continueMsg(senderId, message, msgType, messageStatus, value.senddate);
    });
  }
  
  var continueMsg = function(sendBy, message, msgType, messageStatus, sendAt){
    
    
    
    var msgBoxRef = $('.msgbodywrap');
    console.log('sendby ref: ', msgBoxRef);
    var msgbody = '';
    if(msgType == 'receiver'){
      msgbody += '<div class="msg '+msgType+'"><div class="msgImg"><img ng-src="{{selectedFrd.profilePic ? (\'./../../images/'+sendBy+'/profile.jpg\'): \'./../../images/default_user.png\'}}" class="profilepic"></div><div class="msgContent">'+
               message + " " + $filter('date')(sendAt,'hh:mm a')+'</div></div>';
    }else{
      msgbody += '<div class="msg '+msgType+'"><div class="msgContent" style="float:right;">'+
               message + " " + $filter('date')(sendAt,'hh:mm a')+'</div><div class="msgImg" style="float:right;"><img ng-src="{{userInfo.profilePic ? (\'./../../images/'+$rootScope.userInfo._id+'/profile.jpg\'): \'./../../images/default_user.png\'}}" class="profilepic"></div></div>';
    }
    
    if(messageStatus == "old"){
      msgBoxRef.prepend(msgbody);
    }else{
      msgBoxRef.append(msgbody);  
    }
    $compile(msgBoxRef)($scope);
    //setScrollBarBottom(sendBy);
  };
  
  function setScrollBarBottom(chatBoxId){
    var d = $( "div[scroll-id="+chatBoxId+"]");
    d.scrollTop(d.prop("scrollHeight"));
  }
  
});