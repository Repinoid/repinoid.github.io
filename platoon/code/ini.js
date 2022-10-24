//initMap() ;
	
		
	debugger ;
	
var MAPPA ;
var 	multilinesArray 	= [], 
		polygonesArray 		= [], 
		rectanglesArray 	= [] , 
		textsArray 			= [], 
		circlesArray 		= [],  
		arrowsArray 		= [] ;

function initMap() {   // , 
 //    var location = new google.maps.LatLng(47.6424, 10.6882); // alps
	 		MAPPA = new google.maps.Map(document.getElementById('map'), {
			zoom: 12,
			 center: {
					lat: -34.397,
					lng: 150.644 },
        });
			
	const hash = window.location.hash.slice(1) ;
	if ( hash.length > 0) 				// load draw objecrt from URL file
		getFigures(hash) ;

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
