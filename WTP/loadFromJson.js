function rectFromJson (fName, callback) {

		this.X = new XMLHttpRequest();
		this.X.open("GET", fName, true);
		this.X.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
		this.X.send(null);
		this.X.close;
		
		this.X.onload = function () 
		{
			var malay ;
			if ( (X.readyState == 4 && X.status == "200") && 
								( malay = tryParsing(X.responseText) ) ) 	// if file exists && OK parsed
			{
				for ( let i = 0; i < malay.length; i++ )
					{ restoreRectObj (malay[i]) ; }
				callback(malay) ;
				return (malay) ;
			}	
		}
}		

function tryParsing (u) {
	try {
		var		obj =	JSON.parse(u) ;
		return (obj) ;
	}
	catch (err) {
		return (false) ;
	}
}
			
function restoreRectObj (obj) {						// функция преобразует числовые координаты в LatLng в самом объекте
	
	for (i=0, key = obj.dots; i < key.length; i++) 
			if ( ( typeof key[i].lat == "number" ) &&( typeof key[i].lng == "number" ) ) {			// точки в прямоугольнике
					var lt = key[i].lat ; var lg = key[i].lng ;
					key[i] = new google.maps.LatLng(lt, lg);
				}
	for (i=0 ; i < obj.elevations.length; i++) 														// объекты с высотами
	{		var key = obj.elevations[i].location ;
			if ( ( typeof key.lat == "number" ) &&( typeof key.lng == "number" ) ) {
					var lt = key.lat ; var lg = key.lng ;
					obj.elevations[i].location = new google.maps.LatLng(lt, lg);
				}}
	for (i=0, key=obj.path; i < key.length; i++) 				
			if ( ( typeof key[i].lat == "number" ) &&( typeof key[i].lng == "number" ) ) {			// контур прямоугольника
					var lt = key[i].lat ; var lg = key[i].lng ;
					key[i] = new google.maps.LatLng(lt, lg);
				}
	
			if ( ( typeof obj.SW.lat == "number" ) &&( typeof obj.SW.lng == "number" ) ) {			// углы прямоугольника
					var lt = obj.SW.lat ; var lg = obj.SW.lng ;
					obj.SW = new google.maps.LatLng(lt, lg);
				}
			if ( ( typeof obj.SE.lat == "number" ) &&( typeof obj.SE.lng == "number" ) ) {
					var lt = obj.SE.lat ; var lg = obj.SE.lng ;
					obj.SE = new google.maps.LatLng(lt, lg);
				}
			if ( ( typeof obj.NW.lat == "number" ) &&( typeof obj.NW.lng == "number" ) ) {
					var lt = obj.NW.lat ; var lg = obj.NW.lng ;
					obj.NW = new google.maps.LatLng(lt, lg);
				}
			if ( ( typeof obj.NE.lat == "number" ) &&( typeof obj.NE.lng == "number" ) ) {
					var lt = obj.NE.lat ; var lg = obj.NE.lng ;
					obj.NE = new google.maps.LatLng(lt, lg);
				}
		let pLine = new google.maps.Polyline({
				 clickable: false,
				 strokeColor: '#0000CC',
				 strokeOpacity: 0.2,
//				 map: MAPPA,
				 path: obj.path
			});	
}

	function okrugl(num, dig) {
			var s = num.toFixed(dig) ;
			var pF = parseFloat(s)
			return  pF ;
	}