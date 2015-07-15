define(['app'], function () {
    return angular.module('WebSynth-directives')
    .service('wsKeyboardService', ['$rootScope', '$log', function ($rootScope, $log) {

        function onKeyUp(note, frequency) {
            $rootScope.$broadcast('keyboard-keyUp', { note: note, frequency: frequency });
        }

        function onKeyDown(note, frequency) {
            $rootScope.$broadcast('keyboard-keyDown', { note: note, frequency: frequency });
        }

        return {
            onKeyUp: onKeyUp,
            onKeyDown: onKeyDown
        };
    }])
    .directive('wsQwertyHancock', function ($log, $parse, wsKeyboardService) {
        var uniqueId = 0;
        return {
            restrict: 'EA', /* restrict if can apply to element or attribute, or all */
            scope: {
                keyboardWidth: '@',
                keyboardHeight: '@',
                startNote: '@',
                whiteKeyColor: '@blackColor',
                blackKeyColor: '@whiteColor',
                activeColor: '@',
                borderColor: '@',
                keyboardLayout: '@',
                octaves: '@',
                roundedBorder: '@'
            },
            //replace: true,
            //template: '<div ng-attr-id="{{uniqueId}}"></div>',
            link: function (scope, element, attrs) {

                var id = element.attr('id') || '';

                if (id == '') {
                    id = 'keyboard' + uniqueId;
                    uniqueId++;

                    element.attr('id', id);
                }

                var keyboard = new QwertyHancock({
                    id: id,
                    width: $parse(scope.keyboardWidth)(),
                    height: $parse(scope.keyboardHeight)(),
                    octaves: $parse(scope.octaves)(),
                    startNote: scope.startNote,
                    whiteNotesColour: scope.whiteKeyColor,
                    blackNotesColour: scope.blackKeyColor,
                    activeColour: scope.activeColor,
                    keyboardLayout: scope.keyboardLayout,
                    roundedBorder: $parse(scope.roundedBorder)()
                });

                keyboard.keyDown = function (note, frequency) {
                    wsKeyboardService.onKeyDown(note, frequency);
                };

                keyboard.keyUp = function (note, frequency) {
                    wsKeyboardService.onKeyUp(note, frequency);
                };
            }
        };
    });
});
