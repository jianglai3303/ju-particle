
function codeInner(){
    /**
    Overall data
    **/
    var layers = [];
    var comps = [];
    var combglRender = new CanvasRender($('#combCanvas')[0],'blur');
    var select;
    var ticked = false;
    var comTick = 0;
    var stats
    /**
    Edit layer 
    **/
    var canvas = $('#testCanvas')[0];
    Resize.setCanvas();

    var glRender = new CanvasRender(canvas,'blur');
    var frameNum = 3000;
    var playing = false;
    var startplay = 0;
    var ps = new ParticleSys(glRender);
    var frameParams = [];
    var rgbaStr = 'rgba(0,255,255,1)';
    var startrgba = [0,255,255,1];
    var endrgba = [0,255,255,0];
    frameParams[0] = [new Emit2d(new Vector2(canvas.width/2, canvas.height/2),new Vector2(1, 1)),
                      new PureColor('rgba(0,255,255,1)')];

    var getIndexByClass = function(arr, name){
        for(var i = 0; i < arr.length; i++){
            if(arr[i] instanceof name)
                return i;
        }
        return -1;
    };
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
            var startrgba = effects[getIndexByClass(effects, AgeColor)].startrgba;
            var endrgba = effects[getIndexByClass(effects, AgeColor)].endrgba;
            $("input#min-color").trigger("colorpickersliders.updateColor", 'rgba('+startrgba[0]+','+startrgba[1]+','+startrgba[2]+','+startrgba[3]+')');
            $("input#max-color").trigger("colorpickersliders.updateColor", 'rgba('+endrgba[0]+','+endrgba[1]+','+endrgba[2]+','+endrgba[3]+')');
        }else{
            $('input[name="colorAge"]')[0].checked = false;
            $('input[name="colorAge"]')[1].checked = true;
            $("input#min-color").trigger("colorpickersliders.updateColor", 'rgba(0,255,255,1)');
            $("input#max-color").trigger("colorpickersliders.updateColor", 'rgba(0,255,255,0)');
        }
        if(getIndexByClass(effects, Emit2d)!=-1){
            var xval = Math.floor(effects[getIndexByClass(effects, Emit2d)].emitPos.x/canvas.width*100);
            var yval = Math.floor(effects[getIndexByClass(effects, Emit2d)].emitPos.y/canvas.height*100);
            var xspeed = effects[getIndexByClass(effects, Emit2d)].speed.x;
            var yspeed = effects[getIndexByClass(effects, Emit2d)].speed.y;
            var minsize = effects[getIndexByClass(effects, Emit2d)].minsize;
            var maxsize = effects[getIndexByClass(effects, Emit2d)].maxsize;
            var density = effects[getIndexByClass(effects, Emit2d)].density;
            var life = effects[getIndexByClass(effects, Emit2d)].life;
            $('#x').val(xval);
            $('#y').val(yval);
            $('#speedX').val(xspeed);
            $('#speedY').val(yspeed);
            $('#particle-minsize').val(minsize);
            $('#particle-maxsize').val(maxsize);
            $('#density').val(density);
            $('#life').val(life);
            $('#point').addClass('active');
            $($('li[role="presentation"]')[0]).addClass('active');
            $('#area').removeClass('active');
            $($('li[role="presentation"]')[1]).removeClass('active');
        }else{
            $('#x').val(50);
            $('#y').val(50);
            $('#speedX').val(1);
            $('#speedY').val(1);
            $('#particle-minsize').val(4);
            $('#particle-maxsize').val(4);
            $('#density').val(1);
            $('#life').val(100);
            $('#area').addClass('active');
            $($('li[role="presentation"]')[1]).addClass('active');
            $('#point').removeClass('active');
            $($('li[role="presentation"]')[0]).removeClass('active');
        }
        if(getIndexByClass(effects, AreaIni2d)!=-1){
            var xspeed = effects[getIndexByClass(effects, AreaIni2d)].speedx;
            var yspeed = effects[getIndexByClass(effects, AreaIni2d)].speedy;
            var minsize = effects[getIndexByClass(effects, AreaIni2d)].minsize;
            var maxsize = effects[getIndexByClass(effects, AreaIni2d)].maxsize;
            var density = effects[getIndexByClass(effects, AreaIni2d)].density;
            var life = effects[getIndexByClass(effects, AreaIni2d)].life;
            $('#area-speedX').val(xspeed);
            $('#area-speedY').val(yspeed);
            $('#area-density').val(density);
            $('#area-minsize').val(minsize);
            $('#area-maxsize').val(maxsize);
            $('#area-life').val(life);
            $('#area').addClass('active');
            $($('li[role="presentation"]')[1]).addClass('active');
            $('#point').removeClass('active');
            $($('li[role="presentation"]')[0]).removeClass('active');

        }else{
            $('#area-speedX').val(1);
            $('#area-speedY').val(1);
            $('#area-density').val(1);
            $('#area-minsize').val(4);
            $('#area-maxsize').val(4);
            $('#area-life').val(100);
            $('#fileToUpload').replaceWith($('#fileToUpload').clone(true));
            $('#point').addClass('active');
            $($('li[role="presentation"]')[0]).addClass('active');
            $('#area').removeClass('active');
            $($('li[role="presentation"]')[1]).removeClass('active');
        }
        if(getIndexByClass(effects, AirForce)!=-1){
            $('#xforce').val(effects[getIndexByClass(effects, AirForce)].xforce);
            $('#yforce').val(effects[getIndexByClass(effects, AirForce)].yforce);
            $('#octaveCount').val(effects[getIndexByClass(effects, AirForce)].octaveCount);
            $('#persistence').val(effects[getIndexByClass(effects, AirForce)].octaveCount);
        }else{
            $('#xforce').val(4);
            $('#yforce').val(4);
            $('#octaveCount').val(7);
            $('#persistence').val(0);
        }
        //Player Params reset
        ps.render();
        $('#frame').val(0);
        $('#frame-num').html($('#frame').val());
    }

    // Canvas render expend
    var tick = function() {
        if(playing){
            if(parseInt($('#frame').val()) > startplay){
                ps.clearEffects();
                for(var i = 0;i < frameParams[0].length;i++){
                    ps.addEffect(frameParams[0][i]);
                }
                ps.update();
                ps.render();
            }else{
                ps.clearCanvas();
            }
            $('#frame').val(parseInt($('#frame').val())+1);
            $('#frame-num').html($('#frame').val());
        }
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

    //Event bind

    $('#start-frame').on('change', function(e){
        startplay = parseInt($('#start-frame').val());
    });
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
        $('#frame-num').html($('#frame').val());
        if(parseInt($('#frame').val()) > startplay){
            requestMovieFrame();
            ps.render();
        }else{
            ps.clearCanvas();
        }
    });


    $('#particle-maxsize,#particle-minsize').on('change',function(){
        if(getIndexByClass(frameParams[0], Emit2d)!=-1){
            var index = getIndexByClass(frameParams[0], Emit2d);
            var minsizeval = parseInt($('#particle-minsize').val());
            var maxsizeval = parseInt($('#particle-maxsize').val());
            if(minsizeval >= 1 && minsizeval <=100 && minsizeval >= 1 && minsizeval <=100 && minsizeval<=maxsizeval){
                frameParams[0][index].minsize = minsizeval;
                frameParams[0][index].maxsize = maxsizeval;
            }else{
                alert('数值应该在1～100之间, 且区间正确')
                $('#particle-minsize').val(4);
                $('#particle-maxsize').val(4);
                frameParams[0][index].minsize =4;
                frameParams[0][index].maxsize =4;
            }
        }
    });

    $('#area-minsize,#area-maxsize').on('change',function(){
        if(getIndexByClass(frameParams[0], AreaIni2d)!=-1){
            var index = getIndexByClass(frameParams[0], AreaIni2d);
            var minsizeval = parseInt($('#area-minsize').val());
            var maxsizeval = parseInt($('#area-maxsize').val());
            if(minsizeval >= 1 && minsizeval <=100 && minsizeval >= 1 && minsizeval <=100 && minsizeval<=maxsizeval){
                frameParams[0][index].minsize = minsizeval;
                frameParams[0][index].maxsize = maxsizeval;
            }else{
                alert('数值应该在1～100之间, 且区间正确')
                $('#area-minsize').val(4);
                $('#area-maxsize').val(4);
                frameParams[0][index].minsize =4;
                frameParams[0][index].maxsize =4;
            }
        }
    });

    $('#x, #y').on('change',function(){
        var position = [parseInt($('#x').val()) / 100 * canvas.width,
            parseInt($('#y').val()) / 100 * canvas.height,
        ];
        var index = getIndexByClass(frameParams[0],Emit2d);
        frameParams[0][index].emitPos = new Vector2(position[0], position[1]);
    });

    $('#density').on('change',function(){
        var index = getIndexByClass(frameParams[0],Emit2d);
        frameParams[0][index].density = parseInt($('#density').val());
    });

    $('#area-density').on('change',function(){
        var index = getIndexByClass(frameParams[0],AreaIni2d);
        frameParams[0][index].density = parseInt($('#area-density').val());
    });

    $('#speedX, #speedY').on('change',function(){
        var spd = [parseInt($('#speedX').val()),
            parseInt($('#speedY').val())
        ];
        var index = getIndexByClass(frameParams[0],Emit2d);
        frameParams[0][index].speed = new Vector3(spd[0], spd[1]);
    });

    $('#area-speedX, #area-speedY').on('change',function(){
        var index = getIndexByClass(frameParams[0],AreaIni2d);
        frameParams[0][index].speedx = parseInt($('#area-speedX').val());
        frameParams[0][index].speedy = parseInt($('#area-speedY').val());
    });

    $('#life').on('change',function(){
        var life = parseInt($('#life').val());
        if(!isNaN(life)){
            var index = getIndexByClass(frameParams[0],Emit2d);
            frameParams[0][index].life = life;
        }else{
            alert('请输入有效数字');
        }
        
    });

    $('#area-life').on('change',function(){
        var life = parseInt($('#area-life').val());
        if(!isNaN(life)){
            var index = getIndexByClass(frameParams[0],AreaIni2d);
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
            rgbaStr = 'rgba('+Math.floor(color.rgba['r'])+','+Math.floor(color.rgba['g'])+','+Math.floor(color.rgba['b'])+','+color.rgba['a']+')';
            frameParams[0][index].color = rgbaStr;
            if(!playing&&ps.getEffectByClass(PureColor)){
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
    $('#common-area').click(function (e) {
        $('#common-params').fadeToggle();
    });
    $('#particle-area').click(function (e) {
        $('#particle-params').fadeToggle();
    });
    $('#air-area').click(function (e) {
        $('#air-params').fadeToggle();
    });
    $('#air-use').click(function (e) {
        var index = getIndexByClass(frameParams[0],AirForce);
        if(index != -1){
            frameParams[0].splice(index,1);
        } 
        if(getIndexByClass(frameParams[0], AirForce)== -1){
            var airforce = new AirForce(canvas);
            airforce.xforce = parseInt($('#xforce').val());
            airforce.yforce = parseInt($('#yforce').val());
            var o = parseInt($('#octaveCount').val());
            var p = parseInt($('#persistence').val())/10;
            airforce.setParams(o, p, canvas);
            frameParams[0].push(airforce);
        }
            
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
            frameParams[0].splice(0, 1, new Emit2d(new Vector2(canvas.width/2,canvas.height/2),new Vector2(1,1)));
            if(!playing){
                ps.replaceEffect(ScatterIni2d, frameParams[0][0]);
                ps.replaceEffect(AreaIni2d, frameParams[0][0]);
                ps.update();
                ps.render();
            }
        }
    });
    
    $('#fileToUpload').change(function(e){
        var file = $('#fileToUpload')[0].files[0];
        if(!/image\/\w+/.test(file.type)){ 
            alert("请确保文件为图像类型"); 
            return false; 
        } 
        var reader = new FileReader(); 
        reader.readAsDataURL(file);
        reader.onload = function(e){
            frameParams[0].splice(0, 1, new AreaIni2d(this.result,canvas));
            ps.clearParticles();
            if(!playing){
                ps.replaceEffect(Emit2d, new AreaIni2d(this.result,canvas));
                ps.replaceEffect(ScatterIni2d, frameParams[0][0]);
                ps.update();
                ps.render();
            }
        }
    });

    var combTick = function() {
        comTick++;
        if(comps.length>0)
            comps[0].ps.clearCanvas();
        for(var i = 0; i<comps.length; i++){
            if(comTick > comps[i].start){
                comps[i].ps.update();
                comps[i].ps.renderNotClear(); 
            }
            
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
            results.push({'ps':psCopy, 'start':drafts[i].start});
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

    $('#add-layer').click(function(e){
        if(layers.length>=5){
            alert('为了更好的绘制性能，请设置5层以内特效');
            return;
        }
        var id = new Date().getTime();
        //Add the layer in data
        frameParams[0] = [new Emit2d(new Vector2(canvas.width/2,canvas.height/2),new Vector2(1, 1)),
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

        var startframe = parseInt($('#start-frame').val());
        for(var i=0; i < layers.length; i++){
            if(select==layers[i].id){
                layers.splice(i,1,{'effects': effectsCopy,'id': id,'start': startframe});
            }
        }
        select = id;
    });

    $('#layers-view').on('click','div', function(e){
        select = e.currentTarget.dataset.index;
        //Show the selected layer
        $('.cover').hide();
        $('#layers-view div').each(function(){
            $(this).removeClass('selected');
        });
        $(e.currentTarget).addClass('selected');
        for(var i=0; i < layers.length; i++){
            if(select==layers[i].id){
                startplay = layers[i].start;
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
        select = null;
        $('.cover').show()
        
    });

    $('#gencode').on('click',function(e){
        alert('正在为您生成代码，请等待');
        var str = "'"+JSON.stringify(layers)+"'";
        var w = parseInt($('#canvas-width').val());
        var h = parseInt($('#canvas-height').val());
        var code =[
            '<html>',
            '<head>',
            '</head>',
            '<body>',
            '<canvas id="combCanvas" width="'+w+'" height="'+h+'">',
            '</canvas>',
            '<script type="text/javascript" src="http://juparticle-jusdk.stor.sinaapp.com/2d_all_sdk.js"></script>',
            '<script type="text/javascript">',
            'function codeInner(){',
                'var comps;',
                'var combglRender = new CanvasRender($("#combCanvas")[0],"blur");',
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

    $(window).on('beforeunload',function(){
        return "退出编辑后，将无法保存记录";
    });

    $('#change-settings').on('click', function(e){
        var w = parseInt($('#canvas-width').val());
        var h = parseInt($('#canvas-height').val());
        if(isNaN(w)||isNaN(h)) return;
        var str = window.location.href;
        window.location.href = str.substring(0, str.indexOf('2d'))+ '2d.html?w=' + w + '&h=' + h;
    });
};