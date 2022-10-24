function makeRectangle(param) {
	class WRectangle extends google.maps.Rectangle { 
		constructor (args) {
			super(args) ;
			super.setOptions({editable: false, clickable: false, draggable: false }) ;
			this.name = "Rectangle" ;
		}
		set figureColor(color) {
			super.setOptions({fillColor: color, strokeColor: color }) ;
		}
		set figureOpacity(oppa) {
			super.setOptions({fillOpacity:	oppa, strokeOpacity:	oppa }) ;
		}
		set figureClickable(yn) {
			super.setOptions({clickable:	yn}) ;
		}
		get options() {
			const opts 	= {} ;
				opts.name 				= 	this.name ;
				opts.fillColor			=	this.fillColor	;
				opts.strokeColor		=	this.fillColor	;
				opts.fillOpacity   		=   this.fillOpacity	;
				opts.strokeOpacity   	=   this.fillOpacity	;
				opts.bounds				= 	this.getBounds() ;
			return opts ;
		}
	}
	
	const dotImage = {
		url: './platoon/PIX/dot1.gif',
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point( 10,  10) 
	};
	const distanceMarker = new google.maps.Marker({
								map: karta, 
								icon: dotImage,
								opacity: 0.9
								}) ;
	
	let recta = {} ;
	if ( ! param ) {
		recta = new WRectangle ({
			strokeColor: 	figFillColor,
			fillColor: 		figFillColor,
			fillOpacity: 	figFillOpacity,
			strokeOpacity: 	figFillOpacity,
		});
//		google.maps.event.addListenerOnce (karta, 'click', setFirstPoint) ;
			mapCell.addEventListener('click', setFirstPoint) ;					// js listener _______________________		
		karta.setOptions({gestureHandling : "none" }) ;							// freeze map
		promptString.innerHTML = "Задайте первый угол прямоугольника кликом по левой клавише мыши" ;

	} else {
		recta = new WRectangle (param) ;
		recta.figureEditListener 	= google.maps.event.addListener (recta, 'contextmenu', figureEditFunction) ;
		recta.figureClickable = true ;
	}
	let firstPoint = {} ;
	recta.setMap(karta);
	function setFirstPoint (event) {
			mapCell.removeEventListener('click', setFirstPoint) ;	
		promptString.innerHTML = "Задайте второй угол прямоугольника кликом по левой клавише мыши" ;
		event.latLng = coordFromMouse(event) ;
		firstPoint = event.latLng ;
//		recta.mouseMoveListenerKarta 		=	google.maps.event.addListener 		(karta, 'mousemove', mouseMoveFunction) ;
//		recta.mouseMoveListenerRecta 		=	google.maps.event.addListener 		(recta, 'mousemove', mouseMoveFunction) ;
			mapCell.addEventListener('mousemove', mouseMoveFunction) ;	
		recta.mouseMoveListener4Coord 		=	google.maps.event.addListener 		(recta, 'mousemove', showCoordinates) ;		
		recta.figureClickable = true ;
		window.setTimeout(function() {
			karta.setOptions({gestureHandling : "cooperative" }) ;
		},200);

//		recta.secondPointListenerKarta = google.maps.event.addListener (karta, 'click', setSecondPoint) ;
//		recta.secondPointListenerRecta = google.maps.event.addListener (recta, 'click', setSecondPoint) ;
			mapCell.addEventListener('click', setSecondPoint) ;		
	}
	function setSecondPoint (event) {
			mapCell.removeEventListener('mousemove', mouseMoveFunction) ;	
			mapCell.removeEventListener('click', setSecondPoint) ;				
		promptString.innerHTML = "Клик правой клавишей по фигуре - редактировать" ;
		distanceMarker.setMap(null) ;
		// google.maps.event.removeListener(recta.mouseMoveListenerKarta) ;
		// google.maps.event.removeListener(recta.mouseMoveListenerRecta) ;
		// google.maps.event.removeListener(recta.secondPointListenerKarta) ;
		// google.maps.event.removeListener(recta.secondPointListenerRecta) ;
		recta.lineEditListener = google.maps.event.addListener (recta, 'contextmenu', figureEditFunction) ;
	}
	
  	function mouseMoveFunction (event) {
		event.latLng = coordFromMouse(event) ;
		const currentPos = event.latLng ;
		const prevPoint = firstPoint ;
		const poluDlinaPos = 	google.maps.geometry.spherical.interpolate				(prevPoint, currentPos, 0.45) ;
		const dlina  = 			google.maps.geometry.spherical.computeDistanceBetween	(prevPoint, currentPos) ;
			distanceMarker.setPosition(poluDlinaPos) ;
			distanceMarker.setLabel({text: dlina.toFixed(0) + " m", fontSize: '14px', color: "#000000" }) ;
			if (currentPos.lng() > firstPoint.lng())
				recta.setBounds(new google.maps.LatLngBounds(firstPoint, event.latLng )) ;					
			else
				recta.setBounds(new google.maps.LatLngBounds(event.latLng, firstPoint)) ;		
//		recta.setMap(karta);
			
	}
	function figureEditFunction (event) {
		const isEditable = recta.getEditable() ;
		recta.setEditable( ! isEditable) ;
		recta.setDraggable( ! isEditable) ;
	}
  
  return recta ;
}