'use strict';

require.config({
    paths: {
        'angular': '../../Scripts/angular',
        'angular-animate': '../../Scripts/angular-animate',
        'angular-route': '../../Scripts/angular-route',
        'angular-ui-router': '../../Scripts/angular-ui-router',
        'angular-cache': '../../Scripts/angular-cache',
        'angular-resource': '../../Scripts/angular-resource',
        'angular-sanitize': '../../Scripts/angular-sanitize',
        'bootstrap': '../../Scripts/bootstrap',
        'ui-bootstrap': '../../Scripts/ui-bootstrap-0.10.0',
        'ui-bootstrap-templates': '../../Scripts/ui-bootstrap-tpls-0.10.0',
        'jquery': '../../Scripts/jquery-1.9.0',
        'jquery-ui': '../../Scripts/jquery-ui-1.11.2',
        'lodash': '../../Scripts/lodash',
        'qwerty-hancock': '../../Scripts/qwerty-hancock',
        'webaudio': '../../Scripts/webaudio'
    },
    shim: {
        'angular': {
            exports: 'angular',
            deps: ['jquery']
        },
        'qwerty-hancock': { deps: ['jquery'] },
        'jquery-ui': { deps: ['jquery'] },
        'angular-animate': { deps: ['angular'] },
        'angular-route': { deps: ['angular'] },
        'angular-ui-router': { deps: ['angular'] },
        'angular-cache': { deps: ['angular'] },
        'angular-resource': { deps: ['angular'] },
        'angular-sanitize': { deps: ['angular'] },
        'bootstrap': { deps: ['jquery'] },
        'ui-bootstrap-templates': { deps: ['ui-bootstrap'] },
        'ui-bootstrap': {
            deps: [
                'angular',
                'bootstrap'
            ]
        },
        'app': {
            deps: [
                'webaudio',
                'qwerty-hancock',
                'angular',
                'angular-route',
                'angular-ui-router',
                'angular-cache',
                'angular-resource',
                'angular-sanitize',
                'angular-animate',
                'jquery',
                'jquery-ui',
                'lodash'
            ]
        }
    },
    priority: [
        'angular'
    ],
    urlArgs: 'v=' + (new Date()).getTime()
});

require([
    'app'

    /* add other dependencies here */
    /* controllers, services, directives, and factories will go here */
    , 'controllers/HomeCtrl'

    , 'directives/ws-qwerty-hancock'
    , 'directives/ws-knob'
    , 'filters/truefalse'

    , 'services/audioservice'

], function (app) {

    'use strict';

    angular.element(document).ready(function () {
        var html = angular.element(document.getElementById('WebSynth'));
        html.addClass('ng-app');
        angular.bootstrap(html, [app['name']]);
    });
});