function getHorizonT(center, sqs, isMaxResolution) {

	hiddenChunks.length = 0 ;
	maxDist = getMostDistant().dist ;
	let N = getRadio("radioSectors") ;						// количество секторов - из значения ползунка
	if (isMaxResolution)
		N = CanvaWid ;
	
	let dAngle = 360 / N;
	var eArr = [] ;
	
	maximumEle.elevation = -15000 ;
	minimumEle.elevation = 15000 ;
	proms = [] ;
	
	for (var i = 0; i < N; i++) {
		var angle = dAngle * i;
		eArr[i] = getSlice(center, angle, sqs, i) ;		// получает срез с высотами и точкой горизонта
	}
	
	var maxAn = -Math.PI / 2; // В честь Ванчинова				вычисление макс мин углов горизонта по всему кругу
	var minAn = Math.PI / 2; // В честь Ванчинова	
	var maxDi = 0 ;
	for (var i=0; i < eArr.length; i++) {
		if (eArr[i].maxViewPnt.viewAngle > maxAn)
			maxAn = eArr[i].maxViewPnt.viewAngle ;
		if (eArr[i].maxViewPnt.viewAngle < minAn)
			minAn = eArr[i].maxViewPnt.viewAngle ;
		if (eArr[i].maxViewPnt.distance > maxDi)
			maxDi = eArr[i].maxViewPnt.distance  ;
	}
	eArr.maxAn = maxAn ;
	eArr.minAn = minAn ;
	eArr.maxHorizontDistance = maxDi ;

	horiPnts = eArr ;									// для глобального объекта 
	
	if (panoramaButtPressed)
		drawSector(+horizonSlider.value , canvair) ;
	
	if (profileButtPressed)
		drawProfile(+horizonSlider.value , canvair) ;
	
	if (isMaxResolution)
		infoWin.close() ;

	var chuvash = [] ;
	var pgones = [] ;
	
	while ( hiddenChunks.length ) {
			var polygChu = [] ;
			AddNextToChain(0, polygChu, hiddenChunks) ;	
		chuvash.push(polygChu) ;	
	}
	
	for (var i=0 ; i < chuvash.length; i++) {
			var poly = chuvash[i] ;
			var hidPath = [] ;
			if ( poly.length < 2 )
				continue ; 										// пропускаем если отрезок единичный
			for (var j=0; j< poly.length; j++) {
				var otrezok = poly[j] ;
				var sector = eArr[otrezok.a_idx] ;
				hidPath.push( sector[otrezok.be].location ) ;
			}
			for (var j=0; j < poly.length; j++) {
				var otrezok = poly[poly.length - j - 1] ;
				var sector = eArr[otrezok.a_idx] ;
					if ( typeof sector[otrezok.en] == "undefined" )
						var rr = 0 ;
				
				hidPath.push( sector[otrezok.en].location ) ;
			}
			pgones.push(hidPath) ;
	}
	eArr.hiddens = pgones ;
	
	maxAnInd.innerHTML = (maxAn*180/Math.PI).toFixed(1) + "&ordm" ;
	minAnInd.innerHTML = (minAn*180/Math.PI).toFixed(1) + "&ordm" ;
	
	return eArr;
}
// ********************************************************************************************************************
function isPointInBorder (coords ) {
	if ( AllRectsBorders.N*AllRectsBorders.S*AllRectsBorders.E*AllRectsBorders.W == undefined )
		return null ;
	if ( coords.lat() > AllRectsBorders.N ) 
		return null ; 
	if ( coords.lat() < AllRectsBorders.S ) 
		return null ; 
	if ( coords.lng() > AllRectsBorders.E ) 
		return null ; 
	if ( coords.lng() < AllRectsBorders.W ) 
		return null ; 
	return 1 ;
}


