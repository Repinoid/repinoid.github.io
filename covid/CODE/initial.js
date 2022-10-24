
   // Load the Visualization API and the corechart package.
		google.charts.load('current', {'packages':['corechart', 'bar', 'line'], 'language': 'ru'}); //.then(begin);
		google.charts.setOnLoadCallback(begin);

    			var jon, chiks, bu, coords, dataFile, pref = "";
				var dataFileRussia = "DATAS/lastCovid.json" ;
				var dataFileWorld =  "DATAS/lastWorld.json" ;
				var dataFileUSA =  "DATAS/lastUSA.json" ;
				var dataEngWorld =  "DATAS/lastEngWorld.json" ;
				
				var SM = 10 ;	// SMA for olds
				var lasts = 5 ; // lasts days withous SMA
		
				var data = {} ;
    			var chart = {} ;
				var datesA =[] ;
				var MA = [] ;
    			var options = 	{
					title:'CoVitus',
//					'width':1000, 
//					'height':600,
//					bar: { groupWidth: '75%' },
					isStacked: true,
//					chartArea :	{left: 77, top: 60, width: '85%', height: '70%'} ,
					legend: { position: 'bottom', maxLines: 10 },
					series: {
						0: {targetAxisIndex: 0, color: "blue", lineWidth: 3, lineDashStyle: [7, 1] },
						1: {targetAxisIndex: 0, color: "green", lineWidth: 4},
						2: {targetAxisIndex: 0},
						3: {targetAxisIndex: 1, color: "red", lineWidth: 7, lineDashStyle: [4, 2]},
					},
					hAxis: 						{
						format: 'd/M/yy',
						slantedText: true,
					//	slantedTextAngle: 30,
						gridlines: {count: 50}	},
					vAxis: {},
					vAxes: 	{
						0: {textStyle : {fontSize: 10,	color:'blue'} },
						1: {textStyle : {fontSize: 11, 	color:'red'} }
							},
				};	// End options

function begin() 	{
	const s = document.getElementById('switch') ;
	
	if ( s.name == "Russia" ) 
		dataFile = dataFileRussia ;
	else if ( s.name == "rusWorld" ) 
		dataFile = dataFileWorld ;
	else if ( s.name == "USA" ) 
		dataFile = dataFileUSA ;
	else if ( s.name == "engWorld" ) 
		dataFile = dataEngWorld ;

	getLSypexgeo() ;
		data 	= 	new google.visualization.DataTable();	
		chart 	= 	new google.visualization.LineChart(document.getElementById('chart_div'));
	document.getElementById('showInfected').checked = true ;
		const tbl = document.getElementById('tab') ;
		tbl.height = window.innerHeight ;
//return ;

	jon = fetFile (dataFile) ; 
}
	
function checlick() {
	for (let i = 0; i < chiks.length; i++)
		jon[i].checked = chiks[i].checked ;
	const ich = document.getElementById('radioChoice') ;
	if (! document.getElementById('radioChoice').checked) {
		for (let i = 0; i < chiks.length; i++) 	
			if (chiks[i].checked == true) {
				drawChart(jon[i]) ; 
				break ;
			}
	}
	else	
		drawRegionsChart() ;
}


function tryParsing (u) 			{
	try { let	obj = JSON.parse(u) ; return (obj) ; }
	catch (err) {return (false);}	}
