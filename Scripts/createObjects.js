import * as THREE from './three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js';

	obschak.newKlasse = function(can) {
		return new klasse3D(can) ;
	}
	export class klasse3D {
		constructor (kan) {
			const kanva = document.querySelector('#canva3D');
			kanva.style.display = "block" ;
			const ctx = kanva.getContext('2d') ;
			kanva.width  = document.body.clientWidth; 
			kanva.height = document.body.clientHeight; 
			const renderer = new THREE.WebGLRenderer({kanva});
				const fov = 75;
				const aspect = 2;  // the canvas_ default
				const near = 0.1;
				const far = 1000;
			const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
				const multify = globusas.Columns / 25 ;
				camera.position.set(0, 10* multify, -10);
				camera.position.set(20, 50, -50);
			const controls = new OrbitControls(camera, kanva);
				controls.maxPolarAngle = Math.PI/2 ;
				controls.target.set(8, 2, 1.5);
				controls.update();
			const scene = new THREE.Scene();
				addLight(scene, -1,  2,  4);
				addLight(scene,  1,  2, -2); 
				addLight(scene, -1, -2,  4);
				addLight(scene,  1, -2, -2);
					function addLight(...pos) {
						const color = 0xFFFFFF;
						const intensity = 1;
						const light = new THREE.DirectionalLight(color, intensity);
							light.position.set(...pos);
						scene.add(light);
					}
			let hMap = new heightMapObject(dataURL, globusas) ;
			
			{	let geometry = new THREE.BoxGeometry( 1, 1, 1 );
				let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
				let cube = new THREE.Mesh( geometry, material );
				scene.add( cube );}

			
			
			scene.add(hMap.telo);
			function rendering() {
					renderer.render(scene, camera);
					requestAnimationFrame(rendering);
				}
			requestAnimationFrame(rendering);			
		}
	}
	export class heightMapObject {
		constructor(dataURL, rectus) {
			const pulkovas = [] ;
			rectus.elevations.forEach((element) => {
				pulkovas.push(element.elevation) ;
			})
			const hKoef = +document.getElementById("slider3D").value ;
			this.geom = new THREE.Geometry();
				const width = rectus.Columns ;
				const height = rectus.Rows ;
				const dX = MY3DcomputeDistanceBetween( rectus.elevations[0].location, rectus.elevations[1].location ) ; 		// cell width
				const dZ = MY3DcomputeDistanceBetween( rectus.elevations[0].location, rectus.elevations[width].location ) ; 	// cell height
				const xzRatio = dX / dZ ;
				const cellsAcross = rectus.Columns - 1;
				const cellsDeep = rectus.Rows - 1;
				const hK = +document.getElementById("delitel").value ;
			const gZero = rectus.hMin + (rectus.hMax - rectus.hMin) * hK ;
			for ( let i=0; i < rectus.pointsNumber; i++)
				pulkovas[i] = pulkovas[i] > gZero ? pulkovas[i] - gZero : 0 ;
			const hMid = Math.sqrt(rectus.hMax*rectus.hMax/2 + rectus.hMin*rectus.hMin/2) ;
			const CC = hKoef / hMid * Math.sqrt(rectus.pointsNumber)/50;
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
					const ndx = this.geom.vertices.length;
					this.geom.vertices.push(
						new THREE.Vector3(x0, h00, z0),	// 0										//      2----3
						new THREE.Vector3(x1, h01, z0),	// 1										//      |\  /|
						new THREE.Vector3(x0, h10, z1),	// 2										//      | \/4|
						new THREE.Vector3(x1, h11, z1),	// 3										//      | /\ |
						new THREE.Vector3((x0 + x1) / 2, hm, (z0 + z1) / 2),	// 4					//      |/  \|
					);																				//      0----1
						this.geom.faces.push(
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
						this.geom.faceVertexUvs[0].push(
							[ new THREE.Vector2(u0, v0), new THREE.Vector2(um, vm), new THREE.Vector2(u1, v0) ],	// 0 4 1
							[ new THREE.Vector2(u1, v0), new THREE.Vector2(um, vm), new THREE.Vector2(u1, v1) ],	// 1 4 3
							[ new THREE.Vector2(u1, v1), new THREE.Vector2(um, vm), new THREE.Vector2(u0, v1) ],	// 3 4 2
							[ new THREE.Vector2(u0, v1), new THREE.Vector2(um, vm), new THREE.Vector2(u0, v0) ],	// 2 4 0
						);
				}
			}
			this.geom.computeFaceNormals();	
			this.geom.translate(width / -2, 0, height / -2);
			const loader = new THREE.TextureLoader();
			this.texture = loader.load(dataURL);
			this.material = new THREE.MeshPhongMaterial({color: 0xCCCCCC, map: this.texture});
			this.telo = new THREE.Mesh(this.geom, this.material);
			this.telo.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
				let outObj = "#<br># WhatThePeak.Com © 2021 <br>" ;
				const center = MAPPA.getCenter() ;
				outObj += "# Map Center  " + center.lat().toFixed(3) + ', ' + center.lng().toFixed(3) + "<br>" ;
				outObj += "# Copy (Crtl A) & Save to .OBJ file<br>#<br>"
				for ( let i = 0 ; i < this.geom.vertices.length; i++ ) 
					outObj += "v " 	+ this.geom.vertices[i].x.toFixed(3) + " " 
									+ this.geom.vertices[i].y.toFixed(3) + " " 
									+ this.geom.vertices[i].z.toFixed(3) + "<br>" ;
				for ( let i = 0 ; i < this.geom.faces.length; i++ ) 
					outObj += "f " 	+ (this.geom.faces[i].a + 1) + " " 
									+ (this.geom.faces[i].b + 1) + " " 
									+ (this.geom.faces[i].c + 1) + "<br>";
			this.OBJ = outObj ;
		}
	}
