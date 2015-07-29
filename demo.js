angular.module("app", ['jqrange-slider'])
    .controller("mainCtrl", function($scope) {
        $scope.options = {
            type: "date",
            jqOptions: {
                bounds: {
                    min: new Date(1950, 0, 1),
                    max: new Date(2014, 0, 1)
                }
            },
            selectedRange: {
                min: new Date(0),
                max: new Date(86401000)
            }
        };

        $scope.redraw = function() {
            $scope.$broadcast('recreateSlider');
        }
    });