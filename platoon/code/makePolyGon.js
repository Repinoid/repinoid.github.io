
function makePolygon(param) {
	class Wpolygon extends google.maps.Polygon { 
		constructor (args) {
			super(args) ;
			super.setOptions({editable: false, clickable: false, draggable: false }) ;
			this.name = "Polygon" ;
		}
		set figureColor(color) {
			super.setOptions({fillColor: color, strokeColor: color }) ;
		}
//		set lineWidth(wid) {
//			super.setOptions({strokeWeight:		wid}) ;
//		}
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
//				opts.strokeWeight    	=   this.strokeWeight 	;
				opts.path 				= 	this.getPath().getArray() ;
//				opts.icons 				= 	this.icons ;
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
//	const lineSymbol = { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, };
	
	let polly = {} ;
	if ( ! param ) {
		polly = new Wpolygon ({
			geodesic: true,
			strokeColor: 	figFillColor,
			fillColor: 		figFillColor,
			fillOpacity: 	figFillOpacity,
			strokeOpacity: 	figFillOpacity,
//			zIndex:			-1, 
//			strokeWeight: 	figStrokeWeight,
		});
//		if (isArrowed)
//			polly.setOptions({icons : [{ icon: 	lineSymbol, offset: "100%"}] }) ;
		polly.linePath = [] ;
		google.maps.event.addListenerOnce (karta, 'click', setFirstPoint) ;
		karta.setOptions({gestureHandling : "none" }) ;							// freeze map
		promptString.innerHTML = "Задайте первую точку многоугольника кликом по левой клавише мыши" ;

	} else {
		polly = new Wpolygon (param) ;
		polly.figureEditListener 	= google.maps.event.addListener (polly, 'contextmenu', figureEditFunction) ;
		polly.figureClickable = true ;
	}
	function setFirstPoint (event) {
		promptString.innerHTML = "Левая клавиша мыши - следующая точка. Двойной клик - закончить построение" ;
		polly.linePath.push(event.latLng) ;
		polly.mapClickListener 			=	google.maps.event.addListener 		(karta, 'click', mapClickFunction) ;
		polly.mapDoubleClickListener 	=	google.maps.event.addListenerOnce 	(karta, 'dblclick', mapDoubleClickFunction) ;
		polly.mouseMoveListener 		=	google.maps.event.addListener 		(karta, 'mousemove', mouseMoveFunction) ;
		polly.mouseMoveListener4Coord 	=	google.maps.event.addListener 		(polly, 'mousemove', showCoordinates) ;
	}
		function mapClickFunction (event) {
			polly.linePath.push(event.latLng) ;
			polly.setPath(polly.linePath) ;
		}
  	function mouseMoveFunction (event) {
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
		function mapDoubleClickFunction (event) {
			promptString.innerHTML = "Клик правой клавишей по фигуре - редактировать" ;
				const poo = JSON.stringify(polly.options) ;
			distanceMarker.setMap(null) ;
			google.maps.event.removeListener(polly.mapClickListener) ;
			google.maps.event.removeListener(polly.mouseMoveListener) ;
			google.maps.event.removeListener(polly.mapDoubleClickFunction) ;
			polly.lineEditListener = google.maps.event.addListener (polly, 'contextmenu', figureEditFunction) ;
			polly.figureClickable = true ;
			window.setTimeout(function() {
				karta.setOptions({gestureHandling : "cooperative" }) ;
			},200);
		}
	function figureEditFunction (event) {
		const isEditable = polly.getEditable() ;
		polly.setEditable( ! isEditable) ;
		polly.setDraggable( ! isEditable) ;
	}
  polly.setMap(karta);
  
  return polly ;
}