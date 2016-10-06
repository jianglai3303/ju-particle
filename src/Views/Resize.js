define(function(require,exports,mudule){
	function getSearchParameters() {
      var prmstr = window.location.search.substr(1);
      return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
	}

	function transformToAssocArray( prmstr ) {
	    var params = {};
	    var prmarr = prmstr.split("&");
	    for ( var i = 0; i < prmarr.length; i++) {
	        var tmparr = prmarr[i].split("=");
	        params[tmparr[0]] = tmparr[1];
	    }
	    return params;
	}
	exports.setCanvas = function(){
		var params = getSearchParameters();
		var w = parseInt(params['w']);
		var h = parseInt(params['h']);
		if(isNaN(w)||isNaN(h)){
			$('#combCanvas')[0].width = 600;
	    	$('#combCanvas')[0].height = 600;
		    $('#testCanvas')[0].width = 600;
		    $('#testCanvas')[0].height = 600;
		    $('#canvas-width').val(600)
		    $('#canvas-height').val(600)
		}else{
			$('#combCanvas')[0].width = w;
	    	$('#combCanvas')[0].height = h;
		    $('#testCanvas')[0].width = w;
		    $('#testCanvas')[0].height = h;
		    $('#canvas-width').val(w);
		    $('#canvas-height').val(h);
		}
	}
});