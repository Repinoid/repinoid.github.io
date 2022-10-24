var w2show ;
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
	polzun.onchange = function() {
		const pend = polzun.value ;
		const pend1 = this.value ;
		const path = [] ;
		
		let maxLat = -1000, maxLng = -1000, minLat = 1000, minLng = 1000 ;
		let distance = 0.0 ;
		for (let i=0; i <= pend; i++) {
			const lat = trackObj.arr[i].lat ; 
			const lng = trackObj.arr[i].lng ;
			path.push(new google.maps.LatLng(lat, lng));
				maxLat = maxLat > lat ? maxLat : lat ;
				maxLng = maxLng > lng ? maxLng : lng ;
				minLat = minLat < lat ? minLat : lat ;
				minLng = minLng < lng ? minLng : lng ;		
			if ( i == 0 ) 
				continue ;
			const currPoint = new google.maps.LatLng(trackObj.arr[i].lat, trackObj.arr[i].lng) ;
			const prevPoint = new google.maps.LatLng(trackObj.arr[i-1].lat, trackObj.arr[i-1].lng) ;
			distance += google.maps.geometry.spherical.computeDistanceBetween(currPoint, prevPoint) ;
		}
		runnerMarker.setPosition(path[path.length-1]) ;
		const i = pend ;
		velocity.innerHTML += " ►►► " + (distance/1000).toFixed(2) + "km " ;
		if ( trackObj.hasTime) {
			const timeDiff = trackObj.arr[i].time - trackObj.arr[i-1].time ;
			if ( timeDiff ) {
				const currPoint = new google.maps.LatLng(trackObj.arr[i].lat, trackObj.arr[i].lng) ;
				const prevPoint = new google.maps.LatLng(trackObj.arr[i-1].lat, trackObj.arr[i-1].lng) ;
				const dist = google.maps.geometry.spherical.computeDistanceBetween(currPoint, prevPoint) ;
				const speed = 3600* dist/timeDiff ;
				velocity.innerHTML = w2show + " 🔥 " + speed.toFixed(2) + " " + "km/h" ;
				
				let tm = trackObj.arr[i].time - trackObj.arr[0].time ;
				tm /= 1000 ;
				let tstr = " ⏳ " ;
				if ( Math.floor(tm/86400) )
					tstr += Math.floor(tm/86400) + 'd' ;
				tm = tm % 86400 ;
				if ( Math.floor(tm/3600) )
					tstr += Math.floor(tm/3600) + 'h' ;
				tm = tm % 3600 ;
				if ( Math.floor(tm/60) )
					tstr += Math.floor(tm/60) + 'm' ;
				tm = tm % 60 ;
				tstr += tm + 's' ;
				velocity.innerHTML += tstr ;
			}
		}	
		const bounds = new google.maps.LatLngBounds(new google.maps.LatLng(minLat, minLng), new google.maps.LatLng(maxLat, maxLng)) ;
		MAPPA.fitBounds(bounds) ;
		trackLine.setPath(path) ;
	}
	
function setTrack(trackObj) {	



	if ( trackObj.hasTime ) {
		const datStr  = "" + new Date(trackObj.arr[0].time);
		const dat = datStr.slice(0, datStr.indexOf("GMT")-1) ;
		let tm = trackObj.arr[trackObj.arr.length-1].time - trackObj.arr[0].time ;
		tm /= 1000 ;
		let tstr = " ⌚ " ;
		if ( Math.floor(tm/86400) )
			tstr += Math.floor(tm/86400) + 'd' ;
		tm = tm % 86400 ;
		if ( Math.floor(tm/3600) )
			tstr += Math.floor(tm/3600) + 'h' ;
		tm = tm % 3600 ;
		if ( Math.floor(tm/60) )
			tstr += Math.floor(tm/60) + 'm' ;
		tm = tm % 60 ;
		tstr += tm + 's' ;
		velocity.innerHTML = dat + " " + trackObj.name + "&nbsp &nbsp &nbsp ⇔ " + (trackObj.distance/1000).toFixed(2) + "km," + tstr;
	}
	else
		velocity.innerHTML = trackObj.name + "&nbsp &nbsp &nbsp ⇔ " + (trackObj.distance/1000).toFixed(2) + "km" ;
	
	w2show = velocity.innerHTML ;
	startMarker.setPosition	(trackObj.start) ;
	finishMarker.setPosition(trackObj.finish) ;
	trackLine.setPath(trackObj.path) ;
	
	polzun.max 		= trackObj.arr.length - 1 ;
	polzun.value 	= Math.floor(trackObj.arr.length / 30) + 1 ;
	polzun.step 	= Math.floor(trackObj.arr.length / 200) + 1 ; 
	polzun.min 		= 3*polzun.step ; 
	
	return trackObj ;
}
