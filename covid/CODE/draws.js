
function wShow() {
	if (  document.getElementById('radioChoice').checked )
		drawRegionsChart() ;
}
function changeMode() {
	const Ws = document.getElementsByClassName('W2')
	const Wb = document.getElementsByClassName('wB')
	let typ ;
	if ( ! document.getElementById('radioChoice').checked) {
		typ = "radio" ;
		for ( let i=0 ; i < Ws.length; i++ ) 	//{
			Ws[i].style.opacity = 0;
//			Wb[i].style.opacity = 0; 			}
	}
	else {
		typ = "checkbox" ;
		for ( let i=0 ; i < Ws.length; i++ ) 	//{
			Ws[i].style.opacity = 1;
//			Wb[i].style.opacity = 1;			}
			
	}
	for (let i = 0; i < chiks.length; i++)
		chiks[i].type = typ ;
	checlick() ;
}
  
function drawRegionsChart() {
		chart 	= 	new google.visualization.LineChart(document.getElementById('chart_div'));    
		data 	= 	new google.visualization.DataTable();
		
		document.getElementById('A_Button').innerHTML = 	"Заразилось" ;
		document.getElementById('H_Button').innerHTML = 	"Выздоровело" ;
		document.getElementById('I_Button').innerHTML =		"Болеет" ;
		document.getElementById('D_Button').innerHTML =		"Умерло" ;
		
		options.title = "Значения на миллион человек населения" ;
		options.chartArea =	{left: 77, top: 60, height: '80%'} ;
			const cha = document.getElementById('charta') ;
			const chW = cha.clientWidth ;
			const pro1 = ((chW - 250) / chW) * 100 ;
			const pro = Math.round(pro1) ;
			options.chartArea.width = "" + pro + "%" ;
		const numberOfRows = data.getNumberOfRows() ;
		if (numberOfRows)
			data.removeRows(0, numberOfRows) ;
		let numberOfColumns = data.getNumberOfColumns() ;
		if (numberOfColumns)
			data.removeColumns(0, numberOfColumns) ;
	if ( document.getElementById('dayChoice').checked)
		drawRegionsDayly() ;
	else
		drawRegionsCommon() ;
}
// ---------------------------------------------------------------------------------------------
function drawRegionsCommon() {
		const numberOfRows = data.getNumberOfRows() ;
			if (numberOfRows)
				data.removeRows(0, numberOfRows) ;
		const numberOfColumns = data.getNumberOfColumns() ;
			if (numberOfColumns)
				data.removeColumns(0, numberOfColumns) ;
	options.vAxes = {} ;
	options.legend = { position: 'right', maxLines: 80, textStyle : {fontSize: 13, 	color:'black'} } ;
	options.series = {} ;
//	options.chartArea =	{left: 60, top: 60, width: '73%', height: '70%'} ,
	options.vAxis =  {textStyle:{fontSize: 12, color: "red"}} ;
	const malay = jon[0].regData ;
//	options.title = "" ;
	data.addColumn('date', 'Дата');
	for (let i = 0; i < chiks.length; i++) {	
		if (chiks[i].checked == true) {
			data.addColumn('number', jon[i].region.substr(0, 25));	// создаём столбцы по числу помеченных регионов
		}
	}
	let isAny = false ;
	for (let j=0; j < malay.length; j++)	{				// перебираем даты
		const dt = malay[j].T ;
		let a ;
		// if ( ! dt ) {
			// a = [null] ;
		// }
		// else 
			a = [new Date(dt)] ;
		for (let i = 0; i < chiks.length; i++) 	
			if (chiks[i].checked == true) {	
				isAny = true ;								// что-то выбрано
				const da = jon[i].regData[j] ;
				const propor = 1000000.0/jon[i].popula ;
				let wa ;
				if (document.getElementById('showInfected').checked)
					wa = da.A ;											
				else if (document.getElementById('showDead').checked)
					wa = da.D ;											
				else if (document.getElementById('showHealed').checked)
					wa = da.H ;											
				else if (document.getElementById('showIll').checked)
					wa = da.I ;
				let wp ;
				if ( wa ) 
					wp = Math.round(wa * propor) ;
				else 
					wp = null ;
				a.push(wp) ;		//
			}
		data.addRow(a);
	}
	if (isAny) 								// если есть выбранные регионы
		chart.draw(data, options);
}

