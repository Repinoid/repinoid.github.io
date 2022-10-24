function curvedR(coord, rctngl) 
{	
			const X0 = rctngl.SW.lng();		// left bottom corver
			const Y0 = rctngl.SW.lat();
			const X1 = rctngl.NE.lng();		// left bottom corver
			const Y1 = rctngl.NE.lat();
			const X = coord.lng();		// point
			const Y = coord.lat();
		if ((X<X0) || (Y<Y0) || (X>X1) || (Y>Y1)) 
			return null ;
	const cellX = rctngl.dLng / (rctngl.Columns-1);	// cell width
	const cellY = rctngl.dLat / (rctngl.Rows-1);		// cell height
		const dY = Y - Y0;							// relative point position 
		const dX = X - X0;
	const Xn = Math.floor(dX / cellX); 				// целое. в какой ячейке
	const Yn = Math.floor(dY / cellY);
		const	posX = dX % cellX ;						// координаты точки в ячейке
		const	posY = dY % cellY ;
	const paramX = posX / cellX ;						// коорд в ячейке приведённые к 1
	const paramY = posY / cellY ;
		if ((X == X1) && (Y == Y1))					// if NE angle
			return  rctngl.elevations[rctngl.pointsNumber-1] ;
		if (X == X1) {								// if right boundary
				const ind = (Yn+1) * rctngl.Columns - 1 ;
				const hB = rctngl.elevations[ind].elevation ;
				const hU = rctngl.elevations[ind+rctngl.Columns].elevation ;
				const h = hB + (hU-hB)*paramY ;
			return { elevation: h, location: coord } ; }
		if (Y == Y1) {								// if upper boundary
				const ind = Yn  * rctngl.Columns + Xn ;
				const hL = rctngl.elevations[ind].elevation ;
				const hR = rctngl.elevations[ind+1].elevation ;
				const h = hL + (hR-hL)*paramX ;
			return { elevation: h, location: coord } ; }
		const pLeft = [], pRight = [], pBottom = [], pUp = [] ;
		const hLeft = [], hRight = [], hBottom = [], hUp = [] ;
			for ( let i=0; i < 4; i++)
				pBottom[i] 	= Xn + i - 1 ;
			for ( let i=0; i < 4; i++)
				pLeft[i] 	= Yn + i - 1 ;
		if (Xn == 0) // если в крайней левой ячейке
			pBottom[0] 	= 	0 ; 
		if (Xn == rctngl.Columns - 2) // если в крайней правой ячейке
			pBottom[3] 	= rctngl.Columns - 1	 ; 
		if (Yn == 0) 		// если в нижней ячейке
			pLeft[0] 	= 	0 ; 	
		if (Yn == rctngl.Rows - 2) // если в верхней ячейке
			pLeft[3] 	= 	rctngl.Rows - 1 ; 	
	pBottom.forEach(function(valX, ind) {
		let i = Yn * rctngl.Columns + valX;
		if ( ! rctngl.elevations[i] )
			debugger ; 
		hBottom[ind] = rctngl.elevations[i].elevation ;
		if ( rctngl.elevations[i+rctngl.Columns] === undefined  ) {
			debugger ;
			i -= rctngl.Columns ;
		}
		hUp[ind] = rctngl.elevations[i+rctngl.Columns].elevation ;
	})
	pLeft.forEach(function(valY, ind) {
		let i = valY * rctngl.Columns + Xn;
		if (rctngl.elevations[i] === undefined)
			debugger ;
		hLeft[ind] = rctngl.elevations[i].elevation ;
		hRight[ind] = rctngl.elevations[i+1].elevation ;
	})
	let vBottom =	Cartmul(hBottom, 	paramX) ;
	let vUp =		Cartmul(hUp, 	paramX) ;
	let vX = vBottom + (vUp - vBottom) * paramY ;
		let vLeft =		Cartmul(hLeft, 	paramY) ;
		let vRight =	Cartmul(hRight,	paramY) ;
		let vY = vLeft + (vRight - vLeft) * paramX ;
	let vRet = (vX + vY) / 2  ;
	return { elevation: vRet, location: coord }
}
function Cartmul(P, t) 
{ 	let k0 = -t*(1-t)*(1-t)*P[0] ;
	let k1 = (2 - 5*t*t + 3*t*t*t)*P[1] ;
	let k2 = t*(1 + 4*t - 3*t*t)*P[2] ;
	let k3 = -t*t*(1-t)*P[3] ;
	let K = 0.5 * (k0+k1+k2+k3) ;
	return K ;
}
function setDelitel(de) {
		const curvedElevations = new 	composeRectangleDotsConstructor
										(obschak.bounds, obschak.first.Columns*de, obschak.first.Rows*de) ;
		const mass = [] ;
		for ( let i=0 ; i < curvedElevations.pointsNumber; i++ ) { 	
			let dot = curvedElevations.dots[i] ;		// точка в новом массиве
			let ele = curvedR(dot, obschak.first) ;
			if (  ! ele ) {
				let a = 5 ;
			}
			mass.push(ele);			
		}
		curvedElevations.elevations = mass ;
		findMaxMinPoints(curvedElevations) ;
		globusas = curvedElevations ;
}
