
function getRectUnderRays (angle, nDirect, nPerpend) {
	
	var eArr = AllRects ; 

	if ( AllRects.length == 0)
		return null ;
	
	var bnd = getMostDistant().maxBounds ;
	var mRO = new boundsParameters(bnd) ;			// max Rectangle Options
	
	var diagonaleLength = computeDistanceBetween(mRO.SW, mRO.NE) ;
	var dDirect 	= diagonaleLength / nDirect ;
	var dPerpend 	= diagonaleLength / nPerpend ;
	var grabli, coord ;

	var sunBeams = [] ;
	var sunRaysForward = [], sunRaysBackward = [] ;

	var j = 0 ;
	do {	
			grabli = computeOffset( mRO.center, dPerpend * (j++ +0.5), angle + 90 ) ;	// вправо
//				if ( ! isInRect(grabli, bnd) )											// если перпендикуляр вышел за пределы внешней границы
//					break ;
				var i = 0 ;
				var sliceForward = [] ;
				do  {	
						coord = computeOffset( grabli, dDirect * (i++ +0.5), angle) ;		// продвижение вперёд от перпендикуляра
						var pnt = getPointWithElevation(coord, eArr) ; 					
						if ( ! pnt )													// если нет данных по высоте в этой точке - пропустить
							continue ;
						sliceForward.push(pnt) ;										// поместить отчку в передний  массив
					} while (isInRect(coord, bnd)) ;
		
				i = 0 ;
				var sliceBackward = [] ;
				do  {	
						coord = computeOffset( grabli, dDirect * (i++ +0.5), angle + 180) ;	// продвижение назад от перпендикуляра
						var pnt = getPointWithElevation(coord, eArr) ; 					
						if ( ! pnt )													// если нет данных по высоте в этой точке - пропустить
							continue ;
						sliceBackward.push(pnt) ;										// поместить отчку в передний  массив
					} while (isInRect(coord, bnd)) ;
			sunRaysForward.push ( [sliceForward, sliceBackward] ) ;
	} while ( sliceForward.length || sliceBackward.length  ) ;
	
	j = 0 ;
	do {	
			grabli = computeOffset( mRO.center, dPerpend * (j++ +0.5), angle - 90 ) ;	// влево
//				if ( ! isInRect(grabli, bnd) )											// если перпендикуляр вышел за пределы внешней границы
//					break ;
				var i = 0 ;
				var sliceForward = [] ;
				do  {	
						coord = computeOffset( grabli, dDirect * (i++ +0.5), angle) ;		// продвижение вперёд от перпендикуляра
						var pnt = getPointWithElevation(coord, eArr) ; 					
						if ( ! pnt )													// если нет данных по высоте в этой точке - пропустить
							continue ;
						sliceForward.push(pnt) ;										// поместить отчку в передний  массив
					} while (isInRect(coord, bnd)) ;
		
				i = 0 ;
				var sliceBackward = [] ;
				do  {	
						coord = computeOffset( grabli, dDirect * (i++ +0.5), angle + 180) ;	// продвижение назад от перпендикуляра
						var pnt = getPointWithElevation(coord, eArr) ; 					
						if ( ! pnt )													// если нет данных по высоте в этой точке - пропустить
							continue ;
						sliceBackward.push(pnt) ;										// поместить отчку в передний  массив
					} while (isInRect(coord, bnd)) ;
			sunRaysBackward.push ( [sliceForward, sliceBackward] ) ;
	} while (sliceForward.length || sliceBackward.length ) ;	
	
	sunRaysBackward.reverse() ;
	sunBeams = sunRaysBackward.concat(sunRaysForward) ;
	
	for (var rayInd=0; rayInd < sunBeams.length; rayInd++) {
			sunBeams[rayInd][1].reverse() ;
			sunBeams[rayInd] = sunBeams[rayInd][1].concat(sunBeams[rayInd][0]) ;
	}

				sunBeams.dDist = dDirect ;
				sunBeams.dPerpend = dPerpend ;
				sunBeams.angle = angle ; 
				sunBeams.diagonale = diagonaleLength ; 

	
	return sunBeams ;
}
// ************************************************************************************************
function isInRect( pnt, bnd) {
	var mRO = new boundsParameters(bnd) ;		
	if ((pnt.lat() > mRO.North) ||
		(pnt.lat() < mRO.South) ||
		(pnt.lng() > mRO.East ) ||
		(pnt.lng() < mRO.West ) )
			return null ;
	return 1 ;
}
// **********************************************************************************************

