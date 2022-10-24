function readFiles(input)
{
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

			const trackObj = parseGPX(content) ;
			tracksArray.	push	(new trackClass(MAPPA, {}, trackObj));
			MAPPA.fitBounds(trackObj.bounds) ;
			loadTrackWindow.style.display = "none" ;
			const w1 = window.location.href ;
			const w2 = w1.replace("#", "A") ;
				const str = "userLocations.php?TRK=" ;
				writeLocations(str) ;

		}
		loadBlink.style.display = "block" ;
        reader.readAsText(file);
    }
}	
function parseTrack(kus) {
	const trackKus = {} ;
	const lat_begin = kus.indexOf('lat="', 	0)  ;  		// find latitude
	const lat_end 	= kus.indexOf('"', 	lat_begin+5) ;
		const lat 	=	 parseFloat(kus.slice(lat_begin + 5, 	lat_end)) ;
	const lon_begin = kus.indexOf('lon="', lat_end)  ;	// fing longitude after latitude
	const lon_end 	= kus.indexOf('"', 	lon_begin+5) ;
		const lon 	=	 parseFloat(kus.slice(lon_begin + 5, 	lon_end)) ;
	trackKus.lat = lat ;
	trackKus.lng = lon ;
	
	if ( kus.indexOf('<time>') > 0 )  {
		const time_begin 	= kus.indexOf('<time>', 	0)  ;
		const  time_end 	= kus.indexOf('</time>', 	time_begin) ;
			const tm 	= 	kus.slice(time_begin + 6, 	time_end) ;
			const msUTC = Date.parse(tm) ;
			trackKus.time =  msUTC;
	}
	if ( kus.indexOf('<ele>') > 0 )  {
		const ele_begin = kus.indexOf('<ele>', 0)  ;
		const ele_end 	= kus.indexOf('</ele>', ele_begin+5) ;
		const ele 	=	 parseFloat(kus.slice(ele_begin + 5, ele_end)) ;
		trackKus.ele = ele ;
	}
	return trackKus ;
}

function parseGPX(malay) {
	
	const trackObj = {} ;
	const trackArray = [] ;
	const path = [] ;
	
	const trk = malay.indexOf('<trk', 0) ;		
	const nm 	= malay.indexOf('<name>', trk) ;
	if ( nm > 0 ) {
		let nmend 		= malay.indexOf('</name>', nm) ;
		trackObj.name 	= malay.slice(nm + 6, nmend) ;
	}
	else
		trackObj.name = "" ;

	let trkpt_begin 	= malay.indexOf('<trkpt', 0) ;		// find first point field
	while ( trkpt_begin > 0 ) {
		const trkpt_end = malay.indexOf('</trkpt>', trkpt_begin) ;
		const kus 	= malay.slice(trkpt_begin, trkpt_end+8) ;
		const t = parseTrack(kus) ;
		trackArray.push(t) ;
		trkpt_begin 	= malay.indexOf('<trkpt', trkpt_end+8) ;
	}
	
	if ( ('time' in trackArray[0]) && (trackArray[0].time > 100000) )
		trackObj.hasTime = true ;
	else
		trackObj.hasTime = false ;

	if ( 'ele' in trackArray[0]  )
		trackObj.hasElevation = true ;
	else
		trackObj.hasElevation = false ;
	
	trackObj.start = 	new google.maps.LatLng(	trackArray[0].lat, 
												trackArray[0].lng) ;
	trackObj.finish = 	new google.maps.LatLng(	trackArray[trackArray.length - 1].lat, 
												trackArray[trackArray.length - 1].lng) ;
	
	let maxLat = -1000, maxLng = -1000, minLat = 1000, minLng = 1000 ;
	let distance = 0.0 ;
	for (let i=0; i < trackArray.length; i++) {
		path.push(new google.maps.LatLng(trackArray[i].lat, trackArray[i].lng));
		maxLat = maxLat > trackArray[i].lat ? maxLat : trackArray[i].lat ;
		maxLng = maxLng > trackArray[i].lng ? maxLng : trackArray[i].lng ;
		minLat = minLat < trackArray[i].lat ? minLat : trackArray[i].lat ;
		minLng = minLng < trackArray[i].lng ? minLng : trackArray[i].lng ;
		if ( i == 0 ) 
			continue ;
		const currPoint = new google.maps.LatLng(trackArray[i].lat, 	trackArray[i].lng) ;
		const prevPoint = new google.maps.LatLng(trackArray[i-1].lat, 	trackArray[i-1].lng) ;
		distance += google.maps.geometry.spherical.computeDistanceBetween(currPoint, prevPoint) ;
		
	}
		trackObj.bounds = new google.maps.LatLngBounds(new google.maps.LatLng(minLat, minLng), new google.maps.LatLng(maxLat, maxLng)) ;
		trackObj.distance = distance ;
		MAPPA.fitBounds(trackObj.bounds) ;
		
	trackObj.path = path ;
	trackObj.arr =  trackArray;
	
	return trackObj ;
}
