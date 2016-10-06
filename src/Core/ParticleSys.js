define(function(require,exports,mudule){
	var Particle = require('./Particle');
	var Vector = require('../Math/Vector2');
	var Emit2d = require('../Effect/Emit2d');
	var Emit3d = require('../Effect/Emit3d');

	ParticleSys = function(render) {
	    this._render = render;
	    this.particles = [];
	    this.effectArr = [];
	    this.allEffectArr = [];
	}

	ParticleSys.prototype.clearParticles = function (){
		this.particles = [];
	}

	ParticleSys.prototype.clearEffects = function (){
		this.effectArr = [];
	    this.allEffectArr = [];
	}

	ParticleSys.prototype.getEffectByClass =  function(name){
		for(var i = 0; i < this.allEffectArr.length; i++){
			if(this.allEffectArr[i] instanceof name)
				return this.allEffectArr[i];
		}
		for(var i = 0; i < this.effectArr.length; i++){
			if(this.effectArr[i] instanceof name)
				return this.effectArr[i];
		}
		return null;
	};

	ParticleSys.prototype.getEffects =  function(){
		var effects = [];
		for(var i = 0; i < this.allEffectArr.length; i++){
			effects.push(this.allEffectArr[i]);
		}
		for(var i = 0; i < this.effectArr.length; i++){
			effects.push(this.effectArr[i]);
		}
		return effects;
	};

	ParticleSys.prototype.cloneEffects = function (ps) {
		this.allEffectArr = ps.allEffectArr.slice();
		this.effectArr = ps.effectArr.slice();
		for(var i = 0; i < this.allEffectArr.length; i++){
	    	if(this.allEffectArr[i].stop)
	    		this.allEffectArr[i].stop = false;
	    }
	}

	ParticleSys.prototype.replaceEffect =  function(name, replace){
		for(var i = 0; i < this.allEffectArr.length; i++){
			if(this.allEffectArr[i] instanceof name)
				this.allEffectArr.splice(i, 1, replace);
		}
		for(var i = 0; i < this.effectArr.length; i++){
			if(this.effectArr[i] instanceof name)
				this.effectArr.splice(i, 1, replace);
		}
		return null;
	};
	
	ParticleSys.prototype.removeEffectByClass =  function(name){
		for(var i = 0; i < this.allEffectArr.length; i++){
			if(this.allEffectArr[i] instanceof name)
				this.allEffectArr.splice(i, 1);
		}
		for(var i = 0; i < this.effectArr.length; i++){
			if(this.effectArr[i] instanceof name)
				this.effectArr.splice(i, 1);
		}
	};
	
	ParticleSys.prototype.addEffect = function(effect) {
		if(effect.allProcess){
			this.allEffectArr.push(effect);
			return;
		}
		this.effectArr.push(effect);
	};

	ParticleSys.prototype.update = function() {
	    for (var i = 0; i < this.particles.length; i++) {
	        if (this.particles[i].age == this.particles[i].life) {
	            this.particles.splice(i, 1);
	        }
	    }
	    for(var i = 0; i < this.allEffectArr.length; i++){
	    	if(!this.allEffectArr[i].stop)
	    		this.allEffectArr[i].exe(this.particles, 0, this._render.canvas);
	    }
	    for(var i = 0; i < this.allEffectArr.length; i++){
	    	if(this.allEffectArr[i].once)
	    		this.allEffectArr[i].stop = true;
	    }
	    for (var i = 0; i < this.particles.length; i++) {
	    	for (var j = 0; j < this.effectArr.length; j++){
	    		this.effectArr[j].exe(this.particles, i, this._render.canvas);
	    	}
	        this.particles[i].update();
	    }
	};

	ParticleSys.prototype.render = function() {
	    this._render.render(this.particles);
	};

	ParticleSys.prototype.renderNotClear = function() {
	    this._render.renderNotClear(this.particles);
	};

	ParticleSys.prototype.clearCanvas = function() {
	    this._render.clearCanvas();
	};

	return ParticleSys;
});




