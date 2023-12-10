function prettifyString(str) {
	let temp = str.split("");
	let res = "";
	for(let i = 0; i < temp.length; i++) {
		res += temp[i];
		if(i % 2 == 1) res += " ";
	}
	return res;
}

//for memo practice - highlight wrong in red
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

//for text with multiple colors
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
