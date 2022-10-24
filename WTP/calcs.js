//------------------------------------------------------------------
function getPointWithElevation(pnt, sqs) {

	if ( ! sqs )
		return null ;
	if ( ! sqs.length )
		return null ;
	
	var pointsFromRects = [] ;
	for (var i=0 ; i < sqs.length; i++) {									// из каждого прямоугольника по 3 точки
		var fourPoints = get4FourPointsInRectangle(pnt, sqs[i]) ; 
		if ( fourPoints != null)	
			pointsFromRects.push( {numb: i, pnts: fourPoints, dens: sqs[i].density} ) ;
	}	
	if ( pointsFromRects.length == 0 )
		return null ;

	pointsFromRects.sort(function(a,b) {																	
		if ( a.dens < b.dens )
			return 1 ;
		else
			return -1 ;
	}) ;
	
	var mD = pointsFromRects.pop() ;
	var mostDense = mD.pnts ; 
	
	mostDense.sort(function(a,b) {																	// сортировка по близости
			if (MYcomputeDistanceBetween(pnt, a.location) >= MYcomputeDistanceBetween(pnt, b.location) )
				return 1 ;
			else
				return -1 ; 
			}) ; 
	var pnt0 = mostDense[0] ;
	var pnt1 = mostDense[1] ;
	var pnt2 = mostDense[2] ;
	
	
	var elePoint = eleIterationByThreePoints(pnt, pnt0, pnt1, pnt2) ;
	elePoint.grid = Math.sqrt(mD.dens) ;
	 
	 pT1 = pnt0 ;
	 pT2 = pnt1 ;
	 pT3 = pnt2 ;
	
	return elePoint ;
}
// -----------------------------------------------------------------------------------------------------------------------
function eleIterationByThreePoints(coord, pnt0, pnt1, pnt2) {
	var a11 = coord.lng() - pnt0.location.lng();
	var a21 = pnt1.location.lng() - pnt0.location.lng();
	var a31 = pnt2.location.lng() - pnt0.location.lng();

	var a12 = coord.lat() - pnt0.location.lat();
	var a22 = pnt1.location.lat() - pnt0.location.lat();
	var a32 = pnt2.location.lat() - pnt0.location.lat();

	var a23 = pnt1.elevation - pnt0.elevation;
	var a33 = pnt2.elevation - pnt0.elevation;

	var hei = (a11 * a22 * a33 - a11 * a23 * a32 - a12 * a21 * a33 + a12 * a23 * a31) / (-a21 * a32 + a22 * a31) + pnt0.elevation;
	
	var X = a22 * a33 - a23 * a32 ;
	var Y = a21 * a33 - a23 * a31 ;
	var Z = a21 * a32 - a22 * a31 ;
	
	
	var cosOf = Math.sqrt((X*X + Y*Y)/(X*X + Y*Y + Z*Z)) ;
	var ugol = Math.acos(cosOf) * 180 / Math.PI ;

	return { elevation: hei, location: coord, naklon: Math.abs(ugol) };
}
// -----------------------------------------------------------------------------------------------------------------------
function get4FourPointsInRectangle(coord, rctngl) {
	if ((coord.lat() < rctngl.SW.lat()) || (coord.lat() > rctngl.NE.lat()) || (coord.lng() < rctngl.SW.lng()) || (coord.lng() > rctngl.NE.lng()))
		return null;		// если точка не входит в прямоугольник
	
	let X0 = rctngl.SW.lng();
	let Y0 = rctngl.SW.lat();
	let X = coord.lng();
	let Y = coord.lat();

	let cellX = rctngl.dLng / (rctngl.Columns-1);
	let cellY = rctngl.dLat / (rctngl.Rows-1);

	let dY = Y - Y0;
	let dX = X - X0;

	let Xn = Math.floor(dX / cellX); // целое. в какой ячейке
	let Yn = Math.floor(dY / cellY);
	
	let Ax, Bx, Cx, Ay, By, Cy, Dx, Dy, AInd, BInd, CInd, DInd ;
	
	Ax = Xn ; 		Ay = Yn ;
	Bx = Xn +1 ; 	By = Yn ;
	Cx = Xn +1 ; 	Cy = Yn + 1 ;
	Dx = Xn ;	 	Dy = Yn + 1;
	
	Ax += Ax > rctngl.Columns - 2	? -2 : 0;				// если на краю
	Ay += Ay > rctngl.Rows - 2 		? -2 : 0;
	Bx += Bx > rctngl.Columns - 2 	? -2 : 0;
	By += By > rctngl.Rows - 2 		? -2 : 0;
	Cx += Cx > rctngl.Columns - 2 	? -2 : 0;
	Cy += Cy > rctngl.Rows - 2 		? -2 : 0;
	Dx += Dx > rctngl.Columns - 2 	? -2 : 0;
	Dy += Dy > rctngl.Rows - 2 		? -2 : 0;

	AInd = Ay * rctngl.Columns + Ax;
	BInd = By * rctngl.Columns + Bx;
	CInd = Cy * rctngl.Columns + Cx;
	DInd = Dy * rctngl.Columns + Dx;
	
	var cellCorners = [ rctngl.elevations[AInd], rctngl.elevations[BInd], rctngl.elevations[CInd], rctngl.elevations[DInd] ] ;
	
	return cellCorners ;				// возвращаем угловые точки ячейки
}
// -----------------------------------------------------------------------------------------------------------------------
function MYcomputeDistanceBetween(a,b) {
		
		var alat = a.lat()*Math.PI/180 ;
		
		var bl = b.lat() ;
		var bg = b.lng() ;
		
		var c2 = (b.lat()-a.lat())*(b.lat()-a.lat()) + (b.lng()-a.lng())*(b.lng()-a.lng())*Math.cos(a.lat()*Math.PI/180)  *  Math.cos(b.lat()*Math.PI/180) ;
		var c= Math.sqrt(c2) ;
		var d =c*Math.PI/180 ;
		
		return Math.sin(d)*EARTH_RADIUS ;
	}	

// ****************************************************************************************************
function boundsParameters(bnd) {
		var NE = bnd.getNorthEast() ;				//	северо-восток
		var SW = bnd.getSouthWest() ;				//	юго-запад
		this.North = NE.lat() ;
		this.East = NE.lng() ;
		this.South = SW.lat() ;
		this.West = SW.lng() ;
		this.Dlat = this.North - this.South ;
		this.Dlng = this.East - this.West ; 
	this.SW = SW ;
	this.NE = NE ;
	this.SE = new google.maps.LatLng(this.South, this.East);
	this.NW = new google.maps.LatLng(this.North, this.West);
	this.path = [this.SW, this.NW, this.NE, this.SE, this.SW] ;
	this.center = interpolate(this.SW, this.NE, 0.5) ;
}
