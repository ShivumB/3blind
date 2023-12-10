//for memo practice
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

//for letterpair word practice
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

//for corner tracing
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

//same as corner code but with edges
function genEdge() {
	
	const g = color(0,255,0);
	const b = color(0, 0, 255);
	const r = color(255,0, 0);
	const o = color(255,165,0);
	const w = color(255,255,255);
	const y = color(255,255,0);
	
	let options = [
		[w,b],
		[w,r],
		[w,g],
		[w,o],
		[o,b],
		[o,g],
		[g,r],
		[r,b],
		[y,g],
		[y,r],
		[y,b],
		[y,o],
	];
	
	let letters = [
		["a","q"],
		["b","m"],
		["c","i"],
		["d","e"],
		["h","r"],
		["f","l"],
		["j","p"],
		["n","t"],
		["u","k"],
		["v","o"],
		["w","s"],
		["x","g"],
	]
	
	//this is so no repeats - after chose edge, edge goes to 12th slot, then comes back next time
	let edgeIndex = int(Math.random() * 11);
	
	let temp = edgeOptions[edgeIndex];
	edgeOptions[edgeIndex] = edgeOptions[11];
	edgeOptions[11] = temp;
	
	const chosenEdge = options[edgeOptions[edgeIndex]];
	const orientation = int(Math.random()*2);
	
	const c = [chosenEdge[(0 + orientation)%2], chosenEdge[(1 + orientation)%2]];
	const l = letters[edgeOptions[edgeIndex]][orientation];
	
	return [c,l];
}
