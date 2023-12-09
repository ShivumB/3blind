//goes from: title, press, memo, recall, title
var scene;

var cornerLetters;
var edgeLetters;

//for transitioning background
var bg;
var bg1;
var bg2;

var time;
var startTime;

//for full practice
var inputCorners;
var inputEdges;
var answer;
var response;
var correctedResponse;

//for letterPair practice
var inputLetterPair;
var pair;

//for tracing practice
var inputTraceCorner;
var inputTraceEdge;

//for tracing
var corner;
var cornerOptions;
// var mouseInitPos;
// var mouseDelta;

//for opengl
var font;

function genSequence() {
	let ans1 = "";	
	for(let i = 0; i < 8; i++) {
		let chosen = int(Math.random()*(cornerLetters.length - 1));
		ans1 += cornerLetters[chosen].toLowerCase();
		if(i % 2 == 1) ans1 += " ";
		
		let temp = cornerLetters[chosen];
		cornerLetters[chosen] = cornerLetters[cornerLetters.length - 1];
		cornerLetters[cornerLetters.length - 1] = temp;
	}
	
	let ans2 = "";
	for(let i = 0; i < 12; i++) {
		let chosen = int(Math.random()*(edgeLetters.length - 1));
		ans2 += edgeLetters[chosen];
		if(i % 2 == 1) ans2 += " ";
		
		let temp = edgeLetters[chosen];
		edgeLetters[chosen] = edgeLetters[edgeLetters.length - 1];
		edgeLetters[edgeLetters.length - 1] = temp;
	}
	
	return [ans1,ans2];
}

function genPair() {
	let res = "";
	if(Math.random() < 0) {
			let chosen = int(Math.random()*(edgeLetters.length - 1));
			res += edgeLetters[chosen];	
		
			let temp = edgeLetters[chosen];
			edgeLetters[chosen] = edgeLetters[edgeLetters.length - 1];
			edgeLetters[edgeLetters.length - 1] = temp;

			res += edgeLetters[int(Math.random()*(edgeLetters.length - 1))];
	} else {
		let chosen = int(Math.random()*(cornerLetters.length - 1));
		res += cornerLetters[chosen].toLowerCase();	
		
		let temp = cornerLetters[chosen];
		cornerLetters[chosen] = cornerLetters[cornerLetters.length - 1];
		cornerLetters[cornerLetters.length - 1] = temp;

		res += cornerLetters[int(Math.random()*(cornerLetters.length - 1))].toLowerCase();
	}
	
	return res;
}

function genCorner() {
	
	const g = color(0,255,0);
	const b = color(0, 0, 255);
	const r = color(255,0, 0);
	const o = color(255,165,0);
	const w = color(255,255,255);
	const y = color(255,255,0);
	
	let options = [
		[g, o, w],
		[g, w, r],
		[g, r, y],
		[g, y, o],
		[w, o, b],
		[w, b, r],
		[b, o, y],
		[b, y, r],
	];
	
	let letters = [
		["i", "f", "d"],
		["j", "c", "m"],
		["k", "p", "v"],
		["l", "u", "g"],
		["a", "e", "r"],
		["b", "q", "n"],
		["s", "h", "x"],
		["t", "w", "o"]
	]
	
	//this is so no repeats - after chose corner, corner goes to 8th slot, then comes back next time
	let cornerIndex = int(Math.random() * 7);
	
	let temp = cornerOptions[cornerIndex];
	cornerOptions[cornerIndex] = cornerOptions[7];
	cornerOptions[7] = temp;
	
	const chosenCorner = options[cornerOptions[cornerIndex]];
	const orientation = int(Math.random()*3);
	
	const c = [chosenCorner[(0 + orientation)%3], chosenCorner[(1 + orientation)%3], chosenCorner[(2 + orientation)%3]];
	const l = letters[cornerOptions[cornerIndex]][orientation];
	
	return [c,l];
}

function lerpBg(fromBg, toBg) {
	fromBg[0] += 0.3*(toBg[0] - fromBg[0]);
	fromBg[1] += 0.3*(toBg[1] - fromBg[1]);
	fromBg[2] += 0.3*(toBg[2] - fromBg[2]);
}

function prettifyString(str) {
	let temp = str.split("");
	let res = "";
	for(let i = 0; i < temp.length; i++) {
		res += temp[i];
		if(i % 2 == 1) res += " ";
	}
	return res;
}

