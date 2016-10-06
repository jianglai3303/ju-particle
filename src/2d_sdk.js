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
seajs.use(['Views/Resize','Core/ParticleSys', 'Render/CanvasRender', 'Render/WebglRender', 'Effect/AgeColor', 'Effect/Emit2d', 'Effect/PureColor', 'Math/Vector3', 'Effect/Colorful', 'Effect/ScatterIni2d', 'Effect/SizeDes', 'Effect/Viberate','Effect/AreaIni2d','Effect/AirForce'], function(Resize, ParticleSys, CanvasRender, WebglRender, AgeColor,  Emit2d, PureColor, Vector3, Colorful, ScatterIni2d, SizeDes, Viberate, AreaIni2d, AirForce) {
    console.log('2d sdk load ok....');
    var argsNow = getArgs(arguments.callee);
    for(var i=0;i<argsNow.length;i++){
    	eval('this.'+argsNow[i]+'='+argsNow[i]);
    }
    var self = this;
    $(document).ready(function(){
      codeInner.bind(self)();
    }) 
});