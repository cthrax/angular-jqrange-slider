angular.module("jqrange-slider", [])
    .constant('DEFAULTS', {
        type: "range", // range, edit or date
        jqOptions: {},
        onApiReady: null
    })
    .factory("JqrangeService", function() {
        var JqrangeService = function(ele, sliderFunc) {
            this.ele = ele;
            this.slider = sliderFunc;
        };

        var methods = ["bounds",
            "destroy",
            "enable",
            "disable",
            "min",
            "max",
            "resize",
            "scrollLeft",
            "scrollRight",
            "values",
            "zoomIn",
            "zoomOut"
        ];

        // Add methods supported by jqrange-slider
        methods.map(function(method) {
            JqrangeService.prototype[method] = function() {
                var args = [];
                if (!!arguments) {
                    // Copy the special arguments array into a normal array
                    for (var i = 0; i < arguments.length; i++) {
                        args[i] = arguments[i];
                    }
                }
                args.splice(0, 0, method);
                return this.slider.apply($(this.ele), args);
            };
        });

        JqrangeService.prototype.synchronize = function(bounds, selectedValues) {
            this.slider.apply($(this.ele), ['bounds', bounds.min, bounds.max]);
            this.slider.apply($(this.ele), ['values', selectedValues.min, selectedValues.max]);
        };

        return JqrangeService;

    })
    .directive("jqrangeSlider", function(DEFAULTS, JqrangeService) {
        var link = function($scope, ele) {

            var service = null;

            $scope.$on('recreateSlider', function() {
                service.destroy();
                create();
            });

            var create = function() {
                var options = angular.extend(DEFAULTS, $scope.options);
                var constructor = $(ele).rangeSlider;
                if (options.type === "edit") {
                    constructor = $(ele).editRangeSlider;
                } else if (options.type === "date") {
                    constructor = $(ele).dateRangeSlider;
                }

                if (!!$scope.options.jqOptions && !$scope.options.jqOptions.defaultValues) {
                    $scope.options.jqOptions.defaultValues = $scope.options.selectedRange;
                }

                service = new JqrangeService(ele, constructor);

                // Create the element
                constructor.call($(ele), options.jqOptions);

                // Watch external changes to selection and match on slider
                $scope.$watch("options.selectedRange", function (nv, ov) {
                    // Only change values if there's actually a change
                    if (!!nv
                        && !!ov
                        && (nv.min.getTime() !== ov.min.getTime() || nv.max.getTime() !== ov.max.getTime())) {

                        var bounds = service.values();
                        if (!!nv && nv.min.getTime() !== bounds.min.getTime() && nv.max.getTime() !== bounds.max.getTime()) {
                            service.values(nv.min, nv.max);
                        } else {
                            service.values(bounds.min, bounds.max);
                        }
                    }
                });

                // Watch for external changes to bounds and match on slider
                $scope.$watch("options.jqOptions.bounds", function (nv, ov) {
                    if (!!nv
                        && !!ov
                        && (nv.min.getTime() !== ov.min.getTime() || nv.max.getTime() !== ov.max.getTime())) {
                        var min, max;
                        try {
                            min = new Date(nv.min);
                            max = new Date(nv.max);
                            service.bounds(min, max);
                        } catch (exception) {
                            console.log("Invalid date");
                        }
                    }
                });

                // Watch for user changes to selection and notify angular.
                $(ele).bind("userValuesChanged", function (evt, data) {
                    $scope.$apply((function () {
                        $scope.options.selectedRange = data.values;
                    })());
                });

                // Watch for user changes to selection and notify angular.
                $(ele).bind("valuesChanging", function (evt, data) {
                    $scope.$emit('sliderValuesChanging', data.values)
                });

                // Pass the service out so external control of the component can be had
                if (typeof options.onApiReady === "function") {
                    options.onApiReady(service);
                }
            }

            create();
        };

        return {
            restrict: "EAC",
            replace: true,
            link: link,
            template: "<div></div>",
            scope: {
                options: "="
            }
        };
    });
