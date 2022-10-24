function getLocationByNavigator() {

	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(function(position) {
		var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude) ;
		var xmlhttp= new XMLHttpRequest();
		var str = "Loco.php?OWN=" + position.coords.latitude.toFixed(4) + "," + position.coords.longitude.toFixed(4) ;
		xmlhttp.open("GET", str,true);
		xmlhttp.send();
		xmlhttp.close;
														
		MAPPA.setCenter(pos);
		POVmarker.setPosition(pos) ;
	  },function() {}
	)} ;   
}
////////////////////////////////////////////////////////////////////////////////////////////
function getLocationByIpStack(maped) 
{
	var LL = [50.799754,42.015194] ;
	var access_key = '9e774fa1fd70b4b31b544bba0c261ff0';
	$.ajax({
			url: 'getIP.php',
//			url:'http://whatthepeak.com/WTP/getIP.php',			
			type:'GET',
			dataType:'json',
			success: function(data) 
			{
				ip = data.ip ;
				$.ajax({
					url: 'http://api.ipstack.com/' + ip + '?access_key=' + access_key,   
					dataType: 'jsonp',
//					alert("dddddddddddddddd") ;
					success: 
						function(D) 
						{ 
							var pos = new google.maps.LatLng(D.latitude, D.longitude) ;
							maped.setCenter(pos);
							POVmarker.setPosition(pos) ;
							
								var xmlhttp= new XMLHttpRequest();
								var str = "Loco.php?OWN=" + D.latitude.toFixed(4) + "," + D.longitude.toFixed(4) ;
								xmlhttp.open("GET", str,true);
								xmlhttp.send();
								xmlhttp.close;							
						}, 
				});
			}
	})
}
///////////////////////////////////////////////////////////////////////////