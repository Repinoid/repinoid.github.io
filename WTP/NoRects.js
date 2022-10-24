function fOut (karta) {
	let center = karta.getCenter() ;
	let str = center.lat().toFixed(2) + ',' + center.lng().toFixed(2) + ',' + karta.getZoom() + ".json";
	return str ;
}

function initiation () {
	
			function putHashedURL() {
				window.location.hash = "#" + composeURL() ; 
			}
			google.maps.event.addListener(MAPPA	, "bounds_changed", 
				function (event) { putHashedURL() }
			) ;
			
			let locU = getLocationFromURL () ;

			if (locU) 
				getMainElevator(2) ;
			return ;
}

function getMainElevator(hmApiCalls) {
		 
		var loadBlink = document.getElementById('blink_text') ;
		 
		AllRects.length = null ;
		mapSkin = "" ;
	
		foutName  = fOut(MAPPA) ;
		let X = new XMLHttpRequest();
		X.open("GET", "WTP/Elevs/" + foutName, true);
		X.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
		X.send(null);
		X.close;
		
		X.onload = function () 
		{
			loadBlink.style.display = "block" ;
			var malay ;
			if ( (X.readyState == 4 && X.status == "200") && ( malay = tryParsing(X.responseText) ) ) 	// if file exists && OK parsed
//			if ( null  ) 	// if file exists && OK parsed
			{
				isVeryBeginning = false ;	
				for ( let i = 0; i < malay.length; i++ )
				{
					restoreRectObj (malay[i]) ;
					AllRects.push(malay[i]) ;					// добавляем объект с высотами в общий массив				
				}
				POV = getPointWithElevation(POVmarker.position, AllRects) ;
				drawGorizont(  getHorizonT(POV, AllRects) )   ;
				loadBlink.style.display = "none" ;
				// setTimeout(() => 
					// {
						// document.getElementById("butt3D").onclick() ;
					// }, 2000);
			} 
				else 														// если файла с данными нет (или сбой)
				{
					loadBlink.style.display = "block" ;
					let proms = [];
					let array512 = [] ;
					let firstElevations = new composeRectangleDotsConstructor(MAPPA, hmApiCalls * 512) ; // получаем позиции *512 точек по текущим границам карты
					
					for (let i=0; i < hmApiCalls; i++) {
						array512[i] = firstElevations.dots.slice(i*512, (i+1) * 512);
						proms[i] = getLocationsPromise(array512[i]);
					}
					
					Promise.all(proms).then(function(returns) 
					{
						let eles = [] ;
						for (let i=0; i < returns.length; i++)
							eles = eles.concat(returns[i]) ;						//  arrays of elepoints to one
						firstElevations.elevations = eles ;			
						AllRects.push(firstElevations) ;							// добавляем объект с высотами в общий массив	
						POV = getPointWithElevation(POVmarker.position, AllRects) ;
						drawGorizont(  getHorizonT(POV, AllRects) )   ;
							/**/ {	let rectsJson = JSON.stringify(AllRects);				// запись объекта в файл /////////////////
							/**/	let xmlhttp= new XMLHttpRequest();
							/**/	let phpFile = "saveElevs.php";
							/**/	xmlhttp.open("PUT", phpFile, true);
							/**/	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Отправляем кодировку						
							/**/	xmlhttp.send(foutName + rectsJson);
							/**/	xmlhttp.close;		}								//////////////////////////////////////////

						loadBlink.style.display = "none" ;
						// setTimeout(() => 
							// {
								// document.getElementById("butt3D").onclick() ;
							// }, 1000);

					})
				}
		}
		
	for (var i = 0; i < iniHiddenButts.length; i++)
			iniHiddenButts[i].style.display = "block" ;
	hlpRect.style.display = 'none' ;
	window.location.hash = "#" + composeURL() ; 	
	POVmarker.setPosition(MAPPA.getCenter()) ; 
}

