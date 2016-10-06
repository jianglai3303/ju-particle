define(function(require,exports,mudule){
	function Effect(){
		this.stop = false;
		this.once = false;
		this.allProcess = false;
	};
	Effect.prototype.exe = function(particles, i, canvas){
	};
	Effect.prototype.say = function(){
		console.log('I am a effect');
	};
	return Effect;
});