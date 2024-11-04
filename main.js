import './style.css'

// Import the three.js library
import * as THREE from 'three';

// Allow us to maneuver around the scene
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

// Create the scene
const scene = new THREE.Scene();

// Create the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create the renderer
const renderer = new THREE.WebGLRenderer( {
    canvas: document.querySelector('#bg'),
});

// Set the renderer size and camera position
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Create the sphere and add it to the scene
const geometry = new THREE.SphereGeometry( 10, 32, 16 ); 
const material = new THREE.MeshStandardMaterial( { color: 0xffff00, wireframe: true } );
const sphere = new THREE.Mesh( geometry, material ); 
scene.add( sphere );


// Load the Block M
let blockM;
const mtlLoader = new MTLLoader();
mtlLoader.load('M.mtl', function(materials) {
    materials.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('M.obj', function(object) {
        blockM = object;
        object.scale.set(20, 20, 20);
        object.position.set(10, 0, 0);
        scene.add(object);
    });
});

// Load the Urban Science logo
let urbanScience;
mtlLoader.load('urbanScience.mtl', function(materials) {
    materials.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('urbanScience.obj', function(object) {
        urbanScience = object;
        object.scale.set(3, 3, 3);
        object.position.set(30, 0, 0);
        scene.add(object);
    });
});


// Create an ambient light that lights up the whole scene
// const ambientLight = new THREE.AmbientLight(0xffffff); // soft white light
// scene.add(ambientLight);

// Create a hemisphere light that lights up the sky, the ground, and the objects
const light = new THREE.HemisphereLight( 0xffffff, 0x000000, 1 );
scene.add( light );

// Create a grid to help us see the position of the objects
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);



// Add the orbit controls to the scene to allow us to move around
const controls = new OrbitControls(camera, renderer.domElement);



// Create a random star field
function addStar() {
    const geometry = new THREE.SphereGeometry(5, 24, 24);
    const material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
    const star = new THREE.Mesh( geometry, material );

    // Randomly generate the position of the star
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(1000));

    star.position.set(x, y, z);
    scene.add(star);
}
Array(200).fill().forEach(addStar); // Create 200 stars



// Move the camera on scroll
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    camera.position.x = t * -0.02; 
    camera.position.y = t * -0.02;
}
document.body.onscroll = moveCamera;




// Animate the scene
function animate() {
    requestAnimationFrame( animate );
    sphere.rotation.x += 0.001;
    sphere.rotation.y += 0.001;
    sphere.rotation.z += 0.001;
    blockM.rotation.x += 0.001;
    blockM.rotation.y += 0.001;
    blockM.rotation.z += 0.001;
    urbanScience.rotation.x += 0.001;
    urbanScience.rotation.y += 0.001;
    urbanScience.rotation.z += 0.001;
    renderer.render( scene, camera );
    controls.update();
}
animate();

