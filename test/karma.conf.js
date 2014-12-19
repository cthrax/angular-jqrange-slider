module.exports = function (config) {
    config.set({
        basePath: './',
        frameworks: ['mocha', 'chai', 'chai-as-promised', 'sinon-chai', 'chai-things', 'dirty-chai'],
        files: [
            "src/angular-jqrange-slider.js"
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
