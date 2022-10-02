import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import CreateArrow from './CreateArrow';

const canvasWrap = document.querySelector('.canvas-wrap');
const canvas = canvasWrap.querySelector('canvas');

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let renderer, scene, camera, ambientLight, pointLight;
let orbitControls, raycaster, mouse;
let cubeTextureLoader, cubeTexture;
let gltfLoader;
let arrow = null;
let arrows = [];

const init = function () {
    // Renderer
    renderer = new THREE.WebGL1Renderer({ canvas, antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    // renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 'gray' );
    
    // Camera
    camera = new THREE.PerspectiveCamera( 70, WIDTH/HEIGHT, 0.1, 100 );
    camera.position.set(0, 6, 10);
    scene.add( camera );

    // Light 
    ambientLight = new THREE.AmbientLight('#fff', 0.2);
    pointLight = new THREE.PointLight('#fff', 1, 100, 1);
    pointLight.position.set(0, 10, 5)
    scene.add(ambientLight, pointLight);

    const pointLightHelper = new THREE.PointLightHelper( pointLight, 1 );
    scene.add( pointLightHelper );

    // Controls
    orbitControls = new OrbitControls( camera, renderer.domElement );
    orbitControls.enableZoom = false;
    orbitControls.enableDamping = true;

    // CubeTextureLoader
    cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTexture = cubeTextureLoader
        .setPath('./public/texture/living/')
        .load([
            'px.png', 'nx.png',
            'py.png', 'ny.png',
            'pz.png', 'nz.png',
        ]);
    // scene.background = cubeTexture;

    // GLTFLoader
    gltfLoader = new GLTFLoader();
    for (let i = 0; i < 4; i++) {
        let distance = 5;

        const px = i === 1 ? -distance : i === 3 ? distance : 0;
        const pz = i === 0 ? -distance : i === 2 ? distance : 0;
        const rz = i === 1 ? Math.PI / -2 :  i === 2 ? Math.PI : i === 3 ? Math.PI / 2 : 0;

        arrow = new CreateArrow({
            gltfLoader,
            scene,
            name: `arrow${i}`,
            positionX: px,
            positionZ: pz,
            rotationX: Math.PI / 2,
            rotationZ: rz,
        });
        arrows.push(arrow);
    }
    
    // Mesh
    const geometry = new THREE.BoxGeometry(50, 50, 50);
    const material = new THREE.MeshStandardMaterial({ 
        // color: 'red',
        side: THREE.DoubleSide,
        envMap: cubeTexture,
        metalness: 1,
        roughness: 0,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Raycaster
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    canvas.addEventListener('click', function (e) {
        mouse.x = e.clientX / canvas.width * 2 - 1;
        mouse.y = -(e.clientY / canvas.height * 2 - 1);
        
        checkIntersects();
    })
}

const checkIntersects = function () {
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(scene.children);
    
    for (const item of intersects) {
        console.log(item.object.name);
    }
}

const draw = function () {
    orbitControls.update();

    renderer.render( scene, camera );
    renderer.setAnimationLoop(draw);
}

init();
draw();