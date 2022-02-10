let size = 75;
let fcnn;
let img;
let data_input = []
let nn_img;
let sliders = [];
let p_range;

function distsqrd(x1, x2, y1, y2){
	return (x2-x1)**2 + (y2-y1)**2;
}

function nn_img_update(){
	nn_img = fcnn.forward(data_input);
	img.loadPixels();
	for(var i=0; i<img.pixels.length; i+=4) {
		//var x = (~~(i/4)) % size;
		//var y = ~~((~~(i/4)) / size);
		img.pixels[i] = ~~(nn_img[~~(i/4)][0]*255);//*128+127);
		img.pixels[i+1] = ~~(nn_img[~~(i/4)][1]*255);//*128+127);
		img.pixels[i+2] = ~~(nn_img[~~(i/4)][2]*255);//*128+127);
		img.pixels[i+3] = 255;
	}
	img.updatePixels();
	image(img, 0, 0);
}

function setup(){
	createCanvas(300, 300);
	background(0);
	p_range = 1.25;
	var slid = new Slider(-1, 1, 0,0);

	for (var j = 0; j < 3; j++) {
		for (var i = 0; i < 5; i++) {
			sliders.push(new Slider(-p_range, p_range, ((slid.width+3)*j), size+(i*(3+slid.height))));
		}
	}

	img = createImage(size, size);
	fcnn = new Neural_network([2,5,50, 50, 50,3], p_range+0.3)
	console.log(fcnn.weights[0]);

	for (var i = 0; i < 5; i++) {
		sliders[i].m_val = fcnn.biases[0][i];
		sliders[i].val = map(sliders[i].m_val, sliders[i].min, sliders[i].max, 0, sliders[i].width);	
	}
	var temp = 5;
	for (var j = 0; j < 2; j++){
		for (var i = 0; i < 5; i++) {
			sliders[temp].m_val = fcnn.weights[0][j][i];
			sliders[temp].val = map(sliders[temp].m_val, sliders[temp].min, sliders[temp].max, 0, sliders[temp].width);
			temp++;
		}
	}

	for (var x=0;x<size;x++){
		for (var y=0;y<size;y++){
			data_input.push([(2*(x/size)-1)*2, (2*(y/size)-1)*2])
		}
	}
	nn_img_update();
	for (var i = sliders.length - 1; i >= 0; i--) {
		image(sliders[i].gp, sliders[i].x, sliders[i].y);
	}
}

function draw(){
	for (var i = sliders.length - 1; i >= 0; i--) {
		image(sliders[i].gp, sliders[i].x, sliders[i].y);
	}
	if (mouseIsPressed){
		var k = 5
		for (var i = 0; i < 5; i++) {
			sliders[i].update();
		 	fcnn.biases[0][i] = sliders[i].m_val;	
		}
		for (var i = 0; i < 2; i++) {
			for (var j = 0; j < 5; j++){
				sliders[k].update();
				fcnn.weights[0][i][j] = sliders[k].m_val;
				k++;
			}	
		}
		nn_img_update();
	}
}
