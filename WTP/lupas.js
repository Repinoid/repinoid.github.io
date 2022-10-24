function setLupa (eArr) {
	
	var mapBounds = MAPPA.getBounds() ;	
	
	var recSW = interpolate(mapBounds.getSouthWest(),mapBounds.getNorthEast(), 0.8) ;
	var recNE = interpolate(mapBounds.getSouthWest(),mapBounds.getNorthEast(), 0.9) ;
	
	lupaRecta = setAreaRectangle(recSW, recNE) ;	
	
	lupaRecta.setOptions( { fillOpacity: 0.2, fillColor: "Blue" } ) ;
	
	google.maps.event.addListener(lupaRecta, 'drag', function() {
		
		 var lupaObject = new composeRectangleDotsConstructor(lupaRecta, 10000) ;
//		 lupaObject.pLine.setMap(null) ;
		 lupaObject.deletePline()  ;
		 var maximumEle = { elevation: -15000} ;
		 var minimumEle = { elevation:  15000} ;

		var lupaDots = lupaObject.dots ;
	
		for ( var i=0 ; i < lupaDots.length; i++ ) {
			var ele = lupaDots[i] ;
			lupaObject.elevations[i] =  getPointWithElevation(ele, eArr) ;
			if ( ! lupaObject.elevations[i])
				continue ;
			
			if ( maximumEle.elevation < lupaObject.elevations[i].elevation )				// поиск глобальных мин/макс точек
							maximumEle =  lupaObject.elevations[i] ;
			if ( minimumEle.elevation > lupaObject.elevations[i].elevation )
							minimumEle =  lupaObject.elevations[i] ;
		}
		if (lupaDots) {
				hiMark.setPosition(maximumEle.location) ;
				hiMark.setMap(MAPPA) ;
				loMark.setPosition(minimumEle.location) ;
				loMark.setMap(MAPPA) ; 

				hiMark.setLabel({text: maximumEle.elevation.toFixed(0) + "m", fontSize: '16px', color: 'Red', fontWeight: '500' }) ;
				loMark.setLabel({text: minimumEle.elevation.toFixed(0) + "m", fontSize: '16px', color: 'Green', fontWeight: '500' }) ;
		}
	}) ;
	
	
}