var iWx = 0.6
var iWy = 0.3

function resetAll() {
	AllRects.length = null ;
	mapSkin = "" ;
	
	for (var i = 0; i < iniHiddenButts.length; i++)
		iniHiddenButts[i].style.display = "none" ;
	
	closeButts () ; 
	
}

function setFirstRectangle() {
	
//	debugger ;	
	
		{ 	let centerLat = MAPPA.getCenter().lat() ;
			let centerLng = MAPPA.getCenter().lng() ;
			let dLat = 0.1 ;
			let dLng = 0.2 ;
			let sw = new google.maps.LatLng(centerLat - dLat, centerLng - dLng) ;					// rectangle 2*dLat/2*dLng sizes
			let ne = new google.maps.LatLng(centerLat + dLat, centerLng + dLng) ;
			let rectaBounds = new google.maps.LatLngBounds(sw, ne) ;										
			MAPPA.fitBounds(rectaBounds) ; 															// fit MAPPA size to max include rectangle
			var fR = setAreaRectangle(sw, ne) ; }
	
						isHelpOn = false ; showHelps() ;
						var s = window.location.hash.slice(1) ;
						var dec = decodeURI (s) ;
						var isHash = tryParsing (dec) ;				// parse coords from URL hash
						if ( isHash ) {
							var sw 	= new google.maps.LatLng(isHash.rB.south, isHash.rB.west) ;
							var ne 	= new google.maps.LatLng(isHash.rB.north, isHash.rB.east) ;
							var	rs 	= new google.maps.LatLngBounds(sw, ne) ;				// compose rectanle boundaries
							var m 	= new google.maps.LatLng(isHash.mC.lat, isHash.mC.lng) ;			// compose map center
							var e 	= new google.maps.LatLng(isHash.eP.lat, isHash.eP.lng) ;			// compose eYe position
							var Z	= isHash.Z ;
							MAPPA.setCenter(m) ;
							MAPPA.setZoom(Z) ;
							POVmarker.setPosition(e) ;
							fR.setBounds(rs) ;
							isVeryBeginning = false ;
						}

				function putHashedURL() { 				
					window.location.hash = "#" + composeURL(MAPPA, POVmarker, fR) ; }
				google.maps.event.addListener(	MAPPA, 'dragend', 
					function (event) { 
							putHashedURL() ;
							let coo = MAPPA.getCenter() ;
							MAPPA.setCenter(coo) ;
						}) ;
				google.maps.event.addListener(	POVmarker, "dragend", 
					function (event) { putHashedURL() }) ;		
				google.maps.event.addListener(	fR, "bounds_changed", 
					function (event) { putHashedURL() }) ;

	return fR ;
}
// #######################################################################################################
function setAreaRectangle(recSW, recNE) {
	var	areaRecta = new google.maps.Rectangle ({ 									// создаём новый объект 
		editable: true,
		draggable: true,
		strokeWeight: 2
	} ) ;
	
	var mapBounds = MAPPA.getBounds() ;	
	
	var	rectaBounds = new google.maps.LatLngBounds(recSW, recNE ) ;					
	areaRecta.setBounds(rectaBounds) ;												// задаём границы, из параметров
	areaRecta.setMap(MAPPA) ;
	

	areaRecta.rectWi = new google.maps.Marker({										// создаём 2 маркера для вывода размеров прямоугольника
                map: MAPPA,
                icon: areaMarkerImage,
                opacity: 0.9
	 }) ;
	areaRecta.rectHe = new google.maps.Marker({
                map: MAPPA,
                icon: areaMarkerImage,
                opacity: 0.9
	 }) ;
	google.maps.event.addListener(areaRecta, 'bounds_changed', showRectSizes) ;		// добавляем слушатель для вывода размеров
	showRectSizes() ;
	
	function showRectSizes() {
			var rectBounds = areaRecta.getBounds() ;

			var NW = new google.maps.LatLng( rectBounds.getNorthEast().lat() , rectBounds.getSouthWest().lng()) ;
			
			var poluDlinaPos  = interpolate(NW,rectBounds.getNorthEast(), 0.5) ;
			var poluVusotaPos = interpolate(NW,rectBounds.getSouthWest(), 0.45) ;
			var dlina  = computeDistanceBetween(NW,rectBounds.getNorthEast()) ;
			var vusota = computeDistanceBetween(NW,rectBounds.getSouthWest()) ;
			
			areaRecta.rectWi.setPosition(poluDlinaPos) ;
			areaRecta.rectWi.setLabel({text: dlina.toFixed(0) + " m", fontSize: '16px', color: 'Blue', fontWeight: '600' }) ;
			areaRecta.rectHe.setPosition(poluVusotaPos) ;
			areaRecta.rectHe.setLabel({text: vusota.toFixed(0) + " m", fontSize: '16px', color: 'Blue', fontWeight: '600' }) ;

 	} ;
	
	areaRecta.sqMtr = function() {
			var bnd = this.getBounds() ;
			var NE = bnd.getNorthEast() ;				//	северо-восток
			var SW = bnd.getSouthWest() ;				//	юго-запад
			var N = NE.lat() ;
			var E = NE.lng() ;
			var S = SW.lat() ;
			var W = SW.lng() ;
			var SE = new google.maps.LatLng(S, E);
			var NW = new google.maps.LatLng(N, W);
			var perimeter = [SW, NW, NE, SE, SW] ;
			var area = google.maps.geometry.spherical.computeArea(perimeter) ;
			return (area) ;
	}	
	areaRecta.getCorners = function() {
			var bnd = this.getBounds() ;
			var NE = bnd.getNorthEast() ;				//	северо-восток
			var SW = bnd.getSouthWest() ;				//	юго-запад
			var N = NE.lat().toFixed(2) ;
			var E = NE.lng().toFixed(2) ;
			var S = SW.lat().toFixed(2) ;
			var W = SW.lng().toFixed(2) ;
			var str = S + "," + W + "," + N + "," + E ;
			return str ; 
	}
	
//	mostDistant = getMostDistant().dist ;
	
	return(areaRecta) ;
}


