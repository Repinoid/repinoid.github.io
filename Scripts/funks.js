function compressor (obj) {
	const out = {};
	out.B = obj.bnd ;
		out.R = obj.Rows ;
		out.C = obj.Columns ;
	out.H = [] ;
//	out.D = obj.dataURL ;
//	out.D = obj.canvas ;
		for ( let i=0 ; i < obj.pointsNumber; i++)
			out.H.push( parseFloat( obj.elevations[i].elevation.toFixed(3) ) ) ;
	return out ;
}
function fOut (karta) {
	let center = karta.getCenter() ;
	let str = center.lat().toFixed(2) + ',' + center.lng().toFixed(2) + ',' + karta.getZoom() + ".json";
	return str ;
}
///////////////////////////////////////////////////////////////////////
		function tryParsing (u) {
			try {
				const		obj =	JSON.parse(u) ;
				return (obj) ;
			}
			catch (err) {
				return (false) ;
			}
		}
//-----------------------------------------------------		
function restoreRectObj (obj) {						// функция преобразует числовые координаты в LatLng в самом объекте
	
	for (i=0, key = obj.dots; i < key.length; i++) 
			if ( ( typeof key[i].lat == "number" ) &&( typeof key[i].lng == "number" ) ) {			// точки в прямоугольнике
					const lt = key[i].lat ; const lg = key[i].lng ;
					key[i] = new google.maps.LatLng(lt, lg);
				}
	for (i=0 ; i < obj.elevations.length; i++) 														// объекты с высотами
	{		const key = obj.elevations[i].location ;
			if ( ( typeof key.lat == "number" ) &&( typeof key.lng == "number" ) ) {
					const lt = key.lat ; const lg = key.lng ;
					obj.elevations[i].location = new google.maps.LatLng(lt, lg);
				}}
	for (i=0, key=obj.path; i < key.length; i++) 	
			if ( ( typeof key[i].lat == "number" ) &&( typeof key[i].lng == "number" ) ) {			// контур прямоугольника
					const lt = key[i].lat ; const lg = key[i].lng ;
					key[i] = new google.maps.LatLng(lt, lg);
				}
			
			if ( ( typeof obj.SW.lat == "number" ) &&( typeof obj.SW.lng == "number" ) ) {			// углы прямоугольника
					const lt = obj.SW.lat ; const lg = obj.SW.lng ;
					obj.SW = new google.maps.LatLng(lt, lg);
			}
			if ( ( typeof obj.SE.lat == "number" ) &&( typeof obj.SE.lng == "number" ) ) {
					const lt = obj.SE.lat ; const lg = obj.SE.lng ;
					obj.SE = new google.maps.LatLng(lt, lg);
			}
			if ( ( typeof obj.NW.lat == "number" ) &&( typeof obj.NW.lng == "number" ) ) {
					const lt = obj.NW.lat ; const lg = obj.NW.lng ;
					obj.NW = new google.maps.LatLng(lt, lg);
			}
			if ( ( typeof obj.NE.lat == "number" ) &&( typeof obj.NE.lng == "number" ) ) {
					const lt = obj.NE.lat ; const lg = obj.NE.lng ;
					obj.NE = new google.maps.LatLng(lt, lg);
			}
			
			obj.bnd = new google.maps.LatLngBounds(obj.SW, obj.NE) ;
			
			if ( ( typeof obj.minPoint.lat == "number" ) &&( typeof obj.minPoint.lng == "number" ) ) {
					const lt = obj.minPoint.lat ; const lg = obj.minPoint.lng ;
					obj.minPoint = new google.maps.LatLng(lt, lg);
			}
			if ( ( typeof obj.maxPoint.lat == "number" ) &&( typeof obj.maxPoint.lng == "number" ) ) {
					const lt = obj.maxPoint.lat ; const lg = obj.maxPoint.lng ;
					obj.maxPoint = new google.maps.LatLng(lt, lg);
			}
			
		pLine = new google.maps.Polyline({
				 clickable: false,
				 strokeColor: '#0000CC',
				 strokeOpacity: 0.2,
				 map: MAPPA,
				 path: obj.path
			});	
		function number2LatLng (pnt) {
			if ( ( typeof pnt.lat == "number" ) &&( typeof pnt.lng == "number" ) ) {
						const lt = pnt.lat ; const lg = pnt.lng ;
						pnt = new google.maps.LatLng(lt, lg);
		}
}
}
//-----------------------------------------------
function viewAngel(otkuda, kuda, rostOtkuda) {
		let otkudaL = otkuda.location ; 
		let beginElevator = otkuda.elevation + rostOtkuda ; 				//otkuda elevation + viewer height
		let kudaL = kuda.location ;
		let endElevator = kuda.elevation ;
	let onSphereDist =  MYcomputeDistanceBetween(otkudaL, kudaL) ;		// расстояние между координатами, на поверхности сферы
	let angBet = onSphereDist  / EARTH_RADIUS ;							// in radians
		let a2 = (EARTH_RADIUS + beginElevator) * (EARTH_RADIUS + beginElevator) +								 // by cosinus theorema, a**2
						(EARTH_RADIUS + endElevator) * (EARTH_RADIUS + endElevator) -								// a**2 = b**2 + c**2 - 2*b*c*cos(bc)
							2 * (EARTH_RADIUS + beginElevator)*(EARTH_RADIUS + endElevator)*Math.cos(angBet) ;
	let a 		= Math.sqrt(a2) ;			 // distance between hill's tops
		let viAn ;
	let sinb 	= (EARTH_RADIUS + endElevator) * Math.sin(angBet) / a ;
		let viAnPlus90 = Math.asin( Math.sin(angBet)*(EARTH_RADIUS + endElevator)/a) ;
	let bOnCos = (EARTH_RADIUS + beginElevator) / Math.cos(angBet) ;
		let viAnModule = Math.abs(viAnPlus90 - Math.PI/2) ;
	if ( (EARTH_RADIUS + endElevator) <= bOnCos)
		viAn = - viAnModule ;
	else
		viAn =  viAnModule ;
	return viAn ;								// in radians
}

	function MY3DcomputeDistanceBetween(a,b) {
		var alat = a.lat()*Math.PI/180 ;
		var bl = b.lat() ;
		var bg = b.lng() ;
		var c2 = 	(b.lat()-a.lat())*(b.lat()-a.lat()) + 
					(b.lng()-a.lng())*(b.lng()-a.lng()) * 	Math.cos(a.lat()*Math.PI/180) * 
															Math.cos(b.lat()*Math.PI/180) ;
		var c= Math.sqrt(c2) ;
		var d =c*Math.PI/180 ;
	return Math.sin(d)*6378300 ;
	}
