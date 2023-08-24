import './style.css';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import portalVS from '/resources/shaders/portalShader/vertex.glsl'
import portalFS from '/resources/shaders/portalShader/fragment.glsl'

import GUI from 'lil-gui';

console.time('Threejs')

//THREE.ColorManagement.enabled = false;


//Sizes 
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Resize

window.addEventListener('resize', ()=>{
    //Update Sizes 
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //Update camera
    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix();

    //Update Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//Loaders

const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = ()=>{
  initProject();
}

const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader(loadingManager);

const obsidianCubeTexture = textureLoader.load('resources/textures/obsidianBlockBackedTexture/ObsidianBlockBakedTexture.jpg');

gltfLoader.load('resources/models/Block/Block.glb', (gltf)=>{
  
  const obsidianCube = gltf.scene.children[0];
  //console.log(obsidianCube)
  const obsidianMaterial = new THREE.MeshBasicMaterial({
    map:obsidianCubeTexture,
  })
  //obsidianCube.material = obsidianMaterial;
  //scene.add(obsidianCube);
})

const portalTexture = textureLoader.load('/resources/textures/netherPortalTexture/nether_portal.png');

function initProject(){
  //Scene 
  const scene = new THREE.Scene();
  
  //Camera 
  const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height, 0.1, 100);
  
  //Renderer
  const canvas = document.querySelector('.experience')
  const renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(sizes.width, sizes.height);
  
  //Controls 
  const orbitControls = new OrbitControls(camera, canvas);
  orbitControls.enableDamping = true;
  orbitControls.enabled = true;
  
  //Lights
  const ambientLight = new THREE.AmbientLight('#ffffff', 10);
  scene.add(ambientLight)
  
  //Objects
  
  const portalMaterial = new THREE.ShaderMaterial({
    vertexShader: portalVS,
    fragmentShader: portalFS,
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: { 
      uTime: { value: 0 },
      uResolution: { value: sizes.width }   
    }
  })
  
  
  const portalGeometry = new THREE.PlaneGeometry(2, 2, 200, 200);
  
  const portalMesh = new THREE.Mesh(portalGeometry, portalMaterial);
  
  scene.add(portalMesh);
  
  //scene.add(new THREE.Mesh(portalGeometry, new THREE.MeshBasicMaterial({ map: portalTexture})))
  
  //Scene Configuration
  
  camera.position.set(0, 0, 1.2)
  
  //Gui
  
  //Animate
  const clock = new THREE.Clock();
  
  const tick = ()=>{
    const elapsedTime = clock.getElapsedTime();
  
      //Controls
      orbitControls.update();

      //Update shaders 
      portalMaterial.uniforms.uTime.value = elapsedTime;

      //Render
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
  }
  
  console.timeEnd('Threejs')
  tick();
}