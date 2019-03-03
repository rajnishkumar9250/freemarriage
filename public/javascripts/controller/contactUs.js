angular.module('freeMarriage')
  .controller('contactUsCtrl', function($scope, $window){
     console.log("welcome to contact us");
     var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(12.8935884,77.6284463),
        mapTypeId: google.maps.MapTypeId.CITY
     };
     $scope.map = new google.maps.Map(document.getElementById('contactUsmap'), mapOptions);
     var infoWindow = new google.maps.InfoWindow();
   
      var officeAddress = {
        city : '#9/11, M M Residency',
        desc : 'This is the best residence in the world!',
        lat : 12.8935359,
        long : 77.6284674
      };
      var createMarker = function (info){
        
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.city
        });
        marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
        
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });
        
        //$scope.markers.push(marker);
        
      }
      createMarker(officeAddress);
   
    
});