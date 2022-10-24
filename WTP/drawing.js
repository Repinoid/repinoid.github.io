
// ****************************************************************************
function drawSector(azzy, canva) {
	
	if (horiPnts.length == 0)
		return null ;
	var viewAng = getRadio("panoramaViewAngle") ;
	var karta = MAPPA ;
	
	canva.style.display = "block" ;
	
	canva.width = canva.offsetWidth;
	canva.height = canva.offsetHeight;
	
	context = canva.getContext("2d");	

	context.clearRect(0, 0, canva.clientWidth, canva.clientHeight);
	var cRect = canva.getBoundingClientRect() ;
	
	var dAn = horiPnts.maxAn - horiPnts.minAn ;	
	var hLen = horiPnts.length ;
		var angStep = 360 / hLen ;										// угловой шаг
		var hmSteps = Math.floor( viewAng/ angStep ) ;					// сколько шагов в обозреваемом секторе 
		var xStep = CanvaWid / hmSteps ;								// шаг в пикселах
	var beginAngle = azzy - viewAng/2 ;
	if (beginAngle < -180)
		beginAngle += 360 ;
	if (beginAngle > 180)
		beginAngle -= 360 ;
	
	horiLeftVal.innerHTML = beginAngle.toFixed(0) + "&ordm" ;						// вывод границ угла обзора возле ползунка 
	horiRightVal.innerHTML = (beginAngle + viewAng).toFixed(0) + "&ordm";
	
	var beginIndex = Math.floor ( beginAngle/360 * hLen ) ;
	
	for (var i = beginIndex; i < beginIndex + hmSteps ; i++) {
		var idx = i ;
		
		if (i < 0) 														// для зацикливания массива по кругу
			idx = i + hLen ;
		if (i >= hLen) 
			idx = i - hLen  ;
		
		var X0 = xStep * (i - beginIndex) ;
		var dX = xStep ;

		var horiSlice = horiPnts[idx].vidat ;							// массив видимых точек
		
		for ( j = horiSlice.length - 1; j >= 0; j--) {
			
			var dY = ( (horiSlice[j].viewAngle - horiPnts.minAn)  / dAn) * (cRect.height - 10) ; 				// высота точки горизонта в пикселах			
			var Y0 = cRect.height - dY ;
			
			var colo = (horiSlice[j].distance / horiPnts.maxHorizontDistance) ;
			

/* 			var coloRation = 256 - Math.floor(colo * 16 )*15 ;
			
			var R = (Math.floor(coloRation/2+16)).toString(16) ; 
			var G = coloRation.toString(16) ;

			var B = (Math.floor(coloRation/3+100)).toString(16) ; 
			var colorade = "#"+R+G+B ;
 */		
			var coloRation = 216 - 20*Math.floor(colo*(10)) ;
			
			var RGB = coloRation.toString(16) ; 
			var colorade = "#"+RGB+RGB+RGB ;
		
			context.fillStyle = colorade;
			context.fillRect(X0, Y0, dX, dY) ;					
			
			var RGB = (coloRation-29).toString(16) ; 
			var colorade = "#"+RGB+RGB+RGB ;
			context.fillStyle = colorade;
			context.fillRect(X0, Y0-1, dX, 1) ;					
			
		}
	}
			context.fillStyle = "#FF0000";
			context.fillRect(CanvaWid/2, 0, 2, cRect.height ) ;					
	
	
	var diagonale = computeDistanceBetween( karta.getBounds().getNorthEast(), karta.getBounds().getSouthWest()) ;		// рисуем сектор обзора
		var gonPath = [] ;
		gonPath.push(POV.location) ;
		var gonP = computeOffset(POV.location, diagonale, beginAngle);
		gonPath.push(gonP) ;
		gonP = computeOffset(POV.location, diagonale, beginAngle + viewAng);
		gonPath.push(gonP) ;
		gonPath.push(POV.location) ;	
	sectorGon.setMap(karta);
	sectorGon.setPath(gonPath) ;
	
	var middleLine = [] ;
	gonP = computeOffset(POV.location, diagonale, azzy);
	middleLine.push(POV.location) ;
	middleLine.push(gonP) ;
		
	pLine.setMap(karta) ;
	pLine.setPath(middleLine) ;
	pLine.setOptions( {strokeWeight: 15, opacity: 1, strokeColor: 'black' } ) ;
	
//	document.getElementById('minViewAngleSlider').innerHTML = beginAngle  ;						// значения слайдера угла обзора			
//	document.getElementById('maxViewAngleSlider').innerHTML = beginAngle + viewAng ;
//	document.getElementById('angleRangeCell').innerHTML	= (horiPnts.maxAn*180/Math.PI).toFixed(1) + String.fromCharCode(176)  ;
}
// ****************************************************************************