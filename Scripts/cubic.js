	import * as THREE from './three.module.js';
	obschak.cubeFunk = cubic ;
	
//	cubic() ;
	
	
function cubic() {
																		//	return ;
	
	const canvas = document.querySelector('#cubatura');
	const renderer = new THREE.WebGLRenderer({canvas, alpha: true});
		const fov = 75;
		const aspect = 2;  // the canvas default
		const near = 0.1;
		const far = 5;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.z = 1.33;
	const scene = new THREE.Scene();
		const boxWidth = 1;
		const boxHeight = 1;
		const boxDepth = 1;
	const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
	const cubes = [];  // just an array we can use to rotate the cubes
	const loadManager = new THREE.LoadingManager();
	const loader = new THREE.TextureLoader(loadManager);

	obschak.pic3D = new THREE.MeshBasicMaterial({map: loader.load('./PIX/ForCubic/3D.gif')});
	obschak.pic2D = new THREE.MeshBasicMaterial({map: loader.load('./PIX/ForCubic/2D.gif')});
	obschak.picClick = new THREE.MeshBasicMaterial({map: loader.load('./PIX/ForCubic/click.gif')});



		const materials = [] ;
		const allMaterials = [] ;
		// let fnam = "" ;
		// for ( let i=0; i < 30; i++) {
			// if ( i < 10-1 )
				// fnam = './PIX/ForCubic/polit/0' + (i+1) + '.jpg' ;
			// else
				// fnam = './PIX/ForCubic/polit/' + (i+1) + '.jpg' ;
			// const flo = loader.load(fnam) ;
			// const ma = new THREE.MeshBasicMaterial({map: flo});
			// allMaterials[i] = ma ;
		// }
		obschak.allMaterials = allMaterials ;
//		changeGranes(materials, allMaterials) ;
//		materials[6-1] = allMaterials[0] ;
		setCubeGranes(materials, obschak.pic3D) ;		
		materials[0] = obschak.picClick ;
		materials[1] = obschak.picClick ;
		materials[2] = obschak.picClick ;
		
			
		loadManager.onLoad = () => {
			const cube = new THREE.Mesh(geometry, materials);
			scene.add(cube);
			cubes.push(cube);  // add to our list of cubes to rotate
			obschak.cube = cube ;
//			canvas.onmouseover = changeGranes(materials, allMaterials) ;
		};		
			function resizeRendererToDisplaySize(renderer) {
				const canvas = renderer.domElement;
				const width = canvas.clientWidth;
				const height = canvas.clientHeight;
				const needResize = canvas.width !== width || canvas.height !== height;
				if (needResize) {
					renderer.setSize(width, height, false);
				}
				return needResize;
			}
  function render(time) {
    time *= 0.001;
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
			cubes.forEach((cube, ndx) => {
			  const speed = .2 + ndx * .1;
			  const rot = time * speed  ; 

		//	  cube.rotation.y = (rot*2)	% (2*Math.PI);
		//	  cube.rotation.z = (rot/2) % (2*Math.PI);
		//	  cube.rotation.z = 0; //(rot/2) % (2*Math.PI);
			  cube.rotation.x = (2*rot) % (2*Math.PI);
			  
			});
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
