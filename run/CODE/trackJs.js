var MAPPA = {}, trackLine = {}, startMarker = {}, finishMarker = {}, runnerMarker = {} ;
var trackObj = {} ;

function initMap() {  
	
	var loca = new google.maps.LatLng(55.904434, 39.185255); // pokrov

	MAPPA = new google.maps.Map(document.getElementById('mapCell'), {
				zoom: 13,
				center: loca, 
//				mapTypeId: google.maps.MapTypeId.HYBRID,
				mapTypeId: google.maps.MapTypeId.TERRAIN,
				clickableIcons: false, 
				fullscreenControl: false,
				mapTypeControlOptions: {
					style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
					position: google.maps.ControlPosition.LEFT_TOP,
				},
			});
			
	trackLine = new google.maps.Polyline({
		clickable:		false,
		draggable: 		false,
		editable: 		false,
		strokeColor: 	'red', 
		strokeOpacity:	0.7,
		strokeWeight: 	7,
		map: 			MAPPA,
	});
	const startMarkerImage = {
				url: './CODE/start.gif',
				anchor: new google.maps.Point(20,20),
			};
	startMarker = new google.maps.Marker({										
											icon: startMarkerImage,
											opacity: 0.5,
											clickable:		false,
											draggable: 		false,
											title: 			"start", 
											map: 			MAPPA ,
										}) ;
//	startMarker.setLabel({text: "Start", fontSize: '12px', color:  'green'}) ;
	const finishMarkerImage = {
				url: './CODE/finish.gif',
				anchor: new google.maps.Point(40,40),
			};
	finishMarker = new google.maps.Marker({										
											icon: finishMarkerImage,
											opacity: 0.5,
											clickable:		false,
											draggable: 		false,
											title: 			"finish", 
											map: 			MAPPA ,
										}) ;
//	startMarker.setLabel({text: "Start", fontSize: '12px', color:  'green'}) ;
	const runnerMarkerImage = {
				url: './CODE/runner.gif',
				anchor: new google.maps.Point(40,40),
			};
	runnerMarker = new google.maps.Marker({										
											icon: runnerMarkerImage,
											opacity: 0.5,
											clickable:		false,
											draggable: 		false,
											title: 			"runner", 
											map: 			MAPPA ,
										}) ;
//	startMarker.setLabel({text: "Start", fontSize: '12px', color:  'green'}) ;

	if ( window.location.hash) {
		const ha = window.location.hash.slice(1) ;				// without #
		if (ha[0] == "T") {
			
			const fname = "./tracks/" + ha + ".json" ;
			const X = new XMLHttpRequest();
			X.open("GET", fname, true);
			X.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
			X.send(null);
			X.close;
			X.onload = function () {
				let obrat ;
				if ( (X.readyState == 4 && X.status == "200") && ( obrat = tryParsing(X.responseText) ) ) 	// if file exists && OK parsed
				{		
					for (let i=0; i < obrat.path.length; i++) 
						obrat.path[i] = makeLatLng(obrat.path[i]) ;
					obrat.start		= makeLatLng(obrat.start) ;
					obrat.finish	= makeLatLng(obrat.finish) ;
					obrat.bounds	= new google.maps.LatLngBounds(	new google.maps.LatLng(obrat.bounds.south, obrat.bounds.west), 
																	new google.maps.LatLng(obrat.bounds.north, obrat.bounds.east) ) ;
				}
				trackObj = obrat ;
				
				MAPPA.fitBounds(trackObj.bounds) ;
				setTrack(trackObj) ;
			}
		}
	}

	
	getTrackerLocation("OWN") ;
	
			const podskaz  = "<hr>&nbsp Загрузите трек с диска. <br>"+
							"&nbsp Ползунок - движение по треку<hr>" +
							"&nbsp Load track and use slider" ;
			hlpTxt.innerHTML = podskaz ;
//			navigator.clipboard.writeText(window.location) ;
	
}


function makeLatLng(obj) {
	const np = new google.maps.LatLng(obj.lat, obj.lng) ;
	return np ;
}

function drawTrack(malay) {
	trackObj = parseGPX(malay) ;
	setTrack(trackObj) ;
}
	

function readFiles(input)
{
	trackLine.setPath(null) ; 
	trackLine.setMap(null) ; 
	startMarker.setMap(null) ;  
	finishMarker.setMap(null) ; 
	if ( trackObj.arr != undefined)
		trackObj.arr.length = 0 ;
	
     if (window.FileList && window.File) {

		let loadBlink = document.getElementById('blink_text') ;  // BLINK ON #############
//        const file = e.target.files[0];
		const file = input.files[0];

        const name = file.name ? file.name : 'NOT SUPPORTED';
        const type = file.type ? file.type : 'NOT SUPPORTED';
        const size = file.size ? file.size : 'NOT SUPPORTED';

        const reader = new FileReader();
		reader.onload = function() {
			let content = reader.result ;
			loadBlink.style.display = "none" ;
			drawTrack(content) ;
				trackLine.setMap(MAPPA) ; 
				startMarker.setMap(MAPPA) ;  
				finishMarker.setMap(MAPPA) ; 
		}
		loadBlink.style.display = "block" ;
        reader.readAsText(file);
    }
}

function tryParsing (u) {
	try {
		const		obj =	JSON.parse(u) ;
		return (obj) ;
	}
	catch (err) {
		return (false) ;
	}
}
