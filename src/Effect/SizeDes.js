define(function(require,exports,mudule){
	var Effect = require('./Effect');
	function SizeDes(){
	};
	SizeDes.prototype.__proto__ = Effect.prototype;
	SizeDes.prototype.exe = function(particles , i , canvas){
		var size = (1 - (particles[i].age / particles[i].life)) * 20;
        particles[i].size = size;
	}
	return SizeDes;
});