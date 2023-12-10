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

//general input used when input directly under timer. used to have multiple inputs at same position, reduced to this.
var input2;

//for letterPair practice
var pair;

//for corner tracing
var corner;
var cornerOptions;

//for edge tracing
var edge;
var edgeOptions;

var font;

function lerpBg(fromBg, toBg) {
	fromBg[0] += 0.3*(toBg[0] - fromBg[0]);
	fromBg[1] += 0.3*(toBg[1] - fromBg[1]);
	fromBg[2] += 0.3*(toBg[2] - fromBg[2]);
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
	
	input2 = createInput("");
	input2.addClass("textbox");
	input2.addClass("hidden");
	input2.position(width/2 - 140, height/2 + 20);
	
	pair = genPair();
	cornerOptions = [0,1,2,3,4,5,6,7];
	corner = genCorner();
	
	edgeOptions = [0,1,2,3,4,5,6,7,8,9,10,11];
	edge = genEdge();
	
	answer = ["",""];
	response = ["",""];
	correctedResponse = ["",""];	
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
			translate(6,-185,0);
			
			//to transform corner
			push();
			
			rotateX(-3*PI/4);
			rotateZ(-PI/4);
			
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
			
		case "traceEdges":
			
			orbitControl();
			
			ambientLight(255);
			translate(0,-100,0);
			
			//to transform corner
			push();
			
			rotateX(-PI/3)			
						
			translate(0, -50, -100);
			ambientMaterial(edge[0][0]);
			box(100, 10, 100);
			
			translate(0,50,50);
			ambientMaterial(edge[0][1]);
			box(100, 100, 10);
			
			pop();
			
			time = millis() - startTime;	
			break;
	}
}
