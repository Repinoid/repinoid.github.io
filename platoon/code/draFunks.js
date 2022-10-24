
	
	// saveUrl.onclick = function() { 
			// saveUrl.style.backgroundColor = bgclr ;
			// const Tarr = makeTextsArray		(textsArray) ;
			// const Larr = makeLinesArray		(multilinesArray) ;
			// const Garr = makeGonesArray		(polygonesArray) ;
			// const Carr = makeCirclesArray	(circlesArray) ;
			// const Rarr = makeRectanglesArray(rectanglesArray) ;
			// const Sarr = makeStrelkasArray	(arrowsArray) ;
			// const Karr = makeTracksArray	(tracksArray) ;
			
				// const mapers = {	mapName: mapName.value, 
									// lat:	MAPPA.getCenter().lat(), lng: MAPPA.getCenter().lng(), zoom: MAPPA.getZoom(),
									// lines:		Larr,
									// gones: 		Garr,
									// rects:		Rarr,
									// circles: 	Carr,
									// labels:		Tarr,
									// arrows:		Sarr,
									// tracks:		Karr,
								// } ;
			// const allJson = JSON.stringify(mapers) ;
			// const luc = "" + Math.abs(MAPPA.getBounds().getSouthWest().lat() + Date.now()) ;
			
				// const today = new Date() ;		
				// const month = today.getMonth() + 1;
				// const dat = today.getDate();
				// const dayString = "P" + today.getFullYear() + '-' + (month > 9 ? month :  "0" + month) + '-' + (dat > 9 ? dat :  "0" + dat) + '/'; 
			
			// let foutName = luc.replace('.', '')  ;
				// /**/ {	// запись объекта в файл /////////////////
				// /**/	let xmlhttp	= new XMLHttpRequest();
				// /**/	let phpFile = "savedraws.php";
				// /**/	xmlhttp.open("PUT", phpFile, true);
				// /**/	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Отправляем кодировку		
						// const packet = dayString + foutName + ".json" + allJson ;
				// /**/	xmlhttp.send(packet);
				// /**/	xmlhttp.close;		}								//////////////////////////////////////////
			// window.location.hash = "#" + dayString + foutName ;
		
			// const podskaz = "&nbsp Скопируйте ссылку на карту <br>"+
							// "&nbsp Отошлите соратникам<hr>" +
							// "<span id = 'urlTxt'>&nbsp &nbsp" + window.location + "&nbsp &nbsp</span><hr>" + 
							// "&nbsp &nbspВ случае редактирования сохраните новую ссылку по Save MAP&nbsp &nbsp" ;
			// navigator.clipboard.writeText(window.location) ;
			// saveTxt.innerHTML = podskaz ;
			// saveHelp.style.display = "block" ;
			// const w1 = window.location.href ;
			// const w2 = w1.replace("#", "A") ;
				// const str = "userLocations.php?DRA=" + w2 ;
				// writeLocations(str) ;
	// }
	
	function makeLatLng(obj) {
		const np = new google.maps.LatLng(obj.lat, obj.lng) ;
		return np ;
	}


	function getTrack(hash) {
		const fname = "./run/tracks/" + hash + ".json" ;
		const X = new XMLHttpRequest();
		X.open("GET", fname, true);
		X.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
		X.send(null);
		X.close;
		X.onload = function () {
			let obrat ;
			if ( (X.readyState == 4 && X.status == "200") && ( obrat = tryParsing(X.responseText) ) ) 	// if file exists && OK parsed
			{
				for (let i=0; i < obrat.path.length; i++) 
					obrat.path[i] = makeLatLng(obrat.path[i]) ;
				obrat.start		= makeLatLng(obrat.start) ;
				obrat.finish	= makeLatLng(obrat.finish) ;
				obrat.bounds	= new google.maps.LatLngBounds(	new google.maps.LatLng(obrat.bounds.south, obrat.bounds.west), 
																new google.maps.LatLng(obrat.bounds.north, obrat.bounds.east) ) ;
				tracksArray.	push	(new trackClass(MAPPA, {}, obrat));
				MAPPA.fitBounds(obrat.bounds) ;
				POVmarker.setPosition(obrat.start) ;
			}
			else
				getIPLocation(MAPPA, POVmarker, defaultLocation) ;
		}
	}

	function getFigures(hash) {
		const fname = "./figures/" + hash + ".json" ;
		const X = new XMLHttpRequest();
		X.open("GET", fname, true);
		X.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
		X.send(null);
		X.close;
		X.onload = function () {
			let obrat ;
			if ( (X.readyState == 4 && X.status == "200") && ( obrat = tryParsing(X.responseText) ) ) 	// if file exists && OK parsed
			{
				const jp = obrat.figgas ;
				let figga = {} ;
				for (let i = 0; i < jp.length; i++)  {
					switch ( jp[i].name ) {
						case "Polyline":
							figga = makePolyline(jp[i], true) ;
							break ;
						case "Polygon":
							figga = makePolygon(jp[i]) ;
							break ;
						case "Rectangle":
							figga = makeRectangle(jp[i]) ;
							break ;
						case "Circle":
							figga = makeCircle(jp[i]) ;
							break ;
						case "Text":
							figga = makeText(jp[i]) ;
							break ;
					}
					figArray.push(figga) ;
				}

				const loc = new google.maps.LatLng(obrat.lat, obrat.lng) ;
				MAPPA.setCenter(loc) ;
				MAPPA.setZoom(obrat.zoom) ;
				if ( obrat.mapName != undefined )
					mapName.value = obrat.mapName ;
				
				POVmarker.setPosition(loc) ;
				getOwnLoco(obrat.lat, obrat.lng, "URL") ;
				setLocationForm.style.display = "none" ;
				hlpTxt.innerHTML = infoWin2D ;
				promptString.innerHTML = "Клик правой клавишей мыши - редактировать фигуру" ;
				return obrat ;
			}
			else
				getIPLocation(MAPPA, MAPPA.getCenter(), defaultLocation) ;
				promptString.innerHTML = "" ;
			return null ;
		}
	}

	// toPIC.	onclick = function() { 
		// if  ( (lineParametersForm.style.display == "block")||(txtForm.style.display == "block") ) return ;
		// const mp = document.getElementById('mapCell') ;

		// const canvas = document.getElementById('canva');
			// canvas.width  = mp.clientWidth;
			// canvas.height = mp.clientHeight;
		// mp.style.display 		= 	"none" ;
		// canvas.style.display 	=	"block" ;

		// figs2Pic (canvas) ;
		
		
	// } ;	
	
	
