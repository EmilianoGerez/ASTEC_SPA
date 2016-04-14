angular.module("order").directive('dlKeyCode', dlKeyCode);

function dlKeyCode() {
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs) {
            $element.bind("keypress", function(event) {
                var keyCode = event.which || event.keyCode;

                if (keyCode == $attrs.code) {
                    $scope.$apply(function() {
                        $scope.$eval($attrs.dlKeyCode, {
                            $event: event
                        });
                    });

                }
            });
        }
    };
}