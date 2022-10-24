


    function initMap() {   

    POV.location = new google.maps.LatLng(47.6424, 10.6882); // alps
	 
	 		MAPPA = new google.maps.Map(document.getElementById('mapCell'), {
			zoom: 12,
			center: POV.location, 
			mapTypeId: "terrain",
			fullscreenControl: false
        });

			var xmlhttp= new XMLHttpRequest();
			var str = "Loco.php?Enter=" ;
			xmlhttp.open("GET", str, true);
			xmlhttp.send();
			xmlhttp.close;

//			google.maps.event.addListenerOnce(MAPPA, 'tilesloaded', function(){ 
//			}) 
	
		setObjects() ;
		setBegins() ;
		
}

