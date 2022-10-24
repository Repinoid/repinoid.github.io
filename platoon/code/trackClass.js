class trackClass {
	constructor (karta, opts, trackObj) {
		
		const path = trackObj.path ;

			const areaMarkerImage = {
					url: './platoon/PIX/dot1.gif',
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point( 10,  10) };

			let mapClickListener  		=	{} ;		
			let mapRightClickListener  	=	{} ;
			let mapMouseListener  		=	{} ;
		const line = new google.maps.Polyline({
			strokeColor: 	(opts.strokeColor	!= undefined) 	? opts.strokeColor 		: '#FF0000',
			strokeOpacity: 	(opts.strokeOpacity != undefined) 	? opts.strokeOpacity 	: 0.7,			// прозрачноть линии по умолчению 1
			strokeWeight: 	(opts.strokeWeight 	!= undefined) 	? opts.strokeWeight 	: 7,			// толщина линии по умолчанию 1 пиксела
			clickable:		true,
			draggable: 		false,
			editable: 		false,
			map: 			karta,
			track:			trackObj,
		});
			line.setPath(path) ;
			line.rightClickListener 	= 	google.maps.event.addListener	(line, 'contextmenu', 	contextMenuFunction) ;

		widthOrFontSliderText.innerHTML = "Ширина линии<hr>" ;
		
		
		this.line = line ;

		function contextMenuFunction() {			// +++++++++++++++++++++++++++++++++++++++++++++++++++
			if  ( (lineParametersForm.style.display == "block")||(txtForm.style.display == "block") ) 
				return ;

				showDragaCell.style.display = "none" ;
				showDistsCell.style.display = "none" ;
			polyWidthSlider.value 	= line.strokeWeight ;
			polyOpacitySlider.value = line.strokeOpacity ;
			lineParametersForm.style.display = "block" ;
			polyWidthSlider.onchange = 		function () { line.setOptions({strokeWeight: 	this.value}) }
			polyOpacitySlider.onchange = 	function () { line.setOptions({strokeOpacity: 	this.value , fillOpacity: 	this.value}) }
			
				const txtClr = document.getElementsByClassName('clrButts');
				for ( let i=0; i < txtClr.length; i++ )
					txtClr[i].onclick = function () 	{	line.setOptions({strokeColor:this.style.backgroundColor}) };
					
				deleteLine.onclick = function() {
					let res = confirm("Удалить трек\r\nВы уверены ?");
					if (res) {
						line.setMap(null) ;
						lineParametersForm.style.display = "none" ; 
					}
				}
				closeLineParam.onclick = function () { 
					lineParametersForm.style.display = "none" ; 
				}
		}
	}
}

function makeTracksArray(inArr) {
	const arr = [] ;
	for ( let i=0 ; i< inArr.length; i++) {
		const obj 		= inArr[i].line ;
		const path 		= obj.getPath().getArray() ;
		if ( ! obj.getMap() || (path.length < 2) ) {
			inArr.splice(i--, 1) ;
			continue ;
		}
		try {
			const path 		= obj.getPath().getArray() ;
			const opts 	= {} ;
			opts.strokeColor		=	obj.strokeColor	;
			opts.strokeOpacity   	=   obj.strokeOpacity	;
			opts.strokeWeight    	=   obj.strokeWeight 	;
			const easyTrack 	= {	track: 		obj.track,  
									options: 	opts } ;	
			arr.push(easyTrack) ;
		} catch {} ;
	}
	return arr ;
}
function decodeTracks (rectJson) {
//	try {
		for ( let i=0 ; i< rectJson.length; i++) {
			const obrat = rectJson[i].track ;
			const path = obrat.path ;
			for ( let j=0 ; j < path.length; j++) {
				const otrez = path[j] ;
				path[j] = new google.maps.LatLng(otrez.lat, otrez.lng) ;
			}
			obrat.start		= makeLatLng(obrat.start) ;
			obrat.finish	= makeLatLng(obrat.finish) ;
			obrat.bounds	= new google.maps.LatLngBounds(	new google.maps.LatLng(obrat.bounds.south, obrat.bounds.west), 
															new google.maps.LatLng(obrat.bounds.north, obrat.bounds.east) ) ;
		}
		return rectJson ;
//	} catch { return (null) ; } ;
}

