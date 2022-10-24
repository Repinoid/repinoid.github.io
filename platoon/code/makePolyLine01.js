function coordFromMouse(mouseEvent) {
	const cH = mapCell.clientHeight ;		// map size in pixels
	const cW = mapCell.clientWidth ;
		const mapBounds = karta.getBounds() ;
	const SW = mapBounds.getSouthWest() ;	// left bottom corner point
	const NE = mapBounds.getNorthEast() ;	// right upper 
	const x0 = SW.lng() ;					// left bootom X zero coordinate
	// const y0 = SW.lat() ;
	const y0 = NE.lat() ;					// left upper Y zero coordinate
	const pixelWidth 	= (NE.lng() - SW.lng()) / cW 	;		// pixel width
	const pixelHeight 	= (NE.lat() - SW.lat()) / cH 	;		// pixel height
		const x = 	mouseEvent.x * pixelWidth + 	x0;
		const y = 	-mouseEvent.y * pixelHeight + y0	;	
		const xy = new google.maps.LatLng(y, x) ;
	return xy ;
}

function makePolyline(param, isArrowed) {
	class Wpolyline extends google.maps.Polyline { 
		constructor (args) {
			super(args) ;
			super.setOptions({editable: false, clickable: false, draggable: false }) ;
			this.name = "Polyline" ;
		}
		set figureColor(color) {
			super.setOptions({strokeColor:		color}) ;
		}
		set lineWidth(wid) {
			super.setOptions({strokeWeight:		wid}) ;
		}
		set figureOpacity(oppa) {
			super.setOptions({strokeOpacity:	oppa}) ;
		}
		set figureClickable(yn) {
			super.setOptions({clickable:	yn}) ;
		}
		get options() {
			const opts 	= {} ;
				opts.name 				= 	this.name ;
				opts.strokeColor		=	this.strokeColor	;
				opts.strokeOpacity   	=   this.strokeOpacity	;
				opts.strokeWeight    	=   this.strokeWeight 	;
				opts.path 				= 	this.getPath().getArray() ;
				opts.icons 				= 	this.icons ;
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
	const lineSymbol = { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, };
	
	let polly = {} ;
	if ( ! param ) {
		polly = new Wpolyline ({
			geodesic: true,
			strokeColor: 	figStrokeColor,
			strokeOpacity: 	figStrokeOpacity,
			strokeWeight: 	figStrokeWeight,
//			zIndex:			10, 
		});
		if (isArrowed)
			polly.setOptions({icons : [{ icon: 	lineSymbol, offset: "100%"}] }) ;
		polly.linePath = [] ;
		
				//		google.maps.event.addListenerOnce (karta, 'click', setFirstPoint) ;
		mapCell.addEventListener('click', setFirstPoint) ;						// js listener _______________________
		
		karta.setOptions({gestureHandling : "none" }) ;							// freeze map
		promptString.innerHTML = "Задайте первую точку полилинии кликом по левой клавише мыши" ;

	} else {
		polly = new Wpolyline (param) ;
		polly.figureEditListener 	= google.maps.event.addListener (polly, 'contextmenu', figureEditFunction) ;
		polly.figureClickable = true ;
	}
//	function setFirstPoint (event) {
	function setFirstPoint () {
		mapCell.removeEventListener('click', setFirstPoint) ;
		promptString.innerHTML = "Левая клавиша мыши - следующая точка. Двойной клик - закончить построение" ;
			event.latLng = coordFromMouse(event) ;		
			polly.linePath.push(event.latLng) ;
		
//		polly.mapClickListener 			=	google.maps.event.addListener 		(karta, 'click', mapClickFunction) ;
			mapCell.addEventListener('click', mapClickFunction) ;						// js listener _______________________
//		polly.mapDoubleClickListener 	=	google.maps.event.addListenerOnce 	(karta, 'dblclick', mapDoubleClickFunction) ;
			mapCell.addEventListener('dblclick', mapDoubleClickFunction) ;						// js listener _______________________
//		polly.mouseMoveListener 		=	google.maps.event.addListener 		(karta, 'mousemove', mouseMoveFunction) ;
			mapCell.addEventListener('mousemove', mouseMoveFunction) ;						// js listener _______________________

//		polly.mouseMoveListener 		=	addEventListener('mousemove', mouseMoveFunction) ;

//		google.maps.event.addListener 		(karta, 'mousemove', mouseMoveFunction) ;
//		mapCell.onmousemove = mouseMoveFunction(event) ;
		
		
	}
	
		function mapClickFunction (event) {
			event.latLng = coordFromMouse(event) ;		
			polly.linePath.push(event.latLng) ;
			polly.setPath(polly.linePath) ;
		}
		
		function mapDoubleClickFunction (event) {				// last line point 
			promptString.innerHTML = "Клик правой клавишей по фигуре - редактировать" ;
				const poo = JSON.stringify(polly.options) ;
			distanceMarker.setMap(null) ;
//				google.maps.event.removeListener(polly.mapClickListener) ;
			mapCell.removeEventListener('click', mapClickFunction) ;						// js listener _______________________
//				google.maps.event.removeListener(polly.mouseMoveListener) ;
			mapCell.removeEventListener('mousemove', mouseMoveFunction) ;						// js listener _______________________				
//				google.maps.event.removeListener(polly.mapDoubleClickFunction) ;
			mapCell.removeEventListener('dblclick', mapDoubleClickFunction) ;						// js listener _______________________
				
			polly.lineEditListener = google.maps.event.addListener (polly, 'contextmenu', figureEditFunction) ;
			polly.figureClickable = true ;
			window.setTimeout(function() {
				karta.setOptions({gestureHandling : "cooperative" }) ;
			},200);
		}
		
  	function mouseMoveFunction (event) {
		event.latLng = coordFromMouse(event) ;		
		const currentPos = event.latLng ;
		const prevPoint = polly.linePath[polly.linePath.length-1] ;
		const poluDlinaPos = 	google.maps.geometry.spherical.interpolate				(prevPoint, currentPos, 0.45) ;
		const dlina  = 			google.maps.geometry.spherical.computeDistanceBetween	(prevPoint, currentPos) ;
			distanceMarker.setPosition(poluDlinaPos) ;
			distanceMarker.setLabel({text: dlina.toFixed(0) + " m", fontSize: '14px', color: polly.strokeColor }) ;
		polly.linePath.push(event.latLng) ;
		polly.setPath(polly.linePath) ;
		polly.linePath.pop() ;
	}
	function figureEditFunction (event) {
		const isEditable = polly.getEditable() ;
		polly.setEditable( ! isEditable) ;
		if (isArrowed)
			polly.setDraggable( ! isEditable) ;
	}
  polly.setMap(karta);
  
  return polly ;
}