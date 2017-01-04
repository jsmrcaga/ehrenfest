const fs = require('fs');

var compartments = {
	A: [],
	B: []
};

var exec = {
	results: []
};

function generateBalls(nb){
	// random and place in container B since X0 = 0;
	for(var i = 0; i < nb; i++){
		compartments.B.push({
			label: i
		});
	}
}

function moveBall(nb){
	var ball = parseInt(Math.random() * nb);

	// check B
	for(var i =0; i < compartments.B.length; i++){
		b = compartments.B[i];
		if(b.label === ball){
			translate(compartments.B, compartments.A, i);
			return;
		}
	}

	// check A
	for(var i =0; i < compartments.A.length; i++){
		b = compartments.A[i];
		if(b.label === ball){
			translate(compartments.A, compartments.B, i);
			return;
		}
	}

	function translate(from, to, index){
		var b = from.splice(index, 1);
		to.push(b[0]);
	}
}

function init(){
	compartments.A = [];
	compartments.B = [];
}

function run(nbBalls){
	init();
	generateBalls(nbBalls);

	for(var n=0; n < 100; n++){
		moveBall(nbBalls);
	}

	if(compartments.A.length + compartments.B.length > 50){
		console.log('ERROR!!!!');
	}
	exec.results.push(compartments);
}

function interpret(nbBalls){
	// get mean distribution of balls in both compartments
	var dists = [];
	entropies = [];
	entropies192 = [];
	for(var r of exec.results){
		var a = r.A.length / nbBalls;
		var b = r.B.length / nbBalls;
		dists.push({
			A:a,
			B:b
		});

		entropies.push(stirling(nbBalls, r.A.length, 0));
		entropies192.push(stirling(nbBalls, r.A.length, 192));
	}

	var meanDistA = sum(dists, 'A') / dists.length;
	var meanDistB = sum(dists, 'B') / dists.length;
	console.log(`The mean distribution for the compartment A is ${meanDistA} and for B: ${meanDistB}`);

	function sum(array, prop){
		var s = 0;
		for(var el of array){
			s += el[prop];
		}
		return s;
	}

	// get mean entropy
	function stirling(d, i, cte){
		return -(i) * Math.log(i) - (d-i)* Math.log(d-i) + cte;
	}
	var me = entropies.reduce((a, b) => a+b) / entropies.length;
	var me192 = entropies192.reduce((a, b) => a+b) / entropies192.length;
	console.log(`The mean entropy is ${me}`);
	console.log(`The mean entropy is ${me192} for a constant of 192`);
}

console.time('Execution time');
(function(){
	console.log('Starting...');
	for(var i = 0 ; i < 1000; i++){
		run(50);
	}
	console.log('Interpreting results....');
	interpret(50);
})();
console.timeEnd('Execution time');