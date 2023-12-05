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
			inputLetterPair.elt.focus();
			inputLetterPair.value("");
		} else if(scene == "letterPair") {
			scene = "title";
			inputLetterPair.addClass("hidden");
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
	} 
}

function keyReleased() {	
	if(keyCode == 32) {
		switch(scene) {
			case "press":
				scene = "memo";
				
				startTime = millis();
				time = millis();
				
				answer = genSequence();
				break;
		}
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight);
		
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
	inputCorners.position(width/2 - 140,height*15/24 - 20);
	
	inputEdges = createInput("");
	inputEdges.addClass("textbox");
	inputEdges.addClass("hidden");
	inputEdges.position(width/2 - 140, height*15/24 + 30);
	
	inputLetterPair = createInput("");
	inputLetterPair.addClass("textbox");
	inputLetterPair.addClass("hidden");
	inputLetterPair.position(width/2 - 140, height/2 + 20);
	
	pair = genPair();
	
	answer = ["",""];
	response = ["",""];
	correctedResponse = ["",""];
}

function draw() {
	background(bg[0], bg1[1], bg[2]);
	
	textSize(20);
	textAlign(LEFT, TOP);
	text("3blind memo trainer", 30, 30);
	
	if(scene != "letterPair") {
		textSize(80);
		textAlign(RIGHT, BOTTOM);
		text(Math.floor(time/1000), width/2, height/2);
		textSize(40);
		textAlign(LEFT, BOTTOM);
		text("." + Math.floor((time % 1000)/10), width/2, height/2);
	}

	switch(scene) {
		case "title":
			lerpBg(bg, bg1);

			textSize(40);
			textAlign(CENTER, CENTER);
			text(answer[0] + "\n" + answer[1], width/2,height/4);

			//text array changes the text aligning to LEFT, CENTER
			textArray(correctedResponse[0], width/2,height*15/24);
			textArray(correctedResponse[1], width/2,height*15/24 + 40);


			textSize(20);
			textAlign(CENTER, TOP);
			text("press or hold space to start memo", width/2, height/2 + 10);
			break;

		case "press":
			lerpBg(bg, bg2);
			break;

		case "memo":
			lerpBg(bg, bg1);

			textSize(40);
			textAlign(CENTER, CENTER);
			text(answer[0] + "\n" + answer[1], width/2,height/4);

			textSize(20);
			textAlign(CENTER, TOP);
			text("press 'ENTER' to start recall", width/2, height/2 + 10);

			time = millis() - startTime;
			break;

		case "recall":			
			textAlign(CENTER, TOP);
			textSize(20);
			text("press 'SHIFT' + 'ENTER' to submit", width/2, height/2 + 10);

			time = millis() - startTime;
			break;

		case "letterPair":
			textAlign(CENTER, BOTTOM);
			textSize(80);
			text(pair, width/2, height/2);
			break;
	}

}
