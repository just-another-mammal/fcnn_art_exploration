function Neural_network(nodes, p_range){
	this.nodes = nodes;
	this.LR = 0.001;
	this.p_range = p_range;

	this.weight_init = function(){
		let result = [];
		for (var i = 0; i < this.nodes.length-1; i++){
			result.push([]);
			for (var j = 0; j < this.nodes[i]; j++){
				result[i].push([]);
				for (var k = 0; k < this.nodes[i+1]; k++){
					result[i][j].push(random(-this.p_range,this.p_range));
				}
			}
		}
		return result;
	}

	this.bias_init = function(){
		let result = [];
		for (var i = 0; i < this.nodes.length-1; i++){
			result.push([]);
			for (var j = 0; j < this.nodes[i+1]; j++){
				result[i].push(0); //(-this.p_range,this.p_range)
			}
		}
		return result;
	}

	this.weights = this.weight_init();
	this.biases = this.bias_init();

	this.getDim = function(x){
	    let dim = [];
	    for (;;) {
	        dim.push(x.length);

	        if (Array.isArray(x[0])) {
	            x = x[0];
	        } else {
	            break;
	        }
	    }
	    return dim;
	}

	this.ReLU = function(x){
		let result = [];
		for (var i = 0; i < x.length; i++){
			result.push([]);
			for (var j = 0; j < x[i].length; j++){
				result[i].push(+(x[i][j] > 0)*x[i][j]);
			}
		}
		return result;
	}

	this.gaussian = function(x){
		let result = [];
		for (var i = 0; i < x.length; i++){
			result.push([]);
			for (var j = 0; j < x[i].length; j++){
				result[i].push(Math.pow(2, -(Math.pow(x[i][j], 2))));
			}
		}
		return result;
	}

	this.tanh = function(x){
		let result = [];
		for (var i = 0; i < x.length; i++){
			result.push([]);
			for (var j = 0; j < x[i].length; j++){
				result[i].push(Math.tanh(x[i][j]));
			}
		}
		return result;
	}

	this.derivative = function(x){
		for (var i = 0; i < x.length; i++){
			for (var j = 0; j < x[i].length; j++){
				x[i][j] = 1-Math.pow(x[i][j], 2)
			}
		}
		return x;
	}

	this.dot = function(matrix_a, matrix_b){
		if (matrix_a[0].length != matrix_b.length){
			throw "the dimensions don't match";
		}
		result = [];
		for (var row = 0; row < matrix_a.length; row++){
			result.push([]);
			for (var col = 0; col < matrix_b[0].length; col++){
				result[row][col] = 0;
				for (var elem = 0; elem < matrix_b.length; elem++){
					result[row][col] += matrix_a[row][elem]*matrix_b[elem][col]
				}
			}
		}
		return result;
	}

	this.transpose = function(x){
		let result = [];

		for (var i = 0; i < x[0].length; i++){
			result[i] = [];
			for (var j = 0; j < x.length; j++){
				result[i][j] = x[j][i];
			}
		}

		return result;
	}

	this.operation = function(matrix_a, matrix_b, oper){
		let result = [];
		let expression = "matrix_a[i][j] " + oper + " matrix_b";
		if (Array.isArray(matrix_b)){
			expression += "[i][j]";
		}
		for (var i = 0; i < matrix_a.length; i++){
			result[i] = [];
			for (var j = 0; j < matrix_a[0].length; j++){
				result[i][j] = eval(expression);
			}
		}
		return result;
	}

	this.axis0_sum = function(x){
		let result = [];

		for (var i = 0; i < x[0].length; i++){
			result[i] = 0;
			for (var j = 0; j < x.length; j++){
				result[i] += x[j][i];
			}
		}

		return result;

	}

	this.add_bias = function(x, index){
		result = [];
		for (var j = 0, m = x.length; j < m; j++){
			result.push([]);
			for (var i = 0, n = x[0].length; i < n; i++){
				result[j].push(x[j][i] + this.biases[index][i])
			}
		}
		
		return result;
	}

	this.forward = function(input, backprop=false){
		if (this.getDim(input).length == 1){
			input = [input];
		}
		var data = [input];
		for (var i = 0; i < this.weights.length; i++){
			data.push(this.gaussian(this.add_bias(this.dot(data[i], this.weights[i]), i)));
		}
		if (backprop){
			return data;
		} else{
			return data[data.length-1];
		}
	}

	this.backpropagation = function(input, labels){
		if (this.getDim(input).length == 1){
			input = [input];
			labels = [labels];
		}
		var data = this.forward(input, backprop=true);
		var delta = [];
		var curr_delta;
		var prime;
		var DcostDw = [];
		var DcostDb = [];

		for (var layer = this.weights.length-1; layer >= 0; layer--){
			prime = this.derivative(data[layer+1]);
			if (layer == this.weights.length-1){
				delta.unshift(this.operation(labels, data[data.length-1], "-"));
				delta[0] = this.operation(delta[0], delta[0].length, "/");
				delta[0] = this.operation(delta[0], prime, "*");
			}
			else{
				delta.unshift(this.dot(delta[layer], this.transpose(this.weights[layer+1])));
				delta[0] = this.operation(delta[0], prime, "*");
			}

			DcostDw.unshift(this.dot(this.transpose(data[layer]), delta[0]));
			DcostDb.unshift(this.axis0_sum(delta[0]));
		}

		for (var layer = 0; layer < this.weights.length; layer++){
			this.weights[layer] = this.operation(this.weights[layer], this.operation(DcostDw[layer], this.LR, "*"), "+");
		}

		this.biases = this.operation(this.biases, DcostDb, "+");

	}

}

/*
function setup(){
	NN = new Neural_network([2, 6, 1]);
	//var data_input = [[Math.cos(0.2), Math.sin(0.2)], [Math.cos(0.4), Math.sin(0.4)]];
	//var data_labels = [[Math.cos(0.2) + Math.sin(0.2)], [Math.cos(0.4) + Math.sin(0.4)]];
	
	for (var i = 0; i < 100; i++){
		NN.backpropagation(data_input, data_labels);
	}
	
	
	//console.log(NN.forward([Math.cos(0.2), Math.sin(0.2)]));
}
*/
