angular.module('freeMarriage')
.directive("onScroll", [function () {
  var previousScroll = 0;
  var link = function ($scope, $element, attrs) {
      $element.bind('scroll', function (evt) {
          var currentScroll = $element.scrollTop();
          console.log('attributes: ', attrs.scrollId );
          var chatterId = attrs.scrollId;
          console.log('current scroll: ', currentScroll, ' event:', evt);
          $scope.$eval(attrs["onScroll"], {$event: evt, $direct: currentScroll > previousScroll ? 1 : -1, currentScrollPos: currentScroll, chatterId: chatterId});
          previousScroll = currentScroll;
      });
  };
  return {
      restrict: "A",
      link: link
  };
}]).directive('ngFiles', ['$parse', function ($parse) {

    function fn_link(scope, element, attrs) {
        var onChange = $parse(attrs.ngFiles);
        var imgType = $parse(attrs.imgType);
        element.on('change', function (event) {
            onChange(scope, { $files: event.target.files, imgType:imgType });
        });
    };

    return {
        link: fn_link
    }
} ]);