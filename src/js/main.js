import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import CreateArrow from './CreateArrow';
import dat from 'dat.gui';
import gsap from 'gsap';

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
    for (let i = 0; i < totalNum; i++) {
        const texture = cubeTextureLoader
            .setPath(`./public/texture/${i}/`)
            .load([
                'px.png', 'nx.png',
                'py.png', 'ny.png',
                'pz.png', 'nz.png',
            ]);
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
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const meterial = new THREE.MeshStandardMaterial({ color: 'red' });
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
        console.log(item.object.name);
        
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
            arrows.forEach(item => {
                gsap.to(item.model.position, {
                    duration: 1,
                    x: item.model.position.x + meshs[currentMesh].position.x,
                    y: item.model.position.y + meshs[currentMesh].position.y,
                    z: item.model.position.z + meshs[currentMesh].position.z,
                });
            });

            arrows[1].model.material.transparent = true;
            arrows[1].model.material.opacity = 0;
            console.log(arrows[1].model.material.opacity);

            // if ( meshs[currentMesh].position.x === meshs[currentMesh - 1].position.x ) arrows[1].model.material.opacity(0);
            
            setTimeout(() => {
                scene.background = textures[currentMesh];
            }, 500);

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



/*

1. box의 좌표를 수기로 따야한다는 점
2. sky view - 바귈때 부드럽게 바뀔 수 있는 처리
3. cube map - 정말 박스모양 그대로 보임 , shpere 로 하면 이동할때 빈공간이 살짝 보일 수 있음



*/