// *********************************************************************************************************************************
function drawGorizont(horror) {
	let hlen = horror.length ;
	
	let path = [] ;
	
	for (let i=0; i < hlen; i++) 
		path.push(horror[i].maxViewPnt.location) ;
	
	let multiPath = [] ;
	multiPath.push(path) ;
	
	let hids = horror.hiddens ;
	for (let i=0; i < hids.length; i++) 
		multiPath.push(hids[i]) ;

	holesGone.setGeometry( new google.maps.Data.Polygon( multiPath ) ) ;
}
	
function restoreRectObj (obj) {						// функция преобразует числовые координаты в LatLng в самом объекте
	
	for (i=0, key = obj.dots; i < key.length; i++) 
			if ( ( typeof key[i].lat == "number" ) &&( typeof key[i].lng == "number" ) ) {			// точки в прямоугольнике
					var lt = key[i].lat ; var lg = key[i].lng ;
					key[i] = new google.maps.LatLng(lt, lg);
				}
	for (i=0 ; i < obj.elevations.length; i++) 														// объекты с высотами
	{		var key = obj.elevations[i].location ;
			if ( ( typeof key.lat == "number" ) &&( typeof key.lng == "number" ) ) {
					var lt = key.lat ; var lg = key.lng ;
					obj.elevations[i].location = new google.maps.LatLng(lt, lg);
				}}
	for (i=0, key=obj.path; i < key.length; i++) 				
			if ( ( typeof key[i].lat == "number" ) &&( typeof key[i].lng == "number" ) ) {			// контур прямоугольника
					var lt = key[i].lat ; var lg = key[i].lng ;
					key[i] = new google.maps.LatLng(lt, lg);
				}
	
			if ( ( typeof obj.SW.lat == "number" ) &&( typeof obj.SW.lng == "number" ) ) {			// углы прямоугольника
					var lt = obj.SW.lat ; var lg = obj.SW.lng ;
					obj.SW = new google.maps.LatLng(lt, lg);
				}
			if ( ( typeof obj.SE.lat == "number" ) &&( typeof obj.SE.lng == "number" ) ) {
					var lt = obj.SE.lat ; var lg = obj.SE.lng ;
					obj.SE = new google.maps.LatLng(lt, lg);
				}
			if ( ( typeof obj.NW.lat == "number" ) &&( typeof obj.NW.lng == "number" ) ) {
					var lt = obj.NW.lat ; var lg = obj.NW.lng ;
					obj.NW = new google.maps.LatLng(lt, lg);
				}
			if ( ( typeof obj.NE.lat == "number" ) &&( typeof obj.NE.lng == "number" ) ) {
					var lt = obj.NE.lat ; var lg = obj.NE.lng ;
					obj.NE = new google.maps.LatLng(lt, lg);
				}
		let pLine = new google.maps.Polyline({
				 clickable: false,
				 strokeColor: '#0000CC',
				 strokeOpacity: 0.2,
				 map: MAPPA,
				 path: obj.path
			});	
}

	function okrugl(num, dig) {
			var s = num.toFixed(dig) ;
			var pF = parseFloat(s)
			return  pF ;
	}