function sunRays() {
	
	var hour = +sunSlider.value ;
	var mins = Math.floor((hour % 1)*60) ;
	var hour = Math.floor(hour) ;
	
	var dt = calendar.valueAsDate.getDate() ;
	var yr = calendar.valueAsDate.getFullYear() ;
	var mnth = calendar.valueAsDate.getMonth() + 1 ;

		var real12hours = POV.location.lng()/15 ;
		var tZone = Math.round(real12hours) ;
		var hDelta = real12hours - tZone ;
		
		var real12String = Math.floor(real12hours) + ":" + ((real12hours % 1)*60).toFixed(0) ;
	
	var sun =  SunPos( POV, yr, mnth, dt, hour, mins, 0, tZone) ;
	
		sunSlider.min = 12 - Math.abs(sun.chU) - hDelta;
		sunSlider.max = 12 + Math.abs(sun.chU) - hDelta;
		sunRiseTime.innerText = timeToStr(12 - Math.abs(sun.chU) - hDelta ) ;
		sunSetTime.innerText  = timeToStr(12 + Math.abs(sun.chU) - hDelta ) ;
	
	
	
	angle = sun.azzy ;
	if ( POV.location.lat() < 0 )
		angle += 180 ;
	angle = angle % 360 ; 
	
	voshod = sun.nad ; 
	

		var hiddens = [] ;
		var visibles = [] ;
		var shadowTan = Math.tan(voshod/180*Math.PI) ;				// во сколько раз тень длиннее
		if ( shadowTan == 0 )										// чтобы на нуль не делилось
			shadowTan = 0.01
		var koef = 1/shadowTan ;

		var sunR = getRectUnderRays (angle, 600, 333) ;
		var dDist = sunR.dDist ; 
		
		for ( var i = 0 ; i < sunR.length ; i++ ) {
			var slice = sunR[i] ;
			var mX = -15000 ;
			for ( var j = 0 ; j < slice.length; j++ ) {					// определение и запись свойства в тени или нет
				if ( dDist*j + slice[j].elevation*koef > mX ) {
					mX = dDist*j + slice[j].elevation*koef ; 
					slice[j].inShadow = false ;
					}
				else 
					slice[j].inShadow = true ;
			}
		}
					for ( var i = 0 ; i < sunR.length ; i++ ) {
						var slice = sunR[i] ;
							var IND = 0 ;
					
								while ( IND < slice.length ) {
										if ( slice[IND].inShadow ) {					// если точка невидима
											var hidBegin = IND ;										// устанавливаем начало невидимого отрезка
											while ( (IND < slice.length) && slice[IND].inShadow )  // ищем конец невидимости
												IND ++ ;
											var hidEnd = IND -1 ;									// последний индекс
											if ( hidEnd - hidBegin) 								// если отрезок не точка
												hiddens.push( {a_idx: i, be: hidBegin, en: hidEnd } ) ;		// помещаем патаметры невидимого отрезка в глобальный массив
										}
										IND++ ;
								}
					}
					sunR.hiddens = hiddens ;
//--------------------------------------------------------------------------------		
					for ( var i = 0 ; i < sunR.length ; i++ ) {
						var slice = sunR[i] ;
							var IND = 0 ;
					
								while ( IND < slice.length ) {
										if (  ! slice[IND].inShadow ) {					// если точка видима
											var hidBegin = IND ;										// устанавливаем начало невидимого отрезка
											while ( (IND < slice.length) && (! slice[IND].inShadow) )  // ищем конец видимости
												IND ++ ;
											var hidEnd = IND -1 ;									// последний индекс
											if ( hidEnd - hidBegin) 								// если отрезок не точка
												visibles.push( {a_idx: i, be: hidBegin, en: hidEnd } ) ;		// помещаем патаметры невидимого отрезка в глобальный массив
										}
										IND++ ;
								}
					}
					sunR.visibles = visibles ;

		
		for (var i=0 ; i < shaPolyGones.length; i++) 
			shaPolyGones[i].setMap(null) ;
		shaPolyGones.length = 0 ;
	
		shaPolyGones = makeShadowGons(sunR, sunR.hiddens) ;
		
		
//		drawHiddens (sunR) ;

		
		sunHour.innerText = "GMT+" + tZone + ":  " + timeToStr(sunSlider.value) + "  Azimuth " + angle.toFixed(1) + "  Declination " + voshod.toFixed(1) ;
		
		return sunR ;
}		
function drawHiddens (sunR) {
		if ( sunR.hiddens.length == 0 )
			return null ; 
	
		for ( var i = 0 ; i < sunSpots.length ; i++ ) 
			sunSpots[i].setMap(null) ;
		sunSpots.length = 0 ;
		
		for ( var i = 0 ; i < sunR.hiddens.length ; i++ ) {
			var hidd = sunR.hiddens[i] ;
			var beg = sunR[ hidd.a_idx ][hidd.be] ;
			var end = sunR[ hidd.a_idx ][hidd.en] ;
			
			var begLeft = computeOffset(beg.location, sunR.dPerpend/2, sunR.angle-90);
			var begRight = computeOffset(beg.location, sunR.dPerpend/2, sunR.angle+90);
			var endLeft = computeOffset(end.location, sunR.dPerpend/2, sunR.angle-90);
			var endRight = computeOffset(end.location, sunR.dPerpend/2, sunR.angle+90);
			var path = [begLeft, begRight, endRight, endLeft] ;
			
			var Gon = new google.maps.Polygon({
				clickable: false,
				strokeColor: "Black", 
				strokeWeight: 0 ,
				strokeOpacity: 0.2,
				fillOpacity: 0.3,
				fillColor: "Black", 
				path: path ,
				map: MAPPA 
			});
			sunSpots.push(Gon) ;
		}
	pLine.setMap(MAPPA) ;
	var pLineEnd = computeOffset(POV.location, sunR.diagonale, sunR.angle);
	pLine.setPath([POV.location, pLineEnd]) ;	

}	
// *************************************************************************
function makeShadowGons(sunR, hiddens)
{
	var chuvaks = [] ;
	while ( hiddens.length ) {
		var polygChu = [] ;
		composeChains(0, polygChu,  sunR, hiddens) ;	
		chuvaks.push(polygChu) ;	
	}
	var pgones = [] ;
	
		for (var i=0 ; i < chuvaks.length; i++) {
			var poly = chuvaks[i] ;
			var hidPath = [] ;
//			if ( poly.length < 2 )
//				continue ; 										// пропускаем если отрезок единичный
			for (var j=0; j< poly.length; j++) {
				var otrezok = poly[j] ;
				var sector = sunR[otrezok.a_idx] ;
				hidPath.push( sector[otrezok.be].location ) ;
			}
			for (var j=0; j < poly.length; j++) {
				var otrezok = poly[poly.length - j - 1] ;
				var sector = sunR[otrezok.a_idx] ;
				hidPath.push( sector[otrezok.en].location ) ;
			}
						var Gon = new google.maps.Polygon({
				clickable: false,
				strokeColor: "Black", 
				strokeWeight: 0 ,
				strokeOpacity: 0.2,
				fillOpacity: 0.3,
				fillColor: "Black", 
				path: hidPath ,
				map: MAPPA 
			});
			pgones.push(Gon) ;
	}
	pLine.setMap(MAPPA) ;
	var pLineEnd = computeOffset(POV.location, sunR.diagonale, sunR.angle);
	pLine.setPath([POV.location, pLineEnd]) ;	

	return pgones ;
}
//*****************************************************************
function composeChains(ind, shaChu, sunR, hiddens) {
	
		var hidChunks = hiddens ;
		var baseChunk =  hidChunks[ind] ;												// базовый отрезок
			var baseBeg = sunR[ baseChunk.a_idx ][baseChunk.be].location ;		// начало и конец базового отрезка
			var baseEnd = sunR[ baseChunk.a_idx ][baseChunk.en].location ;		
			var baseDlina 	= MYcomputeDistanceBetween (baseBeg, baseEnd)				// длина базового отрезка
			var BD2 = baseDlina * baseDlina ;											// квадрат длины
		
		shaChu.push(baseChunk) ;								// заносим в массив границ будущего полигона отрезок невидимости
		hidChunks.splice(ind, 1) ;								// вырезаем его 
		
		var i = ind  ;
		
		while ( (i < hidChunks.length) && (hidChunks[i].a_idx == baseChunk.a_idx) ) {
			i++ ;
		} ;		// пропуск отрезков из той же линии

		while ( (i < hidChunks.length) && (hidChunks[i].a_idx == baseChunk.a_idx +1 ) ) {	// поиск соприкасающегося отрезка в  примыкающем секторе
		
			var hidd = hidChunks[i] ;
			var iBeg = sunR[ hidd.a_idx ][hidd.be].location ;		
			var iEnd = sunR[ hidd.a_idx ][hidd.en].location ;		
			
			var BB =  MYcomputeDistanceBetween (baseBeg, iBeg) ;	
				var BB2 = BB * BB ; 								// квадрат расстояния между началом базы и началом текущего отрезка
			var EB =  MYcomputeDistanceBetween (baseEnd, iBeg) ;	
				var EB2 = EB * EB ; 								// квадрат расстояния между концом базы и началом текущего отрезка
			var BE =  MYcomputeDistanceBetween (baseBeg, iEnd) ;	
				var BE2 = BE * BE ; 								// квадрат расстояния между началом базы и концом текущего отрезка
			var EE =  MYcomputeDistanceBetween (baseEnd, iEnd) ;	
				var EE2 = EE * EE ; 								// квадрат расстояния между концом базы и началом текущего отрезка

			if (	(EE2 > BD2 + BE2) ||					// если конец отрезка ниже базы ИЛИ 
					(BB2 > BD2 + EB2) ) 					// если начало отрезка выше базы - отрезки не пересекаются, продолжаем поиск
				{}
			else
					{
							composeChains(i, shaChu, sunR, hiddens) ;
							break ;																		// выход из цикла если нашлось пересечение
					}
			i++ ;
		}	
}
// **************************************************************
function timeToStr(tim) {
	var hours = Math.floor(tim)  ;
	var mins = (tim % 1) * 60 ;
	var str = hours + ":" + mins.toFixed(0) ;
	if (mins < 10)
		str = hours + ":0" + mins.toFixed(0) ;
	
	return str ;
}
