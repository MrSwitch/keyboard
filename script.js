//
// Keyboard Javascript API
// Author Andrew Dodson

	var context = new AudioContext();

	// GAIN
	// Is effectively the volume
	var gainNode = context.createGain();
	gainNode.gain.value = gain.value;

	// Assume the output is all going through the mix node.
	var compressor = context.createDynamicsCompressor();
	compressor.connect(context.destination);

	// BiQuad
	var biquad = context.createBiquadFilter();
	biquad.type = biquadType.value.toLowerCase();
	biquad.gain.value = biquadGain.value;
	biquad.Q.value = biquadQ.value;
	biquad.frequency.value = biquadFreq.value;

	//
	// Compressor
	var compresor = context.createDynamicsCompressor();
	compresor.threshold.value = threshold.value;
	compresor.knee.value = knee.value;
	compresor.ratio.value = ratio.value;
	compresor.reduction.value = reduction.value;
	compresor.attack.value = attack.value;
	compresor.release.value = release.value;


	//
	// ANALYSER
    var analyser = context.createAnalyser();
    analyser.fftSize = 2048;


	// And in Reverse
	biquad.connect(compresor);
	gainNode.connect(biquad);
	compresor.connect(analyser);
    analyser.connect(context.destination);


    var i=0;
    function draw(){
		var freqByteData = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(freqByteData);
		if(i++ < 60){
			console.log(freqByteData);
			window.requestAnimationFrame(draw);	
		}
    }

	draw();	



	//
	// NOTES
	var notes = [["C0","16.35"],["C#0/Db0","17.32"],["D0","18.35"],["D#0/Eb0","19.45"],["E0","20.60"],["F0","21.83"],["F#0/Gb0","23.12"],["G0","24.50"],["G#0/Ab0","25.96"],["A0","27.50"],["A#0/Bb0","29.14"],["B0","30.87"],["C1","32.70"],["C#1/Db1","34.65"],["D1","36.71"],["D#1/Eb1","38.89"],["E1","41.20"],["F1","43.65"],["F#1/Gb1","46.25"],["G1","49.00"],["G#1/Ab1","51.91"],["A1","55.00"],["A#1/Bb1","58.27"],["B1","61.74"],["C2","65.41"],["C#2/Db2","69.30"],["D2","73.42"],["D#2/Eb2","77.78"],["E2","82.41"],["F2","87.31"],["F#2/Gb2","92.50"],["G2","98.00"],["G#2/Ab2","103.83"],["A2","110.00"],["A#2/Bb2","116.54"],["B2","123.47"],["C3","130.81"],["C#3/Db3","138.59"],["D3","146.83"],["D#3/Eb3","155.56"],["E3","164.81"],["F3","174.61"],["F#3/Gb3","185.00"],["G3","196.00"],["G#3/Ab3","207.65"],["A3","220.00"],["A#3/Bb3","233.08"],["B3","246.94"],["C4","261.63"],["C#4/Db4","277.18"],["D4","293.66"],["D#4/Eb4","311.13"],["E4","329.63"],["F4","349.23"],["F#4/Gb4","369.99"],["G4","392.00"],["G#4/Ab4","415.30"],["A4","440.00"],["A#4/Bb4","466.16"],["B4","493.88"],["C5","523.25"],["C#5/Db5","554.37"],["D5","587.33"],["D#5/Eb5","622.25"],["E5","659.26"],["F5","698.46"],["F#5/Gb5","739.99"],["G5","783.99"],["G#5/Ab5","830.61"],["A5","880.00"],["A#5/Bb5","932.33"],["B5","987.77"],["C6","1046.50"],["C#6/Db6","1108.73"],["D6","1174.66"],["D#6/Eb6","1244.51"],["E6","1318.51"],["F6","1396.91"],["F#6/Gb6","1479.98"],["G6","1567.98"],["G#6/Ab6","1661.22"],["A6","1760.00"],["A#6/Bb6","1864.66"],["B6","1975.53"],["C7","2093.00"],["C#7/Db7","2217.46"],["D7","2349.32"],["D#7/Eb7","2489.02"],["E7","2637.02"],["F7","2793.83"],["F#7/Gb7","2959.96"],["G7","3135.96"],["G#7/Ab7","3322.44"],["A7","3520.00"],["A#7/Bb7","3729.31"],["B7","3951.07"],["C8","4186.01"],["C#8/Db8","4434.92"],["D8","4698.64"],["D#8/Eb8","4978.03"]];


	notes.forEach(function(item){
		var btn = document.createElement('button');
		btn.id = item[0].replace(/\W/g,'');
		btn.appendChild(document.createTextNode(item[0]));
		btn.title = item[0];
		btn.type = "button";
		btn.className = item[0].match(/\#/)?'black':'white';
		btn.setAttribute('data-note', item[0].replace(/[0-9]/g,''));
		var osc;
		btn.onmousedown = function(){
			if(osc){
				osc.gain.exponentialRampToValueAtTime(1.0, context.currentTime);
			}
			osc = addOscillator(parseFloat(item[1]));

			//addToScore(item);
		};
		btn.onmouseup = out;
		btn.onmouseout = out;

		function out(){
			if(osc){
				osc.gain.exponentialRampToValueAtTime(1.40130e-45, context.currentTime+0.01);
				osc = null;
			}
		}

		document.querySelector('div.keyboard').appendChild(btn);
	});



	//
	// RANGE
	// Update form 'value'
	var inputs = document.querySelectorAll('input');
	for(var i=0;i<inputs.length;i++){
		(function(item){
			item.addEventListener('focus', function(){
				this.setAttribute('value', this.value);
			});
			item.addEventListener('input', function(){
				this.setAttribute('value', this.value);
			});
		})(inputs[i]);
	}


	// 
	// AddOscillator
	function addOscillator(freq){

		//
		// GAIN
		var gainNodeTemp = context.createGain();
		gainNodeTemp.gain.value = 0;
		gainNodeTemp.gain.exponentialRampToValueAtTime(1, context.currentTime+0.01);

		console.log(freq);

		//
		// OSCILLATOR
		var oscillatorTemp = context.createOscillator();
	//	oscillator.connect(context.destination); // Connect to speakers
		oscillatorTemp.start(0); // Start generating sound immediately
		oscillatorTemp.type = wave.value.toLowerCase();
		oscillatorTemp.frequency.value = freq; // in hertz
		oscillatorTemp.detune.value = detune.value; // in hertz

		oscillatorTemp.connect(gainNodeTemp);

		// Add to the main gainNode
		gainNodeTemp.connect(gainNode);

		return gainNodeTemp;
	}


	var a = document.querySelectorAll("button[data-toggle]");
	for(var i=0;i<a.length;i++){
		a[i].onclick=function(){
			this.classList.toggle("visible");
			document.querySelector(this.getAttribute("data-toggle")).classList.toggle("visible");
		};
	}

	//
	// Scoring
	//


/*

	var selection = window.getSelection();//get the selection object (allows you to change selection)
	var tempo = 2000;
	var play = false;
	var score = document.getElementById('score');


	score.addEventListener('keydown', function(e){
		switch(e.which){
			// Keep the navigation
			case 37:
			case 38:
			case 39:
			case 40:
			return;
			// Delete a span to the left/right
			case 46:
			case 8:

			break;
		}
		e.preventDefault();
	});
	function addToScore(item){

		var span = document.createElement("span");
		span.appendChild(document.createTextNode(item[0]));
		span.setAttribute('contenteditable',false);
		score.appendChild(span);

		var brs = score.getElementsByTagName("br");
		for(var i = 0;i<brs.length;i++){
			score.removeChild(brs[i]);
		}
	}

	function playScore(){

		// Toggle Play control
		this.classList.toggle("play");
		play = this.classList.contains("play");

		// Does it contain text
		var	text = score.innerText;

		if(play&&text){
			
			var notes = text.split(" ");
			var range = document.createRange();//Create a range (a range is a like the selection but invisible)
			range.selectNodeContents(score);//Select the entire contents of the element with the range
			range.collapse(true);//collapse the range to the end point. false means collapse to end rather than the start
			selection.removeAllRanges();//remove any selections already made
			selection.addRange(range);//make the range you have just created the visible selection
		}
	}

	(function selectNoteOnTempo(){
		setTimeout(function(){
			if( play && selection.rangeCount===1 && document.activeElement === score ){
				var range = selection.getRangeAt(0);
				console.log(range);
				if(!range.collapsed){
					selection.modify("move", "forward", "character");
					selection.modify("move", "forward", "character");
				}
				selection.modify("extend", "forward", "word");
				console.log(selection.toString());
			}
			selectNoteOnTempo();
		}, tempo);
	})();


	var canvas = document.getElementById('canvas');
	var renderer = new Vex.Flow.Renderer(canvas,
	Vex.Flow.Renderer.Backends.CANVAS);

	var ctx = renderer.getContext();
	var stave = new Vex.Flow.Stave(10, 0, 500);
	stave.addClef("treble").setContext(ctx).draw();

	// Create the notes
	var notes = [
		// A quarter-note C.
		new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "q" }),

		// A quarter-note D.
		new Vex.Flow.StaveNote({ keys: ["d/4"], duration: "q" }),

		// A quarter-note rest. Note that the key (b/4) specifies the vertical
		// position of the rest.
		new Vex.Flow.StaveNote({ keys: ["b/4"], duration: "qr" }),

		// A C-Major chord.
		new Vex.Flow.StaveNote({ keys: ["c/4", "e/4", "g/4"], duration: "q" })
	];

	// Create a voice in 4/4
	var voice = new Vex.Flow.Voice({
		num_beats: 4,
		beat_value: 4,
		resolution: Vex.Flow.RESOLUTION
	});

	// Add notes to voice
	voice.addTickables(notes);

	// Format and justify the notes to 500 pixels
	var formatter = new Vex.Flow.Formatter().
	joinVoices([voice]).format([voice], 500);

	// Render voice
	voice.draw(ctx, stave);
*/
