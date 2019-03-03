angular.module('freeMarriage')
.controller('chatBoxCtrl', function($scope, $state, $rootScope, $http, socket, $compile, _, $filter){
  console.log('chat box controller');
  
  $scope.setFriendPic = function(frdId, profilepic){
    console.log('Friend id:', frdId);
    var profilepic;
    if(profilepic){
      profilepic = 'images/'+frdId+'/profile.jpg';
    }else{
      profilepic = 'images/default_user.png';
    }
    return profilepic;
  }

  
  socket.on('connect', function(){
    console.log('server connected');
    socket.emit('userconnected', $rootScope.userInfo._id);
  });
  
  socket.on('disconnect', function(){
    console.log('server disconnected');
  });
  
  socket.on('newMessage', function(data){
    console.log('new message: ', data);
    var msgBoxRef = $('#'+data.sendBy);
    console.log('sendby ref: ', msgBoxRef);
    var messageStatus = 'new';
    if(msgBoxRef.length > 0){
      console.log('continue chatting');
      
      continueMsg(data.sendBy, data.message, 'receiver', messageStatus, data.sendAt);
    }else{
      console.log('new chatting');
      /*var newmsgBox = '<div class="chatbox" id="'+data.sendBy+'">'+
            '<h3>'+data.sendBy+'</h3>'+
            '<div class="msglist">'+
              '<div class="msg sender">'+
               data.message+
              '</div>'+
              '<div class="msg receiver">'+
                'hi i m receiver'+
              '</div>'+
            '</div>'+
            '<div class="writeNewMsg">'+
              '<textarea  ng-model="newWriteMessage"></textarea>'+
            '</div>'+
          '</div>';
      $('.chatBoxcontainer').append(newmsgBox);*/
      createChatBox(data.sendBy, data.username, data.message, messageStatus, data.sendAt);
    }
  });
  
  
  socket.on('onlineFriend', function(data){
    //$scope.online = true;
    console.log('friend online');
    _.each($rootScope.userInfo.friends, function (value, prop) {  
        console.log('userid: ', value._id);
        if(value._id == data){
          $rootScope.userInfo.friends[prop].onlinestatus = 'online';
          console.log('friend offline seet: ', data);
          
        }
    })
  });
  
  socket.on('offlineFriend', function(data){
    //$scope.online = false;
    console.log('friend offline: ', data);
    console.log('friends: ', $rootScope.userInfo.friends);
    _.each($rootScope.userInfo.friends, function (value, prop) {  
        console.log('userid: ', value._id);
        if(value._id == data){
          $rootScope.userInfo.friends[prop].onlinestatus = 'offline';
          console.log('friend offline seet: ', data);
          
        }
    })
  });
  
  $scope.$on('userSelectedForChat', function(event, args, selectedImg){
    console.log('frds info: ', args);
    $scope.setSenderId(args.userId, args.userName);
  });
  
  
  
  $scope.setSenderId = function(senderId, senderUsername){
    //$scope.friendid = senderId;
    createChatBox(senderId, senderUsername, undefined);
    getOldMessage(senderId);  
  };
  
  $scope.sendMessage = function($event){
    console.log('new message sending1: ',  $event);
    console.log('new message sending2: ',$event.currentTarget.getAttribute("id"));
    var dataToSend = {};
    dataToSend.sendBy = $rootScope.userInfo._id;  
    dataToSend.sendTo = $event.currentTarget.getAttribute("id");
    dataToSend.username = $rootScope.userInfo.userName;  //$event.currentTarget.getAttribute("username");
    console.log('new message sending: ',$('#'+dataToSend.sendTo).find('textarea'));
    dataToSend.message = $('#'+dataToSend.sendTo).parent().find('textarea').val();
    dataToSend.sendAt = new Date();
    $('#'+dataToSend.sendTo).parent().find('textarea').val('');
    socket.emit('sendMessage', dataToSend);
    console.log('send data: ', dataToSend);
    var messageStatus = 'new';
    continueMsg(dataToSend.sendTo, dataToSend.message, 'sender', messageStatus, dataToSend.sendAt);
    setScrollBarBottom(dataToSend.sendTo);
    /*var d = $( "div[scroll-id="+dataToSend.sendTo+"]");
    d.scrollTop(d.prop("scrollHeight"));*/
  };
  
  
  var createChatBox = function(sendBy, username, message, messageStatus, sendAt){
    if($(".head_"+sendBy).length > 0){ // donot create double chat box
      $(".head_"+sendBy).parent().find('.msgbox').focus();
      return false;
    }
    $scope.username = username;
    var chatBoxNo = angular.element(document.getElementById('chatBoxcontainer')).find('.chatbox');
    if(chatBoxNo.length >= 2){ // Allow only two chat box open
      angular.element(document.getElementById('chatBoxcontainer')).
      find('.chatbox:first').remove();
    }
    var newmsgBox = '<div class="chatbox" >'+
            '<div class="chatboxHeader clearfix '+ "head_"+sendBy+'"><a ui-sref="profile({ username: username})"><span class="username">'+username+'</span></a><img src="images/icon/fileclose.png" class="closechattab"></div>'+
            '<div class="chatboxBody"><div class="msglist" on-scroll="getOldMessage($direct,$event, currentScrollPos, chatterId)" scroll-id="'+sendBy+'">'+             
            '</div>'+
            '<div class="writeNewMsg">'+
              '<textarea autofocus class="msgbox"></textarea>'+
            '</div>'+
            '<span class="glyphicon glyphicon-chevron-right forwarmsg"'+ 
              ' ng-click="sendMessage($event)" id="'+sendBy+'" username="'+username+'"></div>'+
          '</div>';
      var temp = $compile(newmsgBox)($scope); 
      angular.element(document.getElementById('chatBoxcontainer')).append(temp);
            
      $(".head_"+sendBy).bind("click", function($event){
        $(this).parent().find('.chatboxBody').toggle();
      });
      
      //$('.chatboxHeader').bind("click", closeChatTab);
    
      $('.closechattab').bind("click", function($event){
        console.log('closing');
        $event.stopPropagation();
        $event.target.parentElement.parentElement.remove();
      });
      if(message !== undefined){
        continueMsg(sendBy, message, 'receiver', messageStatus, sendAt);  
      }
      
  }
  
  
  
  $scope.getOldMessage =  function ($event, $direct, scrollPos, chatterId) {
        console.log("Scrolling " + $direct > 1 ? "down" : "up", $event, ' scroll current position: ', scrollPos, ' ; chatterid: ', chatterId);
        if($event == -1 && scrollPos == 0){
          getOldMessage(chatterId);
        }
    };
  
  function getOldMessage(senderId){
    var user1 = $rootScope.userInfo._id; // logged In user;
    var user2 = senderId;
    $http.get('/getoldmessageoftwouser?user1='+user1 +'&user2='+user2).then(function(data){
       console.log('old messages: ', data);
       showMsgInChatbox(senderId, data.data.message);
    },function(err){
      console.log('Error: ', err);
    });
    
    
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
    var msgBoxRef = $('#'+sendBy);
    console.log('sendby ref: ', msgBoxRef);
    var msgWrap = '<div class="msg '+msgType+'">'+
               message + " " + $filter('date')(sendAt,'hh:mm a')+
              '</div>';
    if(messageStatus == "old"){
      msgBoxRef.parent().find('.msglist').prepend(msgWrap);
    }else{
      msgBoxRef.parent().find('.msglist').append(msgWrap);  
    }
    setScrollBarBottom(sendBy);
  };
  
  function setScrollBarBottom(chatBoxId){
    var d = $( "div[scroll-id="+chatBoxId+"]");
    d.scrollTop(d.prop("scrollHeight"));
  }
  
  function closeChatTab($event){
    console.log('closing chat tab:', $($(this)[0].parentElement).find(".chatboxBody").css("display"));
    //console.log('closing chat tab:');
    $($(this)[0].parentElement).find(".chatboxBody").toggle();

  }
});
