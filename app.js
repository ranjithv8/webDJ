window.AudioContext = window.AudioContext||window.webkitAudioContext;

var context = new AudioContext();
var analyser = context.createAnalyser();
var javascriptNode = context.createJavaScriptNode(2048, 1, 1);
var source = context.createBufferSource();
var theMusicBuffer;
var filters = [];
var i =0;
var loop_id;
var toggle;

$(function(){
	console.log("Called loadMusic");

	var request = new XMLHttpRequest();
	request.open('GET',"far_from_love.mp3",true);
	request.responseType = "arraybuffer";

	request.onload = function() {
		console.log("Song Loaded");
		context.decodeAudioData(request.response,function(buffer){
			console.log("Song decode Done");
			source.buffer = buffer;
			analyser.smoothingTimeConstant = 0.3;
			analyser.fftSize = 32;
			//source.connect(javascriptNode);
			javascriptNode.connect(context.destination);
			source.connect(analyser);
			
			//analyser.connect(javascriptNode);
			source.connect(context.destination);
			
		},onError);
	};
	request.send();
});

onError = function(){
	console.log("error");
};

javascriptNode.onaudioprocess = function(audioProcessingEvent) {
	var array =  new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(array);
	
	var outputBuffer = audioProcessingEvent.outputBuffer;
	
	var filter = [];
	var sum = 0;
	for (i=0; i< array.length; i++){
		$(".bar"+i).height(array[i]);
	}
};


function startDJ(event){
	if(toggle) {
		//stop_filter_loop();
		source.stop(0);		
	} else {
		source.noteOn(0);
		//filter_loop();
	}
	toggle = !toggle;
}