//goes from: title, press, memo, recall, title
var scene;
var seq;
var cornerLetters;
var edgeLetters;

var bg;
var bg1;
var bg2;

var time;
var startTime;

var inputCorners;
var inputEdges;

var answers;

function genSequence() {
	ans = "";
	
	for(let i = 0; i < 8; i++) {
		let chosen = int(Math.random()*(cornerLetters.length - 1));
		ans += cornerLetters[chosen].toLowerCase();
		if(i % 2 == 1) ans += " ";
		
		let temp = cornerLetters[chosen];
		cornerLetters[chosen] = cornerLetters[cornerLetters.length - 1];
		cornerLetters[cornerLetters.length - 1] = temp;
	}
	
	ans += "\n";
	for(let i = 0; i < 12; i++) {
		let chosen = int(Math.random()*(edgeLetters.length - 1));
		ans += edgeLetters[chosen];
		if(i % 2 == 1) ans += " ";
		
		let temp = edgeLetters[chosen];
		edgeLetters[chosen] = edgeLetters[edgeLetters.length - 1];
		edgeLetters[edgeLetters.length - 1] = temp;
	}
	
	return ans;
}

function lerpBg(fromBg, toBg) {
	fromBg[0] += 0.3*(toBg[0] - fromBg[0]);
	fromBg[1] += 0.3*(toBg[1] - fromBg[1]);
	fromBg[2] += 0.3*(toBg[2] - fromBg[2]);
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	
	scene = "title";
	
	//no buffer letters
	//missing a, e, r
	cornerLetters = ["B","C","D","F","G","H","I","J","K","L","M","N","O","P","Q","S","T","U","V","W","X"];
	//missing b, m
	edgeLetters = ["A","C","D","E","F","G","H","I","J","K","L","N","O","P","Q","R","S","T","U","V","W","X"];
	
	seq = "";
	
	bg = [250,240,240];
	bg1 = [250,240,240];
	bg2 = [100,255,100];
	
	time = 0;
	startTime = 0;
	
	inputCorners = createInput("");
	inputEdges = createInput("");
	inputCorners.addClass("textbox");
	inputEdges.addClass("textbox");
	inputCorners.position(-10,-100);
	inputEdges.position(-10,-100);
	
	answers = [];
	answers[0] = "";
	answers[1] = "";
}

function keyPressed() {	
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
				answers[0] = "";
				let temp = inputCorners.value().toLowerCase().split("");
				let p = "";
				for(let i = 0; i < temp.length; i++) {
					p += temp[i];
					
					if(p.length == 2) {
						answers[0] += p + " ";
						p = "";
					}
				}
				
				answers[1] = "";
				temp = inputEdges.value().toUpperCase().split("");
				p = "";
				for(let i = 0; i < temp.length; i++) {
					p += temp[i];
					
					if(p.length == 2) {
						answers[1] += p + " ";
						p = "";
					}
				}
				
				inputCorners.value("");
				inputCorners.position(-10,-100);
				inputEdges.value("");
				inputEdges.position(-10,-100);
			} else if(document.activeElement === inputCorners.elt) {
				inputEdges.elt.focus();
			} else if(document.activeElement === inputEdges.elt) {
				inputCorners.elt.focus();
			}
		}
		
		if(scene == "memo") {
				scene = "recall";
				
				inputCorners.elt.focus();
				inputCorners.position(width/2 - 140,height*15/24 - 20);
				inputCorners.value("");
				inputEdges.position(width/2 - 140, height*15/24 + 30);
				inputEdges.value("");
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
				
				seq = genSequence();
				break;
		}
	}
}

function draw() {
	background(bg[0], bg1[1], bg[2]);
	
	textSize(20);
	textAlign(LEFT, TOP);
	text("3blind memo trainer", 30, 30);
	
	textSize(80);
	textAlign(RIGHT, BOTTOM);
	text(Math.floor(time/1000), width/2, height/2);
	textSize(40);
	textAlign(LEFT, BOTTOM);
	text("." + Math.floor((time % 1000)/10), width/2, height/2);
	
	switch(scene) {
		case "title":
			lerpBg(bg, bg1);

			textSize(40);
			textAlign(CENTER, CENTER);
			text(seq, width/2,height/4);
			
			if(answers[0] != "") {
				text(answers[0], width/2,height*15/24);
			}
			if(answers[1] != "") {
				text("\n\n" + answers[1], width/2,height*15/24);
			}
			
			textSize(20);
			textAlign(CENTER, TOP);
			text("press or hold space to start memo", width/2, height/2 + 10);
			break;
			
		case "press":
			textAlign(CENTER, TOP);
			lerpBg(bg, bg2);
			break;
			
		case "memo":
			lerpBg(bg, bg1);
			
			textSize(40);
			textAlign(CENTER, CENTER);
			text(seq, width/2,height/4);
			
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
	}

}
