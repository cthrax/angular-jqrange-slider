describe("jqrange-slider", function() {
    var directive = null;
    beforeEach(module("jqrange-slider"));
    beforeEach(inject(function($compile, $rootScope) {
        var scope = $rootScope.$new();
        scope.options = {
            type: "date",
            jqOptions: {
                bounds: {
                    min: new Date(1950, 0, 1),
                    max: new Date(2014, 0, 1)
                }
            },
            selectedRange: {
                min: new Date(0),
                max: new Date(100000000)
            }
        };

        var Directive = function() {};
        Directive.prototype = {
            html: '<jqrange-slider options="options"></jqrange-slider>',
            scope: scope,
            compile: function() {
                return $compile(this.html)(this.scope);
            }
        };

        directive = new Directive();
    }));
    it("should always be a date object", function(done) {
        /*var scope = directive.scope;
        scope.$watch("range", function(nv) {
            // assert that it's a date when it changes
        });*/
        done();
    });

    it("should load with correct defaults", function(done) {
        var scope = directive.scope;
        scope.options.onApiReady = function(service) {
            expect(service.bounds()).to.deep.equal(scope.options.jqOptions.bounds);
            expect(service.values()).to.deep.equal(scope.options.selectedRange);
            done();
        };

        directive.compile();
        scope.$apply();
    });

    it("should not change bounds if not necessary", function(done) {
        var scope = directive.scope;
        var bounds = null;
        scope.options.onApiReady = function(service) {
            bounds = service.bounds();
            scope.options.selectedRange = {
                min: new Date(1951, 0, 1),
                max: new Date(1952, 0, 1)
            };

            scope.$apply();
            expect(service.bounds()).to.deep.equal(bounds);
            done();
        };

        directive.compile();
        scope.$apply();
    });
});