import * as THREE from './three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js';

export function compose3D(dataURL) {

  const canvas =  document.querySelector('#canva3D');
		canvas.width  = document.body.clientWidth; ;
		canvas.height = document.body.clientHeight; ;
		canvas.style.zIndex   = 1;
  canvas.style.display = "block" ;

  const renderer = new THREE.WebGLRenderer({canvas});

  const fov = 75;
  const aspect = 2;  // the canvas_ default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	let multify = AllRects[0].Columns / 50 ;
	camera.position.set(0, 10* multify, -9);
	
	if ( camFucks.x + camFucks.y + camFucks.z + camFucks.rX + camFucks.rY + camFucks.rZ ) {
		camera.position.x = camFucks.x ;
		camera.position.y = camFucks.y ;
		camera.position.z = camFucks.z ;
		camera.rotation._x = camFucks.rX ;
		camera.rotation._y = camFucks.rY ;
		camera.rotation._z = camFucks.rZ ;
	}		

   const controls = new OrbitControls(camera, canvas);
   controls.maxPolarAngle = Math.PI/2 ;
   controls.target.set(0, 0, 0);
   controls.update();
 		controls.addEventListener('change', function(event) {
					let cam = controls.object ;
					let pos = cam.position ;
					let rot = cam.rotation ;
					camFucks.x = + pos.x.toFixed(2);
					camFucks.y = + pos.y.toFixed(2);
					camFucks.z = + pos.z.toFixed(2);
					camFucks.rX = + rot._x.toFixed(2);
					camFucks.rY = + rot._y.toFixed(2);
					camFucks.rZ = + rot._z.toFixed(2);
					window.location.hash = "#" + composeURL() ; 			
			}
		) ;

	var scene = new THREE.Scene();

	  function addLight(...pos) {
			const color = 0xFFFFFF;
			const intensity = 1;
			const light = new THREE.DirectionalLight(color, intensity);
			light.position.set(...pos);
			scene.add(light);
	  }

	  addLight(-1, 2, 4);
	  addLight(1, 2, -2); 
	  addLight(-1, -2, 4);
	  addLight(1, -2, -2);

	var hMap = createHeightmap(dataURL, AllRects[0]) ;
	scene.add(hMap.telo);		
	hMap.scena = scene ;

		function rendering() {
			renderer.render(scene, camera);
			renda = requestAnimationFrame(rendering);
		}
		requestAnimationFrame(rendering);
  
  return hMap ; 
}

