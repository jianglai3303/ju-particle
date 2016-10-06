function codeInner(){
    /**
    Overall data
    **/
    var canvas = $('#testCanvas')[0];
    canvas.width = 600;
    canvas.height = 600;
    var glRender = new WebglRender(canvas);
    glRender.setNewDis(parseInt($('#distance').val()));
    var frameNum = 3000;
    var playing = false;
    changedParam = true;
    var ps = new ParticleSys(glRender);;
    var layers = [];
    
    var rgbaStr = 'rgba(0,255,255,1)';
    var startrgba = [0,255,255,1];
    var endrgba = [0,255,255,0];

    // 默认帧以及操作帧
    var frameParams = [];
    frameParams[0] = [new Emit3d(new Vector3(0, 0, -15),new Vector3(1, 1, 1), 150),
                      new PureColor('rgba(0,255,255,1)'),
                      new SizeDes()];
    var combCanvas = $('#combCanvas')[0];
    combCanvas.width = 600;
    combCanvas.height = 600;
    var combglRender = new WebglRender(combCanvas);
    combglRender.setNewDis(parseInt($('#distance').val()));

    var ticked = false;
    var select;
    var loader = new THREE.OBJLoader();
    

    /**
    Data access expend
    **/
    var getIndexByClass = function(arr, name){
        for(var i = 0; i < arr.length; i++){
            if(arr[i] instanceof name)
                return i;
        }
        return -1;
    };

    /**
    Canvas render expend
    **/
    var tick = function() {
        if(changedParam){
            ps.clearEffects();
            for(var i = 0;i < frameParams[0].length;i++){
                ps.addEffect(frameParams[0][i]);
            }
        }
        ps.update();
        ps.render();
        $('#frame').val(parseInt($('#frame').val())+1);
        $('#frame-num').html($('#frame').val());
        if($('#frame').val() < frameNum && playing)
            requestAnimationFrame(tick);
    };
    var requestMovieFrame = function(){
        ps = new ParticleSys(glRender);
        for(var i = 0;i < frameParams[0].length;i++){
            ps.addEffect(frameParams[0][i]);
        }
        for(var i = 0;i < frameParams[0].length;i++){
            if(frameParams[0][i].stop)
                frameParams[0][i].stop = false;
        }
        for(var i =0; i<parseInt($('#frame').val()); i++)
            ps.update();
    }

    var combTick = function() {
        comTick++;
        if(comps.length>0)
            comps[0].ps.clearCanvas();
        for(var i = 0; i<comps.length; i++){
            comps[i].ps.update();
            comps[i].ps.renderNotClear(); 
            
        }
        requestAnimationFrame(combTick);
    };
    var decodeDocs = function(str){
        var results = [];
        var drafts = JSON.parse(str);
        for (var i = 0; i < drafts.length; i++) {
            var psCopy = new ParticleSys(combglRender);
            for (var j = 0; j < drafts[i].effects.length; j++) {
                var eff = eval('new '+ drafts[i].effects[j].etype+'()');
                for(var key in drafts[i].effects[j]){
                    eff[key] = drafts[i].effects[j][key];
                }
                psCopy.addEffect(eff);
            }
            results.push({'ps':psCopy});
        };
        return results;
    };
    $('#com-play').click(function(e){
        var str = JSON.stringify(layers);
        comps = decodeDocs(str);
        comTick = 0;
        if(ticked) return;
        combTick();
        ticked = true;
    });

    /**
    Event bind
    **/
    // 播放器相关
    $('#play').on('click', function(e){
        if(!playing){
            requestMovieFrame();
            playing = true;
            tick();
        }
        e.preventDefault();
        return false;
    });

    $('#pause').on('click', function(e){
        playing = false;
        e.preventDefault();
        return false;
    });

    $('#frame').on('click', function(){
        playing = false;
        requestMovieFrame();
        ps.render();
    });

    // 面板操作影响effect数组
    $('#x, #y, #z').on('change',function(){
        var position = [parseInt($('#x').val()) / 100 * 28 - 14,
            parseInt($('#y').val()) / 100 * 20 - 10,
            parseInt($('#z').val())  / 100 * -100
        ];
        var index = getIndexByClass(frameParams[0],Emit3d);
        frameParams[0][index].emitPos = new Vector3(position[0], position[1], position[2]);
    });

    $('#speedX, #speedY, #speedZ').on('change',function(){
        var spd = [parseInt($('#speedX').val()) / 10,
            parseInt($('#speedY').val()) / 10,
            parseInt($('#speedZ').val())  / 10
        ];
        var index = getIndexByClass(frameParams[0],Emit3d);
        frameParams[0][index].speed = new Vector3(spd[0], spd[1], spd[2]);
    });
    $('#life').on('change',function(){
        var life = parseInt($('#life').val());
        if(!isNaN(life)){
            var index = getIndexByClass(frameParams[0],Emit3d);
            frameParams[0][index].life = life;
        }else{
            alert('请输入有效数字');
        }
        
    });

    $('#colorAge1, #colorAge2').on('click', function(e){
        var val = parseInt(e.currentTarget.value);
        if(!val&&getIndexByClass(frameParams[0],AgeColor)==-1){
            $('#age-prior1,#age-prior2').hide();
            frameParams[0].push(new AgeColor(startrgba, endrgba));
            if(!playing){
                ps.addEffect(new AgeColor(startrgba, endrgba));
                ps.update();
                ps.render();
            }
        }else if(val&&getIndexByClass(frameParams[0],AgeColor)!=-1){
            $('#age-prior1,#age-prior2').show();
            var index = getIndexByClass(frameParams[0],AgeColor);
            frameParams[0].splice(index,1);
            if(!playing){
                ps.removeEffectByClass(AgeColor);
                ps.update();
                ps.render();
            }
        }
    });

    $('#colorful').on('change', function(e) {
        if (this.checked) {
            $('#age-prior1,#age-prior3').hide();
            var index = getIndexByClass(frameParams[0], PureColor);
            frameParams[0].splice(index, 1, new Colorful());
            if(!playing){
                ps.replaceEffect(PureColor, new Colorful());
                ps.update();
                ps.render();
            }
        } else {
            $('#age-prior1,#age-prior3').show();
            var index = getIndexByClass(frameParams[0], Colorful);
            frameParams[0].splice(index, 1, new PureColor(rgbaStr));
            if(!playing){
                ps.replaceEffect(Colorful, new PureColor(rgbaStr));
                ps.update();
                ps.render();
            }
        }
    });;

    $('#viber').on('change', function(e) {
        console.log('viber');
    });

    $("input#default").ColorPickerSliders({
        placement: 'bottom',
        swatches: false,
        order: {
          rgb: 1,
          opacity: 2
        },
        onchange: function(container, color) {
            var index = getIndexByClass(frameParams[0],PureColor);
            rgbaStr = 'rgba('+color.rgba['r']+','+color.rgba['g']+','+color.rgba['b']+','+color.rgba['a']+')';
            frameParams[0][index].color = rgbaStr;
            if(!playing){
                ps.getEffectByClass(PureColor).color = rgbaStr;
                ps.update();
                ps.render();
            }
        }
    });
    $("input#min-color").ColorPickerSliders({
        placement: 'bottom',
        swatches: false,
        order: {
          rgb: 1,
          opacity: 2
        },
        onchange: function(container, color) {
            var index = getIndexByClass(frameParams[0],AgeColor);
            startrgba =[Math.floor(color.rgba['r']),Math.floor(color.rgba['g']),Math.floor(color.rgba['b']),color.rgba['a']];
            frameParams[0][index].startrgba = startrgba;
            if(!playing&&ps.getEffectByClass(AgeColor)){
                ps.getEffectByClass(AgeColor).startrgba = startrgba;
                ps.update();
                ps.render();
            }
        }
    });

    $("input#max-color").ColorPickerSliders({
        placement: 'bottom',
        swatches: false,
        order: {
          rgb: 1,
          opacity: 2
        },
        onchange: function(container, color) {
            var index = getIndexByClass(frameParams[0],AgeColor);
            endrgba =[Math.floor(color.rgba['r']),Math.floor(color.rgba['g']),Math.floor(color.rgba['b']),color.rgba['a']];
            frameParams[0][index].endrgba = endrgba;
            if(!playing&&ps.getEffectByClass(AgeColor)){
                ps.getEffectByClass(AgeColor).endrgba = endrgba;
                ps.update();
                ps.render();
            }
        }
    });
    $('#emit-area').click(function (e) {
        $('#emit-params').fadeToggle();
    });
    
    $('#particle-area').click(function (e) {
        $('#particle-params').fadeToggle();
    });
    $('#air-area').click(function (e) {
        $('#air-params').fadeToggle();
    });
    $('#air-use').click(function (e) {
        if(getIndexByClass(frameParams[0], AirForce)== -1)
            frameParams[0].push(new AirForce());
    });

    $('#air-cancel').click(function (e) {
        var index = getIndexByClass(frameParams[0],AirForce);
        if(index != -1)
            frameParams[0].splice(index,1);
    });
    
    $('#emit-way a').click(function (e){
        e.preventDefault(); 
        $(this).tab('show');
        value = $(this).attr("data-i");
        if (value == '0') {
            ps.clearParticles();
            frameParams[0].splice(0, 1, new Emit3d(new Vector3(0, 0, -15), new Vector3(1, 1, 1), 150));
            if(!playing){
                ps.replaceEffect(AreaIni3d, frameParams[0][0]);
                ps.update();
                ps.render();
            }
        }
    });

    var loadPos =  function(geoType, cb){
        var selPos = []
        if(geoType==1){
            loader.load( '/models/renti.obj', function (obj) {
                for(var i=0;i<obj.children.length;i++){
                    var geometry = obj.children[i].geometry; 
                    var verPos = geometry.attributes.position.array;
                    for(var i=0; i<verPos.length; i=i+3){
                        selPos.push({'x':verPos[i],'y':verPos[i+1],'z':verPos[i+2]});
                    }
                }
                cb(selPos);
            });
        }else if(geoType==2){
            loader.load( '/models/futou.obj', function (obj) {
                for(var i=0;i<obj.children.length;i++){
                    var geometry = obj.children[i].geometry; 
                    var verPos = geometry.attributes.position.array;
                    for(var i=0; i<verPos.length; i=i+3){
                        selPos.push({'x':verPos[i],'y':verPos[i+1],'z':verPos[i+2]});
                    }
                }
                cb(selPos);
            });
        }
        else if(geoType==3){
            loader.load( '/models/bird.obj', function (obj) {
                for(var i=0;i<obj.children.length;i++){
                    var geometry = obj.children[i].geometry; 
                    var verPos = geometry.attributes.position.array;
                    for(var i=0; i<verPos.length; i=i+3){
                        selPos.push({'x':verPos[i],'y':verPos[i+1],'z':verPos[i+2]});
                    }
                }
                cb(selPos);
            });
        }

    }
    $('#gemo-choose').change(function(e){
        var geoType = $(this).val();
        var spd = [parseInt($('#gemo-speedX').val()),
            parseInt($('#gemo-speedY').val()),
            parseInt($('#gemo-speedZ').val())
        ];
        var life = $('#gemo-life').val();
        var density = parseInt($('#gemo-density').val());
        loadPos(geoType, function(selPos){
            var areaIni3d = new AreaIni3d(selPos,spd,life,density);
            areaIni3d.geoType = geoType;
            frameParams[0].splice(0, 1, areaIni3d);
            ps.clearParticles();
            if(!playing){
                ps.replaceEffect(Emit3d, areaIni3d);
                ps.replaceEffect(ScatterIni3d, frameParams[0][0]);
                ps.update();
                ps.render();
            } 
        });
        
    });
    $('#gemo-speedX, #gemo-speedY, #gemo-speedZ').on('change',function(){
        var spd = [parseInt($('#gemo-speedX').val()),
            parseInt($('#gemo-speedY').val()),
            parseInt($('#gemo-speedZ').val())
        ];
        var index = getIndexByClass(frameParams[0],AreaIni3d);
        frameParams[0][index].speed = spd;
    });
    $('#gemo-life').on('change',function(){
        var life = parseInt($('#gemo-life').val());
        if(!isNaN(life)){
            var index = getIndexByClass(frameParams[0],AreaIni3d);
            frameParams[0][index].life = life;
        }else{
            alert('请输入有效数字');
        }
        
    });
    $('#gemo-density').on('change',function(){
        var density = parseInt($('#gemo-density').val());
        var index = getIndexByClass(frameParams[0],AreaIni3d);
        frameParams[0][index].density = density;
        
    });
    $('#gemo-transX, #gemo-transY, #gemo-transZ').on('change',function(){
        var tx = Number($('#gemo-transX').val());
        var ty = Number($('#gemo-transY').val());
        var tz = Number($('#gemo-transZ').val());
        if(isNaN(tx)||isNaN(ty)||isNaN(tz)){
            alert('请输入有效数字');
            return;
        }
        var index = getIndexByClass(frameParams[0],AreaIni3d);
        frameParams[0][index].translate = [tx,ty,tz];
    });


    // 根据某一帧effect刷新编辑面板
    var refreshEditPanel = function(effects){
        playing = false;
        rgbaStr = 'rgba(0,255,255,1)';
        frameParams[0] = effects;
        ps = new ParticleSys(glRender);
        //Panel Params reset

        for(var i=0; i < layers.length; i++){
            if(select==layers[i].id){
                $('#start-frame').val(layers[i].start);
            }
        }
        if(getIndexByClass(effects, PureColor)!=-1){
            $('#age-prior1,#age-prior2,#age-prior3').show();
            $("input#default").trigger("colorpickersliders.updateColor", effects[getIndexByClass(effects, PureColor)].color);
        }
        if(getIndexByClass(effects, Colorful)!=-1){
            $('#age-prior2').show();
            $('#age-prior1,#age-prior3').hide();
            $('#colorful')[0].checked = true;
        }else{
            $('#colorful')[0].checked = false;
        }
        if(getIndexByClass(effects, AgeColor)!=-1){
            $('#age-prior3').show();
            $('#age-prior1,#age-prior2').hide();
            $('input[name="colorAge"]')[0].checked = true;
            $('input[name="colorAge"]')[1].checked = false;
        }else{
            $('input[name="colorAge"]')[0].checked = false;
            $('input[name="colorAge"]')[1].checked = true;
        }
        if(getIndexByClass(effects, Emit3d)!=-1){
            var xval = Math.floor((effects[getIndexByClass(effects, Emit3d)].emitPos.x+14)*100/28);
            var yval = Math.floor((effects[getIndexByClass(effects, Emit3d)].emitPos.y+10)*5);
            var zval = Math.floor(effects[getIndexByClass(effects, Emit3d)].emitPos.z*-1);
            var xspeed = effects[getIndexByClass(effects, Emit3d)].speed.x*10;
            var yspeed = effects[getIndexByClass(effects, Emit3d)].speed.y*10;
            var zspeed = effects[getIndexByClass(effects, Emit3d)].speed.z*10;
            var life = effects[getIndexByClass(effects, Emit3d)].life;
            $('#x').val(xval);
            $('#y').val(yval);
            $('#z').val(zval);
            $('#speedX').val(xspeed);
            $('#speedY').val(yspeed);
            $('#speedZ').val(zspeed);
            $('#life').val(life);
            $('#area').removeClass('active');
            $($('li[role="presentation"]')[0]).addClass('active');
            $('#point').addClass('active');
            $($('li[role="presentation"]')[1]).removeClass('active');
        }else{
            $('#x').val(50);
            $('#y').val(50);
            $('#z').val(35);
            $('#speedX').val(1);
            $('#speedY').val(1);
            $('#speedZ').val(1);
            $('#life').val(150);
            $('#area').addClass('active');
            $($('li[role="presentation"]')[1]).addClass('active');
            $('#point').removeClass('active');
            $($('li[role="presentation"]')[0]).removeClass('active');
        }
        if(getIndexByClass(effects, AreaIni3d)!=-1){
            var speed = effects[getIndexByClass(effects, AreaIni3d)].speed;
            var life = effects[getIndexByClass(effects, AreaIni3d)].life;
            var density = effects[getIndexByClass(effects, AreaIni3d)].density;
            var translate = effects[getIndexByClass(effects, AreaIni3d)].translate;
            $("#gemo-choose").val(effects[getIndexByClass(effects, AreaIni3d)].geoType);
            $('#gemo-speedX').val(speed[0]);
            $('#gemo-speedY').val(speed[1]);
            $('#gemo-speedZ').val(speed[2]);
            $('#gemo-life').val(life);
            $('#gemo-density').val(density);
            $('#gemo-transX').val(translate[0]);
            $('#gemo-transY').val(translate[1]);
            $('#gemo-transZ').val(translate[2]);
        }else{
            $("#gemo-choose").val(0);
            $('#gemo-speedX').val(50);
            $('#gemo-speedY').val(50);
            $('#gemo-speedZ').val(50);
            $('#gemo-life').val(10);
            $('#gemo-density').val(1);
            $('#gemo-transX').val(0);
            $('#gemo-transY').val(0);
            $('#gemo-transZ').val(0);
        }
        //Player Params reset
        ps.render();
        $('#frame').val(0);
        $('#frame-num').html($('#frame').val());
    }
    $('#add-layer').click(function(e){
        if(layers.length>=5){
            alert('为了更好的绘制性能，请设置5层以内特效');
            return;
        }
        var id = new Date().getTime();
        //Add the layer in data
        frameParams[0] = [new Emit3d(new Vector3(0, 0, -15),new Vector3(1, 1, 1),100),
                      new PureColor('rgba(0,255,255,1)')];
        var effectsCopy = [];
        for(var i = 0; i < frameParams[0].length; i++){
            var effectCopy = $.extend(true, {}, frameParams[0][i]);
            effectCopy.__proto__ = frameParams[0][i].__proto__;
            effectCopy.etype = frameParams[0][i].constructor.name;
            if(effectCopy.once){
                effectCopy.stop = false;
            };
            effectsCopy.push(effectCopy);
        }

        layers.push({'effects': effectsCopy,'id': id,'start': 0});
        startplay = 0;

        //Show it in the panel
        select = id;
        if(layers.length==1){
            $('.cover').hide();
        }
        $('#layers-view div').each(function(){
            $(this).removeClass('selected');
        });
        $('#layers-view').append('<div class="selected" data-index="'+id+'"><img src="blank.png">'+ id+'</div>');

        refreshEditPanel(frameParams[0]);
    });

    $('#save-layer').click(function(e){
        var id = new Date().getTime();
        // Show the save layer on UI 
        for(var i=0; i < layers.length; i++){
            if(select==layers[i].id){
                $('div [data-index="'+select+'"]').replaceWith('<div class="selected" data-index="'+id+'"><img src="'+ canvas.toDataURL('image/jpeg')+'"> '+ id+'</div>');
            }
        }
        //Store the layer in data
        var effectsCopy = [];
        for(var i = 0; i < frameParams[0].length; i++){
            var effectCopy = $.extend(true, {}, frameParams[0][i]);
            effectCopy.__proto__ = frameParams[0][i].__proto__;
            effectCopy.etype = frameParams[0][i].constructor.name;
            if(effectCopy.once){
                effectCopy.stop = false;
            };
            effectsCopy.push(effectCopy);
        }

        for(var i=0; i < layers.length; i++){
            if(select==layers[i].id){
                layers.splice(i,1,{'effects': effectsCopy,'id': id});
            }
        }
        select = id;

    });



    $('#layers-view').on('click','div', function(e){
        select = e.currentTarget.dataset.index;
        //Show the selected layer
        $('#layers-view div').each(function(){
            $(this).removeClass('selected');
        });
        $(e.currentTarget).addClass('selected');
        for(var i=0; i < layers.length; i++){
            if(select==layers[i].id){
                refreshEditPanel(layers[i].effects);
            }
        }
    });

    $('#layer-up').on('click',function(e){
        if(select == null){
            alert('未选择任何图层');
            return;
        }
        for(var i=0; i < layers.length; i++){
            if(select==layers[i].id&&i!=0){
                //Swap layers items
                layers[i-1] = layers.splice(i, 1, layers[i-1])[0];
                $('#layers-view div[data-index="'+select+'"]').insertBefore($('#layers-view div[data-index="'+select+'"]').prev());
                break;
            }
        }
    });

    $('#layer-down').on('click',function(e){
        if(select == null){
            alert('未选择任何图层');
            return;
        }
        for(var i=0; i < layers.length; i++){
            if(select==layers[i].id&&i!=layers.length-1){
                //Swap layers items
                layers[i] = layers.splice(i+1, 1, layers[i])[0];
                $('#layers-view div[data-index="'+select+'"]').insertAfter($('#layers-view div[data-index="'+select+'"]').next());
                break;
            }
        }
    });

    $('#layer-del').on('click',function(e){
        if(select == null){
            alert('未选择任何图层');
            return;
        }
        for(var i=0; i < layers.length; i++){
            if(select==layers[i].id){
                layers.splice(i, 1);
                $('#layers-view div[data-index="'+select+'"]').remove();
                select = null;
            }
        }
        
    });
    $('#distance').on('change',function(e){
        glRender.setNewDis(parseInt($('#distance').val()));
    });
    $('#gencode').on('click',function(e){
        alert('正在为您生成代码，请等待');
        var str = "'"+JSON.stringify(layers)+"'";
        var code =[
            '<html>',
            '<head>',
            '</head>',
            '<body>',
            '<canvas id="combCanvas" width="600" height="600">',
            '</canvas>',
            '<script type="text/javascript" src="http://juparticle-jusdk.stor.sinaapp.com/3d_all_sdk.js"></script>',
            '<script type="text/javascript">',
            'function codeInner(){',
                'var comps;',
                'var combglRender = new WebglRender($("#combCanvas")[0]);',
                'combglRender.setNewDis(-30);',
                'var combTick = function() {',
                    'if(comps.length>0)',
                        'comps[0].clearCanvas();',
                    'for(var i = 0; i<comps.length; i++){',
                        'comps[i].update();',
                        'comps[i].renderNotClear();',
                    '}',
                    'requestAnimationFrame(combTick);',
                '};',
                'var decodeDocs = function(str){',
                    'var results = [];',
                    'var drafts = JSON.parse(str);',
                    'for (var i = 0; i < drafts.length; i++) {',
                        'var psCopy = new ParticleSys(combglRender);',
                        'for (var j = 0; j < drafts[i].effects.length; j++) {',
                            'var eff = eval("new "+ drafts[i].effects[j].etype+"()");',
                            'for(var key in drafts[i].effects[j]){',
                                'eff[key] = drafts[i].effects[j][key];',
                            '}',
                            'psCopy.addEffect(eff);',
                        '}',
                        'results.push(psCopy);',
                    '};',
                    'return results;',
                '};',
                'comps = decodeDocs('+str+');',
                'combTick();',
            '}',
            '</script>',
            '</body>',
            '</html>',
        ];
        $('#pro-code').val(code.join('\n'));
    });
}