function writeLocations(str) {
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", str, true);
	xmlhttp.send();
	xmlhttp.close;
}
function getLocationFromURL () {
		if ( ( ! window.location.hash ) || ( window.location.hash == "#null") ) {
				getIPLocation(MAPPA, POVmarker, defaultLocation) ;
				return false; 
			}	
	const ha = window.location.hash.slice(1) ;				// without #
	
	let str = "userLocations.php?URL=" + ha ;
	writeLocations(str) ;
	
	if (ha[0] == "P") {
		const ret = getFigures(ha) ;
		return true ;
	}
	if (ha[0] == "T") {
		const ret = getTrack(ha) ;
		return true ;
	}
	const mass = ha.split(';') ;
	const lat = parseFloat(mass[0]) ;
	const lng = parseFloat(mass[1]) ;
	const zoo = parseInt  (mass[2]) ;
	if ( isNaN(lat) || isNaN(lng)  || isNaN(zoo)  )
		getIPLocation(MAPPA, POVmarker, defaultLocation) ;
	else {
		const loc = new google.maps.LatLng(lat, lng) ;
		MAPPA.setCenter(loc);
		MAPPA.setZoom(zoo) ;	
		POVmarker.setPosition(loc) ;
			getOwnLoco(lat, lng, "URL") ;
		return true ;
	}
	
	
}
function goHomeLocation() {											// click on HOME
	navigator.geolocation.getCurrentPosition(success, error, {enableHighAccuracy:true} ) ;
	function success({ coords }) {
		const {latitude, longitude} = coords ;
		const msPoint = new google.maps.LatLng(latitude, longitude);
		MAPPA.setCenter(msPoint);
		POVmarker.setPosition(msPoint) ;
		getOwnLoco(latitude, longitude, "Exact") ;
	}
	function error({message}) {
		getIPLocationBySypexgeo(maped, POVmarker, defaultLocation) ;
	}
//	getIPLocation(MAPPA, POVmarker, defaultLocation) ;
}

function getIPLocation(maped, POVmarker, defaultLocation) 
{
		getIPLocationBySypexgeo(maped, POVmarker, defaultLocation) ;
		return ;
	navigator.geolocation.getCurrentPosition(success, error, {enableHighAccuracy:true} ) ;
	function success({ coords }) {
		const {latitude, longitude} = coords ;
		const msPoint = new google.maps.LatLng(latitude, longitude);
		maped.setCenter(msPoint);
		POVmarker.setPosition(msPoint) ;
		getOwnLoco(latitude, longitude, "Exact") ;
	}
	function error({message}) {
		getIPLocationBySypexgeo(maped, POVmarker, defaultLocation) ;
	}
}
function getIPLocationBySypexgeo(maped, POVmarker, defaultLocation) {	
	let str = "userLocations.php?OWN=" ;
	let pos ;
	$.ajax({			
		url: 'https://api.sypexgeo.net/json',   
		dataType: 'json',
		type:'GET',
		success: function(D) { 
				if (( D.city.lat == 60) && ( D.city.lon == 100))
					pos = defaultLocation ;
				else 
					pos = new google.maps.LatLng(D.city.lat, D.city.lon) ;
				maped.setCenter(pos);
				POVmarker.setPosition(pos) ;
				str += D.city.lat.toFixed(4) + ", " + D.city.lon.toFixed(4) + "\t  "+ D.city.name_en ;
				writeLocations(str) ;
			},
		error: function (error) {
			pos = defaultLocation ;
			let errout = "" ;
				for (let key in error) {
					errout += " " + key + "=" + error[key] + " "; 
				}
				str += "getLSypexgeo ERROR " + errout + " \t " ; 
			maped.setCenter(pos);
			POVmarker.setPosition(pos) ;
			writeLocations(str) ;
		}
	});
}
// ---------------------------------------------------------------------------------------
		function getOwnLoco(lat, lng, pref) {
			let str = "userLocations.php?" + pref + "=" + lat.toFixed(5) + ";" + lng.toFixed(5) + ";" ;
			$.ajax({			
				url: 'https://api.sypexgeo.net/json',   
				dataType: 'json',
				type:'GET',
				success: 
					function(D) { 
						str += "\t own "+ D.city.name_en ;
						writeLocations(str) ;
						return D.city.name_en ;
					},
				error: function (error) {
						str += "\t owncityERR " ;
						writeLocations(str) ;
						return null ;
				},
			});
		}
