var jj = '{"strokeColor":"#00FF00","strokeOpacity":0.4,"strokeWeight":7,"path":[{"lat":-34.13653582529917,"lng":150.44418615722657},{"lat":-34.49382920828306,"lng":150.22857946777344},{"lat":-34.47798181876193,"lng":150.65567297363282},{"lat":-34.285309189552635,"lng":150.73807043457032},{"lat":-34.304596395443056,"lng":150.82046789550782}],"icons":[{"icon":{"path":1},"offset":"100%"}]}';

var figStrokeColor 		= "#FF0000";
var	figFillColor 		= "#0000FF" ;
var	figStrokeOpacity 	=  1.0;
var figFillOpacity 		= 0.25 ;
var	figStrokeWeight 	= 3;

var figArray = [] ;
	
function figurator() {	

	// let jffp = JSON.parse(jj) ;
	// const pl = makePolyline(jffp, false) ;	
//	figArray.push(pl) ;
	
//	const tt = makeText({position: { lat: -34.397, lng: 150.644 }, label: {text: "PPPPPPPPPP", fontSize: '30px', color: '#FF0000' } }) ;
//	const tt = makeText() ;
	
	
	buttonLine.onclick = function () {
		const pl = makePolyline(null, false) ;	
		figArray.push(pl) ;
	}	
	buttonArrow.onclick = function () {
		const pl = makePolyline(null, true) ;	
		figArray.push(pl) ;
	}
	buttonGon.onclick = function () {
		const pl = makePolygon(null) ;	
		figArray.push(pl) ;
	}
	buttonRectal.onclick = function () {
		const pl = makeRectangle(null) ;	
		figArray.push(pl) ;
	}
	buttonCircle.onclick = function () {
		const pl = makeCircle(null) ;	
		figArray.push(pl) ;
	}
	buttonText.onclick = function () {
		const pl = makeText(null) ;	
		figArray.push(pl) ;
	}
	
	buttonColor.onclick = function () {
		if (colorTable.style.display == "block") 
			colorTable.style.display = "none" ;
		else
			colorTable.style.display = "block" ;
	}
	
	
	const figClr = document.getElementsByClassName('colorButts');	
	for ( let i=0; i < figClr.length; i++ )
		figClr[i].onclick = function () { 
			buttonColor.style.backgroundColor = figStrokeColor = figFillColor = this.style.backgroundColor ;	
			for ( let figInd=0; figInd < figArray.length; figInd++ )
				if ( figArray[figInd].getEditable() )
					figArray[figInd].figureColor = this.style.backgroundColor ;		
		};
	opaSlider.onchange = function () {
		figStrokeOpacity = figFillOpacity = opaSlider.value ;
		for ( let figInd=0; figInd < figArray.length; figInd++ )
			if ( figArray[figInd].getEditable() )
				figArray[figInd].figureOpacity = opaSlider.value ;		
	}
	weightSlider.onchange = function () {
		figStrokeWeight = weightSlider.value ;
		for ( let figInd=0; figInd < figArray.length; figInd++ )
			if ( figArray[figInd].getEditable() && figArray[figInd].name == "Polyline" )
				figArray[figInd].lineWidth = weightSlider.value ;		
	}
	deleteFigures.onclick = function eras() {
		let checked = 0 ;
		for ( let figInd=0; figInd < figArray.length; figInd++ )
			if ( figArray[figInd].getEditable() ) 	
				checked++ ;
		if ( checked == 0 )
			return ;
		let res = confirm("Удалить " + checked + " фигур\r\nВы уверены ?");
		if ( ! res) 
			return ;
	
		for ( let figInd=0; figInd < figArray.length;  )
			if ( figArray[figInd].getEditable() ) {
				figArray[figInd].setMap(null) ;
				figArray.splice(figInd, 1) ;
			}
			else
				figInd++ ;
	}
}
function eraser() {
		for ( let figInd=0; figInd < figArray.length;  )
			if ( figArray[figInd].getEditable() ) {
				figArray[figInd].setMap(null) ;
				figArray.splice(figInd, 1) ;
			}
			else
				figInd++ ;
}

saveUrl.onclick = function saveMap() {
		
	const figuresForSave = [] ;
	for (let i = 0; i < figArray.length; i++) { 
		figuresForSave.push(figArray[i].options) ;
//		figArray[i].setMap(null) ;
	}

	const toSave = {
		mapName: 	mapName.value, 
			lat:		karta.getCenter().lat(), 
			lng: 		karta.getCenter().lng(), 
			zoom: 		karta.getZoom(),
		figgas: 	figuresForSave,
	}

	const allJson = JSON.stringify(toSave) ;
	
	jp = JSON.parse(allJson).figgas ;

	const luc = "" + Math.abs(karta.getBounds().getSouthWest().lat() + Date.now()) ;
	let foutName = luc.replace('.', '')  ;
			
		const today = new Date() ;		
		const month = today.getMonth() + 1;
		const dat = today.getDate();
		const dayString = "P" + today.getFullYear() + '-' + (month > 9 ? month :  "0" + month) + '-' + (dat > 9 ? dat :  "0" + dat) + '/'; 
			
				/**/ {	// запись объекта в файл /////////////////
				/**/	let xmlhttp	= new XMLHttpRequest();
				/**/	let phpFile = "savedraws.php";
				/**/	xmlhttp.open("PUT", phpFile, true);
				/**/	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Отправляем кодировку		
						const packet = dayString + foutName + ".json" + allJson ;
				/**/	xmlhttp.send(packet);
				/**/	xmlhttp.close;		}								//////////////////////////////////////////
			window.location.hash = "#" + dayString + foutName ;
		
			const podskaz = "&nbsp Скопируйте ссылку на карту <br>"+
							"&nbsp Отошлите соратникам<hr>" +
							"<span id = 'urlTxt'>&nbsp &nbsp" + window.location + "&nbsp &nbsp</span><hr>" + 
							"&nbsp &nbspВ случае редактирования сохраните новую ссылку по Save MAP&nbsp &nbsp" ;
			navigator.clipboard.writeText(window.location) ;
			saveTxt.innerHTML = podskaz ;
			saveHelp.style.display = "block" ;
			const w1 = window.location.href ;
			const w2 = w1.replace("#", "A") ;
				const str = "userLocations.php?DRA=" + w2 ;
				writeLocations(str) ;

//	debugger ;
}
