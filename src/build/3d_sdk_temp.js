define('Effect',function(require,exports,mudule){
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
define('Emit2d',['Particle','Effect','Vector2'],function(require,exports,mudule){
	var Particle = require('Particle');
	var Effect = require('Effect');
	var Vector2 = require('Vector2');
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
define('Vector2',function(require, exports, mudule) {

    Vector2 = function(x, y) {
        this.x = x;
        this.y = y;
    }

    Vector2.prototype.copy = function() {
        return new Vector2(this.x, this.y);
    };
    Vector2.prototype.add = function(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    Vector2.prototype.subtract = function(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }
    Vector2.prototype.multiply = function(v) {
        return new Vector2(this.x * v.x, this.y * v.y);
    }
    Vector2.prototype.dot = function(v) {
        return this.x * v.x + this.y * v.y;
    }
    Vector2.prototype.dist = function(v) {
        return (this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y);
    }
    Vector2.prototype.norm = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    Vector2.prototype.unit = function() {
        return new Vector2(this.x/this.norm(),this.y/this.norm());
    }


    Vector2.zero = new Vector2(0, 0);

    return Vector2;
});
define('Particle',['Vector2','Vector3'],function(require,exports,mudule){
	var Vector2 = require('Vector2');
	var Vector3 = require('Vector3');


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
define('AirForce',['Effect','Vector3','Vector2'],function(require,exports,mudule){
	var Effect = require('Effect');
	var Vector3 = require('Vector3');
	var Vector2 = require('Vector2');
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
define('AreaIni3d',['Particle','Effect','Vector3'],function(require, exports, mudule) {
    var Particle = require('Particle');
    var Effect = require('Effect');
    var Vector3 = require('Vector3');
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
define('Viberate',['Particle','Effect','Vector2'],function(require, exports, mudule) {
    var Particle = require('Particle');
    var Effect = require('Effect');
    var Vector2 = require('Vector2');
    function Viberate(v) {
        if(!v) return;
        this.v = v;
    };
    Viberate.prototype.__proto__ = Effect.prototype;
    Viberate.prototype.exe = function(particles, i, canvas) {
        if(Math.random()<0.1){
            particles[i].pos3.x += Math.random()*1-0.5;
            particles[i].pos3.y += Math.random()*1-0.5;
            particles[i].pos3.z += Math.random()*1-0.5;
        }
        
    }
    return Viberate;
});
define('SizeDes',['Effect'],function(require,exports,mudule){
	var Effect = require('Effect');
	function SizeDes(){
	};
	SizeDes.prototype.__proto__ = Effect.prototype;
	SizeDes.prototype.exe = function(particles , i , canvas){
		var size = (1 - (particles[i].age / particles[i].life)) * 20;
        particles[i].size = size;
	}
	return SizeDes;
});
define('ScatterIni3d',['Particle','Effect','Vector3'],function(require, exports, mudule) {
    var Particle = require('Particle');
    var Effect = require('Effect');
    var Vector3 = require('Vector3');
    function ScatterIni3d() {
        this.once = true;
        this.scale = 1;
        this.layer = false;
        this.allProcess = true;
    };
    ScatterIni3d.prototype.__proto__ = Effect.prototype;
    ScatterIni3d.prototype.exe = function(particles, i, canvas) {
        for (var i = 0; i < 400; i++) {
            var particle = new Particle(Number.POSITIVE_INFINITY, 4);
            particle.setColor("rgba(0,0,255,1)");
            if (this.layer) {
                var pos = new Vector3(this.scale * (Math.random() * 0.1 - 0.05) * canvas.width, this.scale * (Math.random() * 0.1 - 0.05) * canvas.height, -50);
            } else {
                var pos = new Vector3(this.scale * (Math.random() * 0.1 - 0.05) * canvas.width, this.scale * (Math.random() * 0.1 - 0.05) * canvas.height, this.scale * Math.random() * -10);
            }

            var velocity = new Vector3(0, 0, 0);
            particle.set3d(pos, velocity);
            particles.push(particle);
        }
    }
    return ScatterIni3d;
});
define('Colorful',['Effect'],function(require,exports,mudule){
	var Effect = require('Effect');
	function Colorful(color){
		if(!color) return;
		this.color = color;
	};
	Colorful.prototype.__proto__ = Effect.prototype;
	Colorful.prototype.exe = function(particles , i , canvas){
		particles[i].setColor('rgba('+Math.floor(Math.random()*255)+','
								 +Math.floor(Math.random()*255)+','+
								 +Math.floor(Math.random()*255)+','+'1)');
		particles[i].lockColor = true;
	}
	return Colorful;
});
define('Vector3',function(require,exports,module){

	Vector3 = function(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
	};

	Vector3.prototype.copy = function() {
		return new Vector3(this.x,this.y,this.z);
	};

	Vector3.prototype.length = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	};

	Vector3.prototype.sqrLength = function() { 
		return this.x * this.x + this.y * this.y + this.z * this.z; 
	};

	Vector3.prototype.add = function(v) {
		return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
	};

	Vector3.prototype.dist = function(v){
		return Math.sqrt((this.x-v.x)*(this.x-v.x) + (this.y-v.y)*(this.y-v.y) + (this.z-v.z)*(this.z-v.z)); 
	};

	Vector3.prototype.subtract = function(v) {
		return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z); 
	};

	Vector3.prototype.multiply = function(f) { 
		return new Vector3(this.x * f, this.y * f, this.z * f); 
	};

	Vector3.prototype.dot = function(v) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	};

	Vector3.prototype.normalize = function() {
		var inv = 1/this.length(); 
		return new Vector3(this.x * inv, this.y * inv, this.z * inv);
	};
	Vector3.prototype.cross = function(v) { 
		return new Vector3(-this.z * v.y + this.y * v.z, this.z * v.x - this.x * v.z, -this.y * v.x + this.x * v.y); 
	}

	return Vector3;
});
define('PureColor',['Effect'],function(require,exports,mudule){
	var Effect = require('Effect');
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
define('Emit3d',['Effect','Particle','Vector3'],function(require,exports,mudule){
	var Effect = require('Effect');
	var Particle = require('Particle');
	var Vector3 = require('Vector3');
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
define('AgeColor',['Effect'],function(require,exports,mudule){
	var Effect = require('Effect');
	function AgeColor(startrgba, endrgba){
		if(!startrgba) return;
		this.startrgba = startrgba;
		this.endrgba = endrgba;
	};
	AgeColor.prototype.__proto__ = Effect.prototype;
	AgeColor.prototype.exe = function(particles , i , canvas){
		particles[i].lockColor = false;
        particles[i].colorAge(this.startrgba, this.endrgba);
	}
	return AgeColor;
});
define('AgeBlur',['Effect'],function(require,exports,mudule){
	var Effect = require('Effect');
	function AgeBlur(){
	};
	AgeBlur.prototype.__proto__ = Effect.prototype;
	AgeBlur.prototype.exe = function(particles , i , canvas){
		var colors = calRGBA(particles[i].color);
		var alpha = 1 - (particles[i].age / particles[i].life);
        particles[i].color = calColor(colors[0], colors[1], colors[2], alpha);
	}
	//rgba to color string
	var calColor = function(r, g, b, a) {
	    var draw = [];
	    draw.push("rgba(" + Math.floor(r));
	    draw.push(Math.floor(g));
	    draw.push(Math.floor(b));
	    draw.push(a + ")");
	    return draw.join(",");
	};

	//color string to rgba
	var calRGBA = function(color) {
	    return (color.substring(color.indexOf('(') + 1, color.indexOf(')'))).split(',');
	};
	return AgeBlur;
});
define('WebglRender',function(require,exports,module){
  function _appendShader(){
      var fs = document.createElement('script');
      fs.setAttribute('id', 'shader-fs');
      fs.setAttribute('type', 'x-shader/x-fragment');
      fs.text = "precision highp float; varying highp vec2 vTextureCoord; uniform sampler2D uSampler; uniform vec4 color; void main(void) {vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)); gl_FragColor = textureColor * color; }";
      document.documentElement.childNodes[0].appendChild(fs);
      var vs = document.createElement('script');
      vs.setAttribute('id', 'shader-vs');
      vs.setAttribute('type', 'x-shader/x-vertex');
      vs.text = "precision highp float; attribute vec3 aVertexPosition; attribute vec2 aTextureCoord; uniform mat4 uMVMatrix; uniform mat4 uPMatrix; varying highp vec2 vTextureCoord; void main(void) { gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); vTextureCoord = aTextureCoord;}";
      document.documentElement.childNodes[0].appendChild(vs);
  }

  function _makePerspective(fovy, aspect, znear, zfar) {
      var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
      var ymin = -ymax;
      var xmin = ymin * aspect;
      var xmax = ymax * aspect;
      return _makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);

  }

  function _makeFrustum(left, right, bottom, top, znear, zfar) {
      var X = 2 * znear / (right - left);
      var Y = 2 * znear / (top - bottom);
      var A = (right + left) / (right - left);
      var B = (top + bottom) / (top - bottom);
      var C = -(zfar + znear) / (zfar - znear);
      var D = -2 * zfar * znear / (zfar - znear);
      return [X, 0, 0, 0, 0, Y, 0, 0, A, B, C, -1, 0, 0, D, 0];
  }

  //rgba to color string
  var calColor = function(colors) {
      var draw = [];
      draw.push(colors[0]/255);
      draw.push(colors[1]/255);
      draw.push(colors[2]/255);
      draw.push(colors[3]);
      return draw;
  };

  //color string to rgba
  var calRGBA = function(color) {
      return (color.substring(color.indexOf('(') + 1, color.indexOf(')'))).split(',');
  };

  function _getShader(gl, id) {
      var shaderScript = document.getElementById(id);
      if (!shaderScript) {
          return null;
      }
      var theSource = "";
      var currentChild = shaderScript.firstChild;

      while (currentChild) {
          if (currentChild.nodeType == 3) {
              theSource += currentChild.textContent;
          }

          currentChild = currentChild.nextSibling;
      }
      var shader;
      if (shaderScript.type == "x-shader/x-fragment") {
          shader = gl.createShader(gl.FRAGMENT_SHADER);
      } else if (shaderScript.type == "x-shader/x-vertex") {
          shader = gl.createShader(gl.VERTEX_SHADER);
      } else {
          return null;
      }
      gl.shaderSource(shader, theSource);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
          return null;
      }
      return shader;
  }

  WebglRender = function(canvas) {
    this.distance = 0;
    this.canvas = canvas;
    this.start();
    this.mvMatrixStack = [];
  }
  WebglRender.prototype.setNewDis= function(dis){
    this.distance = dis;
  }

 WebglRender.prototype._initBuffers= function() {
      var gl = this.gl;
      this.squareVerticesBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
      var vertices = [
          1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
          1.0, -1.0, 0.0, -1.0, -1.0, 0.0
      ];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
      this.textureCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
      var textureCoordinates = [
          0.0, 0.0,
          0.0, 1.0,
          1.0, 0.0,
          1.0, 1.0,
      ];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
  }

 WebglRender.prototype._initTextures =  function() {
      var self = this;
      this.texture = this.gl.createTexture();
      tImage = new Image();
      tImage.onload = function() {
          self._handleTextureLoaded(tImage, self.texture);
      }
      tImage.src = "data:image/png;base64,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";
  }

 WebglRender.prototype._handleTextureLoaded=  function(image, texture) {
      var gl = this.gl;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindTexture(gl.TEXTURE_2D, null);
  }

   WebglRender.prototype._initShaders= function() {
      var gl = this.gl;
      var fragmentShader = _getShader(gl, "shader-fs");
      var vertexShader = _getShader(gl, "shader-vs");
      this.shaderProgram = gl.createProgram();
      gl.attachShader(this.shaderProgram, vertexShader);
      gl.attachShader(this.shaderProgram, fragmentShader);
      gl.linkProgram(this.shaderProgram);
      if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
          alert("Unable to initialize the shader program.");
      }
      gl.useProgram(this.shaderProgram);
      this.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
      gl.enableVertexAttribArray(this.vertexPositionAttribute);
      this.textureCoordAttribute = gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
      gl.enableVertexAttribArray(this.textureCoordAttribute);
  }


  WebglRender.prototype._setMatrixUniforms =function() {
      var gl = this.gl;
      var pUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
      gl.uniformMatrix4fv(pUniform, false, this.perspectiveMatrix);
      var mvUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
      gl.uniformMatrix4fv(mvUniform, false, this.mvMatrix);
  }

  WebglRender.prototype._mvPushMatrix= function(m) {
      if (m) {
          this.mvMatrixStack.push(mat4.create(m));
          this.mvMatrix = mat4.create(m);
      } else {
          this.mvMatrixStack.push(mat4.create(this.mvMatrix));
      }
  }

  WebglRender.prototype._mvPopMatrix= function() {
      if (!this.mvMatrixStack.length) {
          throw ("Can't pop from an empty matrix stack.");
      }
      this.mvMatrix = this.mvMatrixStack.pop();
      return this.mvMatrix;
  }

 

  WebglRender.prototype.initWebGL = function(){
      this.gl = null;
      try {
          this.gl = this.canvas.getContext("experimental-webgl",{preserveDrawingBuffer: true});
      } catch (e) {}
      if (!this.gl) {
          alert("Unable to initialize WebGL. Your browser may not support it.");
      }
  } 

  WebglRender.prototype.start =  function() {
      _appendShader();
      this.initWebGL(this.canvas);
      if (this.gl) {
          this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
          this.gl.clearDepth(1.0);
          this.gl.disable(this.gl.DEPTH_TEST);
          this.gl.depthFunc(this.gl.LEQUAL);

          this._initShaders();
          this._initBuffers();
          this._initTextures();

          this.gl.blendEquation(this.gl.FUNC_ADD);
          this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
          this.gl.enable(this.gl.BLEND);
      }
  }


  WebglRender.prototype.draw = function(particles){
        var gl = this.gl;
        this.perspectiveMatrix = _makePerspective(45, 640.0 / 480.0, 0.1, 100.0);
        this.mvMatrix = mat4.identity(mat4.create());
        gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
        gl.vertexAttribPointer(this.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
        gl.vertexAttribPointer(this.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(gl.getUniformLocation(this.shaderProgram, "uSampler"), 0);
        for (var i = 0; i < particles.length; i++) {
            this._mvPushMatrix();
            mat4.translate(this.mvMatrix,[particles[i].pos3.x,particles[i].pos3.y,particles[i].pos3.z+ this.distance], this.mvMatrix);
            var s = particles[i].size/10;
            mat4.scale(this.mvMatrix, [s, s, s], this.mvMatrix);
            //mat4.rotateZ(mvMatrix, angle * Math.PI / 180);
            var colors = calRGBA(particles[i].color);
            this._setMatrixUniforms();
            gl.uniform4fv(gl.getUniformLocation(this.shaderProgram, "color"), new Float32Array(calColor(colors)));
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            this._mvPopMatrix();
        }
  }

  WebglRender.prototype.renderNotClear  = function(particles) {
      this.draw(particles);
  }

  WebglRender.prototype.clearCanvas =  function() {
      var gl = this.gl;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  WebglRender.prototype.render  = function(particles) {
      this.clearCanvas();
      this.draw(particles);
  }
  return WebglRender;
});

define('CanvasRender',function(require,exports,mudule){
    CanvasRender = function(canvas, mode) {
        this.canvas = canvas;
        this.mode = mode;
    };

    //rgba to color string
    var calColor = function(r, g, b, a) {
        var draw = [];
        draw.push("rgba(" + Math.floor(r));
        draw.push(Math.floor(g));
        draw.push(Math.floor(b));
        draw.push(a + ")");
        return draw.join(",");
    };

    //color string to rgba
    var calRGBA = function(color) {
        return (color.substring(color.indexOf('(') + 1, color.indexOf(')'))).split(',');
    };

    CanvasRender.prototype.clearCanvas = function() {
        var ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    CanvasRender.prototype.renderNotClear  = function(particles) {
        this.draw(particles);
    };
    CanvasRender.prototype.draw  = function(particles) {
        var ctx = this.canvas.getContext('2d');
        if (this.mode == 'solid') {
            for (var i = 0; i < particles.length; i++) {
                ctx.fillStyle = particles[i].color;
                ctx.beginPath();
                ctx.arc(particles[i].position.x, particles[i].position.y, particles[i].size, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
            }
        } else if (this.mode == 'blur') {
            for (var i = 0; i < particles.length; i++) {
                var gradient = ctx.createRadialGradient(particles[i].position.x, 
                                                        particles[i].position.y, 
                                                        particles[i].size / 5, 
                                                        particles[i].position.x, 
                                                        particles[i].position.y, 
                                                        particles[i].size);
                gradient.addColorStop(0, particles[i].color);
                var colors = calRGBA(particles[i].color);
                var finalCol = calColor(colors[0], colors[1], colors[2], 0);
                gradient.addColorStop(1, finalCol);
                ctx.fillStyle = gradient;
                ctx.fillRect(particles[i].position.x - particles[i].size, 
                             particles[i].position.y - particles[i].size, 
                             2 * particles[i].size, 
                             2 * particles[i].size);
            }
        }
    };
    CanvasRender.prototype.render = function(particles) {
        this.clearCanvas();
        this.draw(particles);
    };
    return CanvasRender;
});
define('ParticleSys',['Particle','Vector2','Emit2d','Emit3d'],function(require,exports,mudule){
	var Particle = require('Particle');
	var Vector = require('Vector2');
	var Emit2d = require('Emit2d');
	var Emit3d = require('Emit3d');

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





function getArgs(func) {
  // 先用正则匹配,取得符合参数模式的字符串.
  // 第一个分组是这个:  ([^)]*) 非右括号的任意字符
  var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];

  // 用逗号来分隔参数(arguments string).
  return args.split(",").map(function(arg) {
    // 去除注释(inline comments)以及空格
    return arg.replace(/\/\*.*\*\//, "").trim();
  }).filter(function(arg) {
    // 确保没有 undefined.
    return arg;
  });
}
seajs.use(['ParticleSys', 'CanvasRender', 'WebglRender', 'AgeBlur', 'AgeColor', 'Emit3d', 'PureColor', 'Vector3', 'Colorful', 'ScatterIni3d', 'SizeDes', 'Viberate','AreaIni3d','AirForce'], function(ParticleSys, CanvasRender, WebglRender, AgeBlur, AgeColor , Emit3d, PureColor, Vector3, Colorful, ScatterIni3d, SizeDes, Viberate, AreaIni3d, AirForce) {
    console.log('3d sdk load ok....');
    var argsNow = getArgs(arguments.callee);
    for(var i=0;i<argsNow.length;i++){
    	eval('this.'+argsNow[i]+'='+argsNow[i]);
    }
    var self = this;
    $(document).ready(function(){
      codeInner.bind(self)();
    }) 
});
