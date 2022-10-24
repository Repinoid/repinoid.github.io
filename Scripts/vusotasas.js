function getLocationsPromise(locationsArray) {
	let prms = new Promise ( function(resolve, reject) {
		function getLocationsPromise(locationsArray) {
			let elevatoras = new google.maps.ElevationService;
				elevatoras.getElevationForLocations(	
					{'locations': locationsArray}, 
					function (elevations, status) {
						if (status == google.maps.ElevationStatus.OK)
							resolve(elevations);						// return elevaions to .then function
						else
							if (status == google.maps.ElevationStatus.OVER_QUERY_LIMIT) {		// pause 111 ms 				 
								setTimeout(function () {getLocationsPromise(locationsArray) ;}, 111 );
							}	
							else { 
								reject(status); 
							}	
					}
				);
		}
		getLocationsPromise(locationsArray) ;
	}) ;
	return prms ;
}
// -----------------------------------------------------------------------------------------------------------------------
function getElevatoras (kartas, hmApiCalls, cBack) {
	document.getElementById("delitel").value = 0 ;
	// if (globusas.hasOwnProperty("bnd")) {
		// const gBnd = globusas.bnd ; 
		// const gNE = gBnd.getNorthEast() ;							
		// const gSW = gBnd.getSouthWest() ;
		// const kNE = kartas.getNorthEast() ;					
		// const kSW = kartas.getSouthWest() ;
		// if ( (gNE.lat() == kNE.lat()) && (gNE.lng() == kNE.lng()) && (gSW.lat() == kSW.lat()) && (gSW.lng() == kSW.lng()) ) {
			// open3D() ;
			// const cent = MAPPA.getCenter() ;
			// getOwnLoco(cent.lat(), cent.lng(), "Repeat") ;
				// const canvas = document.getElementById('canva');
				// figs2Pic (canvas) ;
			
			// return ;
		// }
	// }
	
	if (pLine)
		pLine.setMap(null) ;
	globusas = {} ;
					let loadBlink = document.getElementById('blink_text') ;  // BLINK ON #############
					loadBlink.style.display = "block" ;
					
		foutName  = fOut(MAPPA) ;
		let X = new XMLHttpRequest();
		X.open("GET", "./SAVES/" + foutName, true);
		X.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
		X.send(null);
		X.close;
	X.onload = function () {
		var malay ;
	if ( (X.readyState == 4 && X.status == "200") && ( malay = tryParsing(X.responseText) ) ) {	// if file exists && OK parsed
//			restoreRectObj (malay) ;
				const SW = new google.maps.LatLng(malay.B.south, malay.B.west);	
				const NE = new google.maps.LatLng(malay.B.north, malay.B.east);	
				const banda = new google.maps.LatLngBounds(SW, NE) ;
				const ccc = new composeRectangleDotsConstructor(banda, malay.C, malay.R) ;
				for ( let i=0 ; i < ccc.pointsNumber; i++) {
					ccc.elevations[i] = {} ;
					ccc.elevations[i].location  = ccc.dots[i] ;
					ccc.elevations[i].elevation = malay.H[i] ;
				}
				globusas = ccc ;
			findMaxMinPoints(globusas) ;
			dataURL = malay.D ;
				globusas.dataURL = dataURL ;			
			mapFrags2Pic (mapCell) ;
//				obschak.compost() ;
//				open3D() ;
			
			if ( (cBack != undefined) && (typeof cBack === "function") )
				cBack(firstElevations) ;
						loadBlink.style.display = "none" ;						// BLINK OFF #############
			let str = "userLocations.php?LOAD=R" + 	MAPPA.getCenter().lat().toFixed(5) + ";" + 
													MAPPA.getCenter().lng().toFixed(5) + ";" + 
													MAPPA.getZoom() + ";" ;
			writeLocations(str) ;

			return ;
	}
	else {
		let proms = [];
		let array512 = [] ;
		let firstElevations = new composeRectangleDotsConstructor(kartas, hmApiCalls * 512) ; // получаем позиции *512 точек по текущим границам карты
			for (let i=0; i < hmApiCalls; i++) {
				array512[i] = firstElevations.dots.slice(i*512, (i+1) * 512);
				proms[i] = getLocationsPromise(array512[i]);
			}
		Promise.all(proms).then(function(returns) {
			let elevasas = [] ;
			for (let i=0; i < returns.length; i++)
				elevasas = elevasas.concat(returns[i]) ;						//  arrays of elepoints to one
			firstElevations.elevations = elevasas ;
			findMaxMinPoints(firstElevations) ;
			globusas = firstElevations ;
			obschak.first = firstElevations ;
			setDelitel(5) ;
			pLine = new google.maps.Polyline({
						clickable: false,
						strokeColor: '#0000CC',
						strokeOpacity: 0.2,
						map: MAPPA,
						path: globusas.path
					});	
				mapFrags2Pic (mapCell) ;
			if ( (cBack != undefined) && (typeof cBack === "function") )
				cBack(firstElevations) ;
						loadBlink.style.display = "none" ;						// BLINK OFF #############
			let str = "userLocations.php?LOAD=O" + 	MAPPA.getCenter().lat().toFixed(5) + ";" + 
													MAPPA.getCenter().lng().toFixed(5) + ";" + 
													MAPPA.getZoom() + ";" ;
			writeLocations(str) ;

		})
	}
	}
}
//============================================================
function drawMinMaxPoints(ctx) {
		const w = globusas.clientWidth ;
		const h = globusas.clientHeight ;
			const X0 = globusas.SW.lng();		// left bottom corver
			const Y0 = globusas.SW.lat();		
		const minP = globusas.minPoint ;
		const maxP = globusas.maxPoint ;
		let dX = (minP.lng() - X0)/globusas.dLng ;
		let dY = (minP.lat() - Y0)/globusas.dLat ;
			ctx.beginPath();
			ctx.fillStyle="green";
			ctx.arc(dX*w, h - dY*h, 10, 0, 2*Math.PI) ;
			ctx.fill();
			ctx.font = "italic 10pt Arial";
			ctx.fillText(Math.floor(globusas.hMin) + " m", dX*w + 10, h - dY*h);
		ctx.beginPath();
		dX = (maxP.lng() - X0)/globusas.dLng ;
		dY = (maxP.lat() - Y0)/globusas.dLat ;
		ctx.fillStyle="red";
		ctx.arc(dX*w, h - dY*h, 10,  0, 2*Math.PI) ;
		ctx.fill();
		ctx.fillText(Math.floor(globusas.hMax) + " m", dX*w + 10, h - dY*h);
}
function findMaxMinPoints(glo) {
	glo.hMax = -13000, glo.hMin = 10000 ;
		for ( let i=0; i < glo.pointsNumber; i++) {
			if (glo.hMax < glo.elevations[i].elevation) {
				glo.hMax = glo.elevations[i].elevation ;
				glo.maxPoint = glo.elevations[i].location ;
			}
			if (glo.hMin > glo.elevations[i].elevation) {
				glo.hMin = glo.elevations[i].elevation ;
				glo.minPoint = glo.elevations[i].location ;
			}
		}
	heMin.innerText = Math.floor(globusas.hMin) ;
	heMax.innerText = Math.floor(globusas.hMax) ;
}
// -----------------------------------------------------------------------------------------------------------------------
class composeRectangleDotsConstructor {
	constructor (bnd, arg2, arg3) {								// mapasas - current map 
		this.bnd = bnd ; 	
			let NE = bnd.getNorthEast() ;							//	северо-восток
			let SW = bnd.getSouthWest() ;							//	юго-запад
			let N = NE.lat() ; let E = NE.lng() ; 
			let S = SW.lat() ; let W = SW.lng() ;
		let dLat = N - S;											// высота карты
		let dLng = E - W;											// ширина
		let proportion = dLng / dLat ;								// пропорции
		
		let rows, columns, hmPoints ;
		if ( arg3 == undefined ) {
			hmPoints = arg2 ;
			rows 	= Math.floor(Math.sqrt(hmPoints/proportion));	// вычисляем количество строк и столбцов массива точек
			columns = Math.floor(Math.sqrt(hmPoints*proportion)) ;
		}
			else {
					columns 	= arg2 ;
					rows 		= arg3 ;
			}
		let dots = [];												// массив для точек
			for (let j = 0; j < rows; j++) 
				for (let i = 0; i < columns; i++) {					// сначала перебираем Columns !!!
					let lng = W + dLng / (columns-1) * i;			// координаты точек в прямоугольнике
					let lat = S + dLat / (rows-1) * j;  
					let mPoint = new google.maps.LatLng(lat, lng);
					dots.push(mPoint);								// пихаем в массив
				}
		this.dots = dots;											// задаём поля класса
		this.dLat = dLat;
		this.dLng = dLng;
			this.SW = new google.maps.LatLng(S, W);					// точки углов
			this.NE = new google.maps.LatLng(N, E);
			this.SE = new google.maps.LatLng(S, E);
			this.NW = new google.maps.LatLng(N, W);
		this.elevations = [];										// пустой массив для записи данных из промиса высот
			this.Rows = rows ;
			this.Columns = columns ;
			this.pointsNumber = rows * columns ;
		this.path = [this.SW, this.NW, this.NE, this.SE, this.SW] ;
		// pLine = new google.maps.Polyline({
				 // clickable: false,
				 // strokeColor: '#0000CC',
				 // strokeOpacity: 0.2,
				 // map: MAPPA,
				 // path: this.path
			// });	
		let areal = google.maps.geometry.spherical.computeArea(this.path) ;
		this.density = areal/this.pointsNumber ;
	}
}
// *********************************************************************************************************
