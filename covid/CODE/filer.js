function fetFile(fname)	{
	document.getElementById("wait4loading").style.display = "block" ;
	let X = new XMLHttpRequest();
	X.open("GET", fname , true);
	X.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
	X.send(null);
	X.close;
	X.onload = function () 	{
		if  (X.readyState == 4 && X.status == "200") {
			jon = tryParsing(X.responseText) ;
			document.getElementById("wait4loading").style.display = "none" ;
			composeRegList(jon) ;
			drawChart(jon[0]) ;	
			return (jon) ;
		}	
	}
}
// ---------------------------------------------------------------
function composeRegList(jon) {
	sortByInfected() ;
	const step = 0.2 / jon.length ;
	
	let t = document.getElementById('regs');
	for (let i = 0; i < jon.length; i++)	{
		let tr = document.createElement("tr");
			let checkCell = document.createElement("td");
				let check = document.createElement("input");
					check.type = "radio"; 
//					check.type = "checkbox"; 
					check.name = "regRadio" ;
					if (i == 0) 
						check.checked = true ; 
					else
						check.checked = false ; 
				checkCell.appendChild(check);
			tr.appendChild(checkCell);
			let regNameCell = document.createElement("td");
			regNameCell.innerHTML = jon[i].region ;
			const bgc = "font: 12px arial; font-weight: 600; background-color: rgba(0,0,255,"  + (0.2 - i * step) + "); " ;
			regNameCell.style = bgc ;
			jon[i].rowStyle = bgc ;
			
			regNameCell.onclick = function() {
				check.click() ;
			} ;
			
			tr.appendChild(regNameCell);
		t.appendChild(tr);
		check.onclick = function() { 
						checlick();} ;
		jon[i].checked = false ;
	}
	jon[0].checked = true ;
	chiks = document.getElementsByName("regRadio") ;
	sortAlphabetic() ;
	recombinateList() ;
}
// ---------------------------------------------------------------
function recombinateList() {
	let t = document.getElementById('regs');
	for (let i = 0; i < jon.length; i++) {	
		t.rows[i].cells[1].innerHTML = jon[i].region ;					
		t.rows[i].cells[1].style = jon[i].rowStyle
	}		
}
// ---------------------------------------------------------------
function resort() {
	if (document.getElementById("sortByInfected").checked) 
		jon.sort((first,second) => {
			const frd = first.regData ;
			const srd = second.regData ;
			let f=0,	s=0 ;
			for (let i = 0 ; i < frd.length; i++)	
				if (frd[i].A) {
					f = frd[i].A ;
					break ; }
			for (let i = 0 ; i < srd.length; i++)	
				if (srd[i].A) {
					s = srd[i].A ;
					break ; }
			return (-f /first.popula + s /second.popula) ; 
		});
	if (document.getElementById("sortByDead").checked) 
		jon.sort((first,second) => {
			const frd = first.regData ;
			const srd = second.regData ;
			let f=0,	s=0 ;
			for (let i = 0 ; i < frd.length; i++)	
				if (frd[i].D) {
					f = frd[i].D ;
					break ; }
			for (let i = 0 ; i < srd.length; i++)	
				if (srd[i].D) {
					s = srd[i].D ;
					break ; }
			return (-f /first.popula + s /second.popula) ; 
		});
	if (document.getElementById("sortAlphabetic").checked) {
		jon.sort((first,second) => {
			if (first.region == "Вся Россия")
				return -1 ;			
			if (second.region == "Вся Россия")
				return 1 ;
			if (first.region == "ВЕСЬ МИР")
				return -1 ;			
			if (second.region == "ВЕСЬ МИР")
				return 1 ;
			const lc = (first.region).localeCompare(second.region) ;
			return lc ; 
		});
	}
	recombinateList() ;
	for (let i = 0; i < chiks.length; i++)
		chiks[i].checked  = jon[i].checked ;
}
function sortByInfected() {
	jon.sort((first,second) => {
				const frd = first.regData ;
				const srd = second.regData ;
				let f=0,	s=0 ;
				for (let i = 0 ; i < frd.length; i++)	
					if (frd[i].A) {
						f = frd[i].A ;
						break ; }
				for (let i = 0 ; i < srd.length; i++)	
					if (srd[i].A) {
						s = srd[i].A ;
						break ; }
				return (-f /first.popula + s /second.popula) ; 
			});
}
function sortAlphabetic() {
	jon.sort((first,second) => {
		if (first.region == "Вся Россия")
			return -1 ;			
		if (second.region == "Вся Россия")
			return 1 ;
		if (first.region == "ВЕСЬ МИР")
			return -1 ;			
		if (second.region == "ВЕСЬ МИР")
			return 1 ;
		const lc = (first.region).localeCompare(second.region) ;
		return lc ; 
	});
}