//	 recording.js

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext();
var audioInput = null,
    realAudioInput = null,
    inputPoint = null,
    audioRecorder = null;

/* TODO:

- offer mono option
- "Monitor input" switch
*/

function gotBuffers( buffers ) {

    // the ONLY time gotBuffers is called is right after a new recording is completed - 
    // so here's where we should set up the download.
	
   // audioRecorder.exportWAV( doneEncoding );
   audioRecorder.exportMonoWAV( doneEncoding );
}

function doneEncoding( blob ) {
	AUDIOPLAYOBJ.data = blob;
	var srcURL = URL.createObjectURL(AUDIOPLAYOBJ.data);
	AUDIOPLAYOBJ.aObj.src = srcURL;
	AUDIOPLAYOBJ.aObj.load();
	return false;
}

function convertToMono( input ) {
    var splitter = audioContext.createChannelSplitter(2);
    var merger = audioContext.createChannelMerger(2);

    input.connect( splitter );
    splitter.connect( merger, 0, 0 );
    splitter.connect( merger, 0, 1 );
    return merger;
}

function toggleMono() {
    if (audioInput != realAudioInput) {
        audioInput.disconnect();
        realAudioInput.disconnect();
        audioInput = realAudioInput;
    } else {
        realAudioInput.disconnect();
        audioInput = convertToMono( realAudioInput );
    }

    audioInput.connect(inputPoint);
}

function gotStream(stream) {
    inputPoint = audioContext.createGain();
	inputPoint.gain.value = 1.0;

    // Create an AudioNode from the stream.
    realAudioInput = audioContext.createMediaStreamSource(stream);
    audioInput = realAudioInput;
    audioInput.connect(inputPoint);
	
    audioRecorder = new Recorder( inputPoint );
}

function initAudioRecorder(cb) {
	if (!audioRecorder) {
		if(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
			if (!navigator.getUserMedia)
				navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

			navigator.getUserMedia({
				"audio": {
					"mandatory": {
						"googEchoCancellation": "false",
						"googAutoGainControl": "false",
						"googNoiseSuppression": "false",
						"googHighpassFilter": "false"
					},
					"optional": []
				},
				video: false,
			}, function(stream) {
				cb(JSON.stringify({ micstatus : 'allowed' }));
				gotStream(stream);
			}, function(e) {
					cb(JSON.stringify({ micstatus : 'denied' }));
					console.log(e);
			});
		} else {
			cb(JSON.stringify({ micstatus : 'notsupported' }));
		}
	} else {
		cb(JSON.stringify({ micstatus : 'allowed' }));
	}
}

