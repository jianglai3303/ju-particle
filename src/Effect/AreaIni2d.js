define(function(require, exports, mudule) {
    var Particle = require('../Core/Particle');
    var Effect = require('./Effect');
    var Vector2 = require('../Math/Vector2');

    function AreaIni2d(imageBase64, canvas) {
        if(!canvas) return;
        this.scale = 1;
        this.layer = true;
        this.allProcess = true;

        var  imageT = new Image();
        imageT.src = imageBase64;
        var newNode = document.createElement("canvas");
        newNode.setAttribute('id','tempCanvas');
        newNode.setAttribute('width','600');
        newNode.setAttribute('height','600');
        document.body.appendChild(newNode);
        var c = document.getElementById('tempCanvas');
        var ctx = c.getContext("2d");
        ctx.drawImage(imageT,0,0,canvas.width,canvas.height);
        var pixels = ctx.getImageData(0,0,canvas.width,canvas.height).data;
        var p = 0;
        document.body.removeChild(newNode);
        this.select = [];

        this.life = 100;
        this.speedx = 1;
        this.speedy = 2;
        this.minsize = 4;
        this.maxsize = 4;
        this.density = 1;
        
        while(p < pixels.length){
            if(Math.random()<1){
                var r = pixels[p];
                var g = pixels[p + 1];
                var b = pixels[p + 2];
                var a = pixels[p + 3];
                //For some transparent elements
                if(a!=0){
                    var index = p/4;
                    var x = index%canvas.width;
                    var y = (index-x)/canvas.width;
                    this.select.push([x,y]);
                }  
            }
            p = p +4;
        }
    };

    AreaIni2d.prototype.__proto__ = Effect.prototype;
    AreaIni2d.prototype.exe = function(particles, i, canvas) {
        for(var i =0 ; i < this.density; i++){
            var pic = Math.floor(Math.random()*this.select.length);
            var x = this.select[pic][0];
            var y = this.select[pic][1];
            var size = Math.floor(Math.random()*(this.maxsize-this.minsize)+this.minsize);
            var particle = new Particle(this.life, size);
            particle.set2d(new Vector2(x, y),new Vector2(this.speedx*(Math.random() * 2 - 1), this.speedy*(Math.random() * 2 - 1)));
            particles.push(particle);
        }   
    }
    return AreaIni2d;
});