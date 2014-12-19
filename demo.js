angular.module("app", ['jqrange-slider'])
    .controller("mainCtrl", function($scope) {
        $scope.options = {
            type: "date",
            jqOptions: {
                bounds: {
                    min: new Date(1950, 0, 1),
                    max: new Date(2014, 0, 1)
                }
            }
        };

        $scope.range = {
            min: 0,
            max: 10000
        };
    });