function makeCircle(param) {
	class WCircle extends google.maps.Circle { 
		constructor (args) {
			super(args) ;
			super.setOptions({editable: false, clickable: false, draggable: false }) ;
			this.name = "Circle" ;
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
				opts.center				= 	this.getCenter() ;
				opts.radius				= 	this.getRadius() ;
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
	
	let krug = {} ;
	if ( ! param ) {
		krug = new WCircle ({
			strokeColor: 	figFillColor,
			fillColor: 		figFillColor,
			fillOpacity: 	figFillOpacity,
			strokeOpacity: 	figFillOpacity,
		});
//		google.maps.event.addListenerOnce (karta, 'click', setFirstPoint) ;
			mapCell.addEventListener('click', setFirstPoint) ;						// js listener _______________________		
		karta.setOptions({gestureHandling : "none" }) ;							// freeze map
		promptString.innerHTML = "Задайте центр окружности кликом по левой клавише мыши" ;

	} else {
		krug = new WCircle (param) ;
		krug.figureEditListener 	= google.maps.event.addListener (krug, 'contextmenu', figureEditFunction) ;
		krug.figureClickable = true ;
	}
	let firstPoint = {} ;
	krug.setMap(karta);
	function setFirstPoint () {
			mapCell.removeEventListener('click', setFirstPoint) ;		
		promptString.innerHTML = "Задайте радиус окружности кликом по левой клавише мыши" ;
		event.latLng = coordFromMouse(event) ;
		firstPoint = event.latLng ;
		krug.setCenter(firstPoint) ;
//		krug.mouseMoveListenerKarta 		=	google.maps.event.addListener 		(karta, 'mousemove', mouseMoveFunction) ;
//		krug.mouseMoveListenerRecta 		=	google.maps.event.addListener 		(krug,  'mousemove', mouseMoveFunction) ;
			mapCell.addEventListener('mousemove', mouseMoveFunction) ;	
		krug.mouseMoveListener4Coord 		=	google.maps.event.addListener 		(krug,  'mousemove', showCoordinates) ;
		krug.figureClickable = true ;
		window.setTimeout(function() {
			karta.setOptions({gestureHandling : "cooperative" }) ;
		},200);

//		krug.secondPointListenerKarta = google.maps.event.addListener (karta, 'click', setSecondPoint) ;
//		krug.secondPointListenerRecta = google.maps.event.addListener (krug, 'click', setSecondPoint) ;
		mapCell.addEventListener('click', setSecondPoint) ;		
	}
	function setSecondPoint (event) {
			mapCell.removeEventListener('mousemove', mouseMoveFunction) ;	
			mapCell.removeEventListener('click', setSecondPoint) ;		
		promptString.innerHTML = "Клик правой клавишей по фигуре - редактировать" ;
		distanceMarker.setMap(null) ;
		// google.maps.event.removeListener(krug.mouseMoveListenerKarta) ;
		// google.maps.event.removeListener(krug.mouseMoveListenerRecta) ;
		// google.maps.event.removeListener(krug.secondPointListenerKarta) ;
		// google.maps.event.removeListener(krug.secondPointListenerRecta) ;
		krug.lineEditListener = google.maps.event.addListener (krug, 'contextmenu', figureEditFunction) ;
	}
	
  	function mouseMoveFunction (event) {
		event.latLng = coordFromMouse(event) ;
		const currentPos = event.latLng ;
		const prevPoint = firstPoint ;
		const poluDlinaPos = 	google.maps.geometry.spherical.interpolate				(prevPoint, currentPos, 0.45) ;
		const dlina  = 			google.maps.geometry.spherical.computeDistanceBetween	(prevPoint, currentPos) ;
			distanceMarker.setPosition(poluDlinaPos) ;
			distanceMarker.setLabel({text: dlina.toFixed(0) + " m", fontSize: '14px', color: "#000000" }) ;
			
		const radius  = 		google.maps.geometry.spherical.computeDistanceBetween	(firstPoint, event.latLng) ;
		krug.setRadius(radius) ;		
		
	}
	function figureEditFunction (event) {
		const isEditable = krug.getEditable() ;
		krug.setEditable( ! isEditable) ;
		krug.setDraggable( ! isEditable) ;
	}
  
  return krug ;
}