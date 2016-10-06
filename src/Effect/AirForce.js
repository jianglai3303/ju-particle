define(function(require,exports,mudule){
	var Effect = require('./Effect');
	var Vector3 = require('../Math/Vector3');
	var Vector2 = require('../Math/Vector2');
	function AirForce(canvas){
		if(!canvas) return;
		this.octaveCount = 7;
		this.persistence = 0;
		this.noise = generatePerlinNoise(120,120,{octaveCount:this.octaveCount,persistence:this.persistence});
		this.noise2d = generatePerlinNoise(canvas.width,canvas.height,{octaveCount:this.octaveCount,persistence:this.persistence});
		this.xforce = 4;
		this.yforce = 4;
	};
	AirForce.prototype.__proto__ = Effect.prototype;

	AirForce.prototype.setParams= function(octaveCount, persistence,canvas){
		this.octaveCount = octaveCount;
		this.persistence = persistence;
		this.noise = generatePerlinNoise(120,120,{octaveCount:octaveCount,persistence:persistence});
		this.noise2d = generatePerlinNoise(canvas.width,canvas.height,{octaveCount:octaveCount,persistence:persistence});
	}
	
	AirForce.prototype.exe = function(particles , i , canvas){
		if (particles[i].pos3) {
			var x = Math.floor((particles[i].pos3.x+6)*10);
			(x < 0 && (x = 0))||(x > 119 && (x = 119));
			var y = Math.floor((particles[i].pos3.y+6)*10);
			(y < 0 && (y = 0))||(y > 119 && (y = 119));
			particles[i].setAirForce(new Vector3(0.1*this.noise[y*120+x],0.1*this.noise[y*120+x],0));
		};
		if(particles[i].position){
			var x = Math.floor(particles[i].position.x);
			(x < 0 && (x = 0))||(x > canvas.width-1 && (x = canvas.width-1));
			var y = Math.floor(particles[i].position.y);
			(y < 0 && (y = 0))||(y > canvas.height-1 && (y =canvas.height-1));
			particles[i].setAirForce(new Vector2(this.xforce*this.noise2d[y*canvas.width+x],this.yforce*this.noise2d[y*canvas.width+x]));
		}
	}
	return AirForce;
});