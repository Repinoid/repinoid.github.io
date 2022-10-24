var camFucks = {x:0, y:0, z:0, rX:0, rY:0, rZ:0} ;

var renda ;
var objectData = {} ;
var mapSkin = "" ;
var LANG = "RU" ;
var isHelpOn = true ;
var r, geocoder, MAPPA ;
var POV = {} ;
var POVmarker = {} ;
var Recta = {} ;
var AllRects = [] ;
var AllRectsBorders = {} ;
EARTH_RADIUS = 6378300;
var mostDistant ;
var maximumEle={} ;
var minimumEle={} ;
var horiGon = {} ;
var subRectas = [] ;
var uString = {} ;					// for URL 
var isVeryBeginning = true ; 

var horiPnts = [] ;

var hiddenChunks = [] ;

var polyLineForProfile = {} ;

var dlt = 3 ;					// несовпадение высоты экрана
var t1, t2 ;
var canvair, canvaContext, CanvaWid ;
var pLine = {} ;
var topoObject = null ;
var gradiObject = null ;
var lupaObject = null ;
var panoramaButtPressed = false ;
var profileButtPressed = false ;
var sunnyButtPressed = false ;
var polyButtPressed = false ;

var sunSpots = [] ;
var shaPolyGones = [] ;

var topoColors = [
'#00FF00',
'#228B22',
'#006400',
'#ADFF2F',
'#DAA520',
'#CD5C5C',
'#A0522D',
'#8B0000'

/* "#00FA9A",
"#00FF7F",
"#00FF00",
"#008000",
"#006400",
"#D2B48C",
"#DEB887",
"#CD853F",
"#D2691E",
"#B22222"
 */]
var iniHiddenButts = [
	parametersCell,
	panoramaButt,
	topoButt,
	sunnyButt,
	profileButt,
	polyButt,
	butt3D,
	openLupas,
	helpOnOff
	] ;
	
var RuHelps = [
		setLocoHelpRU,
		getEleHelpRU,
//		newAreaHelpRU, 
		panoramaButtHelpRU,
		profileButtHelpRU,
		topoButtHelpRU,
		sunnyButtHelpRU,
		polyButtHelpRU ] ;
		
var EnHelps = [
		setLocoHelpEN,
		getEleHelpEN,
//		newAreaHelpEN,
		panoramaButtHelpEN,
		profileButtHelpEN,
		topoButtHelpEN,
		sunnyButtHelpEN,
		polyButtHelpEN
	] ;	
	
	
RUinfoWin = "Определение области видимости и топографии местности<br><hr>" +
			"Задайте местоположение нажатием <img src='WTP/IMG/SearchLoc.gif'><br>" +
			"Маркер <img src='WTP/IMG/eye.gif'> положения наблюдателя <hr>	" +
			"Изменение масштаба карты - колёсиком мышки <br>или контролами в правом нижнем углу карты<hr>" +
			"нажатием <img src='WTP/IMG/Download.gif'> <b> получите данные</b><hr>" +
			"<img src='WTP/IMG/3D.png'> - переход в 3D режим";

ENinfoWin = "Horizon line visualisation & topology<br><hr>" +
			"Change position / dimensions of the map <br> <Hr>" +
			"Set location by <img src='WTP/IMG/SearchLoc.gif'>"+ 
			"The marker <img src = 'WTP/IMG/eye.gif'> position of the observer <br> <Hr>" +
			"Dragging the map - <br> holding the left mouse button  <Hr>" +
			"Changing the scale of the map - the mouse wheel <br> or controls in the lower right corner of the map <hr>" +
			"Changing the type of map (terrain, satellite) - the upper left corner of the map<hr>"+
			"Press Icon at the left <img src='WTP/IMG/Download.gif'> <b> GET Data</b>" +
			"<img src='WTP/IMG/3D50.gif'> - 3D map mode";

function setObjects() {
	
		levelRedIcon = {
					url: 'WTP/IMG/Red6.gif',
					labelOrigin: new google.maps.Point(40, 7),
					}
		levelGreenIcon = {
					url: 'WTP/IMG/Green6.gif',
					labelOrigin: new google.maps.Point(40, 7),
					}
	
		hiMark = new google.maps.Marker({
				icon: levelRedIcon, 
				opacity: 1, 
			});
		hiMark.setMap(null) ;
		loMark = new google.maps.Marker({
				icon: levelGreenIcon,			
				opacity: 1, 
			});
	
	
	 for (var i=0 ; i < topoColors.length; i++) {
		var row = topoTable.insertRow(-1) ;
		var colorCell = row.insertCell(0) ;
		colorCell.style.backgroundColor = topoColors[i] ;
		colorCell.style.opacity = +topoOpacitySlider.value ;
		colorCell.style.height = "25px" ;
		var colorCell = row.insertCell(1) ;
	} 

 	geocoder = new google.maps.Geocoder();
	
	eyeImage = {
				url: 'WTP/IMG/eye.gif',
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(25, 25) };
				
	areaMarkerImage = {
				url: 'WTP/IMG/dot1.gif',
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(10, 10) };
 
	horiGon = new google.maps.Polygon({
        clickable: false,
        strokeColor: '#0000FF',
        strokeOpacity: 0.2,
		fillOpacity: 0.2,
		fillColor: "Red", 
        map: MAPPA 
    });
	
	sectorGon = new google.maps.Polygon({
        clickable: false,
        strokeColor: '#0000FF',
        strokeOpacity: 0.2,
		fillOpacity: 0.2,
		fillColor: "Green", 
        map: MAPPA 
    });
	
	infoWin = new google.maps.InfoWindow({
    });
	
	
	
    appr1 = new google.maps.Marker({
				icon: {url: 'WTP/IMG/dot5.gif'} , 
				opacity: 1
		});
    appr2 = new google.maps.Marker({
				icon: {url: 'WTP/IMG/dot5.gif'} , 
				opacity: 1
		});
    appr3 = new google.maps.Marker({
				icon: {url: 'WTP/IMG/dot5.gif'} , 
				opacity: 1
		});

    pLine = new google.maps.Polyline({ 
        clickable: false, //
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
    });

	curColor.style.backgroundColor = "Red" ;
}