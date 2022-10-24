import {compose3D} from "./probas.js" ; 	
import {createHeightmap} from "./probas.js" ; 	



var slider = document.getElementById("slider3D") ;

			slider.onchange = function () {
				objectData.scena.remove(objectData.telo) ;
				var newHM = createHeightmap(mapSkin, AllRects[0]) ;
				objectData.scena.add(newHM.telo) ;
				objectData.telo = newHM.telo ;
				window.location.hash = "#" + composeURL() ; 	
			}

butt3D.onclick = function () {
		showHelps(false) ;
		if ( mapSkin == "" ) {
				m2c(document.getElementById('mapCell'), function(mapSkinner) {							
					document.getElementById("mapCell").style.display = "none" ;			
						objectData = compose3D(mapSkinner) ;
						document.getElementById("Hs").innerHTML = 	 "Min " + Math.round(objectData.hMin) + 
																" m   Max " + Math.round(objectData.hMax) ;						
					document.getElementById("rightTable").style.display = "none" ;			
					document.getElementById("topTable").style.display = "none" ;			
					document.getElementById("leftTable").style.display = "none" ;			
					document.getElementById("slider3D").style.display = "block" ;	
					document.getElementById("canvaCell").style.display = "block" ;								
				})
		}
		else {
				document.getElementById("mapCell").style.display = "none" ;			
				document.getElementById("rightTable").style.display = "none" ;			
				document.getElementById("topTable").style.display = "none" ;			
				document.getElementById("leftTable").style.display = "none" ;			
				document.getElementById("slider3D").style.display = "block" ;			
				document.getElementById("canvaCell").style.display = "block" ;								

			}
}
butt2D.onclick = function () {
			cancelAnimationFrame(renda);

			document.getElementById("mapCell").style.display = "block" ;			
			document.getElementById("rightTable").style.display = "block" ;			
			document.getElementById("topTable").style.display = "block" ;			
			document.getElementById("leftTable").style.display = "block" ;			
			
			document.getElementById("canvaCell").style.display = "none" ;			
			document.getElementById("slider3D").style.display = "none" ;			
}


// ftp://192.168.1.44/DuneHDD_d0be188ebe186f6a/