function rawSlice (center, angle, rectAngles) {
	
	let maxAn = -Math.PI / 2; // В честь Ванчинова
	let maxEleP = null ;
	let steps = +iteraSlider.value ;	
	var elevSlice = [] ;
	let vusota =  + heightVal.value ;
	let dDist0 = Math.sqrt(AllRects[0].density) / steps ; 
	let pnt = computeOffset(center.location, 0, angle) ;
	let dist = 0 ;
	let dDist = dDist0 ;
	let counter = 0 ;
	
	while  ( isPointInBorder(pnt) ) {
		dist += dDist ;		
		pnt = computeOffset(center.location, dist, angle);
					var elePoint = getPointWithElevation(pnt, rectAngles) ;			// превращаем в объект-точку с высотой
					if ( elePoint == null) {										// если coord не входит в области с известными высотами - пропуск остатка цикла
						dDist = dDist0 ;
						continue;
					}
					dDist = elePoint.grid / steps ;
					
					if ( maximumEle.elevation < elePoint.elevation )				// поиск глобальных мин/макс точек
						maximumEle =  elePoint ;
					if ( minimumEle.elevation > elePoint.elevation )
						minimumEle =  elePoint ;
					
					let vA = viewAngel(center, elePoint, vusota );		// получаем угловую выстоту для точки
					if (vA > maxAn) {
						maxAn = vA;													// поиск макс угла наблюдения и соотв. точки
						maxEleP = elePoint;
						maxEleP.viewAngle = maxAn ;
						maxEleP.distance = dist ;
						maxEleP.ind = counter ;
						elePoint.vidno = true ;
					}
					else
						elePoint.vidno = false ;
					counter++ ;
					elePoint.viewAngle = vA  ;										// добавляем в элемент 2 свойства - угол и его расстояние от точки наблюдения
					elePoint.distance = dist ;
					elevSlice.push(elePoint) ;										// пихаем точку в массив
			}								// -----------------------------------------------------------------------------												
		elevSlice.maxViewPnt = maxEleP ;									// точка горизонта - с максимальным углом 
		return elevSlice ;
}
// **********************************************************************************************
function getSlice(center, angle, rectAngles, sliceNumber) {	
		var elevSlice = rawSlice(center, angle, rectAngles) ;
		if ( ! elevSlice )
			return null ;
		maxEleP = elevSlice.maxViewPnt  ;
		if ( ! maxEleP )
			return null ;
		
		var sliceVisiblePoints = [] ;
		for (var i=0 ; i < elevSlice.length; i++) 							// создаём массив из видимых точек
			if ( elevSlice[i].vidno )
				sliceVisiblePoints.push(elevSlice[i]) ;
		elevSlice.vidat = sliceVisiblePoints ;								// задаём свойство видимых точек слою
		
		var IDX = 0 ;
		
		while ( (IDX < maxEleP.ind) && (IDX < elevSlice.length) ) {
				if ( elevSlice[IDX].vidno == false ) {					// если точка невидима
					var hidBegin = IDX ;										// устанавливаем начало невидимого отрезка
					while ( (IDX < maxEleP.ind) && (IDX < elevSlice.length) && (elevSlice[IDX].vidno == false) )  // ищем конец невидимости
						IDX ++ ;
					var hidEnd = IDX -1 ;									// последний индекс
					if ( hidEnd != hidBegin) 								// если отрезок не точка
						hiddenChunks.push( {a_idx: sliceNumber, be: hidBegin, en: hidEnd } ) ;		// помещаем параметры невидимого отрезка в глобальный массив
				}
				IDX++ ;
		}
	return (elevSlice) ; 
}
// ********************************************************************************************************************
function getSlicePromise(center, angle, sqs) {
	return new Promise ( function(resolve, reject) {
		var elevSlice = getSlice (center, angle, sqs) 
		resolve(elevSlice) ;
	})
}
// ********************************************************************************************************************
function getMostDistant() {
	if ( AllRects.length == 0)
		return null ;
	
	var maxim = 0 ;
	var dst ;
	var mS = 300 , mN = -300 , mE = -300, mW = 300 ;
	
	for (var i=0; i < AllRects.length; i++)
	{
		if (   mS > AllRects[i].SW.lat()  )			// most South
			mS = AllRects[i].SW.lat() ;
		if (   mN < AllRects[i].NE.lat()  )			// most North
			mN = AllRects[i].NE.lat() ;
		if (   mW > AllRects[i].SW.lng()  )			// most West
			mW = AllRects[i].SW.lng() ;
		if (   mE < AllRects[i].NE.lng()  )			// most East
			mE = AllRects[i].NE.lng() ;
		dst = MYcomputeDistanceBetween(POV.location, AllRects[i].SW) ;
		if (dst > maxim)
			maxim = dst ;
		dst = MYcomputeDistanceBetween(POV.location, AllRects[i].NE) ;
		if (dst > maxim)
			maxim = dst ;
		dst = MYcomputeDistanceBetween(POV.location, AllRects[i].NW) ;
		if (dst > maxim)
			maxim = dst ;
		dst = MYcomputeDistanceBetween(POV.location, AllRects[i].SE) ;
		if (dst > maxim)
			maxim = dst ;
	}
	
	let SW = new google.maps.LatLng(mS, mW);
	let NE = new google.maps.LatLng(mN, mE);
	
	AllRectsBorders.N = mN ;
	AllRectsBorders.S = mS ;
	AllRectsBorders.W = mW ;
	AllRectsBorders.E = mE ;
	
	var maxBounds = new google.maps.LatLngBounds(SW, NE ) ;	

	mostDistant = maxim ; 
	
	return {dist:maxim, maxBounds: maxBounds } ;
}
// *********************************************************************************************************
function viewAngel(otkuda, kuda, rostOtkuda) {
		var otkudaL = otkuda.location ; 
		var beginElevator = otkuda.elevation + rostOtkuda ; 				//otkuda elevation + viewer height
		var kudaL = kuda.location ;
		var endElevator = kuda.elevation ;
		
		var onSphereDist =  MYcomputeDistanceBetween(otkudaL, kudaL) ;		// расстояние между координатами, на поверхности сферы
		var angBet = onSphereDist  / EARTH_RADIUS ;							// in radians
		
		var a2 = (EARTH_RADIUS + beginElevator) * (EARTH_RADIUS + beginElevator) +								 // by cosinus theorema, a**2
						(EARTH_RADIUS + endElevator) * (EARTH_RADIUS + endElevator) -								// a**2 = b**2 + c**2 - 2*b*c*cos(bc)
							2 * (EARTH_RADIUS + beginElevator)*(EARTH_RADIUS + endElevator)*Math.cos(angBet) ;
		var a 		= Math.sqrt(a2) ;			 // distance between hill's tops
		
		var sinb 	= (EARTH_RADIUS + endElevator) * Math.sin(angBet) / a ;
		
		var viAnPlus90 = Math.asin( Math.sin(angBet)*(EARTH_RADIUS + endElevator)/a) ;
		
		var bOnCos = (EARTH_RADIUS + beginElevator) / Math.cos(angBet) ;
		
		var viAnModule = Math.abs(viAnPlus90 - Math.PI/2) ;
		
		if ( (EARTH_RADIUS + endElevator) <= bOnCos)
			viAn = - viAnModule ;
		else
			viAn =  viAnModule ;
		
		return viAn ;								// in radians
}
//************************************************************************************************
function getRadio(radioName) {
	var elems = document.getElementsByName(radioName);
	for ( var i = 0 ; i < elems.length; i++)
		if ( elems[i].checked )
			return +elems[i].value ;

		return +elems[0].value ;
}
//************************************************************************************************
function setHoriShadow() {
//	horiGon.setOptions( { fillOpacity: curColor.style.opacity, fillColor: curColor.style.backgroundColor } ) ;
	MAPPA.data.setStyle({
			fillOpacity: curColor.style.opacity, 
			fillColor: curColor.style.backgroundColor,
			strokeColor: '#0000FF',
			strokeOpacity: 0.2,
		});
	drawGorizont(  getHorizonT(POV, AllRects) )   ;
}
//************************************************************************************************
function AddNextToChain(ind, polygChu, hidChunks) {
			var currentChunk =  hidChunks[ind] ;				
		polygChu.push(currentChunk) ;				// заносим в массив границ будущего полигона отрезок невидимости
		hidChunks.splice(ind, 1) ;					// вырезаем его 
			let i = ind  ;
		while ( (i < hidChunks.length) && (hidChunks[i].a_idx == currentChunk.a_idx) ) {
			i++ ;
		} ;		// пропуск отрезков из того же сектора

		while ( (i < hidChunks.length) && (hidChunks[i].a_idx == currentChunk.a_idx +1 ) ) {	// поиск соприкасающегося отрезка в  примыкающем секторе
			if ( (hidChunks[i].be <= currentChunk.en) && (hidChunks[i].en >= currentChunk.be) ) {	// если границы пересекаются
				AddNextToChain(i, polygChu, hidChunks) ;
				break ;																			// выход из цикла если нашлось пересечение
			}
			i++ ;
		}
}	
//----------------------------------------------------------------------------	
		function tryParsing (u) {
			try {
				var		obj =	JSON.parse(u) ;
				return (obj) ;
			}
			catch (err) {
				return (false) ;
			}
		}
function composeURL () {
	let uString = {} ;
	let cent = MAPPA.getCenter();
	let lat = okrugl(cent.lat(), 3) ;
	let lng = okrugl(cent.lng(), 3) ;
	let LL = new google.maps.LatLng(lat, lng) ;
	uString.mC 		= 	LL;
	uString.Zoo		= 	MAPPA.getZoom() ;
	uString.cam 	= 	camFucks ;
	uString.sharp 	= 	+document.getElementById("slider3D").value ;
	let sfy = JSON.stringify(uString) ;
	let ss = sfy.replace(/"/g, "Q")
	let ss1 = ss.replace(/{/g, "V")
	let ss2 = ss1.replace(/}/g, "W")
	let ss3 = ss2.replace(/,/g, "U")
	let ss4	= 	encodeURI ( ss3 ) ;
	return (ss4) ;
}
