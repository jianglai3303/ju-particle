define(function(require,exports,mudule){
	var Vector2 = require('../Math/Vector2');
	var Vector3 = require('../Math/Vector3');


	Particle = function(life,size){
		this.curColor = this.start;
		this.life = life;
		this.size = size;
		this.age = 0;
		this.collision = false;

		this.color = 'rgba(250, 218, 68, 0)';
		this.enableColorAge = false;
		this.changeSize = false;
		this.viberate = 0;
		this.viberateEnable = false;
		this.gravity = new Vector2(0,0);

		this.airEnable = false;
		this.lockColor = false;

	};

	Particle.prototype.set2d = function(position,velocity){
		this.position = position;
		this.velocity = velocity;
	};

	Particle.prototype.set3d = function(pos3,velocity3){
		this.pos3 = pos3;
		this.velocity3 = velocity3;
	};

	Particle.prototype.setGravity= function(g){
		this.gravity = g;
	};

	Particle.prototype.setAirForce= function(airForce){
		this.airForce = airForce;
		this.airEnable = true;
	};

	Particle.prototype.calColor = function(r,g,b,a) {
		// Calculate the rgba string to draw.
		var draw = [];
		draw.push("rgba(" + ( r > 255 ? 255 : r < 0 ? 0 : ~~r ) );
		draw.push( g > 255 ? 255 : g < 0 ? 0 : ~~g );
		draw.push( b > 255 ? 255 : b < 0 ? 0 : ~~b );
		draw.push( (a > 1 ? 1 : a < 0 ? 0 : a.toFixed(2) + ")"));
		return draw.join( "," );
	};

	Particle.prototype.colorAge = function(startRGBA,finishRGBA){
		this.enableColorAge = true;
		var RANDM1TO1 = function(){ return Math.random() * 2 - 1; };
    	var startColourRandom = [ 62, 60, 60, 0 ];
    	var finishColourRandom = [ 60, 60, 60, 0 ];
    	this.start = [
			startRGBA[ 0 ] + startColourRandom[ 0 ] * RANDM1TO1(),
			startRGBA[ 1 ] + startColourRandom[ 1 ] * RANDM1TO1(),
			startRGBA[ 2 ] + startColourRandom[ 2 ] * RANDM1TO1(),
			startRGBA[ 3 ]
		];

		this.end = [
			finishRGBA[ 0 ] + finishColourRandom[ 0 ] * RANDM1TO1(),
			finishRGBA[ 1 ] + finishColourRandom[ 1 ] * RANDM1TO1(),
			finishRGBA[ 2 ] + finishColourRandom[ 2 ] * RANDM1TO1(),
			finishRGBA[ 3 ]
		];
	};

	Particle.prototype.setColor = function(color){
		if(!this.lockColor){
			this.enableColorAge = false;
			this.color = color;
		}
	};


	Particle.prototype.update = function() {
		if(this.position){
			if(this.airEnable){
				this.position = this.position.add(this.velocity.add(this.airForce));
			}else{
				this.position = this.position.add(this.velocity);
				this.velocity = this.velocity.add(this.gravity);
			}
		}

		if(this.pos3){
			if(this.airEnable){
				this.pos3 = this.pos3.add(this.velocity3.add(this.airForce));
			}else{
				this.pos3 = this.pos3.add(this.velocity3);
			}
		}

		if(this.age!=this.life){
			this.age ++;
		}
		if(this.collision){
			this.collisionDetect();
		}
		if(this.enableColorAge){
			this.color= this.calColor(this.start[0]+((this.end[0]-this.start[0])/(this.life)*this.age),
						this.start[1]+((this.end[1]-this.start[1])/(this.life)*this.age),
						this.start[2]+((this.end[2]-this.start[2])/(this.life)*this.age),
						this.start[3]+((this.end[3]-this.start[3])/(this.life)*this.age));
		}

		if(this.changeSize){
			this.size = ((this.life*this.age) - (this.age*this.age))*0.003;
		}
		if(this.viberateEnable){
			this.position.x = this.position.x+ this.viberate;
		}
	};

	Particle.prototype.setViberate = function(v) {
		this.viberateEnable = true;
		this.viberate = v;
	};

	Particle.prototype.enableCollision = function(x1,x2){
		this.x1 = x1;
		this.x2 = x2; 
		this.collision = true;
	};

	Particle.prototype.collisionDetect = function(){
		//Collision
		if(this.position.x-this.size < this.x1 ||this.position.x + this.size>this.x2){
			this.velocity.x = -this.velocity.x;
		}
	};
	return Particle;
	
});