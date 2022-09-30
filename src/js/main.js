import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const container = document.querySelector('.container');

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let renderer, scene, camera, light;
let orbitControls;
let cubeTextureLoader, cubeTexture;
let gltfLoader;

const init = function () {
    // Renderer
    renderer = new THREE.WebGL1Renderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    container.appendChild( renderer.domElement );

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 'gray' );
    
    // Camera
    camera = new THREE.PerspectiveCamera( 70, WIDTH/HEIGHT, 0.1, 100 );
    camera.position.set(0, 5, 10);
    scene.add( camera );

    // Light 
    light = new THREE.AmbientLight('#fff', 1);
    scene.add(light);

    // Controls
    orbitControls = new OrbitControls( camera, renderer.domElement );
    orbitControls.enableZoom = false;
    orbitControls.enableDamping = true;

    // Loader
    cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTexture = cubeTextureLoader
        .setPath('./public/texture/morning/')
        .load([
            'px.png', 'nx.png',
            'py.png', 'ny.png',
            'pz.png', 'nz.png',
        ]);
    scene.background = cubeTexture;

    gltfLoader = new GLTFLoader();
    gltfLoader.load(
        './public/models/arrow.glb',
        gltf => {
            
        }
    )
    

    // Mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 'red' });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

const draw = function () {
    orbitControls.update();

    renderer.render( scene, camera );
    renderer.setAnimationLoop(draw);
}

init();
draw();