function correctResponse(response, answer) {
	res = [];
	for(let i = 0; i < answer.length; i++) {
		if(i < response.length) {
			
			if(answer.substring(i,i+1) == response.substring(i,i+1)) {
				res[i] = [answer.substring(i,i+1), "black"];
			} else {
				res[i] = [response.substring(i, i + 1), "red"];
			}			
			
		} else if(answer.substring(i,i+1) == " ") {
			res[i] = [" ", "red"]
		} else {
			res[i] = ["_", "red"];
		}
	}
	
	//make rest of letters red
	for(let i = answer.length; i < response.length; i++) {
		res[i] = [response.substring(i,i+1), "red"];
	}
	fill(0);
	return res;
}

function textArray(arr, x, y) {
	textAlign(LEFT, CENTER);
	
	let lengthKeeper = "";
	for(let i = 0; i < arr.length; i++) {
		lengthKeeper += arr[i][0];
	}
	let startX = x - textWidth(lengthKeeper)/2;
	
	lengthKeeper = "";
	for(let i = 0; i < arr.length; i++) {
		if(arr[i][1] == "red") fill(255,0,0);
		else fill (0);
		
		text(arr[i][0], startX + textWidth(lengthKeeper), y);
		lengthKeeper += arr[i][0];
	}
	
	fill(0);
}

function keyPressed() {	
	
	if(keyCode == 187) {
		if(scene == "title") {
			scene = "letterPair";
			inputLetterPair.removeClass("hidden");
			inputLetterPair.value("");
			inputLetterPair.elt.focus();
			
		} else if(scene == "letterPair") {
			scene = "traceCorners";
			inputLetterPair.addClass("hidden");
			
			inputTraceCorner.removeClass("hidden");
			inputTraceCorner.value("");
			inputTraceCorner.elt.focus();
			
			startTime = millis();
		} else if(scene == "traceCorners") {
			scene = "title";
			
			inputTraceCorner.addClass("hidden");
		}
	}
	
	if(keyCode == 32) {
		if(scene == "title") {
				time = 0;
				scene = "press";
		}
	}
	
	if(keyCode === 13) {
		if(scene == "recall") {
			if(keyIsDown(SHIFT)) {
				scene = "title";
				
				//gen answers in same format as sequences
				response[0] = prettifyString(inputCorners.value().toLowerCase());
				response[1] = prettifyString(inputEdges.value().toUpperCase());
				
				//compare answers to sequences, generate list of strings
				correctedResponse[0] = correctResponse(response[0], answer[0]);
				correctedResponse[1] = correctResponse(response[1], answer[1]);
				
				inputCorners.addClass("hidden");
				inputEdges.addClass("hidden");
				
			} else if(document.activeElement === inputCorners.elt) {
				inputEdges.elt.focus();
			} else if(document.activeElement === inputEdges.elt) {
				inputCorners.elt.focus();
			}
		}
		
		 else if(scene == "memo") {
				scene = "recall";
				
				inputCorners.removeClass("hidden");
				inputCorners.value("");
			
				inputEdges.removeClass("hidden");
				inputEdges.value("");
			
				inputCorners.elt.focus();
		}
		
		else if(scene == "letterPair") {
			pair = genPair();
			inputLetterPair.value("");
		}
		
		else if(scene == "traceCorners" && inputTraceCorner.value() == corner[1]) {
			corner = genCorner();
			inputTraceCorner.value("");
			startTime = millis();
		}
	} 
}

function keyReleased() {	
	if(keyCode == 32) {
		switch(scene) {
			case "press":
				scene = "memo";
				
				startTime = millis();
				
				answer = genSequence();
				break;
		}
	}
}

function mousePressed() {
	if(scene == "traceCorners") {
		// mouseInitPos = [mouseX, mouseY];
	}
}

function mouseReleased() {
	if(scene == "traceCorners") {
		// mouseDelta = [mouseDelta[0] + (mouseX - mouseInitPos[0]), mouseDelta[1] + (mouseY - mouseInitPos[1])];
	}
}

