define(['app'], function () {
    return angular.module('WebSynth-controllers')
        .controller('HomeController', function ($scope, $log, audioService) {

            function map(in_val, in_min, in_max, out_min, out_max) {
                return (in_val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
            }

            function objectIsEmpty(obj) {
                return Object.keys(obj).length === 0;
            }

            $scope.waveforms = [{
                id: 0,
                name: 'Sine',
                key: 'sine'
            },
            {
                id: 1,
                name: 'Square',
                key: 'square'
            },
            {
                id: 2,
                name: 'Sawtooth',
                key: 'sawtooth'

            },
            {
                id: 3,
                name: 'Triangle',
                key: 'triangle'

            }];

            $scope.glideRate = 0;

            $scope.volume = 0;

            $scope.lfoRate = 2.5;

            $scope.lfoSelectedWaveform = $scope.waveforms[0];
            $scope.osc1SelectedWaveform = $scope.waveforms[0];
            $scope.osc2SelectedWaveform = $scope.waveforms[0];

            $scope.osc2Range = 2;
            $scope.osc1Range = 4;

            $scope.osc2Detune = 0;
            $scope.osc1Detune = 0;

            $scope.pitchWheel = 0;

            $scope.osc1Mix = 20;
            $scope.osc2Mix = 20;

            $scope.osc1Mod = 3;
            $scope.osc2Mod = 3;

            $scope.filterCutoff = 0;

            audioService.initializeReverb();

            $scope.formatRange = function (val) {
                return Math.pow(2,val) + "'";
            };

            $scope.$on('keyboard-keyDown', function (event, data) {

                $log.debug("data: ", data);
                //audioService.setLFOFrequency($scope.lfoRate);
                //audioService.setLFOType($scope.lfoSelectedWaveform.key);
                //if ($scope.glideRate == 0) {
                //    audioService.enableGlide(false);
                //} else {

                //    audioService.enableGlide(true, map($scope.glideRate, 0, 100, .01, .1));
                //}

                //audioService.setVCOGain(map($scope.volume, 0, 10, 0, 1));
                //audioService.setVCOFrequency(data.frequency);

                //depressed_keys[data.note] = true;
                //audioService.noteOn(data.frequency);
            });

            $scope.$on('keyboard-keyUp', function (event, data) {

                //delete depressed_keys[data.note];
                //if (objectIsEmpty(depressed_keys)) {
                //    audioService.setVCOFrequency(0);
                //    audioService.setVCOGain(0);

                //}
            });

            var depressed_keys = {};
        });
});