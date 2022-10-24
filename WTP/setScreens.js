
// ######################################################################################################################################
function setBegins() {
	
	computeDistanceBetween = google.maps.geometry.spherical.computeDistanceBetween;
    computeOffset = google.maps.geometry.spherical.computeOffset;
	interpolate = google.maps.geometry.spherical.interpolate ;

	
		holesGone =  MAPPA.data.add ({}) ;				// дырчатый полигон для зоны видимости. добавляем в слой данных 
		MAPPA.data.setStyle(function(feature) {
			return ({
						clickable: false,
						strokeColor: '#0000FF',
						strokeOpacity: 0.2,
						fillOpacity: 0.2,
						fillColor: "Red", 
				});
			});
	    POVmarker = new google.maps.Marker({					// EYE marker
				map: MAPPA,
				position: POV.location,
				icon: eyeImage,
				draggable: true ,
				opacity: 0.7
		});
		
		google.maps.event.addListener(POVmarker, "drag", function(event) {
				showLatLngOnMouseMove(event) ;
				POV.location = event.latLng ;										// присваиваем поцизию Глаза для POV
				var pWithEl = getPointWithElevation(POVmarker.position, AllRects) ;
				if (pWithEl == null)												// если нет высот в позиции мыши - выход из функции
					return ;
				POV.elevation = pWithEl.elevation ;									// задаём высоту для POV
				if ( AllRects.length > 0 )
					drawGorizont(  getHorizonT(POV, AllRects) )   ;
		}) ;

		CanvaWid = Math.floor( ( ( document.documentElement.clientWidth - 120)/360) )*360 ;			// ширина канвы пропорционально 360

		eleCanva.style.width = CanvaWid + "px" ;
		eleCanva.style.height = "30vh" ;

							//*********************************************************************************** Geocoder
  	 	 	  		 		geocoder = new google.maps.Geocoder();
													   // Try HTML5 geolocation.
														   
 
//							getLocationByIpStack(MAPPA) ;
//							getLSypexgeo(MAPPA)  ;
 
  		  
							//***********************************************************************************
		google.maps.event.addListener( MAPPA, 'mousemove', showLatLngOnMouseMove) ;								// вывод информации о точке при движении мыши
		google.maps.event.addListener( MAPPA, 'touchmove', showLatLngOnMouseMove) ;	
		

//		mapCell.style.height =   "80vh"; // вкл/выкл показ канвы
		
		var lng = navigator.browserLanguage || navigator.language || navigator.userLanguage;
		if ( (lng != "ru") && (lng != "RU") && (lng != "ru-RU"))
			LANG = "EN" ;
		
		showHelps() ;

//		setLocationForm.style.display = 'block'	;
		
		var nua = navigator.userAgent ;
		var isM = isMobile.any() ;
		
		if ( isM) 
			for (var i = 0; i < iniHiddenButts.length; i++)
				iniHiddenButts[i].style.opacity = 0.9 ;
		
		helpButt.onclick = function() {
				if ( LANG == "RU" ) 
						window.open('WTP/helpRU.html') ;
				else 	window.open('WTP/helpEN.html') ;
		 } ;							
		 
//----------------------------------------------------------------------------------------------------							
		helpOnOff.onclick = function() {
			if (isHelpOn) {
				isHelpOn = false ;
				helpOnOff.innerHTML = "HELP<br>ON" ;
				ENRU.style.display = "none" ;
			} else {
				isHelpOn = true ;
				helpOnOff.innerHTML = "HELP<br>OFF"
				ENRU.style.display = "block" ;				
			} 
			showHelps() ;
		}
//----------------------------------------------------------------------------------------------------				
			ENRU.onclick = function ()
			{
				if ( LANG == "EN" ) {
					LANG = "RU" ;
					ENRU.innerHTML = "English" ; }
				else	{
					LANG = "EN" ;
					ENRU.innerHTML = "Russian" ; }
				showHelps() ;
			}
//----------------------------------------------------------------------------------------------------				
		panoramaButt.onclick = function() {

			if ( ! panoramaButtPressed) {
				closeButts () ;
				canvaTable.style.display = "block" ;				
				canvaTable.style.height = "30vh" ;				
				mapCell.style.height =   "70vh" ;
				drawSector(+horizonSlider.value , canvair) ;
				panoramaButtPressed = true ; }
			else closeButts () ;
		}
//----------------------------------------------------------------------------------------------------				
		profileButt.onclick = function() {
			if ( ! profileButtPressed) {
				closeButts () ;				
				canvaTable.style.display = "block" ;
				mapCell.style.height =   "70vh" ;
				drawProfile(+horizonSlider.value , canvair) ;
				profileButtPressed = true ; }
			else closeButts () ;				
			}
//----------------------------------------------------------------------------------------------------				
		polyButt.onclick = function() {
			if ( ! polyButtPressed) {
				closeButts () ;				
				canvaTable.style.display = "block" ;
				mapCell.style.height =   "70vh" ;
				MAPPA.setOptions({ draggableCursor: "crosshair"}) ;
				profilePolyLine (MAPPA) ;
				polyButtPressed = true ; }
			else closeButts () ;				
			}
//----------------------------------------------------------------------------------------------------		
		sunnyButt.onclick = function() {
			if ( ! sunnyButtPressed ) {
				closeButts () ;				
				sunTable.style.display = "block" ;
				mapCell.style.height =   "90vh" ; 
				sunRays() ;
				sunnyButtPressed = true ; }
			else closeButts () ;				
		}
//----------------------------------------------------------------------------------------------------	
		topoButt.onclick = function() {
			if ( topoObject) {
				topoDiv.style.display = "none" ;				
				topoObject.hiMark.setMap(null) ;							// скрываем маркеры мин макс высот
				topoObject.loMark.setMap(null) ;
				for (var i=0; i < topoObject.polis.length ; i++)
					if ( topoObject.polis[i] )
						topoObject.polis[i].setMap(null) ;					// скрываем прямоугольнкики высот
					topoObject = null ;
			}
			else {
				topoObject = showTopograpfy(AllRects) ;
				topoDiv.style.display = "block" ;
			}
		}
//----------------------------------------------------------------------------------------------------	
		openLupas.onclick = function() {

				if ( ! hiMark.getMap() )
					setLupa(AllRects) ;
				else {
					hiMark.setMap(null) ;
					loMark.setMap(null) ;
					lupaRecta.setMap(null) ;
					lupaRecta.rectWi.setMap(null) ;
					lupaRecta.rectHe.setMap(null) ;
				}
		}

//----------------------------------------------------------------------------------------------------			
		horiLeftVal.innerHTML = horizonSlider.min ;				// для слайдера канвы мин\макс поля заполнить
		horiRightVal.innerHTML = horizonSlider.max ;

		locationAddressButton.addEventListener("click", 	CenterMapByAddressFunction) ; 
		locationCoordinatesButton.addEventListener("click",	CenterMapByCoordinatesFunction) ; 
		locationAddressField.addEventListener("keypress", function(event) {						// if ENTER key
						if (event.keyCode == 13)
							locationAddressButton.click(); });
		locationCoordinatesField.addEventListener("keypress", function(event) {			
						if (event.keyCode == 13)
							locationCoordinatesButton.click(); });		
		heightVal.addEventListener("keypress", function(event) {			
						if (event.keyCode == 13)
							drawGorizont(  getHorizonT(POV, AllRects) ); });		
						
		canvair = document.getElementById('eleCanva') ;
		canvair.width = canvair.offsetWidth;
		canvair.height = canvair.offsetHeight;
		canvaContext = canvair.getContext("2d");

		horizonSlider.onchange = function() {
			if ( panoramaButtPressed )
				drawSector(+horizonSlider.value , canvair) ;
			else
				if ( profileButtPressed )
					drawProfile(+horizonSlider.value , canvair) ;
		} ;	
		horizonSlider.oninput = function() {
			if ( panoramaButtPressed )
				drawSector(+horizonSlider.value , canvair) ;
			else
				if ( profileButtPressed )
					drawProfile(+horizonSlider.value , canvair) ;
		} ;	

	 	topoOpacitySlider.oninput = function () {
			for (var i=0 ; i < topoColors.length; i++) {
				var ro = topoTable.rows[i+1] ; 
				ro.cells[0].style.opacity = +topoOpacitySlider.value ;
			}
			if ( topoObject && topoObject.polis )
				for (var i=0; i < topoObject.polis.length ; i++)
						if ( topoObject.polis[i] )
							topoObject.polis[i].setOptions( {fillOpacity: +topoOpacitySlider.value} ) ;
						
		} 
		
		sunTable.style.display = "none" ;
		calendar.valueAsDate = new Date() ;
		
		function hideAddressBar(){
		if(document.documentElement.scrollHeight<window.outerHeight/window.devicePixelRatio)
			document.documentElement.style.height=(window.outerHeight/window.devicePixelRatio)+'px';
				setTimeout(window.scrollTo(1,1),0);
		}
		window.addEventListener("load",function(){hideAddressBar();});
		window.addEventListener("orientationchange",function(){hideAddressBar();});
		
}
// ######################################################################################################################################
// ***************************************************************************************************  Ввод координат или адреса
function CenterMapByAddressFunction (){ 								// Search button click
			window.location.hash = "" ;
			var addr = locationAddressField.value;
			geocoder.geocode( { 'address': addr}, function(results, status) {
				var tt = 0 ;
				if (status == 'OK') {

					var coords = results[0].geometry.location ;					
					MAPPA.setCenter(coords);
					POVmarker.setPosition(coords) ;
					setLocationForm.style.display = "none" ;		
					resetAll() ;

						var xmlhttp= new XMLHttpRequest();
						var str = "Loco.php?Address=" + addr ;
						xmlhttp.open("GET", str,true);
						xmlhttp.send();
						xmlhttp.close;

				} 
				else {
						alert('Не удалось найти адрес ' + addr + ". Статус " + status);
						}	
			}) ;
} ; 
function CenterMapByCoordinatesFunction (){ 
		window.location.hash = "" ;
		var coordStr = locationCoordinatesField.value ; 
		var latS = "", lngS = ""; 
		var lat = NaN, lng = NaN ;
		
		var spaceInd = coordStr.indexOf(' ') ;
		var commaInd = coordStr.indexOf(',') ;

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
		setLocationForm.style.display = "none" ;				
		resetAll() ;
			var xmlhttp= new XMLHttpRequest();
			var str = "Loco.php?Coords=" + lat.toFixed(4) + ", " + lng.toFixed(4) ;
			xmlhttp.open("GET", str,true);
			xmlhttp.send();
			xmlhttp.close;

}
// ######################################################################################################################################
// ********************************************************************************************************************
function showLatLngOnMouseMove(event) {
	var mousePos = event.latLng ;
	var lat = mousePos.lat() ;
	var lng = mousePos.lng() ;
	LatLabel.innerText = lat.toFixed(4)
	LngLabel.innerText = lng.toFixed(4)
	
	var lX = "E";		// East
	var lY = "N" ;		// North
			
	if (lat < 0) 
		{lY = "S"; lat = -lat ;} ;
			
	if (lng < 0) 
		{lX = "W"; lng = -lng ;} ;
			
	var gl = Math.floor(lat) ;				// for Latitude
	var restmin = (lat - gl)*60 ;
	var hmin = Math.floor(restmin) ;
	var restsec = (restmin - hmin)*60 ;
	var gradusLat = gl + String.fromCharCode(176) + hmin + "\'" + restsec.toFixed(0) + "\"" + lY;
			
	gl = Math.floor(lng) ;					// for Longitude
	restmin = (lng - gl)*60 ;
	hmin = Math.floor(restmin) ;
	restsec = (restmin - hmin)*60 ;

	var gradusLng = "  " + gl + String.fromCharCode(176) + hmin + "\'" + restsec.toFixed(0) + "\"" + lX ;
	
	LatInHours.innerText = gradusLat ;
	LngInHours.innerText = gradusLng ;
	
	POV.location = POVmarker.position ;

 	var dist = computeDistanceBetween(POV.location, event.latLng).toFixed(0) ;
 	var azzy = google.maps.geometry.spherical.computeHeading(POV.location, event.latLng).toFixed(0) ;
	distValue.innerText = 	"D  " + dist + "m" ;
	azzyValue.innerText = 	"Azm " + azzy + "°" ;

 	
	var elePoint = getPointWithElevation(mousePos, AllRects) ;
	if ( elePoint == null)				
        EleValue.innerText = "";
	else {
		EleValue.innerText = 	"H  " + elePoint.elevation.toFixed(0) + "m" ;
		appr1.setPosition(pT1.location) ;
		appr1.setMap(MAPPA) ;
		appr2.setPosition(pT2.location) ;
		appr2.setMap(MAPPA) ;
		appr3.setPosition(pT3.location) ;
		appr3.setMap(MAPPA) ;
	}
}
// ********************************************************************************************************************************			
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};		

function showHelps(arg) {
		if ( arg == false )
			isHelpOn = false ;
		if ( arg == true )
			isHelpOn = true ;
	
		if ( LANG == "EN" ) {
			hlpTxt.innerHTML = ENinfoWin ;
			ENRU.innerHTML = "Russian" ; }
			
		else {
			hlpTxt.innerHTML = RUinfoWin ;
			ENRU.innerHTML = "English" ; }
	
		var hmHlps = RuHelps.length ;

	
			for ( var i=0 ; i < hmHlps; i++ ) {
				RuHelps[i].style.display = "none" ;
				EnHelps[i].style.display = "none" ; }
				hlpRect.style.display = 'none' ;

			if ( isHelpOn) {			
				hlpRect.style.display = 'block' ;
				if ( LANG == "RU" ) 
					for ( var i=0 ; i < hmHlps; i++ )
						RuHelps[i].style.display = "block" ;
				if ( LANG == "EN" ) 
					for ( var i=0 ; i < hmHlps; i++ )
						EnHelps[i].style.display = "block" ;
			} 
}


