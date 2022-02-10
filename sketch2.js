function Slider(min, max, x, y){
	this.min = min;
	this.max = max;
	this.x = x;
	this.y = y;
	this.width = 50;
	this.height = 5;
	this.gp = createGraphics(this.width,this.height);
	this.gp.background(80);
	this.gp.noStroke();
	this.val = 0;
	this.m_val = map(this.val, 0, this.width, this.min, this.max);

	this.rounding = function(num, dec){
		var ph = Math.pow(10, dec)
		return Math.round((this.m_val+Number.EPSILON)*ph)/ph;
	}

	this.is_inbound = function(){
		return ((mouseX >= this.x) && (mouseX <= this.x + this.gp.width) &&
				(mouseY >= this.y) && (mouseY <= this.y + this.gp.height));
	}

	this.update = function(){
		this.gp.background(80);
		if (this.is_inbound()){
			this.val = mouseX-this.x;
			this.m_val = map(this.val, 0, this.width, this.min, this.max);
		}
		this.gp.fill(255, 0, 0);
		this.gp.rect(0,0,this.val,this.gp.height);
		this.gp.fill(255);
		this.gp.textSize(4)
		this.gp.text(this.rounding(this.m_val, 2).toString(), this.gp.width/2, this.gp.height);
	}
}