function figs2Pic (canvas) {
		canvas.style.zIndex   = 10;
		const ctx = canvas.getContext('2d') ;
		const mapBounds = MAPPA.getBounds() ;
			const SW = mapBounds.getSouthWest() ;
			const NE = mapBounds.getNorthEast() ;
			const x0 = SW.lng() ;
			const y0 = SW.lat() ;
		const pixelWidth 	= (NE.lng() - SW.lng()) / canvas.width 	;
		const pixelHeight 	= (NE.lat() - SW.lat()) / canvas.height ;
		
		for ( let figInd = 0 ; figInd < figArray.length; figInd++) {
			const obj = figArray[figInd] ;
			switch (obj.name) {
				case "Polyline": {
					const mPath = obj.getPath().getArray() ;
					const mLine = [] ;
					ctx.strokeStyle = obj.strokeColor ;
					ctx.lineWidth 	= obj.strokeWeight ;
					for ( let i=0 ; i < mPath.length; i++) 
						mLine.push({	lat: 	mPath[i].lat(), 
										lng:	mPath[i].lng()}) ;
										
					let x = 				(mLine[0].lng - x0) / pixelWidth 	;
					let y = canvas.height - (mLine[0].lat - y0) / pixelHeight 	;
					x = Math.round(x);
					y = Math.round(y) ;
					ctx.beginPath();
					ctx.moveTo(x,y) ;
					ctx.globalAlpha = obj.strokeOpacity ;
					ctx.strokeStyle = obj.strokeColor ;
					for ( let i = 1 ; i < mPath.length; i++) {
						let x = 				(mLine[i].lng - x0) / pixelWidth 	;
						let y = canvas.height - (mLine[i].lat - y0) / pixelHeight 	;
						x = Math.round(x);
						y = Math.round(y) ;
						ctx.lineTo(x, y) ;
						ctx.stroke();
				}			}	
					break ;
				case "Polygon":	{
						const mPath = obj.getPath().getArray() ;
						const mLine = [] ;
						ctx.strokeStyle = obj.strokeColor ;
						ctx.lineWidth 	= obj.strokeWeight ;
						for ( let i=0 ; i < mPath.length; i++) 
							mLine.push({	lat: 	mPath[i].lat(), 
											lng:	mPath[i].lng()}) ;
						let x = 				(mLine[0].lng - x0) / pixelWidth 	;
						let y = canvas.height - (mLine[0].lat - y0) / pixelHeight 	;
							x = Math.round(x);
							y = Math.round(y) ;
						ctx.beginPath();
						ctx.moveTo(x,y) ;
						for ( let i = 1 ; i < mPath.length; i++) {
							let x = 				(mLine[i].lng - x0) / pixelWidth 	;
							let y = canvas.height - (mLine[i].lat - y0) / pixelHeight 	;
							x = Math.round(x);
							y = Math.round(y) ;
							ctx.lineTo(x, y) ;
			//				ctx.stroke();
						}
						ctx.closePath();
						ctx.fillStyle=obj.strokeColor ;
						ctx.globalAlpha = obj.fillOpacity ;
					ctx.fill();		}
					break ;
				case "Rectangle":	{
					const rectBounds = obj.getBounds() ;
					const rectSW = rectBounds.getSouthWest() ;
					const rectNE = rectBounds.getNorthEast() ;	
					ctx.fillStyle	=	obj.strokeColor ;
					ctx.globalAlpha = 	obj.fillOpacity ;
					const dd = rectSW.lng() - x0 ;
					ctx.fillRect(	Math.round(					(rectSW.lng() - x0) 			/ pixelWidth), 
									Math.round(canvas.height - 	(rectNE.lat() - y0) 			/ pixelHeight), 
									Math.round(					(rectNE.lng() - rectSW.lng()) 	/ pixelWidth), 	
					Math.round(					(rectNE.lat() - rectSW.lat()) 	/ pixelHeight) ) ;	}
					break ;
				case "Circle": {
					const center 		= obj.getCenter() ;
					const radius 		= obj.getRadius() ;
						const cX = center.lng() - x0 ;
						const cY = center.lat() - y0 ;
						const toNorth = google.maps.geometry.spherical.computeOffset(center, radius, 0 ) ;	// верхний край круга
						const rad = toNorth.lat() - center.lat() ;
					ctx.fillStyle	=	obj.strokeColor ;
					ctx.globalAlpha = 	obj.fillOpacity ;
					ctx.beginPath();
					ctx.arc(					cX / pixelWidth,
								canvas.height - cY / pixelHeight,
												rad / pixelHeight,						// get radius
								0*Math.PI, 2*Math.PI, true);
					ctx.fill(); }
					break ;
				case "Text": {
					const position = obj.position ;
					const label = obj.label ;
					const txt 	= label.text ;
						ctx.fillStyle 	= label.color;
						ctx.font 		= label.fontSize + " sans-serif";
						ctx.textAlign 	= "center";
						ctx.textBaseline 	= "middle";
					ctx.fillText(	txt, 
														(position.lng() - x0) / pixelWidth,
									canvas.height - 	(position.lat() - y0) / pixelHeight) ;	}
					break ;
				
			}
		
		}
		
		for ( let j=0 ; j < tracksArray.length; j++) {
			const obj = tracksArray[j].line ;
			const mPath = obj.track.path ;
			const mLine = [] ;
			ctx.strokeStyle = obj.strokeColor ;
			ctx.lineWidth 	= obj.strokeWeight ;
			for ( let i=0 ; i < mPath.length; i++) 
				mLine.push({	lat: 	mPath[i].lat(), 
								lng:	mPath[i].lng()}) ;
								
			let x = 				(mLine[0].lng - x0) / pixelWidth 	;
			let y = canvas.height - (mLine[0].lat - y0) / pixelHeight 	;
			x = Math.round(x);
			y = Math.round(y) ;
			ctx.beginPath();
			ctx.moveTo(x,y) ;
			ctx.globalAlpha = obj.strokeOpacity ;
			ctx.strokeStyle = obj.strokeColor ;
			for ( let i = 1 ; i < mPath.length; i++) {
				let x = 				(mLine[i].lng - x0) / pixelWidth 	;
				let y = canvas.height - (mLine[i].lat - y0) / pixelHeight 	;
				x = Math.round(x);
				y = Math.round(y) ;
				ctx.lineTo(x, y) ;
				ctx.stroke();
			}
		}
		for ( let j=0 ; j < multilinesArray.length; j++) {
			const obj = multilinesArray[j].line ;
			const mPath = obj.getPath().getArray() ;
			const mLine = [] ;
			ctx.strokeStyle = obj.strokeColor ;
			ctx.lineWidth 	= obj.strokeWeight ;
			for ( let i=0 ; i < mPath.length; i++) 
				mLine.push({	lat: 	mPath[i].lat(), 
								lng:	mPath[i].lng()}) ;
								
			let x = 				(mLine[0].lng - x0) / pixelWidth 	;
			let y = canvas.height - (mLine[0].lat - y0) / pixelHeight 	;
			x = Math.round(x);
			y = Math.round(y) ;
			ctx.beginPath();
			ctx.moveTo(x,y) ;
			ctx.globalAlpha = obj.strokeOpacity ;
			ctx.strokeStyle = obj.strokeColor ;
			for ( let i = 1 ; i < mPath.length; i++) {
				let x = 				(mLine[i].lng - x0) / pixelWidth 	;
				let y = canvas.height - (mLine[i].lat - y0) / pixelHeight 	;
				x = Math.round(x);
				y = Math.round(y) ;
				ctx.lineTo(x, y) ;
				ctx.stroke();
			}
		}
		for ( let j=0 ; j < polygonesArray.length; j++) {
			const obj = polygonesArray[j].line ;
			const mPath = obj.getPath().getArray() ;
			const mLine = [] ;
			ctx.strokeStyle = obj.strokeColor ;
			ctx.lineWidth 	= obj.strokeWeight ;
			for ( let i=0 ; i < mPath.length; i++) 
				mLine.push({	lat: 	mPath[i].lat(), 
								lng:	mPath[i].lng()}) ;
			let x = 				(mLine[0].lng - x0) / pixelWidth 	;
			let y = canvas.height - (mLine[0].lat - y0) / pixelHeight 	;
				x = Math.round(x);
				y = Math.round(y) ;
			ctx.beginPath();
			ctx.moveTo(x,y) ;
			for ( let i = 1 ; i < mPath.length; i++) {
				let x = 				(mLine[i].lng - x0) / pixelWidth 	;
				let y = canvas.height - (mLine[i].lat - y0) / pixelHeight 	;
				x = Math.round(x);
				y = Math.round(y) ;
				ctx.lineTo(x, y) ;
//				ctx.stroke();
			}
			ctx.closePath();
			ctx.fillStyle=obj.strokeColor ;
			ctx.globalAlpha = obj.fillOpacity ;
			ctx.fill();	
		}
		for ( let j=0 ; j < rectanglesArray.length; j++) {
			const obj = rectanglesArray[j].rectus ;
			const rectBounds = obj.getBounds() ;
			const rectSW = rectBounds.getSouthWest() ;
			const rectNE = rectBounds.getNorthEast() ;	
			ctx.fillStyle	=	obj.strokeColor ;
			ctx.globalAlpha = 	obj.fillOpacity ;
			const dd = rectSW.lng() - x0 ;
			ctx.fillRect(	Math.round(					(rectSW.lng() - x0) 			/ pixelWidth), 
							Math.round(canvas.height - 	(rectNE.lat() - y0) 			/ pixelHeight), 
							Math.round(					(rectNE.lng() - rectSW.lng()) 	/ pixelWidth), 	
							Math.round(					(rectNE.lat() - rectSW.lat()) 	/ pixelHeight) ) ;
		}
		for ( let j=0 ; j < circlesArray.length; j++) {
			const obj = circlesArray[j].krug ;
			const center 		= obj.getCenter() ;
			const radius 		= obj.getRadius() ;
				const cX = center.lng() - x0 ;
				const cY = center.lat() - y0 ;
				const toNorth = google.maps.geometry.spherical.computeOffset(center, radius, 0 ) ;	// верхний край круга
				const rad = toNorth.lat() - center.lat() ;
			ctx.fillStyle	=	obj.strokeColor ;
			ctx.globalAlpha = 	obj.fillOpacity ;
			ctx.beginPath();
			ctx.arc(					cX / pixelWidth,
						canvas.height - cY / pixelHeight,
										rad / pixelHeight,						// get radius
						0*Math.PI, 2*Math.PI, true);
			ctx.fill();
		}
		for ( let j=0 ; j < textsArray.length; j++) {
			const obj = textsArray[j];
			const position = obj.position ;
			const label = obj.label ;
			const txt 	= label.text ;
				ctx.fillStyle 	= label.color;
				ctx.font 		= label.fontSize + " sans-serif";
				ctx.textAlign 	= "center";
				ctx.textBaseline 	= "middle";
			ctx.fillText(	txt, 
												(position.lng() - x0) / pixelWidth,
							canvas.height - 	(position.lat() - y0) / pixelHeight) ;
		}
		for ( let j=0 ; j < arrowsArray.length; j++) {
			const obj = arrowsArray[j];
			const position = obj.getPosition() ;
			const label = obj.getLabel() ;
			const txt 	= label.text ;
				ctx.fillStyle 	= label.color;
				ctx.font 		= label.fontSize + " sans-serif";
				ctx.textAlign 	= "center";
				ctx.textBaseline 	= "middle";
			ctx.fillText(	txt, 
												(position.lng() - x0) / pixelWidth,
							canvas.height - 	(position.lat() - y0) / pixelHeight) ;
		}
}	



	
	// https://a/#T2022-01-20/16426693291608225