define(function(require,exports,mudule){
	var Effect = require('./Effect');
	var Particle = require('../Core/Particle');
	var Vector3 = require('../Math/Vector3');
	function Emit3d(emitPos, speed , life){
		if(!emitPos) return;
		this.emitPos = emitPos;
		this.speed = speed;
		this.life = life;
		this.allProcess = true;
	};
	Emit3d.prototype.__proto__ = Effect.prototype;
	Emit3d.prototype.exe = function(particles, i , canvas){
	    var particle = new Particle(this.life, 20);
	   	particle.setColor("rgba(0,0,255,1)");
	   	var pos = new Vector3(this.emitPos.x, this.emitPos.y, this.emitPos.z);
	   	var velocity = new Vector3(Math.random() * 0.1 - 0.05, Math.random() * 0.1 - 0.05, Math.random() * 0.1 - 0.05);
	   	velocity.x = velocity.x * this.speed.x;
	   	velocity.y = velocity.y * this.speed.y;
	   	velocity.z = velocity.z * this.speed.z;
	   	particle.set3d(pos, velocity);
	    particles.push(particle);
	}
	return Emit3d;
});