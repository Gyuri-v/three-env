import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import CreateArrow from './CreateArrow';
import gsap from 'gsap';

const canvasWrap = document.querySelector('.canvas-wrap');
const canvas = canvasWrap.querySelector('canvas');

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let renderer, scene, camera, ambientLight, pointLight;
let orbitControls;
let raycaster, mouse;
let textureLoader, gltfLoader;

let textures = [];
let arrows = [];
let spots = [];

let arrowDistance = 1;
let currentMesh = 0;
let textureTotalNum = 4;

let spotsValue = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -5),
    new THREE.Vector3(5, 0, -5),
    new THREE.Vector3(5, 0, -10),
]

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

    // textureLoader
    textureLoader = new THREE.CubeTextureLoader();
    for (let i = 0; i < textureTotalNum; i++) {
        const texture = textureLoader
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
        const px = i === 1 ? -arrowDistance : i === 3 ? arrowDistance : 0;
        const pz = i === 0 ? -arrowDistance : i === 2 ? arrowDistance : 0;
        const rz = i === 1 ? Math.PI / -2 :  i === 2 ? Math.PI : i === 3 ? Math.PI / 2 : 0;

        let arrow = new CreateArrow({
            gltfLoader,
            scene,
            num: i,
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

    for (let i = 0; i < spotsValue.length; i++) {
        let mesh = new THREE.Mesh(geometry, meterial);
        mesh.position.set(spotsValue[i].x, spotsValue[i].y, spotsValue[i].z);
        spots.push(mesh);
        scene.add(mesh);
    }
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
                x: spots[currentMesh].position.x,
                z: spots[currentMesh].position.z + 2,
            });
            gsap.to(orbitControls.target, {
                duration: 1,
                x: spots[currentMesh].position.x,
                y: spots[currentMesh].position.y,
                z: spots[currentMesh].position.z,
            });
            arrows.forEach(item => {
                console.log(item.num);
                let px = item.num === 1 ? -arrowDistance : item.num === 3 ? arrowDistance : 0;
                let pz = item.num === 0 ? -arrowDistance : item.num === 2 ? arrowDistance : 0;
                
                gsap.to(item.model.position, {
                    duration: 1,
                    x: px + spots[currentMesh].position.x,
                    z: pz + spots[currentMesh].position.z,
                });
            });

            // if ( 
            //     spots[currentMesh].position.x === spots[currentMesh - 1].position.x
            // ) {
            //     arrows[1].model.material.transparent = true;
            //     arrows[1].model.material.opacity = 0;
            // }
            
            setTimeout(() => {
                scene.background = textures[currentMesh];
            }, 500);

            break;
        }

        if( item.object.name === 'arrow2' ){
            currentMesh--;
            
            gsap.to(camera.position, {
                duration: 1,
                x: spots[currentMesh].position.x,
                z: spots[currentMesh].position.z + 2,
            });
            gsap.to(orbitControls.target, {
                duration: 1,
                x: spots[currentMesh].position.x,
                y: spots[currentMesh].position.y,
                z: spots[currentMesh].position.z,
            });
            arrows.forEach(item => {
                console.log(item.num);
                let px = item.num === 1 ? -arrowDistance : item.num === 3 ? arrowDistance : 0;
                let pz = item.num === 0 ? -arrowDistance : item.num === 2 ? arrowDistance : 0;
                
                gsap.to(item.model.position, {
                    duration: 1,
                    x: px + spots[currentMesh].position.x,
                    z: pz + spots[currentMesh].position.z,
                });
            });

            // if ( 
            //     spots[currentMesh].position.x === spots[currentMesh - 1].position.x
            // ) {
            //     arrows[1].model.material.transparent = true;
            //     arrows[1].model.material.opacity = 0;
            // }
            
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
1. 상하좌우에 박스가 있는지 체크해서 오퍼시티, 클릭 안되게 적용
2. 상하좌우 버튼 다 되도록 적용

*. spotsValue, textureTotalNum 합칠방법..?
*. 이동하는 동안 화살표 클릭 못하게 막아둬야 하나?
*/



/*
1. box의 좌표를 수기로 따야한다는 점
2. sky view - 바귈때 부드럽게 바뀔 수 있는 처리
3. cube map - 정말 박스모양 그대로 보임 , shpere 로 하면 이동할때 빈공간이 살짝 보일 수 있음
*/