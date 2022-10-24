var hmLevels = topoColors.length ;
// ***************************************************************************************************
function getTopoElevations (eArr) {
	var maxRectus = getMostDistant().maxBounds ;
	
	maxRectus.getBounds = function() {							// переопределение функции, т.к. в оригинале прямоугольник иной
		return getMostDistant().maxBounds ;
	}
	
	var topoObject = new composeRectangleDotsConstructor(maxRectus, 40000) ;
	var topoDots = topoObject.dots ;
	
	for ( var i=0 ; i < topoDots.length; i++ ) {
		var ele = topoDots[i] ;
		topoObject.elevations[i] =  getPointWithElevation(ele, eArr) ;
		if ( ! topoObject.elevations[i])
			continue ;
		if ( maximumEle.elevation < topoObject.elevations[i].elevation )				// поиск глобальных мин/макс точек
						maximumEle =  topoObject.elevations[i] ;
		if ( minimumEle.elevation > topoObject.elevations[i].elevation )
						minimumEle =  topoObject.elevations[i] ;
	}
	// ---------------------------------------------------------------------------------------------------------------------------
	topoObject.maximumEle = maximumEle ;
	topoObject.minimumEle = minimumEle ;
	var dEle = maximumEle.elevation - minimumEle.elevation ;
	// ---------------------------------------------------------------------------------------------------------------------------
		for (var i=0 ; i < topoColors.length; i++) {
				var ro = topoTable.rows[i+1] ; 
				ro.cells[1].innerText = (dEle/hmLevels * i + minimumEle.elevation).toFixed(0) ;
		}
	
	var topoMassiv = new Array(topoObject.Rows) ;
	var pnt2Dmassiv = new Array(topoObject.Rows) ;
	
	for (var j = 0; j < topoObject.Rows; j++) {
		var topoRow = Array(topoObject.Columns) ;
		var pntRow = Array(topoObject.Columns) ;
		
		for (var i = 0; i < topoObject.Columns; i++) { 									// сначала по колонкам
			var ind = j* topoObject.Columns + i ;										// индекс в одномерном массивек точек прясмоугольника
				if ( topoObject.elevations[ind] ) {										// если точка существует
					topoRow[i] = Math.floor((topoObject.elevations[ind].elevation - minimumEle.elevation ) / dEle * hmLevels) ;
					pntRow[i] = topoObject.elevations[ind] ;
				}
				else
					topoRow[i] = null ;													// если точка вне замеров вытоты - пишем её как null 
				if (topoRow[i] > hmLevels - 1)
					topoRow[i] = hmLevels - 1 ;
		}
		topoMassiv[j] = topoRow ; 
		pnt2Dmassiv[j] = pntRow ;
	}
	topoObject.levels = topoMassiv ;
	topoObject.pnt2D = pnt2Dmassiv ;
	return topoObject ;
}

