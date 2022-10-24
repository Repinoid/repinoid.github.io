function mapFrags2Pic (mapCell) {
	const fragments = gMap2Fragments (mapCell.innerHTML) ;
		const w = mapCell.clientWidth ;
		const h = mapCell.clientHeight ;
		globusas.clientWidth = w ;
		globusas.clientHeight = h ;
	const ret = fragments.frags ;
	const canvas = document.getElementById('canva');
		canvas.width  = w;
		canvas.height = h;
		canvas.style.zIndex   = 10;
		const ctx = canvas.getContext('2d') ;
			globusas.canvas = canvas ;
			globusas.ctx = ctx ;
			imDat = ctx.getImageData(0, 0, w, h) ;
		const pic = [] ;
		let cunt = 0 ;	
	for (let i = 0; i < ret.length; i++) {	
		const obj = ret[i] ;
			pic[i]       = new Image(); 
			pic[i].setAttribute('crossorigin', 'anonymous');
			pic[i].crossOrigin = 'anonymous';
			pic[i].src    = obj.src ;
		const x = +obj.L  ;
		const y = +obj.T  ;
		pic[i].onload = function(){
				const xCoord = x + w/2 + fragments.dX + fragments.dXtrans ;
				const yCoord = y + h/2 + fragments.dY + fragments.dYtrans ;
			ctx.drawImage(pic[i], xCoord,  yCoord); 			
			cunt ++ ;
			if (cunt == ret.length) {		// if all pix are loaded
figs2Pic (canvas) ;
				drawMinMaxPoints(ctx) ;
				imDat = ctx.getImageData(0, 0, w, h) ;				
				dataURL = canvas.toDataURL();								// global var
				globusas.dataURL = dataURL ;
				obschak.compost() ;
				open3D() ;
				const miniDat = compressor(globusas) ;
//							/**/ {	const rectsJson = JSON.stringify(globusas);				// запись объекта в файл /////////////////
							/**/ {	const rectsJson = JSON.stringify(miniDat);				
							/**/	const xmlhttp= new XMLHttpRequest();
							/**/	const phpFile = "saves.php";
							/**/	xmlhttp.open("PUT", phpFile, true);
							/**/	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Отправляем кодировку						
							/**/	xmlhttp.send(fOut(MAPPA) + rectsJson);
							/**/	xmlhttp.close;		}
			}
		}
	}
}
function gMap2Fragments (innerHT) {
	let dX, dY, dXtrans, dYtrans ;
	let dt = innerHT ;
	console.log(dt) ;
		{ 	let posE = dt.indexOf("transform: matrix") ;
			let kusok = dt.substring(posE + 17, dt.indexOf(";", posE+17)) ;
			let k1 = kusok.replace("(", "") ;
			let k2 = k1.replace(")", "") ;
			let trans = k2.split(",") ;
				dX = +trans[4] ;
				dY = +trans[5] ; 
		}
		{	let posE = dt.indexOf("transform: translate(") ;
			let kusok = dt.substring(posE + 20, dt.indexOf(";", posE+20)) ;
			let k1 = kusok.replace("(", "") ;
			let k2 = k1.replace(")", "") ;
			let	k3 = k2.replace(/px/g, "") ;
			let trans = k3.split(",") ;
				dXtrans = +trans[0] ;
				dYtrans = +trans[1] ;	
		}
	let bDiv = [] ; 
		let pos = dt.indexOf("<div ", 0) ;
		while (pos != -1)  {
			bDiv.push(pos) ;						// massiv of Begins
			pos = dt.indexOf("<div ", pos+5) ;
		} 
	let eDiv = [] ;
		pos = dt.indexOf("</div>", 0) ;
		while (pos != -1)  {
			eDiv.push(pos) ;					// massiv of Ends ; </div> not included
			pos = dt.indexOf("</div>", pos+6) ;
		} 
		let kusoks = [] ;
	for (let i=0; i < eDiv.length; i++) {
		let j = 0 ;
		while ( bDiv[j] < eDiv[i] ) 		// поиск начала - наибольшее меньшее индекса конца
			j++ ;
		kusoks.push( [bDiv[j-1], eDiv[i]] ) ;
		bDiv.splice(j-1,1) ;				// убрать из массива начал уже найденное
	}
		let mapDivs = [] ;
	for (let i=0; i < kusoks.length; i++) 	{
		let idx = kusoks[i] ;
		let inka = dt.substring(idx[0]+5, idx[1]) ;			// содержимое дива без тегов дива
		if ( inka.indexOf("<div ") != -1 )
			continue ; 							// пропустить цикл если есть вложенный див
		if ( inka.indexOf("<div ") != -1 )
			continue ; 							// пропустить цикл если есть вложенный див
		if ( inka.indexOf("maps.googleapis.com/maps/") == -1 )
			continue ; 							// пропустить цикл если нет ссылки на maps.googleapis.com
		if ( inka.indexOf("<img draggable") == -1 )
			continue ; 							// пропустить цикл если нет тега картинки
			let ind = 	inka.indexOf("left: ") ;
			let sLeft = 	+  inka.substring(ind + 6, 	inka.indexOf("px;", ind)) ;  // + - convert to number
				ind = 	inka.indexOf("top: ") ;
			let sTop = 		+ inka.substring(ind + 5, 	inka.indexOf("px;", ind)) ;
				ind = 	inka.indexOf("width: ") ;
			let sWidth = 	+ inka.substring(ind + 7, 	inka.indexOf("px;", ind)) ;
				ind = 	inka.indexOf("height: ") ;
			let sHeight = 	+ inka.substring(ind + 8, 	inka.indexOf("px;", ind)) ;
				ind = inka.indexOf("src=") ;
			let mapKus = inka.substring(ind + 5, inka.indexOf("\"", ind + 5) )
			let obj = {L:sLeft, T:sTop, W:sWidth, H:sHeight, src:mapKus} ;
		mapDivs.push(obj) ;
	}
	var	rtn = {dX:dX, dY:dY, dXtrans:dXtrans, dYtrans:dYtrans, frags:mapDivs} ;
	return rtn ;
}



