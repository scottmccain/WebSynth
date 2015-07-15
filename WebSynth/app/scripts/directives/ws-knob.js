define(['app'], function () {
    return angular.module('WebSynth-directives')
    .controller('wsWebAudioControlsCtrl', function ($scope, $attrs, $log) {

        $scope.formatValue = function () {
            return $scope.format()($scope.value);
        };

        this.createSwitch = function (element) {
            var sw = document.createElement('webaudio-switch');

            sw.setAttribute("src", "images/switch_toggle.png");
            sw.setAttribute("width", "56");
            sw.setAttribute("height", "56");
            sw.setAttribute("value", $scope.value ? 1 : 0);
            sw.ready();

            element[0].appendChild(sw);
            return sw;
        };

        this.createWheel = function (element) {
            var wheel = document.createElement("webaudio-knob");
            wheel.setAttribute("value", "" + $scope.value);
            wheel.setAttribute("src", "images/modulation-wheel.png");

            wheel.setAttribute("min", "" + $scope.min);
            wheel.setAttribute("max", "" + $scope.max);

            if ($scope.scale === "log") {
                wheel.setAttribute("log", true);
            } else {
                wheel.setAttribute("step", $scope.step);
            }

            if ($scope.units)
                wheel.setAttribute("units", $scope.units);

            wheel.setAttribute("height", "110");
            wheel.setAttribute("width", "48");
            wheel.setAttribute("sprites", "100");
            wheel.setAttribute("tooltip", $scope.tooltip);

            wheel.setAttribute("reverse", true);

            wheel.ready();

            element[0].appendChild(wheel);
            return wheel;

        };

        this.createKnob = function (element, img) {

            var knob = document.createElement("webaudio-knob");
            knob.className = "knob";
            knob.setAttribute("value", "" + $scope.value);
            knob.setAttribute("src", img);
            knob.setAttribute("min", "" + $scope.min);
            knob.setAttribute("max", "" + $scope.max);

            if ($scope.scale === "log") {
                knob.setAttribute("log", true);
            } else {
                knob.setAttribute("step", $scope.step);
            }

            if ($scope.units)
                knob.setAttribute("units", $scope.units);

            knob.setAttribute("diameter", "98");
            knob.setAttribute("sprites", "100");
            knob.setAttribute("tooltip", $scope.tooltip);
            knob.ready();

            element[0].appendChild(knob);
            return knob;
        };
    })
    .directive('wsSwitch', function ($log) {
        return {
            controller: 'wsWebAudioControlsCtrl',
            restrict: 'EA', /* restrict if can apply to element or attribute, or all */
            template: '<div style="position:relative"><div class="knobContainer" style="left: {{x}}px;top: {{y}}px;" ></div></div>',
            scope: {
                x: '@clientLeft',
                y: '@clientTop',
                value: '=',
                tooltip: '@',
            },
            replace: true,
            compile: function (element, attr, scope) {


                if (!attr.clientLeft) {
                    attr.clientLeft = 0;
                }

                if (!attr.clientTop) {
                    attr.clientTop = 0;
                }

                return {
                    post: function (scope, element, attr, ctrl) {

                        var sw = ctrl.createSwitch(element.children().first());

                        scope.$watch('value', function(newValue, oldValue) {
                            if (newValue)
                                sw.setValue(newValue);
                        }, true);
                        
                        sw.onchange = function (evt) {
                            scope.$apply(function () { scope.value = evt.target.value; });
                        };
                    }

                }
            }
        };
    })
    .directive('wsWheel', function ($log) {
        return {
            controller: 'wsWebAudioControlsCtrl',
            restrict: 'EA', /* restrict if can apply to element or attribute, or all */
            template: '<div></div>',
            scope: {
                step: '@',
                min: '@minValue',
                max: '@maxValue',
                scale: '@',
                value: '=',
                tooltip: '@',
                units: '@',
                format: '&'
            },
            replace: true,
            compile: function (element, attr, scope) {

                return {
                    post: function (scope, element, attr, ctrl) {

                        var wheel = ctrl.createWheel(element);

                        scope.$watch('value', function(newValue, oldValue) {
                            if (newValue)
                                wheel.setValue(newValue);
                        }, true);

                        if (scope.format()) {
                            wheel.format = scope.formatValue;
                        }
                        
                        wheel.onchange = function (evt) {
                            scope.$apply(function () { scope.value = evt.target.value; });
                        };
                    }

                }
            }
        };
    })
    .directive('wsKnob', function ($log) {
        return {
            controller: 'wsWebAudioControlsCtrl',
            restrict: 'EA', /* restrict if can apply to element or attribute, or all */
            template: '<div style="position:relative"><div class="knobContainer" style="left: {{x}}px;top: {{y}}px;" ></div></div>',
            scope: {
                x: '@clientLeft',
                y: '@clientTop',
                step: '@',
                min: '@minValue',
                max: '@maxValue',
                scale: '@',
                value: '=',
                tooltip: '@',
                units: '@',
                format: '&'
            },
            replace: true,
            compile: function (element, attr, scope) {


                if (!attr.clientLeft) {
                    attr.clientLeft = 0;
                }

                if (!attr.clientTop) {
                    attr.clientTop = 0;
                }

                return {
                    post: function (scope, element, attr, ctrl) {

                        var knob = ctrl.createKnob(element.children().first(), "images/filtate.png");

                        scope.$watch('value', function(newValue, oldValue) {
                            if (newValue)
                                knob.setValue(newValue);
                        }, true);

                        if (scope.format()) {
                            knob.format = scope.formatValue;
                        }
                        
                        knob.onchange = function (evt) {
                            scope.$apply(function () { scope.value = evt.target.value; });
                        };
                    }

                }
            }
        };
    })
    .directive('wsFrequencyKnob', function ($log) {
        return {
            controller: 'wsWebAudioControlsCtrl',
            restrict: 'EA', /* restrict if can apply to element or attribute, or all */
            template: '<div style="position:relative"><div class="knobContainer" style="left: {{x}}px;top: {{y}}px;" ></div></div>',
            scope: {
                x: '@clientLeft',
                y: '@clientTop',
                step: '@',
                min: '@minValue',
                max: '@maxValue',
                scale: '@',
                value: '=',
                tooltip: '@',
                units: '@',
                format: '&'
            },
            replace: true,
            compile: function (element, attr, scope) {


                if (!attr.clientLeft) {
                    attr.clientLeft = 0;
                }

                if (!attr.clientTop) {
                    attr.clientTop = 0;
                }

                return {
                    post: function (scope, element, attr, ctrl) {

                        var knob = ctrl.createKnob(element.children().first(), "images/minimoog-main.png");

                        scope.$watch('value', function (newValue, oldValue) {
                            if (newValue)
                                knob.setValue(newValue);
                        }, true);

                        if (scope.format()) {
                            knob.format = scope.formatValue;
                        }

                        knob.onchange = function (evt) {
                            scope.$apply(function () { scope.value = evt.target.value; });
                        };
                    }

                }
            }
        };
    });

});
