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
seajs.use(['Core/ParticleSys', 'Render/CanvasRender', 'Render/WebglRender', 'Effect/AgeBlur', 'Effect/AgeColor', 'Effect/Emit3d', 'Effect/PureColor', 'Math/Vector3', 'Effect/Colorful', 'Effect/ScatterIni3d', 'Effect/SizeDes', 'Effect/Viberate','Effect/AreaIni3d','Effect/AirForce'], function(ParticleSys, CanvasRender, WebglRender, AgeBlur, AgeColor , Emit3d, PureColor, Vector3, Colorful, ScatterIni3d, SizeDes, Viberate, AreaIni3d, AirForce) {
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