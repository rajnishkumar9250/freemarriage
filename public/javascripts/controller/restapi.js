angular.module('freeMarriage')
   .factory('login', ['$resource', function($resource) {
     console.log("resource factory");
return $resource('/login', null,
    {
        'update': { method:'PUT' }
    });
}]);