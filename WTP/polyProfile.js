
function profilePolyLine (MAPPA) {
 
        polyLineForProfile = new google.maps.Polyline({
			  strokeColor: '#0000CC',
			  strokeOpacity: 0.4,
			  clickable: false,
			  draggable: false,
			  editable: false,
			  map: MAPPA
		});
		
		polyLineForProfile.linePath = [] ;
		polyLineForProfile.dlinaMarkers = [] ;
		var allDlina = 0 ;
		var dlina ;
		
		var areaMarkerImage = {
				url: 'WTP/IMG/dot1.gif',
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(10, 10) };
		var allDlinaImage = {
				url: 'WTP/IMG/dot1.gif',
				origin: new google.maps.Point(10, 10),
				anchor: new google.maps.Point(-15, -15) };


		var sizeMarker = new google.maps.Marker({										
						icon: areaMarkerImage,
						opacity: 0.9
					}) ;
		var allSizeMarker = new google.maps.Marker({										
						icon: allDlinaImage,
						opacity: 0.9
					}) ;
		
	 	var firstPointSetListener = MAPPA.addListener('click', function(event) {

			polyLineForProfile.linePath.push(event.latLng) ;
			google.maps.event.removeListener(firstPointSetListener);
			
			var mousemoveOnComposingListener = MAPPA.addListener('mousemove', function(event) {
					var currentPos = event.latLng ;
					var prevPoint = polyLineForProfile.linePath[polyLineForProfile.linePath.length-1] ;
					polyLineForProfile.linePath.push(currentPos) ;
					
					var poluDlinaPos = google.maps.geometry.spherical.interpolate(currentPos, prevPoint, 0.45) ;
					dlina  = google.maps.geometry.spherical.computeDistanceBetween(currentPos, prevPoint) ;
					sizeMarker.setMap(MAPPA) ;
					sizeMarker.setPosition(poluDlinaPos) ;
					sizeMarker.setLabel({text: dlina.toFixed(0) + " m", fontSize: '14px', color: '#FF0000' }) ;
					
					if ( polyLineForProfile.linePath.length > 2 ) {
						allDlina += dlina ;
						allSizeMarker.setMap(MAPPA) ;
						allSizeMarker.setPosition(currentPos) ;
						allSizeMarker.setLabel({text: allDlina.toFixed(0) + " m", fontSize: '16px', color: '#0000FF' }) ;
						allDlina -= dlina ;
					}
					polyLineForProfile.setPath(polyLineForProfile.linePath) ;
					polyLineForProfile.dlina = allDlina ;
				drawPolyLineProfile(polyLineForProfile) ;
					polyLineForProfile.linePath.pop() ;
				}) ;
			
			var nextPointSetListener = MAPPA.addListener('click', function(event) {
					polyLineForProfile.linePath.push(event.latLng) ;
					polyLineForProfile.dlinaMarkers.push(sizeMarker) ;
					polyLineForProfile.dlinaMarkers.push(allSizeMarker) ;
					allDlina += dlina ;
					sizeMarker = new google.maps.Marker({										
						icon: areaMarkerImage,
						opacity: 0.9
						}) ;
				}); 
			
			var stopLineComposingListener = MAPPA.addListener('rightclick', function(event) {
					polyLineForProfile.dlinaMarkers.push(sizeMarker) ;
					google.maps.event.removeListener(nextPointSetListener);
					google.maps.event.removeListener(stopLineComposingListener);
					google.maps.event.removeListener(mousemoveOnComposingListener);
					polyLineForProfile.setOptions({editable: true, draggable: true }) ;
							google.maps.event.addListener(polyLineForProfile, "mouseout", function() {
								var plPath = this.getPath().getArray()  ;
								for (i=0; i < polyLineForProfile.dlinaMarkers.length; i++)
									polyLineForProfile.dlinaMarkers[i].setMap(null) ;
								polyLineForProfile.dlinaMarkers.length = 0 ;
								allDlina = 0 ;
								for (i=0; i < plPath.length-1; i++) {
										var poluDlinaPos = google.maps.geometry.spherical.interpolate(plPath[i], plPath[i+1] , 0.45) ;
										dlina  = google.maps.geometry.spherical.computeDistanceBetween(plPath[i], plPath[i+1]) ;
										sizeMarker = new google.maps.Marker({										
											icon: areaMarkerImage,
											opacity: 0.9
											}) ;
										sizeMarker.setMap(MAPPA) ;
										sizeMarker.setPosition(poluDlinaPos) ;
										sizeMarker.setLabel({text: dlina.toFixed(0) + " m", fontSize: '14px', color: '#FF0000' }) ;	
										allDlina += dlina ;
										polyLineForProfile.dlinaMarkers.push(sizeMarker) ;
								}
								allSizeMarker.setMap(MAPPA) ;
								allSizeMarker.setPosition(plPath[plPath.length-1]) ;
								allSizeMarker.setLabel({text: allDlina.toFixed(0) + " m", fontSize: '16px', color: '#0000FF' }) ;
								polyLineForProfile.dlinaMarkers.push(allSizeMarker)
								polyLineForProfile.dlina = allDlina ;
							drawPolyLineProfile(polyLineForProfile) ;
						}) ;
				}) ;
				
		});
		
		polyLineForProfile.close = function () {
					if ( ! polyLineForProfile )
						return null ; 
					if ( ! polyLineForProfile.dlinaMarkers )
						return null ;
					if ( ! polyLineForProfile.linePath )
						return null ; 
					
					for ( var i = 0 ; i < polyLineForProfile.dlinaMarkers.length; i++)
						polyLineForProfile.dlinaMarkers[i].setMap(null) ;
					polyLineForProfile.dlinaMarkers.length = 0 ;
					polyLineForProfile.linePath.length = 0 ;
					polyLineForProfile.setMap(null) ;
		}
		
		
		
		return polyLineForProfile ;
}	
// ***********************************
function composePolyProfilePointsArray(polyLineForProfile) {
	
	var pntArray = [] ;
	var Path = polyLineForProfile.getPath().getArray()  ;
	if ( Path.length == 0 )
		return null ;
	var dlina = polyLineForProfile.dlina ;
	if ( dlina == 0 )
		return null ;
	var otrezokEnd = {location:null, elevation:null} ;
	
	var dStep = dlina / (CanvaWid - Path.length)  ;
	for (i=0; i < Path.length-1; i++) {	
		var otrBeg = Path[i] ;
		var otrEnd = Path[i+1] ;
		var ugol  = google.maps.geometry.spherical.computeHeading(otrBeg, otrEnd) ;
		var otrDlina = google.maps.geometry.spherical.computeDistanceBetween(otrBeg, otrEnd) ;
		var hmSteps = Math.floor(otrDlina / dStep) ; 
		for ( j=0; j < hmSteps; j++) {
				var pnt = google.maps.geometry.spherical.computeOffset(otrBeg, j*dStep, ugol) ;
				var pntWele = getPointWithElevation(pnt, AllRects) ;
				pntArray.push(pntWele) ;
		}
		pntArray.push(otrezokEnd) ;
		
	}
	maxAnInd.innerHTML = maximumEle.elevation.toFixed(0) ;
	minAnInd.innerHTML = minimumEle.elevation.toFixed(0) ;

	return pntArray ;
}
function closePolyProfileLine(polyLineForProfile) {
	if ( ! polyLineForProfile )
		return null ; 
	if ( ! polyLineForProfile.dlinaMarkers )
		return null ;
	if ( ! polyLineForProfile.linePath )
		return null ; 
	
	for ( var i = 0 ; i < polyLineForProfile.dlinaMarkers.length; i++)
		polyLineForProfile.dlinaMarkers[i].setMap(null) ;
	polyLineForProfile.dlinaMarkers.length = 0 ;
	polyLineForProfile.linePath.length = 0 ;
	polyLineForProfile.setMap(null) ;
}
// *********************************************************************************************
function drawPolyLineProfile(polyLineForProfile) {
	var pntS = composePolyProfilePointsArray(polyLineForProfile) ;
	if ( ! pntS )
		return null ; 
	
	canva = canvair ; 
	
	canva.width = canva.offsetWidth;
	canva.height = canva.offsetHeight;
	context = canva.getContext("2d");	

	context.clearRect(0, 0, canva.clientWidth, canva.clientHeight);
	var cRect = canva.getBoundingClientRect() ;
	var dAn = maximumEle.elevation - minimumEle.elevation ;	
	var dX = 1 ; 
	
			for (var i=1 ; i < pntS.length; i++) {
				if ( ! pntS[i] )
					continue ;
				var X0 =  i ;
				if ( ! pntS[i].location ) {
					context.fillStyle = "#FF0000";
					context.fillRect(X0, 0, dX, canva.clientHeight) ; }
				else {
					var dY = ( (pntS[i].elevation - minimumEle.elevation)  / dAn) * 190 ; 				// высота точки горизонта в пикселах			
					var Y0 = cRect.height - dY ;
					context.fillStyle = "Grey";
					context.fillRect(X0, Y0, dX, dY) ;
				}
			}
}