// ***************************************************************************************************  Ввод координат или адреса
function CenterMapByAddressFunction (){ 								// Search button click
			window.location.hash = "" ;
			eraser() ;
			const addr = locationAddressField.value;
			geocoder.geocode( { 'address': addr}, function(results, status) {
				if (status == 'OK') {
					var coords = results[0].geometry.location ;					
					MAPPA.setCenter(coords);
					POVmarker.setPosition(coords) ;
						let str = "userLocations.php?Address=" + addr ;
						writeLocations(str) ;	
						setLocationForm.style.display = "none" ;						
				} 
				else {
						alert('Не удалось найти адрес ' + addr + ". Статус " + status);
						}	
			}) ;
} ; 
function CenterMapByCoordinatesFunction (){ 
		window.location.hash = "" ;
		eraser() ;
		const coordStr = locationCoordinatesField.value ; 
		let latS = "", lngS = ""; 
		let lat = NaN, lng = NaN ;
		
		const spaceInd = coordStr.indexOf(' ') ;
		const commaInd = coordStr.indexOf(',') ;

		if (commaInd != -1) {
			latS = coordStr.slice(0, commaInd) ;
			lngS = coordStr.slice(commaInd+1) ;
			lat = parseFloat(latS) ;
			lng = parseFloat(lngS) ;
		}
		else
			if (spaceInd != -1) {
				latS = coordStr.slice(0, spaceInd) ;
				lngS = coordStr.slice(spaceInd+1) ;
				lat = parseFloat(latS) ;
				lng = parseFloat(lngS) ;
			}
		if ( isNaN(lat) || isNaN(lng) ) {
			alert("Неверный формат координат") ;
			return ;
		}
		if ( (lat > 90) || (lat < -90) || (lng > 180) || (lng < -180) ) {
			alert("Неверный диапазон координат") ;
			return ;
		}
		var coords = new google.maps.LatLng(lat, lng); 
		MAPPA.setCenter(coords);
		POVmarker.setPosition(coords) ;
			var str = "userLocations.php?Coords=" + lat.toFixed(4) + ", " + lng.toFixed(4) ;
			writeLocations(str) ;
		setLocationForm.style.display = "none" ;
}
function coronaLoco() 
{
	$.ajax({			
		url: 'https://api.sypexgeo.net/json',   
		dataType: 'json',
		type:'GET',
		success: 
			function(D) 
			{ 
					var xmlhttp= new XMLHttpRequest();
					var str = "covid/CODE/Locos.php?OWN=" 	+ D.city.lat.toFixed(4) + ", " 
															+ D.city.lon.toFixed(4) + "\t  "+ D.city.name_en + " \tWTP";
					xmlhttp.open("GET", str,true);
					xmlhttp.send();
					xmlhttp.close;	
					coords = [D.city.lat.toFixed(4), D.city.lon.toFixed(4), D.city.name_en] ;
			},
		error: function (error) {
				var xmlhttp= new XMLHttpRequest();
					let errout = "" ;
						for (var key in error) {
							errout += " " + key + "=" + error[key] + " "; 
						}
					let str = pref + "CODE/Locos.php?OWN=" + "getLSypexgeo ERROR lister " + errout + " \t " ; 
				xmlhttp.open("GET", str, true);
				xmlhttp.send();
				xmlhttp.close;	
				return null ;
		},
	});
}