function preload() {	
		font = loadFont("Roboto-Regular.ttf");
}

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	textFont(font);		
	
	scene = "title";
	
	//no buffer letters
	//missing a, e, r
	cornerLetters = ["B","C","D","F","G","H","I","J","K","L","M","N","O","P","Q","S","T","U","V","W","X"];
	//missing b, m
	edgeLetters = ["A","C","D","E","F","G","H","I","J","K","L","N","O","P","Q","R","S","T","U","V","W","X"];
	
	bg = [250,240,240];
	bg1 = [250,240,240];
	bg2 = [100,255,100];
	
	time = 0;
	startTime = 0;
	
	inputCorners = createInput("");
	inputCorners.addClass("textbox");
	inputCorners.addClass("hidden");
	inputCorners.position(width/2 - 140, height/2 + height/8 - 20);
	
	inputEdges = createInput("");
	inputEdges.addClass("textbox");
	inputEdges.addClass("hidden");
	inputEdges.position(width/2 - 140, height/2 + height/8 + 30);
	
	inputLetterPair = createInput("");
	inputLetterPair.addClass("textbox");
	inputLetterPair.addClass("hidden");
	inputLetterPair.position(width/2 - 140, height/2 + 20);
	
	inputTraceCorner = createInput("");
	inputTraceCorner.addClass("textbox");
	inputTraceCorner.addClass("hidden");
	inputTraceCorner.position(width/2 - 140, height/2 + 20);
	
	pair = genPair();
	cornerOptions = [0,1,2,3,4,5,6,7];
	corner = genCorner();
	
	answer = ["",""];
	response = ["",""];
	correctedResponse = ["",""];	
	
	// mouseInitPos = [0,0];
	// mouseDelta = [45,225];
}

function draw() {

	background(bg[0], bg1[1], bg[2]);
	
	textSize(20);
	fill(0);
	textAlign(LEFT, TOP);
	text("3blind memo trainer", 30 - width/2, 30 - height/2);
	
	if(scene != "letterPair") {
		textSize(80);
		textAlign(RIGHT, BOTTOM);
		text(Math.floor(time/1000), 0, 0);
		textSize(40);
		textAlign(LEFT, BOTTOM);
		text("." + Math.floor((time % 1000)/10), 0, 0);
	}

	switch(scene) {
		case "title":
			lerpBg(bg, bg1);

			textSize(40);
			textAlign(CENTER, CENTER);
			text(answer[0] + "\n" + answer[1], 0, -height/4);

			//text array changes the text aligning to LEFT, CENTER
			textArray(correctedResponse[0], 0, height/8);
			textArray(correctedResponse[1], 0, height/8 + 40);


			textSize(20);
			textAlign(CENTER, TOP);
			text("press or hold space to start memo", 0, 10);
			break;

		case "press":
			lerpBg(bg, bg2);
			break;

		case "memo":
			lerpBg(bg, bg1);

			textSize(40);
			textAlign(CENTER, CENTER);
			text(answer[0] + "\n" + answer[1], 0, -height/4);

			textSize(20);
			textAlign(CENTER, TOP);
			text("press 'ENTER' to start recall", 0, 10);

			time = millis() - startTime;
			break;

		case "recall":			
			textAlign(CENTER, TOP);
			textSize(20);
			text("press 'SHIFT' + 'ENTER' to submit", 0, 10);

			time = millis() - startTime;
			break;

		case "letterPair":
			textAlign(CENTER, BOTTOM);
			textSize(80);
			text(pair, 0, 0);
			break;
			
		case "traceCorners":
			
			ambientLight(255);
			translate(0,-185,0);
			
			//to transform corner
			push();
						
			// //get rotation of corners
			// if(mouseIsPressed) {
			// 	rotateX((mouseDelta[1] + (mouseY - mouseInitPos[1])) * -0.01);
			// 	rotateY((mouseDelta[0] + (mouseX - mouseInitPos[0])) * 0.01);
			// } else {
			// 	rotateX(mouseDelta[1] * -0.01);
			// 	rotateY(mouseDelta[0] * 0.01);
			// }
			
			rotateX(-3*PI/4);
			rotateZ(-PI/4);
			
			// ambientMaterial(0);
			// box(100,100,100);
			
			translate(0,0,-50);
			ambientMaterial(corner[0][0]);
			box(100, 100, 10);
			
			translate(50, 0, 50);
			ambientMaterial(corner[0][1]);
			box(10, 100, 100);
			
			translate(-50, -50, 0);
			ambientMaterial(corner[0][2]);
			box(100, 10, 100);
			
			pop();
			
			time = millis() - startTime;			
			break;
	}
}
