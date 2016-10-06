define(function(require, exports, mudule) {
    var Particle = require('../Core/Particle');
    var Effect = require('./Effect');
    var Vector3 = require('../Math/Vector3');
    function AreaIni3d(selPos, speed, life, density) {
        this.allProcess = true;
        this.selPos = selPos;
        this.speed = speed;
        this.life = life;
        this.density = density;
        this.translate = [0,0,0];
    };
    AreaIni3d.prototype.__proto__ = Effect.prototype;
    AreaIni3d.prototype.exe = function(particles, i, canvas) {
        var verticles = this.selPos;
        var perEmitNum = verticles.length*this.density/10;
        for(var i =0 ; i < Math.min(perEmitNum,300); i++){
            var index = Math.floor(Math.random()*verticles.length);
            var particle = new Particle(this.life, 1);
            particle.setColor("rgba(0,0,255,1)");
            var pos = new Vector3(verticles[index].x/10+this.translate[0],
                                verticles[index].y/10+this.translate[1],
                                verticles[index].z/10+this.translate[2]);
            var speedX = Math.random()*this.speed[0]/1000-Math.random()*this.speed[0]/2000;
            var speedY = Math.random()*this.speed[1]/1000-Math.random()*this.speed[1]/2000;
            var speedZ = Math.random()*this.speed[2]/1000-Math.random()*this.speed[2]/2000;
            var velocity = new Vector3(speedX,speedY,speedZ);
            particle.set3d(pos, velocity);
            particles.push(particle);
        }   
    }
    return AreaIni3d;
});