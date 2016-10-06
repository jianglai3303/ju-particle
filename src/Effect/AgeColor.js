define(function(require,exports,mudule){
	var Effect = require('./Effect');
	function AgeColor(startrgba, endrgba){
		if(!startrgba) return;
		this.startrgba = startrgba;
		this.endrgba = endrgba;
	};
	AgeColor.prototype.__proto__ = Effect.prototype;
	AgeColor.prototype.exe = function(particles , i , canvas){
		particles[i].lockColor = false;
        particles[i].colorAge(this.startrgba, this.endrgba);
	}
	return AgeColor;
});