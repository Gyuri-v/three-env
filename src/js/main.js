import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import CreateArrow from './CreateArrow';
import dat from 'dat.gui';
import gsap from 'gsap';
import CreateTexture from './createTexture';

const canvasWrap = document.querySelector('.canvas-wrap');
const canvas = canvasWrap.querySelector('canvas');

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let renderer, scene, camera, ambientLight, pointLight, gui;
let orbitControls, raycaster, mouse;
let cubeTextureLoader, textureLiving, textureNeon;
let textures = [];
let gltfLoader;
let arrow = null;
let arrows = [];
let mesh1, mesh2;
let meshs = [];
let currentMesh = 0;
let totalNum = 4;

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
    camera.position.set(0, 1, 2);
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
    // orbitControls.enableZoom = false;
    // orbitControls.enableDamping = true;

    // GUI
    gui = new dat.GUI();
    // gui.add(PerspectiveCamera, 'fov', -50, 50, 0.01);

    // CubeTextureLoader
    cubeTextureLoader = new THREE.CubeTextureLoader();
    // textureLiving = cubeTextureLoader
    //     .setPath('./public/texture/texture0/')
    //     .load([
    //         'px.png', 'nx.png',
    //         'py.png', 'ny.png',
    //         'pz.png', 'nz.png',
    //     ]);
    // textureNeon = cubeTextureLoader
    //     .setPath('./public/texture/neon/')
    //     .load([
    //         'px.png', 'nx.png',
    //         'py.png', 'ny.png',
    //         'pz.png', 'nz.png',
    //     ]);
    for (let i = 0; i < totalNum; i++) {
        const texture = cubeTextureLoader
            .setPath(`./public/texture/${i}/`)
            .load([
                'px.png', 'nx.png',
                'py.png', 'ny.png',
                'pz.png', 'nz.png',
            ]);
        console.log(texture, textureLiving);
        textures.push(texture);
    }
    scene.background = textures[0];

    // GLTFLoader
    gltfLoader = new GLTFLoader();
    for (let i = 0; i < 4; i++) {
        let distance = 1;

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
    // const geometry = new THREE.SphereGeometry(2.5, 16, 8);
    // const geometry = new THREE.BoxGeometry(5, 5, 5);
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const meterial = new THREE.MeshStandardMaterial({ color: 'red' });
    // const material1 = new THREE.MeshStandardMaterial({ 
    //     // color: 'red',
    //     side: THREE.DoubleSide,
    //     envMap: textureLiving,
    //     metalness: 1,
    //     roughness: 0,
    // });
    // const material2 = new THREE.MeshStandardMaterial({ 
    //     // color: 'red',
    //     side: THREE.DoubleSide,
    //     envMap: textureNeon,
    //     metalness: 1,
    //     roughness: 0,
    // });
    mesh1 = new THREE.Mesh(geometry, meterial);
    mesh2 = new THREE.Mesh(geometry, meterial);
    mesh2.position.set(0, 0, -5.01);
    meshs.push(mesh1, mesh2);
    scene.add(mesh1, mesh2);

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
        if( item.object.name === 'arrow0' ){
            currentMesh++;
            
            gsap.to(camera.position, {
                duration: 1,
                x: meshs[currentMesh].position.x,
                z: meshs[currentMesh].position.z + 2,
            });
            gsap.to(orbitControls.target, {
                duration: 1,
                x: meshs[currentMesh].position.x,
                y: meshs[currentMesh].position.y,
                z: meshs[currentMesh].position.z,
            });
            setTimeout(() => {
                scene.background = textures[currentMesh];
            }, 500);

            // orbitControls.target = mesh2.position;
            // console.log(camera.position);
            // cubeTexture = cubeTextureLoader
            // .setPath('./public/texture/neon/')
            // .load([
            //     'px.png', 'nx.png',
            //     'py.png', 'ny.png',
            //     'pz.png', 'nz.png',
            // ]);
            break;
        }
    }
}

const draw = function () {
    orbitControls.update();

    renderer.render( scene, camera );
    renderer.setAnimationLoop(draw);
}

init();
draw();