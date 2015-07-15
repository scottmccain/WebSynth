define(['app'], function () {
    return angular.module('WebSynth-directives')
    .directive('directiveName', function () {
        return {
            restrict: '', /* restrict if can apply to element or attribute, or all */
            templateUrl: '',
            link: function () {
            }
        };
    });
});
