/**
 * Created by Android on 10/29/2016.
 */

angular.module('freeMarriage')
.factory("userInfo", function($http, $q){
    return {
        getUserInfo: function(){
            var deferred = $q.defer();
            $http.get("/getUserDetailsByToken").then(function(res){
                deferred.resolve(res.data);
            }, function(res){
                deferred.resolve(null);
            });
            return deferred.promise;
        },
      
        getProfilePic : function(profileUserInfo){
          if(profileUserInfo.profilePic){
             profilepic = 'images/' + profileUserInfo._id + '/profile.jpg';
           }else{
             profilepic = 'images/default_user.png';
           }
          console.log('profile pic: ', profilepic);
          return profilepic;
        }
    }
}).factory("sessionService", function($cookies){
        var sessionService = {
            getToken :  function(){
                return  $cookies.get('usertoken');
            },
            setToken : function(token){
                $cookies.put('usertoken', token);
            },
            removeToken : function () {
                $cookies.remove('usertoken');
            }
        }
        return sessionService;
})
.factory('headerIntercepter', ['sessionService', function(sessionService) {
        var sessionInjector = {
            request: function(config) {
                console.log("token before setting header: ", sessionService.getToken());
                if (sessionService.getToken()) {
                    config.headers['Authorization'] = sessionService.getToken();
                }
                return config;
            }
        };
        return sessionInjector;
}])
.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        if(!$rootScope.$$phase) {
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        }
      });
    },
    emit: function (eventName, data, callback) {
      console.log('new event: ', eventName, data);
      socket.emit(eventName, data, function () {
        console.log('socket emit callback ');
        var args = arguments;
        //if(!$rootScope.$$phase) {
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        //}
      })
    },
    disconnect : function(){
      socket.disconnect();
    },
    reconnect : function(){
      socket.connect();
    }
  };
})
.factory('broadcastToCtlr', function($rootScope){
  var broadcastEvent = {};
  broadcastEvent.broadcastImageSelected = function(data) {
    console.log('data: ', data);
    $rootScope.$broadcast('imageSelected', data);
  };
  
  broadcastEvent.broadcastUserSelectedForChat = function(data) {
    console.log('data: ', data);
    $rootScope.$broadcast('userSelectedForChat', data);
  };
  
  return broadcastEvent;
});
