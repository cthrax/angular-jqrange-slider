module.exports = function (config) {
    config.set({
        basePath: '../',
        frameworks: ['mocha', 'chai', 'chai-as-promised', 'sinon-chai', 'chai-things', 'dirty-chai'],
        files: [
            "bower_components/jquery/dist/jquery.js",
            "bower_components/jquery-ui/jquery-ui.js",
            "bower_components/angular/angular.js",
            "bower_components/angular-mocks/angular-mocks.js",
            "bower_components/jqrange-slider/dest/jQAllRangeSliders-withRuler.js",
            "src/angular-jqrange-slider.js",
            "test/unit/*"
        ],
        autoWatch: false,
        singleRun: true,
        reporters: ['spec', 'coverage'],
        preprocessors: {
            '../../src/**/*.js': ['coverage']
        },
        coverageReporter: {
            type: 'html',
            dir: '../../build/coverage'
        },
        browsers: ['PhantomJS'],
        plugins: [
            'karma-mocha',
            'karma-chai-plugins',
            'karma-phantomjs-launcher',
            'karma-coverage',
            'karma-spec-reporter'
        ]
    });
};
