define(function(require,exports,mudule){
	var Effect = require('./Effect');
	function Colorful(color){
		if(!color) return;
		this.color = color;
	};
	Colorful.prototype.__proto__ = Effect.prototype;
	Colorful.prototype.exe = function(particles , i , canvas){
		particles[i].setColor('rgba('+Math.floor(Math.random()*255)+','
								 +Math.floor(Math.random()*255)+','+
								 +Math.floor(Math.random()*255)+','+'1)');
		particles[i].lockColor = true;
	}
	return Colorful;
});