function getLSypexgeo() 
{
	$.ajax({			
		url: 'https://api.sypexgeo.net/json',   
		dataType: 'json',
		type:'GET',
		success: 
			function(D) 
			{ 
					const w = document.getElementById('switch').name ;
					var xmlhttp= new XMLHttpRequest();
					var str = "CODE/Locos.php?OWN=\t" + D.city.name_en + "\t " + D.city.lat.toFixed(4) + ", " 
															+ D.city.lon.toFixed(4) + " \tf." + w ;
					xmlhttp.open("GET", str,true);
					xmlhttp.send();
					xmlhttp.close;	
					coords = [D.city.lat.toFixed(4), D.city.lon.toFixed(4), D.city.name_en] ;
			},
		error: function (error) {
				var xmlhttp= new XMLHttpRequest();
					let errout = "" ;
						for (var key in error) {
							errout += " " + key + "=" + error[key] + " "; 
						}
					let str = pref + "CODE/Locos.php?OWN=" + "getLSypexgeo ERROR lister " + errout + " \t " ; 
				xmlhttp.open("GET", str, true);
				xmlhttp.send();
				xmlhttp.close;	
				return null ;
		},
	});
}
function sendCommy () {
	const w = document.getElementById('switch').name ;
	const ta = document.getElementById('tare').value ;
	var xmlhttp= new XMLHttpRequest();
		const str = pref + "CODE/Commy.php?comment=" + coords[0] + "  " + coords[1] + "  " + coords[2] + "  \n" + " \tf." + w + "\n" +ta ;
		xmlhttp.open("GET", str,true);
		xmlhttp.send();
		xmlhttp.close;
	document.getElementById('commentForm').style.display = "none" ;
}
