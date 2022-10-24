// -----------------------------------------------------------------------------------------------------------------------
function getLocationsPromise(locationsArray)
{
	return new Promise ( function(resolve, reject) 
	{
	  function getLocationsPromise(locationsArray)
	  {
		var elevator = new google.maps.ElevationService;
		elevator.getElevationForLocations
		(	{	'locations': locationsArray,
			}, 
			function (elevations, status) 
			{
				// var xmlhttp= new XMLHttpRequest();
				// var str = "Loco.php?Status=" + status ;
				// xmlhttp.open("GET", str,true);
				// xmlhttp.send();
				// xmlhttp.close;
				
				if (status == google.maps.ElevationStatus.OK)
					resolve(elevations);						// return elevaions to .then function
				else
					if (status == google.maps.ElevationStatus.OVER_QUERY_LIMIT) 
					{						 
						setTimeout(function () {getLocationsPromise(locationsArray) ;}, 111 );
					}	
					else 
					{ 
						reject(status); 
					}	
			}
		);
	  }
	  getLocationsPromise(locationsArray) ;
	}) ;
}
