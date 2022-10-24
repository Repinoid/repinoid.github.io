function getLocationFromURL () {
		if ( ( ! window.location.hash ) || ( window.location.hash == "#null") ) {
				getLSypexgeo(MAPPA)  ;
				return false; 
			}	
	let s = window.location.hash.slice(1) ;				// without #
	var dec = decodeURI (s) ;
			{	let ss 	= dec.replace(/Q/g, '\"') ;
				let ss1	= ss.replace(/V/g, "{" ) ;
				let ss2	= ss1.replace(/U/g, "," ) ;
				dec 	= ss2.replace(/W/g, "}") ;	}
			
	let isHash = tryParsing (dec) ;				// parse coords from URL hash
	if ( ! isHash )								// if bad data in hash - don't continue
		return false ; 
			
	let m, Z ;
		if ( isHash.Z != undefined ) {
				m 	= new google.maps.LatLng(isHash.mC.lat, isHash.mC.lng) ;			// compose map center
				Z	= isHash.Z ;
		}
		if ( isHash.Zoo != undefined ) {						
				m 	= new google.maps.LatLng(isHash.mC.lat, isHash.mC.lng) ;			// compose map center
				Z	= isHash.Zoo ;
		}
		if ( isHash.cam != undefined ) {						
				camFucks = isHash.cam ;
				document.getElementById("slider3D").value = isHash.sharp ;
		}				
		MAPPA.setCenter(m) ;						// set map to hash data
		MAPPA.setZoom(Z) ;	
		
		getOwnLoco(isHash.mC) ;
				// var xmlhttp= new XMLHttpRequest();
				// var str = "Loco.php?URL=" + isHash.mC.lat + ", " + isHash.mC.lng ;
				// xmlhttp.open("GET", str,true);
				// xmlhttp.send();
				// xmlhttp.close;	
		
	return true ;
}

function getLSypexgeo(maped) 
{
	$.ajax({			
		url: 'https://api.sypexgeo.net/json',   
		dataType: 'json',
		type:'GET',
		success: 
			function(D) 
			{ 
				var pos = new google.maps.LatLng(D.city.lat, D.city.lon) ;
				maped.setCenter(pos);
				POVmarker.setPosition(pos) ;
					var xmlhttp= new XMLHttpRequest();
					var str = "Loco.php?OWN=" + D.city.lat.toFixed(4) + ", " + D.city.lon.toFixed(4) + "\t  "+ D.city.name_en ;
					xmlhttp.open("GET", str,true);
					xmlhttp.send();
					xmlhttp.close;							
			},
		error: function (error) {
				var xmlhttp= new XMLHttpRequest();
					let errout = "" ;
						for (var key in error) {
							errout += " " + key + "=" + error[key] + " "; 
						}
					let str = "Loco.php?OWN=" + "getLSypexgeo ERROR lister " + errout + " \t " ; 
//				var str = "Loco.php?OWN=" + "getLSypexgeo ERROR list " + error + " \t " ; 
				xmlhttp.open("GET", str, true);
				xmlhttp.send();
				xmlhttp.close;	
		},
	});
}

function getOwnLoco(reqLoc) 
{
	$.ajax({			
		url: 'https://api.sypexgeo.net/json',   
		dataType: 'json',
		type:'GET',
		success: 
			function(D) 
			{ 
					var xmlhttp= new XMLHttpRequest();
					var str = "Loco.php?URL=" + reqLoc.lat.toFixed(4) + ", " + reqLoc.lng.toFixed(4) + "\t own "+ D.city.name_en ;
					xmlhttp.open("GET", str,true);
					xmlhttp.send();
					xmlhttp.close;							
			},
		error: function (error) {
				var xmlhttp= new XMLHttpRequest();
				var str = "Loco.php?URL=" + reqLoc.lat.toFixed(4) + ", " + reqLoc.lng.toFixed(4) + "\t owncityERR " ;
				xmlhttp.open("GET", str,true);
				xmlhttp.send();
				xmlhttp.close;	
		},
	});
}