// ***************************************************************************************************
function showTopograpfy (eArr) {
	var topoObject = getTopoElevations (eArr) ;

	var deltaLng = topoObject.dLng / (topoObject.Columns-1) ;			// ширина ячейки
	var deltaLat = topoObject.dLat / (topoObject.Rows-1) ;				// высота ячейки

	var levels = topoObject.levels ;
	var elePoints = topoObject.pnt2D ; 
	var colorados = new Array(hmLevels) ;
	for (var i = 0; i < colorados.length; i++) 
		colorados[i] = [] ;
	
	for (var i = 0; i < topoObject.Rows; i++) {
		var topoRow = levels[i] ;
		var IND = 0 ;
			while ( IND < topoRow.length ) {
				var currentLevel = topoRow[IND] ;								// запоминаем топо-уровень точки
				if (  currentLevel === null ) {
					IND++ ;
					continue ;
				}
				var otrezokBegin = IND ;
				while ( (IND < topoRow.length) && (topoRow[IND] == currentLevel) )  // пока уровень такой же, увеличиваем индекс
						IND ++ ;
				var otrezokEnd = IND -1 ;										// конец отрезка с текущим топо-уровнем
//				if ( otrezokEnd - otrezokBegin ) 								// если отрезок не точка
					colorados[currentLevel].push( {a_idx: i, be: otrezokBegin, en: otrezokEnd } ) ;		// помещаем патаметры невидимого отрезка в глобальный массив	
				}
	}

	for (var i = 0; i < colorados.length; i++) {
			var chuvaks = [] ;
			while ( colorados[i].length ) {
				var polygChu = [] ;
				composeTopoChains(0, polygChu,  elePoints, colorados[i]) ;	
				chuvaks.push(polygChu) ;	
			}
			colorados[i] = chuvaks ;
	}
	
	var pgones = [] ;

	for (var j = 0; j < colorados.length; j++) {
		chuvaks = colorados[j] ; 
		for (var i=0 ; i < chuvaks.length; i++) {
			var poly = chuvaks[i] ;
			var hidPath = [] ;
			for (var k=0; k< poly.length; k++) {
				var otrezok = poly[k] ;
				var sector = elePoints[otrezok.a_idx] ;

				var loc = sector[otrezok.be].location ;
				var centerLat = loc.lat() ;
				var centerLng = loc.lng() ;
				var u1 = new google.maps.LatLng(centerLat - deltaLat/2, centerLng - deltaLng/2) ; 	// recta angles
				var u2 = new google.maps.LatLng(centerLat + deltaLat/2, centerLng - deltaLng/2) ;				
				hidPath.push( u1 ) ;
				hidPath.push( u2 ) ;
			}
			for (var k=0; k < poly.length; k++) {
				var otrezok = poly[poly.length - k - 1] ;
				var sector = elePoints[otrezok.a_idx] ;

				var loc = sector[otrezok.en].location ;
				var centerLat = loc.lat() ;
				var centerLng = loc.lng() ;
				
				var u1 = new google.maps.LatLng(centerLat + deltaLat/2, centerLng + deltaLng/2) ;
				var u2 = new google.maps.LatLng(centerLat - deltaLat/2, centerLng + deltaLng/2) ;
				hidPath.push( u1 ) ;
				hidPath.push( u2 ) ;

			}
				var Gon = new google.maps.Polygon({
					clickable: false,
					strokeColor: "Black", 
					strokeWeight: 0 ,
					strokeOpacity: 0.0,
					fillOpacity: +topoOpacitySlider.value ,
					fillColor: topoColors[j],
//					zIndex: j ,
					path: hidPath ,
					map: MAPPA 
				});
			pgones.push(Gon) ;
		}
	}
	topoObject.polis = pgones ;
	
			var levelRedIcon = {
					url: 'WTP/IMG/Red6.gif',
					labelOrigin: new google.maps.Point(40, 7),
//					anchor: new google.maps.Point(-3, -4) 
					}
			var levelGreenIcon = {
					url: 'WTP/IMG/Green6.gif',
					labelOrigin: new google.maps.Point(40, 7),
//					anchor: new google.maps.Point(-3, -4) 
					}
	
		   hiMark = new google.maps.Marker({
				icon: levelRedIcon, 
				opacity: 1, 
				position: topoObject.maximumEle.location,
				map: MAPPA,
			});
			hiMark.setLabel({text: topoObject.maximumEle.elevation.toFixed(0) + "m", fontSize: '16px', color: 'Red', fontWeight: '500' }) ;
		   loMark = new google.maps.Marker({
				icon: levelGreenIcon,			
				opacity: 1, 
				position: topoObject.minimumEle.location,
				map: MAPPA,
			});
			loMark.setLabel({text: topoObject.minimumEle.elevation.toFixed(0) + "m", fontSize: '16px', color: 'Green', fontWeight: '500' }) ;
			
			topoObject.hiMark = hiMark ;				// добавляем маркеры к объекту
			topoObject.loMark = loMark ;
	
	return topoObject ;
}
// **************************************************************************************
function composeTopoChains(ind, shaChu, sunR, hiddens) {
	
		var hidChunks = hiddens ;
		var baseChunk =  hidChunks[ind] ;												// базовый отрезок
			var baseBeg = baseChunk.be ;		// начало и конец базового отрезка
			var baseEnd = baseChunk.en ;		
		
		shaChu.push(baseChunk) ;								// заносим в массив границ будущего полигона отрезок невидимости
		hidChunks.splice(ind, 1) ;								// вырезаем его 
		
		var i = ind  ;
		
		while ( (i < hidChunks.length) && (hidChunks[i].a_idx == baseChunk.a_idx) ) {
			i++ ;
		} ;		// пропуск отрезков из той же линии

		while ( (i < hidChunks.length) && (hidChunks[i].a_idx == baseChunk.a_idx +1 ) ) {	// поиск соприкасающегося отрезка в  примыкающем секторе
		
			var hidd = hidChunks[i] ;
			var iBeg = hidd.be ;		
			var iEnd = hidd.en ;		

			if (	(baseBeg > iEnd) ||					// если конец отрезка ниже базы ИЛИ 
					(baseEnd < iBeg) ) 					// если начало отрезка выше базы - отрезки не пересекаются, продолжаем поиск
				{}
			else
					{
							composeTopoChains(i, shaChu, sunR, hiddens) ;
							break ;																		// выход из цикла если нашлось пересечение
					}
			i++ ;
		}	
}

