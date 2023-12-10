function keyPressed() {	
	
	if(keyCode == 187) {
		if(scene == "title") {
			scene = "letterPair";
			
			input2.removeClass("hidden");
			input2.value("");
			input2.elt.focus();
			
		} else if(scene == "letterPair") {
			scene = "traceCorners";
			input2.value("");
			input2.elt.focus();
			startTime = millis();
			
		} else if(scene == "traceCorners") {
			scene = "traceEdges";
			input2.value("");
			input2.elt.focus();
		} else if (scene == "traceEdges") {
			scene = "title";
			
			input2.addClass("hidden");
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
			input2.value("");
		}
		
		else if(scene == "traceCorners" && input2.value() == corner[1]) {
			corner = genCorner();
			input2.value("");
			startTime = millis();
		}
		
		else if(scene == "traceEdges" && input2.value() == edge[1]) {
			edge = genEdge();
			input2.value("");
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
