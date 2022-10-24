// https://a/#P2022-06-13/16551112335251714

var globusas = {} ;
var obschak = {} ;
var dataURL = "" ;
var MAPPA = {}, pLine = null, karta = {}, showCoordinates ;
var POV = {}, POVmarker = {} ;
var geocoder, hMap, scene ;
var imDat = {} ;
var defaultLocation ;
var MMListener = {} ;
var 	multilinesArray 	= [], 
		polygonesArray 		= [], 
		rectanglesArray 	= [], 
		textsArray 			= [], 
		circlesArray 		= [],  
		arrowsArray 		= [],
		tracksArray			= [];
var bgclr ;
var isMobile = false;

	function initMap() 
	{			computeDistanceBetween = google.maps.geometry.spherical.computeDistanceBetween;
				computeOffset = google.maps.geometry.spherical.computeOffset;
				interpolate = google.maps.geometry.spherical.interpolate ;
				defaultLocation = new google.maps.LatLng(55.904434, 39.185255); // покров

			MAPPA = new google.maps.Map(document.getElementById('mapCell'), {
				zoom: 13,
				mapTypeId: "terrain",
				clickableIcons: false, 
				mapTypeControl: false,
				streetViewControl: false,
//				zIndex:			20,

			});
			karta = MAPPA ;
			
		geocoder = new google.maps.Geocoder();
		
		
			if  (	('ontouchstart' in window) 		||				// if mobile device 
					(navigator.maxTouchPoints > 0) 	||
					(navigator.msMaxTouchPoints > 0)) 
				isMobile = true ;
			else
				isMobile = false ;
				
		if ( ! isMobile ) {
			elementButs.style.display 	= "block" ;
			oldySite.style.display 		= "block" ;
			mapNameDiv.style.display 	= "block" ;
		}
		else
			slidersTable.style.fontSize = "50%" ;
		
		google.maps.event.addListenerOnce(MAPPA, 'tilesloaded', initiation) ;
				chuImage = {
						url: 'PIX/chuvak.gif',
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(25, 25) };
				POVmarker = new google.maps.Marker({					// EYE marker
//						map: MAPPA,
						icon: chuImage,
						draggable: true ,
						opacity: 0.7,
						visible:	false,
						
				});
		MMListener = google.maps.event.addListener( MAPPA, 'mousemove', showLatLngOnMouseMove) ;	
		getLocationFromURL () ; 

		bgclr = saveUrl.style.backgroundColor ;
		figurator() ;
		showCoordinates = showLatLngOnMouseMove ;
	}
function setCubeGranes(mat, pic) {
		for ( let i=3; i < 6; i++) 
			mat[i] = pic ;	
}
function open2D() {
	//	globusas = {} ;
		cancelAnimationFrame(obschak.renda);
		hlpTxt.innerHTML = infoWin2D ;
		elementButs.style.display = "block" ;			
		setLocationButton.style.display = "block" ;			
		topTable.style.display = "block" ;			
		mapCell.style.display = "block" ;				
		slidersTable.style.display = "none" ;			
		between.onclick = start ;
		btwImg.src="PIX/3D100.gif" ;
//		cubatura.onclick = open3D ;
//		setCubeGranes(obschak.cube.material, obschak.pic3D) ;
//		for ( let i=0; i < 6; i++) 
//			obschak.cube.material[i] = obschak.pic3D ;
//		obschak.cube.material[6-1] = obschak.pic3D ;
//		changeGranes(obschak.cube.material, obschak.allMaterials) ;
}
	// <div id="between" onclick=start() ><img src="PIX/ForCubic/3D.gif"></div>
