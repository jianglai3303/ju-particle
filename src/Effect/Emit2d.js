define(function(require,exports,mudule){
	var Particle = require('../Core/Particle');
	var Effect = require('./Effect');
	var Vector2 = require('../Math/Vector2');
	function Emit2d(emitPos, speed){
		if(!emitPos) return;
		this.allProcess = true;
		this.emitPos = emitPos;
		this.speed = speed;
		this.minsize = 4;
		this.maxsize = 4;
		this.density = 1;
		this.life = 100;
	};
	Emit2d.prototype.__proto__ = Effect.prototype;
	Emit2d.prototype.exe = function(particles, i, canvas){
		for (var i = this.density; i > 0; i--) {
			var size = Math.floor(Math.random()*(this.maxsize-this.minsize)+this.minsize);
		    var particle = new Particle(this.life, size);
		    var velocity = new Vector2(Math.random() * 4 - 2, Math.random() * 4 - 2);
			velocity.x = velocity.x * this.speed.x;
		   	velocity.y = velocity.y * this.speed.y;
		    particle.set2d(new Vector2(this.emitPos.x, this.emitPos.y), velocity);
		    particle.setColor("rgba(0,0,255,1)");
		    particles.push(particle);
		};
	}
	return Emit2d;
});