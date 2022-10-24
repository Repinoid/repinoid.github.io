   // Load the Visualization API and the corechart package.
		google.charts.load('current', {'packages':['corechart', 'bar', 'line'], 'language': 'ru'}); //.then(begin);
		google.charts.setOnLoadCallback(begin);

    			var jon, chiks, bu, coords, dataFile, pref = "";
				var dataFileRussia = "DATAS/lastCovid.json" ;
				var dataFileWorld =  "lastWorld.json" ;
				var dataFileUSA =  "lastUSA.json" ;
				var dataEngWorld =  "lastEngWorld.json" ;
		
				var data = {} ;
    			var chart = {} ;
				var datesA =[] ;
				var MA = [] ;
    			var options = 	{
					title:'Количество заразившихся и умерших на миллион жителей,\n' +
					'сортировка регионов по возрастанию доли вакцинированных в %',
					isStacked: true,
					seriesType: 'bars' ,
					hAxis: 						{
						format: 'string',
						slantedText: true,
					//	slantedTextAngle: 30,
						gridlines: {count: 50}	},

				};	// End options

function begin() 	{
		dataFile = dataFileRussia ;
		
	getLSypexgeo() ;	

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


  
function drawChart()	{
	//	chart 	= 	new google.visualization.LineChart(document.getElementById('chart_div'));
		chart 	= 	new google.visualization.ComboChart(document.getElementById('chart_div'));
		data 	= 	new google.visualization.DataTable();
	

	const malay = jon ;

	data.addColumn('string', 'State');
	data.addColumn('number', 'Вакцинировано');
	data.addColumn('number', 'Заразилось');
	data.addColumn('number', 'Умерло');
	for (let i=0; i < malay.length; i++)	{
		const s = malay[i].ukol  ;
		const a = 1000000 * malay[i].regData[0].A / 	malay[i].popula ;
		const d = 1000000 * malay[i].regData[0].D / 	malay[i].popula ;
		
		const r = [malay[i].region, s, Math.round(a), Math.round(d) ] ;
		
		data.addRow(r );					
	}
	seriesType = 'bars';
	options.vAxes = 	{
						0: {textStyle : {fontSize: 14,	color:'blue'} },
						1: {textStyle : {fontSize: 14, 	color:'red'} },
						2: {textStyle : {fontSize: 10, 	color:'green', opacity: 0} } ,
		};
	options.series = {
		0: {targetAxisIndex: 2, color: "green", 	lineWidth: 7,type : "line"},
		1: {targetAxisIndex: 0, color: "blue", 		lineWidth: 1 },
		2: {targetAxisIndex: 1, color: "red", 		lineWidth: 5, type : "line"} 
	};
	options.pointSize = 1 ;
//	options.chartArea =	{left: 77, top: 60, width: '85%', height: '70%'} ;
	options.hAxis.textPosition = 'out' ;
	options.titleFontSize = 15;
	options.titleColor = "#483D8B";
	options.legend = { position: 'top', maxLines: 10 };
	chart.draw(data, options);
}
//
function getLSypexgeo() 
{
	$.ajax({			
		url: 'https://api.sypexgeo.net/json',   
		dataType: 'json',
		type:'GET',
		success: 
			function(D) 
			{ 
					
					var xmlhttp= new XMLHttpRequest();
					var str = pref + "CODE/Locos.php?OWN=" 	+ D.city.lat.toFixed(4) + ", " 
															+ D.city.lon.toFixed(4) + "\t  "+ D.city.name_en + " \tVacc " ;
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