class composeRectangleDotsConstructor {
		constructor (rectus, hmPoints) 
		{
			var bnd = rectus.getBounds() ;
			
				var NE = bnd.getNorthEast() ;				//	северо-восток
				var SW = bnd.getSouthWest() ;				//	юго-запад
				
				
				
				var N = NE.lat() ;
				var E = NE.lng() ;
				var S = SW.lat() ;
				var W = SW.lng() ;
			var dLat = N - S;
			var dLng = E - W;
			var proportion = dLng / dLat ;
				var rows = Math.floor( Math.sqrt(hmPoints / proportion ) );
				var columns = Math.floor( Math.sqrt(hmPoints * proportion ) ) ;

			var dots = [];
			
			for (var j = 0; j < rows; j++) 
				for (var i = 0; i < columns; i++)  						// сначала Columns !!!
				{
					var lng = W + dLng / (columns-1) * i;
					var lat = S + dLat / (rows-1) * j;  
					var mPoint = new google.maps.LatLng(lat, lng);
					dots.push(mPoint);
				}
			this.dots = dots;
			this.dLat = dLat;
			this.dLng = dLng;
			this.SW = new google.maps.LatLng(S, W);
			this.NE = new google.maps.LatLng(N, E);
			this.SE = new google.maps.LatLng(S, E);
			this.NW = new google.maps.LatLng(N, W);
			this.elevations = [];
			this.Rows = rows ;
			this.Columns = columns ;
			this.pointsNumber = rows * columns ;
			this.path = [this.SW, this.NW, this.NE, this.SE, this.SW] ;
			pLine = new google.maps.Polyline({
				 clickable: false,
				 strokeColor: '#0000CC',
				 strokeOpacity: 0.07,
				 map: MAPPA,
				 path: this.path
			});	
			var areal = google.maps.geometry.spherical.computeArea(this.path) ;
			this.density = areal/this.pointsNumber ;
		}
		deletePline() {
			pLine.setMap(null) ;
		}
}
// ***************************************************************************************************
// https://f0/#%7B%22mC%22:%7B%22lat%22:55.755826,%22lng%22:37.6172999%7D,%22Zoo%22:12%7D
// https://f0/#%7B%22mC%22:%7B%22lat%22:35.216,%22lng%22:33.889%7D,%22Zoo%22:9%7D  // cyprus
// https://f0/#%7B%22mC%22:%7B%22lat%22:34.707,%22lng%22:33.023%7D,%22Zoo%22:12%7D lemesos
// https://whatthepeak.com/#%7B%22mC%22:%7B%22lat%22:55.756,%22lng%22:37.617%7D,%22Zoo%22:12%7D moscow
// https://f0/#%7B%22mC%22:%7B%22lat%22:34.852,%22lng%22:32.474%7D,%22Zoo%22:13%7D peyia
//https://f0/#%7B%22mC%22:%7B%22lat%22:43.681,%22lng%22:40.21%7D,%22Zoo%22:13%7D kr pol

// https://a/#%7B%22mC%22:%7B%22lat%22:55.752,%22lng%22:37.616%7D,%22Zoo%22:12,%22cam%22:%7B%22x%22:18.33,%22y%22:3.85,%22z%22:-3,%22rX%22:-2.7,%22rY%22:0.94,%22rZ%22:2.78%7D,%22sharp%22:10%7D


// limassol 
//https://whatthepeak.com/#VQmCQ:VQlatQ:34.71UQlngQ:33.02WUQZooQ:12UQcamQ:VQxQ:-15.62UQyQ:71.66UQzQ:-1.63UQrXQ:-2.04UQrYQ:-0.15UQrZQ:-2.85WUQsharpQ:2W
//elbrus
//https://whatthepeak.com/#VQmCQ:VQlatQ:43.35UQlngQ:42.45WUQZooQ:10UQcamQ:VQxQ:7.19UQyQ:27.03UQzQ:-23.2UQrXQ:-2.65UQrYQ:0.08UQrZQ:3.1WUQsharpQ:2W
// kortina
//https://whatthepeak.com/#VQmCQ:VQlatQ:46.57UQlngQ:11.98WUQZooQ:10UQcamQ:VQxQ:17.94UQyQ:44.95UQzQ:-1.31UQrXQ:-2.11UQrYQ:0.15UQrZQ:2.91WUQsharpQ:1W

//MH17 https://whatthepeak.com/#VQmCQ:VQlatQ:48.142UQlngQ:38.638WUQZooQ:12UQcamQ:VQxQ:-0.71UQyQ:22.05UQzQ:-1.87UQrXQ:-1.77UQrYQ:0.15UQrZQ:2.53WUQsharpQ:4W

// https://whatthepeak.com/#VQmCQ:VQlatQ:48.079UQlngQ:38.576WUQZooQ:11UQcamQ:VQxQ:-36.28UQyQ:33.11UQzQ:-18.76UQrXQ:-2.27UQrYQ:-0.27UQrZQ:-2.84WUQsharpQ:3W
 // https://whatthepeak.com/#VQmCQ:VQlatQ:48.072UQlngQ:38.791WUQZooQ:11UQcamQ:VQxQ:3.26UQyQ:13.96UQzQ:-2.87UQrXQ:-1.84UQrYQ:0.13UQrZQ:2.7WUQsharpQ:3W

// mont https://whatthepeak.com/#VQmCQ:VQlatQ:45.833UQlngQ:6.865WUQZooQ:10UQcamQ:VQxQ:-7.1UQyQ:11.67UQzQ:-16.27UQrXQ:-2.52UQrYQ:-0.34UQrZQ:-2.91WUQsharpQ:4W