// ---------------------------------------------------------------------------------------------
function drawRegionsDayly() {
		const numberOfRows = data.getNumberOfRows() ;
			if (numberOfRows)
				data.removeRows(0, numberOfRows) ;
		const numberOfColumns = data.getNumberOfColumns() ;
			if (numberOfColumns)
				data.removeColumns(0, numberOfColumns) ;
	options.vAxes = {} ;
	options.legend = { position: 'right', maxLines: 80, textStyle : {fontSize: 13, 	color:'black'} } ;
	options.series = {} ;
//	options.chartArea =	{left: 60, top: 60, width: '73%', height: '70%'} ,
	options.vAxis =  {textStyle:{fontSize: 12, color: "red"}} ;
	const malay = jon[0].regData ;
//	options.title = "" ;
	data.addColumn('date', 'Дата');
	for (let i = 0; i < chiks.length; i++) {	
		if (chiks[i].checked == true) {
			data.addColumn('number', jon[i].region.substr(0, 25));	// создаём столбцы по числу помеченных регионов
		}
	}
	let isAny = false ;
	for (let j=0; j < malay.length-SM - dateSlider.value; j++)	{				// перебираем даты
		const dt = malay[j].T ;
		let a  = [new Date(dt)] ;
		for (let i = 0; i < chiks.length; i++) 	
			if (chiks[i].checked == true) {	
				isAny = true ;								// что-то выбрано
				const da = jon[i].regData[j] ;
				if ( da.A == null)  {
					a.push(null) ;
					continue ;
				}
				let sma = SM ;
				
					if (j < lasts)			// if last days - withous SMA, SMA = 1
						sma = 1 ;
					else 
						sma = SM ;					
				
				
				let malay = jon[i].regData ;
				while ( ! malay[j+sma].A )
					sma-- ;
				if ( sma == 0 )  {
					a.push(null) ;
					continue ;
				}					
				let dt = new Date(malay[i].T) ;
				let A = (malay[j].A - malay[j+sma].A) 	/ sma 	;		
				let H = (malay[j].H - malay[j+sma].H) 	/ sma	; 
				let I =  malay[j].I ; 									//round(malay[i+1].I);
				let D = (malay[j].D - malay[j+sma].D) 	/ sma	;
				if ( D < 0 )
					D = 0 ;
				
				const propor = 1000000.0/jon[i].popula ;
				let wa ;
				if (document.getElementById('showInfected').checked)
					wa = A ;											
				else if (document.getElementById('showDead').checked)
					wa = D ;											
				else if (document.getElementById('showHealed').checked)
					wa = H ;											
				else if (document.getElementById('showIll').checked)
					wa = I ; 	
				let wp ;
				if ( wa ) 
					// wp = Math.round(wa * propor) ;
					wp = (wa * propor) ;
				else 
					wp = null ;
				if ( wa < 0 )
					wp = null ;
				a.push(wp) ;		// 
			}
		data.addRow(a);
	}
	if (isAny) 								// если есть выбранные регионы
		chart.draw(data, options);
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function dNBP(x, delimiter) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter || " ");
}
function drawChart(regus) {
		chart 	= 	new google.visualization.LineChart(document.getElementById('chart_div'));
		data 	= 	new google.visualization.DataTable();
		const rd = regus.regData ;
		let ind = 0 ;
		while ( (! rd[ind].A) && ( ind <rd.length ) )			// search for last not null
			ind++ ;
		const da = rd[ind] ;
		const ti = da.T.split('-') ;
		const tm  = ti[2]+'-'+ti[1]+'-'+ti[0] ;
		
		let prev = ind+1 ;
		while ( (! rd[prev].A) && ( prev <rd.length ) )
			prev++ ;
		
		const pr = rd[prev] ;
		
		document.getElementById('A_Button').innerHTML = dNBP(da.A) + ' / ' + dNBP(Math.round((da.A - pr.A) / (prev - ind )));
		document.getElementById('H_Button').innerHTML = dNBP(da.H) + ' / ' + dNBP(Math.round((da.H - pr.H) / (prev - ind )));
		document.getElementById('I_Button').innerHTML = dNBP(da.I) ;
		document.getElementById('D_Button').innerHTML = dNBP(da.D) + ' / ' + dNBP(Math.round((da.D - pr.D) / (prev - ind )));
		
		options.title = regus.region + "  на " + tm ;
		if ( regus.ukol != undefined)
			options.title = options.title + ". Привито " + regus.ukol + "%";
		if (regus.region == "Ульяновская область")
			options.title =  "Ордена Ленина Ульяновская область 🎖" + "  на " + tm  + ". Чипировано " + regus.ukol + "% земляков Ильича I" ;
		options.chartArea =	{left: 77, top: 60, height: '70%'} ;
		const cha = document.getElementById('charta') ;
			const chW = cha.clientWidth ;
			const pro1 = ((chW - 150) / chW) * 100 ;
			const pro = Math.round(pro1) ;
			options.chartArea.width = "" + pro + "%" ;		
		let numberOfRows = data.getNumberOfRows() ;
		if (numberOfRows)
			data.removeRows(0, numberOfRows) ;
		let numberOfColumns = data.getNumberOfColumns() ;
		if (numberOfColumns)
			data.removeColumns(0, numberOfColumns) ;
	if ( document.getElementById('dayChoice').checked)
		drawDayChart(regus) ;
	else
		drawCommonChart(regus) ;

}	  
function drawCommonChart(regus)	{
	let malay = regus.regData ;

	data.addColumn('date', 'Дата');
	data.addColumn('number', 'Инфицировались');
	data.addColumn('number', 'Выздоровели');	
	data.addColumn('number', 'Болеют');
	data.addColumn('number', 'Смерти');
	for (let i=0; i < malay.length; i++)	{
		if ( ! malay[i].T )
			continue ;
		let dt = new Date(malay[i].T) ;
		let a = [dt, malay[i].A, malay[i].H, malay[i].I, malay[i].D] ;
		data.addRow(a );					
	}
	options.series = {
		0: {targetAxisIndex: 0, color: "blue", 		lineWidth: 3},
		1: {targetAxisIndex: 0, color: "green", 	lineWidth: 4},
		2: {targetAxisIndex: 0, color: "#FF00FF", 	lineWidth: 3},
		3: {targetAxisIndex: 1, color: "red", 		lineWidth: 3} //, lineDashStyle: [4, 2]}
	},
	options.pointSize = 1 ;
//	options.chartArea =	{left: 77, top: 60, width: '85%', height: '70%'} ;
	options.hAxis.textPosition = 'out' ;
	options.titleFontSize = 15;
	options.titleColor = "#483D8B";
	options.legend = { position: 'bottom', maxLines: 10 };
	chart.draw(data, options);
}
// ---------------------------------------------------------------------------------------------
function drawDayChart(regus)	{
	let malay = regus.regData ;
	let numberOfColumns = data.getNumberOfColumns() ;
	if (numberOfColumns)
		data.removeColumns(0, numberOfColumns) ;
	data.addColumn('date', 'Дата');
	data.addColumn('number', 'Инфицировались');
	data.addColumn('number', 'Выздоровели');	
//	data.addColumn('number', 'Болеют');
	data.addColumn('number', 'Смерти');
	
	for (let i=0; i < malay.length - SM - dateSlider.value; i++)	{
		if ( ! malay[i].A )
			continue ;
		
			let sma ; 
		if (i < lasts)			// if last days - withous SMA, SMA = 1
			sma = 1 ;
		else 
			sma = SM ;	
		
		while ( ! malay[i+sma].A )
			sma-- ;
		if ( sma == 0 )
			continue ;
		let dt = new Date(malay[i].T) ;
		let A = (malay[i].A - malay[i+sma].A) 	/ sma 	;		
		let H = (malay[i].H - malay[i+sma].H) 	/ sma	; 
		let I =  malay[i].I ; 									//round(malay[i+1].I);
		let D = (malay[i].D - malay[i+sma].D) 	/ sma	;
		if ( (D < 0) || (A < 0) || (I < 0) )
			continue ;
//		if ( D < 0 )
	//		D = 0 ;
		
		let a = [dt, A,H,D] ;
		data.addRow(a );					
	}
	options.series = {
						0: {targetAxisIndex: 0, color: "blue", 	lineWidth: 	2	},
						1: {targetAxisIndex: 0, color: "green", lineWidth: 	1	},
						2: {targetAxisIndex: 1, color: "red", 	lineWidth: 	1	}
					};
//	options.chartArea =	{left: 77, top: 60, width: '85%', height: '70%'} ;
	options.legend = { position: 'bottom', maxLines: 10 };
//	options.curveType = 'function';
	options.titleFontSize = 15;
	options.titleColor = "#483D8B";
	chart.draw(data, options);
}
