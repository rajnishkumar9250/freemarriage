angular.module('freeMarriage', ['ngRoute','ui.router', 'ngResource', 'ngCookies'])
    .run(function ($rootScope, $state, $cookies, userInfo, sessionService) {
      $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        console.log('state change starts here');
        var isLoggedIn = sessionService.getToken();
        console.log('session: ', isLoggedIn);
        if (toState.authenticate && !isLoggedIn) {
            // User isn’t authenticated
            $rootScope.userInfo = undefined;
            $state.transitionTo("login");
            event.preventDefault();
        }else if(isLoggedIn && !$rootScope.userInfo){
            userInfo.getUserInfo().then(function(res) {
                $rootScope.userInfo = res.user;
                console.log("userinfo: ", $rootScope.userInfo);
                $rootScope.userInfo.profilePic =          
                                 userInfo.getProfilePic($rootScope.userInfo);
                console.log('profile pic: ', $rootScope.userInfo.profilePic);
                if(toState.skipLogedIn){
                    $state.go('profile');
                }
            });
        }else if(isLoggedIn){
            $rootScope.userInfo.profilePic =          
                                 userInfo.getProfilePic($rootScope.userInfo);
            if(toState.skipLogedIn){
                $state.go('profile');
            }
        }else{
          console.log('else condition for user info');
        }
      })
    })
   .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
       $stateProvider
       .state('signup',{
          url:'/signup',
           controller:'signupCtrl',
           templateUrl:'./views/signup.html',
           skipLogedIn:true
       })
       .state('login',{
           url:'/login',
           controller: 'loginCtrl',
           templateUrl:'./views/login.html',
           skipLogedIn:true
       })
       .state('forgetpassword',{
           url:'/forgetpassword',
           controller: 'forgetpasswordCtrl',
           templateUrl:'./views/forgetpassword.html',
           skipLogedIn:true
       })
       .state('resetpassword',{
           url:'/resetpassword/:token',
           controller: 'resetpasswordCtrl',
           templateUrl:'./views/resetpassword.html',
           skipLogedIn:true
       })
      .state('home', {
        url: '/home',
        controller: 'homeCtrl',
        templateUrl: './views/home.html'
      }).state('about-us',{
          url: '/about-us',
          controller: 'aboutUsCtrl',
          templateUrl: './views/aboutUs.html'
       }).state('services',{
          url: '/services',
          controller: 'servicesCtrl',
          templateUrl: './views/services.html'
       }).state('contact-us',{
          url: '/contact-us',
          controller: 'contactUsCtrl',
          templateUrl: './views/contactus.html'
          
       }).state('profile',{
         url: '/profile/:username?menu',
         controller: 'profileCtrl',
         templateUrl: './views/profile.html',
         authenticate: true
       }).state('friends',{
           url: '/friends',
           controller: 'friendCtrl',
           templateUrl: './views/friends/friends.html',
           authenticate: true
       }).state('unfriendlist',{
           url: '/friend/request',
           controller: 'unfriendCtrl',
           templateUrl: './views/friends/unfriends.html',
           authenticate: true
       }).state('chat',{
           url: '/chat',
           controller: 'chatCtrl',
           templateUrl: './views/friends/chat.html',
           authenticate: true
       }).state('friendrequestsent',{
           url: '/friend/requestalreadysent',
           controller: 'friendrequestsentCtrl',
           templateUrl: './views/friends/friendrequestsents.html',
           authenticate: true
       }).state('albumdetail',{
           url: '/:userid/:albumid/albumimage',
           controller: 'albumCtrl',
           templateUrl: './views/profile/album.html',
           authenticate: true
       });;
        //$locationProvider.html5Mode(true);
        // enable HTML5mode to disable hashbang urls
        /*$locationProvider.html5Mode({
          enabled: true,
          requireBase: false
        });*/
   //$urlRouterProvider.otherwise('/home');
   $urlRouterProvider.otherwise(function ($injector, $location) {
        var $state = $injector.get('$state');
        $state.go('home');
    });
      
}).config(['$httpProvider', function($httpProvider) { 
    console.log("header intercepter called");
    $httpProvider.interceptors.push('headerIntercepter');
}]);

   