export function createHeightmap(dataURL, R) {    

	var hKoef = +document.getElementById("slider3D").value ;
    const geom = new THREE.Geometry();
	const width = R.Columns ;
	const height = R.Rows ;
	const dX = MY3DcomputeDistanceBetween( R.elevations[0].location, R.elevations[1].location ) ; 
	const dZ = MY3DcomputeDistanceBetween( R.elevations[0].location, R.elevations[width].location ) ; 
	const xzRatio = dX / dZ ;
		const cellsAcross = R.Columns - 1;
		const cellsDeep = R.Rows - 1;
			var hMax = -13000, hMin = 10000 ;
			for ( let i=0; i < R.pointsNumber; i++)
			{
				if (hMax < R.elevations[i].elevation)
					hMax = R.elevations[i].elevation ;
				if (hMin > R.elevations[i].elevation)
					hMin = R.elevations[i].elevation ;
			}
	let hMid = Math.sqrt(hMax*hMax/2 + hMin*hMin/2) ;
	var CC = hKoef / hMid * Math.sqrt(R.pointsNumber)/50;
	
    for (let z = 0; z < cellsDeep; ++z) {
      for (let x = 0; x < cellsAcross; ++x) {
        const base0 = (z * width + x) ;
        const base1 = base0 + width ;
        const h00 = (R.elevations[base0].elevation		- hMin)*CC ; ;
        const h01 = (R.elevations[base0 + 1].elevation	- hMin)*CC ;
        const h10 = (R.elevations[base1].elevation		- hMin)*CC ;
        const h11 = (R.elevations[base1 + 1].elevation	- hMin)*CC ;
        const hm = (h00 + h01 + h10 + h11) / 4;
					const x0 = x;
					const x1 = x + 1;
					const z0 = 1/xzRatio*z;
					const z1 = 1/xzRatio*(z + 1);
        const ndx = geom.vertices.length;
        geom.vertices.push(
          new THREE.Vector3(x0, h00, z0),	// 0										//      2----3
          new THREE.Vector3(x1, h01, z0),	// 1										//      |\  /|
          new THREE.Vector3(x0, h10, z1),	// 2										//      | \/4|
          new THREE.Vector3(x1, h11, z1),	// 3										//      | /\ |
          new THREE.Vector3((x0 + x1) / 2, hm, (z0 + z1) / 2),	// 4					//      |/  \|
        );																				//      0----1
					geom.faces.push(
					  new THREE.Face3(ndx + 0, ndx + 4, ndx + 1),		// 0 4 1
					  new THREE.Face3(ndx + 1, ndx + 4, ndx + 3),		// 1 4 3
					  new THREE.Face3(ndx + 3, ndx + 4, ndx + 2),		// 3 4 2
					  new THREE.Face3(ndx + 2, ndx + 4, ndx + 0),		// 2 4 0
					);
        const u0 = x / cellsAcross;
        const v0 = z / cellsDeep;
        const u1 = (x + 1) / cellsAcross;
        const v1 = (z + 1) / cellsDeep;
        const um = (u0 + u1) / 2;
        const vm = (v0 + v1) / 2;
			geom.faceVertexUvs[0].push(
			  [ new THREE.Vector2(u0, v0), new THREE.Vector2(um, vm), new THREE.Vector2(u1, v0) ],	// 0 4 1
			  [ new THREE.Vector2(u1, v0), new THREE.Vector2(um, vm), new THREE.Vector2(u1, v1) ],	// 1 4 3
			  [ new THREE.Vector2(u1, v1), new THREE.Vector2(um, vm), new THREE.Vector2(u0, v1) ],	// 3 4 2
		    [ new THREE.Vector2(u0, v1), new THREE.Vector2(um, vm), new THREE.Vector2(u0, v0) ],	// 2 4 0
			);
      }
    }
    geom.computeFaceNormals();
    geom.translate(width / -2, 0, height / -2);

    const loader = new THREE.TextureLoader();
    const texture = loader.load(dataURL);
	const material = new THREE.MeshPhongMaterial({color: 0xCCCCCC, map: texture});

    const telo = new THREE.Mesh(geom, material);
	telo.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

	var retObject = {} ;
	retObject.geometry = geom ;
	retObject.material = material ;
	retObject.telo = telo ;
	retObject.hMin = hMin ;
	retObject.hMax = hMax ;
	
	var outObj = "#<br># WhatThePeak.Com © 2020 <br>" ;
	let center = MAPPA.getCenter() ;
	outObj += "# Map Center  " + center.lat().toFixed(3) + ', ' + center.lng().toFixed(3) + "<br>" ;
	outObj += "# Copy (Crtl A) & Save to .OBJ file<br>#<br>"
	
	for ( let i = 0 ; i < geom.vertices.length; i++ ) 
				outObj += "v " 	+ geom.vertices[i].x.toFixed(3) + " " 
								+ geom.vertices[i].y.toFixed(3) + " " 
								+ geom.vertices[i].z.toFixed(3) + "<br>" ;
						
	for ( let i = 0 ; i < geom.faces.length; i++ ) 
			outObj += "f " + (geom.faces[i].a + 1) + " " + (geom.faces[i].b + 1) + " " + (geom.faces[i].c + 1) + "<br>";
	
	retObject.obj = outObj ;
	
	return retObject ;
}

function MY3DcomputeDistanceBetween(a,b) {
		var alat = a.lat()*Math.PI/180 ;
		var bl = b.lat() ;
		var bg = b.lng() ;
		var c2 = 	(b.lat()-a.lat())*(b.lat()-a.lat()) + 
					(b.lng()-a.lng())*(b.lng()-a.lng()) * 	Math.cos(a.lat()*Math.PI/180) * 
															Math.cos(b.lat()*Math.PI/180) ;
		var c= Math.sqrt(c2) ;
		var d =c*Math.PI/180 ;
		return Math.sin(d)*6378300 ;
}

