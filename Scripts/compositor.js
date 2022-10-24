obschak.compost = compose3D ;

import * as THREE from './three.module.js';
//import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js';
import Stats from './stats.module.js';
import { STLLoader } from './STLLoader.js';

//obschak.delitel = setDelitel ;

export function compose3D() {
	
	// if (hMap != undefined) 
		// if (hMap.telo != undefined) {
			// reloadTelo(scene) ;		
			// return ;
		// }
  const canvas =  document.querySelector('#canva3D');
		canvas.width  = document.body.clientWidth; 
		canvas.height = document.body.clientHeight; 
		canvas.style.zIndex   = 1;
			document.getElementById("mapCell").style.display = "none" ;		
			canvas.style.display = "block" ;  
  const renderer = new THREE.WebGLRenderer({canvas, alpha: true, });
  obschak.rend = renderer ;
	  const fov = 75;
	  const aspect = 2;  // the canvas_ default
	  const near = 0.1;
	  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	const multify = globusas.Columns / 25 ;
		camera.position.set(0, 10* multify, -10);
		camera.position.set(20, 50, -50);
	const controls = new OrbitControls(camera, canvas);
		controls.maxPolarAngle = Math.PI/2 ;
		controls.target.set(8, 2, 1.5);
		controls.update();
 		controls.addEventListener('change', function(event) {
					let cam = controls.object ;
					let pos = cam.position ;
					let rot = cam.rotation ;
			}
		) ;
	obschak.controls = controls ;
	scene = new THREE.Scene();
	  function addLight(...pos) {
			const color = 0xFFFFFF;
			const intensity = 1;
			const light = new THREE.DirectionalLight(color, intensity);
			light.position.set(...pos);
			scene.add(light);
	  }
			  addLight(-1, 2, 4); addLight(1, 2, -2); addLight(-1, -2, 4); addLight(1, -2, -2);
			  
	hMap =  new createHeightmap(dataURL, globusas) ;
	scene.add(hMap.telo);		
	hMap.scena = scene ;
//	addDomas(scene) ;

	function rendering() { 
		renderer.render(scene, camera); 
		obschak.renda = requestAnimationFrame(rendering); 
	} 
	requestAnimationFrame(rendering);
	
  return hMap ; 
}
//==============================================================================================================
export class createHeightmap {
	constructor (dataURL, rectus) {    
		const pulkovas = [] ;
			rectus.elevations.forEach((element) => {
			pulkovas.push(element.elevation) ;
		})
		let hKoef = +document.getElementById("slider3D").value ;
			const width = rectus.Columns ;
			const height = rectus.Rows ;
		const dX = MY3DcomputeDistanceBetween( rectus.elevations[0].location, rectus.elevations[1].location ) ; 		// cell width
		const dZ = MY3DcomputeDistanceBetween( rectus.elevations[0].location, rectus.elevations[width].location ) ; 	// cell height
		const diagonale = MY3DcomputeDistanceBetween( rectus.elevations[0].location, 
													  rectus.elevations[rectus.pointsNumber-1].location ) ;
		const heightRatio = diagonale/(globusas.hMax - globusas.hMin) ;
		const xzRatio = dX / dZ ;
			const cellsAcross = rectus.Columns - 1;
			const cellsDeep = rectus.Rows - 1;
		const hK = +document.getElementById("delitel").value
		const gZero = globusas.hMin + (globusas.hMax - globusas.hMin) * hK ;
		this.gZero = gZero ;
				for ( let i=0; i < rectus.pointsNumber; i++)
					pulkovas[i] = pulkovas[i] > gZero ? pulkovas[i] - gZero : 0 ;
			let hMid = Math.sqrt(globusas.hMax*globusas.hMax/2 + globusas.hMin*globusas.hMin/2) ;
//			hMid = Math.sqrt(hMid) ;
//			const CC = hKoef / hMid * Math.sqrt(rectus.pointsNumber)/100;
//			let CC = Math.sqrt(Math.sqrt(heightRatio)) * hKoef / 200 ;
			let CC = Math.log(heightRatio+10) * hKoef / 500 ;
			if ( CC < 0.1 )
				CC /= 5 ;
			
		this.hKoef = CC ;
		const geom = new THREE.Geometry();
		obschak.geometry = geom ;
		for (let z = 0; z < cellsDeep; ++z) {
			for (let x = 0; x < cellsAcross; ++x) {
				const base0 = (z * width + x) ;										// left bottom corner
				const base1 = base0 + width ;										// left upper corner
				const h00 = (pulkovas[base0] 		)*CC ; 		// corner elevations
				const h01 = (pulkovas[base0 + 1]	)*CC ;		// RB
				const h10 = (pulkovas[base1]		)*CC ;		// LU
				const h11 = (pulkovas[base1 + 1]	)*CC ;		// RU
				const hm = (h00 + h01 + h10 + h11) / 4;								// center elevation
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
		this.geometry = geom ;
		this.material = material ;
		this.telo = telo ;
			let outObj = "#\n# WhatThePeak.Com © 2021\n#\n" ;
			const center = MAPPA.getCenter() ;
			outObj += "# Map Center  " + center.lat().toFixed(3) + ', ' + center.lng().toFixed(3) + "\n" ;
			outObj += "# Save this to .OBJ file\n#\n"
		for ( let i = 0 ; i < geom.vertices.length; i++ ) 
					outObj += "v " 	+ geom.vertices[i].x.toFixed(3) + " " 
									+ geom.vertices[i].y.toFixed(3) + " " 
									+ geom.vertices[i].z.toFixed(3) + "\n" ;
		for ( let i = 0 ; i < geom.faces.length; i++ ) 
				outObj += "f " 		+ (geom.faces[i].a + 1) + " " 
									+ (geom.faces[i].b + 1) + " " 
									+ (geom.faces[i].c + 1) + "\n";
		this.OBJ = outObj ;
	}
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	document.getElementById("slider3D").onchange = function() {	
		reloadTelo(scene) ; 
		const deti = scene.children ;
		for (let i=0; i < deti.length; i++) {
			if (deti[i].name != 'realEstate')
				continue ;
//			let k = hMap.hKoef / 100 * slider3D.value;
			deti[i].setVertical() ;
		}
	} 
//================================================================
	document.getElementById("delitel").onchange = function() {	
				const canvas  = globusas.canvas ;
				const ctx = globusas.ctx ;				
					ctx.putImageData(imDat,0,0);
				ctx.fillStyle="#4169E1" ;
				ctx.globalAlpha = 0.5;
			const hK = +document.getElementById("delitel").value ;
			const gZero = globusas.hMin + (globusas.hMax - globusas.hMin) * hK ;
				heZatop.innerText = Math.floor(gZero) ;
		let blink = document.getElementById('blink_text') ;
		blink.style.display = "block" ;	
		let shag = 2 ;
			for ( let y=0; y < globusas.clientHeight; y = y+shag )
				for ( let x=0; x < globusas.clientWidth; x = x+shag) {
					let lat = globusas.SW.lat() + y/globusas.clientHeight*globusas.dLat ;
					let lng = globusas.SW.lng() + x/globusas.clientWidth *globusas.dLng ;
					let mPoint = new google.maps.LatLng(lat, lng);
					let h = curvedR(mPoint, globusas) ;
					if ( h.elevation < gZero )
						ctx.fillRect(x, globusas.clientHeight - y, shag, shag) ;
			}
		blink.style.display = "none" ;					
			dataURL = canvas.toDataURL(); 
			reloadTelo(scene) ;
	} ;
//--------------------------------------------------------------
	function reloadTelo (zalas) { 	
		if (hMap != undefined) 
			if (hMap.telo != undefined) 
				zalas.remove(hMap.telo) ;		
		globusas.ctx.putImageData(imDat,0,0);
		hMap = new createHeightmap(dataURL, globusas) ;
		zalas.add(hMap.telo);		
		hMap.scena = zalas ;
			const deti = zalas.children ;
			for (let i=0; i < deti.length; i++) 
				if (deti[i].name == 'realEstate')
					zalas.remove(deti[i--]) ;		
			addDomas(zalas) ;
	}
//------------------------------------------------------------
function addDomas(zal) {
	const rInPixels =  Math.sqrt(	globusas.clientHeight*globusas.clientHeight + 
									globusas.clientWidth*globusas.clientWidth) ;
	const pX = globusas.clientWidth  / rInPixels ;
	const pZ = globusas.clientHeight / rInPixels ;
		const loaderSTL = new STLLoader();
	for ( let i=0; i < domas.length; i++) {
			const msLat = domas[i].lat, msLng = domas[i].lng ;
			const msPoint = new google.maps.LatLng(msLat, msLng);
			const p = curvedR(msPoint, globusas) ;
			if ( p == null )
				continue ;
			loaderSTL.load( domas[i].stlFile, function ( geometry ) {
				const cen = hMap.geometry.boundingSphere.center ;
				const rad = hMap.geometry.boundingSphere.radius ;
				const material = new THREE.MeshPhongMaterial( 
								{ color: domas[i].color , specular: 0x111111, shininess: 30 } );
				const msH = p.elevation ;
					let d1 = msLat - globusas.SW.lat() ;
					let d2 = msLng - globusas.SW.lng() ;
					let dLat = (d1)/globusas.dLat * rad *2* pZ;
					let dLng = (d2)/globusas.dLng * rad *2* pX;
				const mesh = new THREE.Mesh( geometry, material );
				mesh.elevation = msH ;
				mesh.name = 'realEstate' ;
				mesh.setVertical = function() {
					this.position.setY((this.elevation - hMap.gZero)*hMap.hKoef) ;
				}
				const poY = (msH- hMap.gZero)*hMap.hKoef ;
					mesh.position.set( cen.x + rad*pX - dLng, poY, cen.z - rad*pZ + dLat);
					mesh.rotation.set( -Math.PI/2, 0, -Math.PI/2);
					let k = hMap.hKoef / 100 * slider3D.value * domas[i].scale ;
					mesh.scale.set( k, k, k );
						mesh.castShadow = true;
						mesh.receiveShadow = true;
				zal.add( mesh );
			} );
	}
}
