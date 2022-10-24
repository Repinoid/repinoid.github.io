saveMapButton.onclick = function() { 
		
			const allJson = JSON.stringify(trackObj) ;
			if (allJson.length < 4)
				return ;
			
			const luc = "" + Math.abs(MAPPA.getBounds().getSouthWest().lat() + Date.now()) ;
			
				const today = new Date() ;		
				const month = today.getMonth() + 1;
				const dat = today.getDate();
				const dayString = "T" + today.getFullYear() + '-' + (month > 9 ? month :  "0" + month) + '-' + (dat > 9 ? dat :  "0" + dat) + '/'; 
			
			let foutName = luc.replace('.', '')  ;
				/**/ {	// запись объекта в файл /////////////////
				/**/	let xmlhttp	= new XMLHttpRequest();
				/**/	let phpFile = "saveTrack.php";
				/**/	xmlhttp.open("PUT", phpFile, true);
				/**/	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Отправляем кодировку		
						const packet = dayString + foutName + ".json" + allJson ;
				/**/	xmlhttp.send(packet);
				/**/	xmlhttp.close;		}								//////////////////////////////////////////
			window.location.hash = "#" + dayString + foutName ;
		
			const podskaz  = "<hr>&nbsp Скопируйте ссылку на трек <br>"+
							"&nbsp Отошлите соратникам<hr>" +
							"<span id = 'urlTxt'>&nbsp &nbsp" + window.location + "&nbsp &nbsp</span><hr>" + 
							"&nbsp Save this URL and share" ;
//			navigator.clipboard.writeText(window.location) ;
			getTrackerLocation("LOAD") ;
			saveTxt.innerHTML = podskaz ;
			saveHelp.style.display = "block" ;
			// const w1 = window.location.href ;
			// const w2 = w1.replace("#", "A") ;
				// const str = "userLocations.php?DRA=" + w2 ;
				// writeLocations(str) ;
	}
	
function getTrackerLocation(s) {	
	let str = "trackerLocations.php?"+s+"=" ; 
	let pos ;
	const w1 = window.location.href ;
	const w2 = w1.replace("#", "W") ;
	
	$.ajax({			
		url: 'https://api.sypexgeo.net/json',   
		dataType: 'json',
		type:'GET',
		success: function(D) { 
				str += D.city.lat.toFixed(4) + ", " + D.city.lon.toFixed(4) + "\t "+ D.city.name_en + "\t " + w2;
				const coord = new google.maps.LatLng(D.city.lat, D.city.lon) ;
				if ( s == "OWN") 
					MAPPA.setCenter(coord) ;
				writeLocations(str) ;
			},
		error: function (error) {
			pos = defaultLocation ;
			let errout = "" ;
				for (let key in error) {
					errout += " " + key + "=" + error[key] + " "; 
				}
				str += "getLSypexgeo ERROR " + errout + " \t " ; 
			writeLocations(str) ;
		}
	});
}	
function writeLocations(str) {
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", str, true);
	xmlhttp.send();
	xmlhttp.close;
}