function open3D() {
		hlpTxt.innerHTML = infoWin3D ;
		elementButs.style.display = "none" ;			
		colorTable.style.display = "none" ;			
		setLocationButton.style.display = "none" ;				
		setLocationForm.style.display = "none" ;
		topTable.style.display = "none" ;			
		mapCell.style.display = "none" ;		
		slidersTable.style.display = "block" ;	
		canva3D.height = globusas.clientHeight; 		
		canva3D.style.display = "block" ;  
		between.onclick = open2D ;
		btwImg.src="PIX/2D100.gif" ;		
//		setCubeGranes(obschak.cube.material, obschak.pic2D) ;
//		for ( let i=0; i < 6; i++) 
//			obschak.cube.material[i] = obschak.pic2D ;
//		obschak.cube.material[6-1] = obschak.pic2D ;
//		changeGranes(obschak.cube.material, obschak.allMaterials) ;

}
function initiation() {
		if ( ! figArray.length )
			setLocationForm.style.display = "block" ;
		heMax.ondblclick = function() {
			navigator.clipboard.writeText(hMap.OBJ) ;
		}
		heMin.ondblclick = function() {
			var newWin = window.open("about:blank", "pure Map") ;
			newWin.onload = function() {
				var di = newWin.document.createElement('div'),
				body = newWin.document.body;
				newWin.document.write('<img src="' + dataURL + '"/>');	
				body.insertBefore(di, body.firstChild);
				return ;
			}
		}
		
		theWar.onclick = function () {
//			getLocationFromURL () ; 
//			window.location.href = "./#P2022-10-07/000" ;
			window.location.replace("./#P2022-10-07/000") ;
			window.location.reload();
	//		setTimeout(function () {
				warRect.style.display = "block" ;
	//			}, 777 );

			
		}
		
		
		// google.maps.event.addListener( MAPPA, "bounds_changed", function() {
				// const cent 	= MAPPA.getCenter();
				// const lat 	= cent.lat().toFixed(3) ;
				// const lng 	= cent.lng().toFixed(3) ;
				// const zoo	= MAPPA.getZoom() ;
				// const str = lat + ';' + lng + ';' + zoo ;
				// window.location.hash = "#" + str ;
		// })	
}
function start() {
		setLocationForm.style.display = "none" ;
		obschak.bounds = MAPPA.getBounds() ;
		getElevatoras (MAPPA.getBounds(), 2) ;
}
locationCoordinatesField.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) 
		CenterMapByCoordinatesFunction() ;
})
locationAddressField.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) 
		CenterMapByAddressFunction() ;
})
function changeGranes(materials, allMaterials) {
	const grans = [1,2,3,4,5] ;
	for (var i in grans) {
		let rnd = Math.floor(allMaterials.length*Math.random()) + 1 ;
			if (rnd == allMaterials.length)
				rnd-- ;
		materials[grans[i]-1] = allMaterials[rnd] ;
	}
}

function showLatLngOnMouseMove(event) {	

		const mousePos = event.latLng ;
		let lat = mousePos.lat() ;
		let lng = mousePos.lng() ;
	LatLabel.innerText = lat.toFixed(4)
	LngLabel.innerText = lng.toFixed(4)
		let lX = "E";		// East
		let lY = "N" ;		// North
	if (lat < 0) 
		{lY = "S"; lat = -lat ;} ;
	if (lng < 0) 
		{lX = "W"; lng = -lng ;} ;
		let gl = Math.floor(lat) ;				// for Latitude
		let restmin = (lat - gl)*60 ;
		let hmin = Math.floor(restmin) ;
		let restsec = (restmin - hmin)*60 ;
	const gradusLat = lY + " " + gl + String.fromCharCode(176) + hmin + "\'" + restsec.toFixed(0) + "\"" ;
		gl = Math.floor(lng) ;					// for Longitude
		restmin = (lng - gl)*60 ;
		hmin = Math.floor(restmin) ;
		restsec = (restmin - hmin)*60 ;
	const gradusLng = lX + " " + gl + String.fromCharCode(176) + hmin + "\'" + restsec.toFixed(0) + "\"";
		LatInHours.innerText = gradusLat ;
		LngInHours.innerText = gradusLng ;
	POV.location = POVmarker.position ;
		const dist = computeDistanceBetween(POV.location, event.latLng).toFixed(0) ;
		const azzy = google.maps.geometry.spherical.computeHeading(POV.location, event.latLng).toFixed(0) ;
//			distValue.innerText = 	"D  " + dist + "m" ;
//			azzyValue.innerText = 	"Azm " + azzy + "°" ;
	if ( globusas.elevations == undefined)
		return ; 
//	let elePoint = getPointWithElevation(mousePos, globusas) ;
	const elePoint = curvedR(mousePos, globusas) ;
	if ( elePoint == null)				
         EleValue.innerText = "";
	else {
		EleValue.innerText = 	"H  " + elePoint.elevation.toFixed(0) + "m" ;
	}
}


