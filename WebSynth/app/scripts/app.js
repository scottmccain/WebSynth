define([], function () {
    'use strict';

    angular.module('WebSynth-controllers', []);
    angular.module('WebSynth-directives', []);
    angular.module('WebSynth-filters', []);
    angular.module('WebSynth-services', []);
    angular.module('WebSynth-factories', []);

    var WebSynth = angular.module('WebSynth', [
        'ngResource',
        'ui.router',
        'jmdobry.angular-cache',
        'WebSynth-controllers',
        'WebSynth-directives',
        'WebSynth-filters',
        'WebSynth-services',
        'WebSynth-factories'
    ]);

    /* you can make custom response intereceptors to respond to server errors,  */
    /* 404 errors, 401 errors, or any http status you can think of              */
    /* these interceptors act as filters and allow you to have fine control     */
    /* over the request.                                                        */
    //ldtsadmin.config(['$httpProvider', '$provide', function ($httpProvider, $provide) {
    //    $httpProvider.interceptors.push('httpResponseInterceptor');
    //}]);


    // this constant is a helper to get the proper path offset for application resources
    WebSynth.constant('viewUrl', function (relativePath) {
        return 'app/views/' + relativePath + '?v=' + (new Date()).getTime();
    });


    WebSynth.config(function ($stateProvider, $urlRouterProvider, viewUrl) {
        // Make sure to end urls with a trailing '/'
        // See https://github.com/angular-ui/ui-router/issues/50

        $stateProvider.state('home', {
            url: '/home/',
            templateUrl: viewUrl('home.html'),
            controller: 'HomeController'
        });


        //----------------------------------------------
        // TODO: More States
        //-----------------------------------------------

        // Catch-all state for invalid URLs
        // Note: this state must be defined last
        $stateProvider.state('otherwise', {
            url: '*path',
            controller: function ($state, $log) {
                $state.go('home');
            }
        });

        // https://github.com/angular-ui/ui-router/issues/50
        $urlRouterProvider.rule(function ($injector, $location) {
            var path = $location.path();
            var search = $location.search();
            var params;

            // check to see if the path already ends in '/'
            if (path[path.length - 1] === '/') {
                return '';
            }

            // If ther was no search string / query params, return with a '/'
            if (Object.keys(search).length === 0) {
                return path + '/';
            }

            // Otherwise build the search string and returna  '/?' prefix
            params = [];
            angular.forEach(search, function (v, k) {
                params.push(k + '=' + v);
            });

            return path + '/?' + params.join('&');
        });

    });

    WebSynth.run(function ($rootScope, $state, $log, $timeout) {


        //$rootScope.$on('$stateChangeStart', function (event, toState) {

        //    function allowAnonymous(state) {
        //        return state.data && state.data.allowAnonymous;
        //    }

        //    if (!allowAnonymous(toState) && !sessionService.hasSession()) {
        //        event.preventDefault();
        //        $state.go('login');
        //        return;
        //    }
        //});

        //$rootScope.$on('session-expired', function () {
        //    sessionService.destroySession();
        //    $timeout(function () {
        //        $state.go('session-expired');
        //    }, 0);
        //});
    });

    return WebSynth;

});