function m2c(mapCell, callback) {

	var s = mapCell.innerHTML ;
		var slng = s.length ;
	var w = mapCell.clientWidth ;
	var h = mapCell.clientHeight ;
	var minW = 0 ;
	var minH = 0 ;
	var posB = 0, posE = 0 ;
	var massi = [] ;
	var ret = [] ;
	
		posE = s.indexOf("transform: matrix") ;
	var kusok = s.slice(posE + 17, s.indexOf(";", posE+17)) ;
	var k1 = kusok.replace("(", "") ;
	var k2 = k1.replace(")", "") ;
	var trans = k2.split(",") ;
	var dX = +trans[4] ;
	var dY = +trans[5] ;
	
		posE = s.indexOf("transform: translate(") ;
		kusok = s.slice(posE + 20, s.indexOf(";", posE+20)) ;
		k1 = kusok.replace("(", "") ;
		k2 = k1.replace(")", "") ;
	let	k3 = k2.replace(/px/g, "") ;
		trans = k3.split(",") ;
	let dXtrans = +trans[0] ;
	let dYtrans = +trans[1] ;	
	
	while ( (posE = s.indexOf("><", posB)) != -1 )
	{
		var kusok = s.slice(posB, posE+1) ;
		if (( kusok.indexOf("img draggable") == 1 ) && ( kusok.indexOf("key=") != -1 ))
			massi.push(kusok) ;
		if (( kusok.indexOf("div style=\"position: absolute;") == 1 ) && ( kusok.indexOf("width") != -1 ) )
			massi.push(kusok) ;
		posB = posE+1 ;
	}
	for (var i = 0; i < massi.length; i++) {
		if ( massi[i].indexOf("img draggable") == 1 ) {
				var mesto = massi[i-1] ;
					var ind = 	mesto.indexOf("left: ") ;
					var sLeft = 	+  mesto.slice(ind + 6, 	mesto.indexOf("px;", ind)) ;
						if ( sLeft < minW )
							minW = sLeft ;
						ind = 	mesto.indexOf("top: ") ;
					var sTop = 		+ mesto.slice(ind + 5, 	mesto.indexOf("px;", ind)) ;
						if ( sTop < minH )
							minH = sTop ;
						ind = 	mesto.indexOf("width: ") ;
					var sWidth = 	+ mesto.slice(ind + 7, 	mesto.indexOf("px;", ind)) ;
						ind = 	mesto.indexOf("height: ") ;
					var sHeight = 	+ mesto.slice(ind + 8, 	mesto.indexOf("px;", ind)) ;

				ind = massi[i].indexOf("src=") ;
				var mapKus = massi[i].slice(ind + 5, massi[i].indexOf("\"", ind + 5) )
				var obj = {L:sLeft, T:sTop, W:sWidth, H:sHeight, src:mapKus} ;
				ret.push(obj) ;
		}
	}
	
	let canvas4mapGet = document.getElementById('canva');
	canvas4mapGet.width  = w;
	canvas4mapGet.height = h;
	canvas4mapGet.style.zIndex   = 10;
	let ctx       = canvas4mapGet.getContext('2d') ;
	let pic = [] ;
	
	for (let i = 0; i < ret.length; i++) {	
		var cunt = 0 ;
		let obj = ret[i] ;
		pic[i]       = new Image(); 
		pic[i].setAttribute('crossorigin', 'anonymous');
		pic[i].crossOrigin = 'anonymous';
		pic[i].src    = obj.src ;
		let x = +obj.L  ;
		let y = +obj.T  ;
		
		pic[i].onload = function(){
			ctx.drawImage(pic[i], x + w/2 + dX + dXtrans , y + h/2 + dY + dYtrans ); 			
			cunt ++ ;
			if (cunt == ret.length) {
				var dataURL = canvas4mapGet.toDataURL();
				var sl = dataURL.length ;
				canvas4mapGet.style.display = "none" ;
				ctx.clearRect(0, 0, canvas4mapGet.width, canvas4mapGet.height);				
				mapSkin = dataURL ;
				callback(mapSkin) ;
			}
		}
	}
}

document.addEventListener('keydown', function(event) {
  if (event.code == 'KeyM' && (event.ctrlKey || event.metaKey)) {
	m2c(document.getElementById('mapCell'), function(mapSkinner) {							
		var newWin = window.open("about:blank", "pure Map") ;
		newWin.onload = function() {
			var di = newWin.document.createElement('div'),
			body = newWin.document.body;
			newWin.document.write('<img src="' + mapSkinner + '"/>');	
			body.insertBefore(di, body.firstChild);
			return ;
		}
	})
  }
  if (event.code == 'KeyI' && (event.ctrlKey || event.metaKey)) {
		if ( objectData.obj == undefined)
				return ;
		var newWin = window.open("about:blank", "OBJ file") ;
		newWin.onload = function() {
			var di = newWin.document.createElement('div'),
			body = newWin.document.body;
			newWin.document.write(objectData.obj);	
			body.insertBefore(di, body.firstChild);
			return ;
		}
  }
});

document.addEventListener('keydown', function(event) {
  if (event.code == 'F7' && (event.ctrlKey || event.metaKey)) {
		getMainElevator(8) ;
  }
});
