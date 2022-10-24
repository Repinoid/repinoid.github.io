function closeButts () {
	
		sunTable.style.display = "none" ;
		canvaTable.style.display = "none" ;
		profileButtPressed = false ;
		sunnyButtPressed = false ;
		panoramaButtPressed = false ;
		polyButtPressed = false ;

		sectorGon.setMap(null);
		pLine.setMap(null) ;

		mapCell.style.height =  "100vh"; 

		if ( shaPolyGones ) {
			for (var i=0 ; i < shaPolyGones.length; i++) 
				if (shaPolyGones[i]) 
					shaPolyGones[i].setMap(null) ;
			shaPolyGones.length = 0 ; }
			
		closePolyProfileLine(polyLineForProfile) ;
		MAPPA.setOptions({ draggableCursor: "auto"}) ;
}

// ***************************************************************
function drawProfile(azzy, canva)
{ 	if (horiPnts.length == 0)
		return null ;
			canva.width = canva.offsetWidth;
			canva.height = canva.offsetHeight;
			context = canva.getContext("2d");	
			context.clearRect(0, 0, canva.clientWidth, canva.clientHeight);
	let cRect = canva.getBoundingClientRect() ;
	let dAn = maximumEle.elevation - minimumEle.elevation ;					// min max углы зрения
	let hLen = horiPnts.length ;
	let maxDist = getMostDistant().dist ;
	let xStep = CanvaWid / maxDist ;								// шаг в пикселах
			horizonSlider.min = -240 ;
			horizonSlider.max = 240 ;
			horiLeftVal.innerHTML = "-240&ordm" ;						// вывод границ угла обзора возле ползунка 
			horiRightVal.innerHTML = "240&ordm";
	
			let angle = +horizonSlider.value ;
			let elevSlice = rawSlice (POV, angle, AllRects) ;
				for (let i=1 ; i < elevSlice.length; i++) {
					let dDist = elevSlice[i].distance - elevSlice[i-1].distance ;					// шаг - расстояние between 
					let dX = dDist * xStep ;										
					let X0 =  elevSlice[i].distance*xStep ;
					let dY = ( (elevSlice[i].elevation - minimumEle.elevation)  / dAn) * (cRect.height - 10) ; 				// высота точки горизонта в пикселах			
					let Y0 = cRect.height - dY ;
					if (elevSlice[i].vidno) 
						context.fillStyle = curColor.style.backgroundColor ;				// if visible
					else
						context.fillStyle = "#808080";
					context.fillRect(X0, Y0, dX+1, dY) ;					
				}
			let mPpos = elevSlice.maxViewPnt.distance*xStep ;				// вертикальная линия - точка горизонта
			context.fillStyle = "Green";
			context.fillRect(mPpos, 0, 3, cRect.height) ;	
			context.font = "italic 14pt Arial";								// расстояние до горизонта
			context.textBaseline = "top";
			context.fillStyle = "Red";
			if ( mPpos < CanvaWid *0.77 ) {
					context.textAlign = "left";
					context.fillText(elevSlice.maxViewPnt.distance.toFixed(0), mPpos + 2, 5);  }
				else {
					context.textAlign = "right";
					context.fillText(elevSlice.maxViewPnt.distance.toFixed(0), mPpos - 2, 5); }
					
	let karta = MAPPA ;					
	let diagonale = computeDistanceBetween( karta.getBounds().getNorthEast(), karta.getBounds().getSouthWest()) ;		// рисуем сектор обзора
	let middleLine = [] ;
	gonP = computeOffset(POV.location, diagonale, azzy);
		middleLine.push(POV.location) ;
		middleLine.push(gonP) ;
		pLine.setMap(karta) ;
		pLine.setPath(middleLine) ;
	maxAnInd.innerHTML = maximumEle.elevation.toFixed(0) ;
	minAnInd.innerHTML = minimumEle.elevation.toFixed(0) ;
}
// ****************************************************************************