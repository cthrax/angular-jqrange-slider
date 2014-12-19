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
            "scrollleft",
            "scrollright",
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

        return JqrangeService;

    })
    .directive("jqrangeSlider", function(DEFAULTS, JqrangeService) {
        var link = function($scope, ele) {
            var options = angular.extend(DEFAULTS, $scope.options);
            var constructor = $(ele).rangeSlider;
            if (options.type === "edit") {
                constructor = $(ele).editRangeSlider;
            } else if (options.type === "date") {
                constructor = $(ele).dateRangeSlider;
            }

            var service = new JqrangeService(ele, constructor);
            var internalChange = false;

            // Create the element
            constructor.call($(ele), options.jqOptions);

            // Watch external changes to selection and match on slider
            $scope.$watch("selectedRange", function(nv) {
                if (!internalChange) {
                    var bounds = service.values();
                    if (!!nv && nv.min !== bounds.min && nv.max !== bounds.max) {
                        service.values(nv.min, nv.max);
                    } else {
                        service.values(bounds.min, bounds.max);
                    }
                } else {
                    console.log("internal change");
                }
            });

            // Watch for external changes to bounds and match on slider
            $scope.$watch("options.jqOptions.bounds", function(nv) {
                console.log("Bounds changed", nv);
                if (!!nv) {
                    var min, max;
                    try {
                        min = new Date(nv.min);
                        max = new Date(nv.max);
                        service.bounds(min, max);
                    } catch(exception) {
                        console.log("Invalid date");
                    }
                }
            }, true);

            // Watch for user changes to selection and notify angular.
            $(ele).bind("userValuesChanged", function(evt, data) {
                internalChange = true;
                $scope.$apply((function() {
                    $scope.selectedRange.min = data.values.min.getTime();
                    $scope.selectedRange.max = data.values.max.getTime();
                })());
            });

            // Pass the service out so external control of the component can be had
            if (typeof options.onApiReady === "function") {
                options.onApiReady(service);
            }
        };

        return {
            restrict: "EAC",
            replace: true,
            link: link,
            template: "<div></div>",
            scope: {
                options: "=",
                selectedRange: "="
            }
        };
    });
