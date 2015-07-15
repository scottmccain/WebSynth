define(['app'], function () {
    return angular.module('WebSynth-services')
        .service('audioService', function ($log) {

            function frequencyFromNoteNumber(note) {
                return 440 * Math.pow(2, (note - 69) / 12);
            }

            //var currentVolume = 0;
            //var currentReverb = 0;

            // the master effects chain for all voices to connect to.
            var audioContext = new AudioContext();


            function EffectChain() {
                var masterGain = audioContext.createGain();

                var waveshaper = new WaveShaper(audioContext);
                var reverbNode = audioContext.createConvolver();
                var reverbGain = audioContext.createGain();
                var reverbBypassGain = audioContext.createGain();
                var volumeNode = audioContext.createGain();
                var compressor = audioContext.createDynamicsCompressor();

                this.connect = function (node) {
                    // connect a node to the output chain
                    node.connect(masterGain);
                };

                this.setDrive = function (driveLevel) {
                    waveshaper.setDrive((driveLevel * driveLevel / 500.0));
                };

                // 0 - 1
                this.setReverb = function (val) {
                    // equal-power crossfade
                    var gain1 = Math.cos(val * 0.5 * Math.PI);
                    var gain2 = Math.cos((1.0 - val) * 0.5 * Math.PI);

                    reverbBypassGain.gain.value = gain1;
                    reverbGain.gain.value = gain2;
                };

                this.setVolume = function (volume) {
                    volumeNode.gain.value = volume;
                };

                this.initializeReverb = function (buffer) {
                    reverbNode.buffer = buffer;
                };

                masterGain.connect(waveshaper.input);

                waveshaper.output.connect(reverbNode);
                waveshaper.output.connect(reverbBypassGain);
                reverbNode.connect(reverbGain);
                reverbGain.connect(volumeNode);
                reverbBypassGain.connect(volumeNode);

                volumeNode.connect(compressor);

                this.setReverb(0);
                this.setDrive(.2);
                this.setVolume(0);

                compressor.connect(audioContext.destination);

                //masterGain.gain.value = 1;

            };

            function SynthVoice(note, velocity, options) {

                var defaultOptions = {
                    osc1Waveform: 'sine',
                    osc2Waveform: 'sine',
                    osc1Mix: 0,
                    osc2Mix: 0,
                    osc1Mod: 0,
                    osc2Mod: 0,
                    osc1Octave: 1, // [1,5]
                    osc2Octave: 1,
                    osc1Detune: 0, // [-1200, 1200]
                    osc2Detune: 0
                };

                this.options = $.extend({}, options, defaultOptions);

                var context = new AudioContext();

                this.originalFrequency = frequencyFromNoteNumber(note);

                this.oscillators = [];

                this.oscillators.push(context.createOscillator());
                this.oscillators.push(context.createOscillator());

                this.oscillators[0].type = this.options.osc1Waveform;
                this.oscillators[1].type = this.options.osc2Waveform;

                this.gain = [];
                this.gain.push(context.createGain());
                this.gain[0].gain.value = .5 * this.options.osc1Mix;
                this.oscillators[0].connect(this.gain[0]);

                this.gain.push(context.createGain());
                this.gain[1].gain.value = .5 * this.options.osc2Mix;
                this.oscillators[1].connect(this.gain[1]);

            }

            SynthVoice.prototype.setOsc1Octave = function (val) {
                this.options.osc1Octave = val;
            };

            SynthVoice.prototype.setOsc2Octave = function (val) {
                this.options.osc2Octave = val;
            };

            SynthVoice.prototype.setOsc1Detune = function (val) {
                this.options.osc1Detune = val;
            };

            SynthVoice.prototype.setOsc2Detune = function (val) {
                this.options.osc2Detune = val;
            };

            SynthVoice.prototype.updateOsc2Frequency = function () {
                this.oscillators[1].frequency.value = this.originalFrequency * Math.pow(2, this.options.osc2Octave);
                this.oscillators[1].detune.value = this.options.osc2Detune; // + currentPitchWheel * 500;	// value in cents - detune major fifth.
            };

            SynthVoice.prototype.updateOsc1Frequency = function () {
                this.oscillators[0].frequency.value = this.originalFrequency * Math.pow(2, this.options.osc1Octave);
                this.oscillators[0].detune.value = this.options.osc1Detune; // + currentPitchWheel * 500;	// value in cents - detune major fifth.
            };


            this.setDrive = function (driveLevel) {
                this.effectChain.setDrive(driveLevel);
            };

            // 0 - 1
            this.setReverb = function (val) {
                this.effectChain.setReverb(val);
            };

            this.setVolume = function (volume) {
                this.effectChain.setVolume(volume);
            };

            var effectChain = new EffectChain();

            var initializeReverb = function () {
                var irRRequest = new XMLHttpRequest();
                irRRequest.open("GET", "sounds/irRoom.wav", true);
                irRRequest.responseType = "arraybuffer";
                irRRequest.onload = function () {
                    audioContext.decodeAudioData(irRRequest.response,
                        function (buffer) { effectChain.initializeReverb(buffer); });
                }
                irRRequest.send();
            };

            initializeReverb();

            var oscillator = audioContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.value = 440;

            var gain = audioContext.createGain();
            gain.gain.value = 0;
            oscillator.connect(gain);

            effectChain.connect(gain);

            effectChain.setDrive(.5);
            effectChain.setReverb(1);
            effectChain.setVolume(1);

            oscillator.start(0);
        });
});