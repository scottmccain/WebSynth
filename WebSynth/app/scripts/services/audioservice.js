define(['app'], function () {
    return angular.module('WebSynth-services')
        .service('audioService', function ($log) {

            function frequencyFromNoteNumber(note) {
                return 440 * Math.pow(2, (note - 69) / 12);
            }

            // the master effects chain for all voices to connect to.
            var audioContext = new AudioContext();

            function AudioNode() {
                this.outputNode;
                this.inputNode;
            }

            AudioNode.prototype.connect = function (node) {

                console.log("node: ", node);

                if (node.hasOwnProperty('inputNode')) {
                    this.outputNode.connect(node.inputNode);
                } else {
                    this.outputNode.connect(node);
                }
            };

            function OutputNode() {
                this.masterGain = audioContext.createGain();

                this.waveshaper = new WaveShaper(audioContext);
                this.reverbNode = audioContext.createConvolver();
                this.reverbGain = audioContext.createGain();
                this.reverbBypassGain = audioContext.createGain();
                this.volumeNode = audioContext.createGain();
                this.compressor = audioContext.createDynamicsCompressor();

                this.masterGain.connect(this.waveshaper.input);

                this.waveshaper.output.connect(this.reverbNode);
                this.waveshaper.output.connect(this.reverbBypassGain);
                this.reverbNode.connect(this.reverbGain);
                this.reverbGain.connect(this.volumeNode);
                this.reverbBypassGain.connect(this.volumeNode);

                this.volumeNode.connect(this.compressor);

                this.setReverb(0);
                this.setDrive(.2);
                this.setVolume(0);

                this.inputNode = this.masterGain;
                this.outputNode = audioContext.destination;

                this.compressor.connect(this.outputNode);
            };

            OutputNode.prototype = new AudioNode();
            OutputNode.prototype.constructor = AudioNode;


            OutputNode.prototype.setDrive = function (driveLevel) {
                this.waveshaper.setDrive((driveLevel * driveLevel / 500.0));
            };

            // 0 - 1
            OutputNode.prototype.setReverb = function (val) {
                // equal-power crossfade
                var gain1 = Math.cos(val * 0.5 * Math.PI);
                var gain2 = Math.cos((1.0 - val) * 0.5 * Math.PI);

                this.reverbBypassGain.gain.value = gain1;
                this.reverbGain.gain.value = gain2;
            };

            OutputNode.prototype.setVolume = function (volume) {
                this.volumeNode.gain.value = volume;
            };

            OutputNode.prototype.initializeReverbBuffer = function (buffer) {
                this.reverbNode.buffer = buffer;
            };

            function VCO() {

                var oscillator = audioContext.createOscillator();

                this.inputNode = this.oscillator;
                this.outputNode = this.oscillator;

                this.setFrequency = function (frequency) {
                    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                }

                oscillator.type = 'sine';
                this.setFrequency(440);
                oscillator.start(0);
            }

            VCO.prototype = new AudioNode();
            VCO.prototype.constructor = VCO;

            function VCA() {
                var gain = audioContext.createGain();

                this.inputNode = gain;
                this.outputNode = gain;

                this.setGain = function (val) {
                    gain.gain.setValueAtTime(val, audioContext.currentTime);
                };

                this.setGain(0);
            };

            VCA.prototype = new AudioNode();
            VCA.prototype.constructor = VCA;

            var effectChain = new OutputNode();

            var initializeReverb = function () {
                var irRRequest = new XMLHttpRequest();
                irRRequest.open("GET", "sounds/irRoom.wav", true);
                irRRequest.responseType = "arraybuffer";
                irRRequest.onload = function () {
                    audioContext.decodeAudioData(irRRequest.response,
                        function (buffer) { effectChain.initializeReverbBuffer(buffer); });
                }
                irRRequest.send();
            };

            initializeReverb();

            effectChain.setDrive(.2);
            effectChain.setReverb(.2);
            effectChain.setVolume(1);

            function createOscillatorNode(options) {
                var node = new VCO();

                var frequency = 0;
                if (options.freq) {
                    frequency = parseFloat(options.freq);
                }

                node.setFrequency(frequency);
                return node;
            }

            function createGainNode(options) {
                var node = new VCA();

                var rate = 0;
                if (options.rate) {
                    rate = parseFloat(options.rate);
                }

                node.setGain(rate);
                return node;
            }

            var nodeJson = '[{"type":"oscillator","freq":440,"id":"osc1","connectedTo":"gain1"},{"type":"gain","rate":0,"id":"gain1","connectedTo":"OUTPUT"},{"type":"oscillator","freq":1,"connectedTo":"gain2"},{"type":"gain","rate":2000,"id":"gain2","connectedTo":"osc1.frequency"}]';


            var nodes = JSON.parse(nodeJson);

            console.log(nodes);

            var audioNodes = {};

            for (var nodeIndex in nodes) {
                var node = nodes[nodeIndex];

                var audioNode;
                switch (node.type) {
                    case 'oscillator':
                        audioNode = createOscillatorNode(node);
                        break;

                    case 'gain':
                        audioNode = createGainNode(node);
                        break;
                }

                audioNodes[node.id] = audioNode;
            }

            // now do connections
            for (var nodeIndex in nodes) {
                var nodeOptions = nodes[nodeIndex];
                var audioNode = audioNodes[nodeOptions.id];

                var parts = nodeOptions.connectedTo.split(".");

                var connectedTo = parts[0];

                if (connectedTo === "OUTPUT") {
                    // special connection to output device
                    audioNode.connect(effectChain);
                } else {
                    var other = audioNodes[connectedTo];

                    if (parts[1]) {
                    }
                    console.log("other: ", other);
                }

                console.log(nodeOptions);
                console.log(audioNode);
                console.log(connectedTo);
            }

        });
});