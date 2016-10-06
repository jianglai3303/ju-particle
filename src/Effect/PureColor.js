define(function(require,exports,mudule){
	var Effect = require('./Effect');
	function PureColor(color){
		if(!color) return;
		this.color = color;
	};
	PureColor.prototype.__proto__ = Effect.prototype;
	PureColor.prototype.exe = function(particles , i , canvas){
		particles[i].lockColor = false;
        particles[i].color = this.color;
	}
	return PureColor;
});