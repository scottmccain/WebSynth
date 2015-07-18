define(["app"], function () {
    return angular.module("WebSynth-services")
        .service("audioService", function ($log) {

            function frequencyFromNoteNumber(note) {
                return 440 * Math.pow(2, (note - 69) / 12);
            }

            // the master effects chain for all voices to connect to.
            var audioContext = new AudioContext();

            function audioNode() {
                this.outputNode = null;
                this.inputNode = null;
            }

            audioNode.prototype.connect = function (node) {

                console.log("node: ", node);
                $log.debug("outputNode: ", this.outputNode);

                if (node.hasOwnProperty('inputNode')) {
                    this.outputNode.connect(node.inputNode);
                } else {
                    this.outputNode.connect(node);
                }
            };

            function output() {
                var masterGain = audioContext.createGain();

                var waveshaper = new WaveShaper(audioContext);
                var reverbNode = audioContext.createConvolver();
                var reverbGain = audioContext.createGain();
                var reverbBypassGain = audioContext.createGain();
                var volumeNode = audioContext.createGain();
                var compressor = audioContext.createDynamicsCompressor();

                masterGain.connect(waveshaper.input);

                waveshaper.output.connect(reverbNode);
                waveshaper.output.connect(reverbBypassGain);
                reverbNode.connect(reverbGain);
                reverbGain.connect(volumeNode);
                reverbBypassGain.connect(volumeNode);

                volumeNode.connect(compressor);

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

                this.initializeReverbBuffer = function (buffer) {
                    reverbNode.buffer = buffer;
                };

                this.setDrive = function (driveLevel) {
                    waveshaper.setDrive((driveLevel * driveLevel / 500.0));
                };

                this.inputNode = masterGain;
                this.outputNode = audioContext.destination;


                this.setReverb(0);
                this.setDrive(.2);
                this.setVolume(0);

                compressor.connect(this.outputNode);

            };

            output.prototype = new audioNode();
            output.prototype.constructor = output;

            function vco() {

                var oscillator = audioContext.createOscillator();

                this.inputNode = oscillator;
                this.outputNode = oscillator;

                this.setFrequency = function (frequency) {
                    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                }

                oscillator.type = "sine";
                this.setFrequency(440);
                oscillator.start(0);
            }

            vco.prototype = new audioNode();
            vco.prototype.constructor = vco;

            function vca() {
                var gain = audioContext.createGain();

                this.inputNode = gain;
                this.outputNode = gain;

                this.setGain = function (val) {
                    gain.gain.setValueAtTime(val, audioContext.currentTime);
                };

                this.setGain(0);
            };

            vca.prototype = new audioNode();
            vca.prototype.constructor = vca;

            var effectChain = new output();

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
                var vcoNode = new vco();

                var frequency = 0;
                if (options.freq) {
                    frequency = parseFloat(options.freq);
                }

                vcoNode.setFrequency(frequency);
                return vcoNode;
            }

            function createGainNode(options) {
                var vcaNode = new vca();

                var rate = 0;
                if (options.rate) {
                    rate = parseFloat(options.rate);
                }

                vcaNode.setGain(rate);
                return vcaNode;
            }

            var nodeJson = '[{"type":"oscillator","freq":2000,"id":"osc1","connectedTo":"gain1"},{"type":"gain","rate":1,"id":"gain1","connectedTo":"OUTPUT"},{"type":"oscillator","freq":1,"connectedTo":"gain2"},{"type":"gain","rate":440,"id":"gain2","connectedTo":"osc1.frequency"}]';


            var nodes = JSON.parse(nodeJson);

            console.log(nodes);

            var audioNodes = {};
            var nodeIndex;
            var nodeOptions;
            var ad;
            for (nodeIndex in nodes) {
                if (nodes.hasOwnProperty(nodeIndex)) {

                    ad = null;

                    nodeOptions = nodes[nodeIndex];

                    switch (nodeOptions.type) {
                    case "oscillator":
                        ad = createOscillatorNode(nodeOptions);
                        break;

                    case "gain":
                        ad = createGainNode(nodeOptions);
                        break;
                    }

                    audioNodes[nodeOptions.id] = ad;
                }
            }

            // now do connections
            for (nodeIndex in nodes) {
                if (nodes.hasOwnProperty(nodeIndex)) {
                    nodeOptions = nodes[nodeIndex];
                    ad = audioNodes[nodeOptions.id];
                    var parts = nodeOptions.connectedTo.split(".");

                    var connectedTo = parts[0];

                    $log.debug("nodeOptions: ", nodeOptions);

                    if (connectedTo === "OUTPUT") {
                        // special connection to output device
                        ad.connect(effectChain);
                    } else {
                        var other = audioNodes[connectedTo];

                        $log.debug("connectedTo: ", connectedTo);
                        $log.debug("type: ", nodeOptions.type);

                        if (parts[1]) {
                            ad.connect(other.inputNode[parts[1]]);
                        } else {
                            ad.connect(other);
                        }

                    }

                    //console.log(nodeOptions);
                    //console.log(ad);
                    //console.log(connectedTo);
                }
            }

        });
});