define(['app'], function () {
    return angular.module('WebSynth-directives')
    .filter('truefalse', function () {
        return function (input) {
            return input ? 'True' : 'False';
        };
    })
    .filter('onoff', function () {
        return function (input) {
            return input ? 'On' : 'Off';
        };
    });
});