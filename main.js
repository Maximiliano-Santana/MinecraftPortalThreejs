import './style.css';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';


import portalVS from '/resources/shaders/portalShader/vertex.glsl'
import portalFS from '/resources/shaders/portalShader/fragment.glsl'

import GUI from 'lil-gui';

console.time('Threejs')

THREE.ColorManagement.enabled = false;


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
const dracoLoader = new DRACOLoader(loadingManager);

dracoLoader.setDecoderPath('/draco/');
gltfLoader.setDRACOLoader(dracoLoader);

//Models

let portalModel = null;
gltfLoader.load('resources/models/portalModel/binary/minecraftPortalModel.glb', (gltf)=>{
  gltf.scene.traverse((child)=>{
    if(child.name === 'BaseStone'){
      child.material = backedBaseStoneMaterial;
    }else if(child.name === 'Decoration' || child.name === 'Leaves' || child.name === 'Flowers' || child.name === 'Vines' || child.name === 'Grass' || child.name === 'TallGrass'){
      child.material = backedPlantsMaterial;
    }else if(child.name === 'Obsidian'){
      child.material = backedObsidianMaterial;
    }else if(child.name === 'BaseDirt' || child.name === 'GroundGrass' || child.name === 'GroundDirt' || child.name === 'Fences'){
      child.material = backedGroundArchMaterial;
    }else if (child.name === 'LavaStill'){
      child.material = lavaStillMaterial;
    }else if(child.name === 'LavaFlow'){
      child.material = lavaFlowMaterial;
    }else if (child.name === 'Portal'){
      child.mateiral = portalMaterial;
      child.visible = false;
    }
  })
  
  portalModel = gltf.scene
  scene.add(portalModel);
  
})

//Textures
// const portalTexture = textureLoader.load('/resources/textures/netherPortalTexture/nether_portal.png');
const backedPlantsTexture = textureLoader.load('/resources/textures/backedTextures/backedPlants.png');
backedPlantsTexture.flipY = false;
backedPlantsTexture.minFilter = THREE.NearestFilter
backedPlantsTexture.magFilter = THREE.NearestFilter
backedPlantsTexture.generateMipmaps = false;
// backedPlantsTexture.colorSpace = THREE.SRGBColorSpace; 

const backedGroundArchTexture = textureLoader.load('/resources/textures/backedTextures/backedGoundArch.jpg')
backedGroundArchTexture.flipY = false;
backedGroundArchTexture.minFilter = THREE.NearestFilter
backedGroundArchTexture.magFilter = THREE.NearestFilter
backedGroundArchTexture.generateMipmaps = false;
// backedGroundArchTexture.colorSpace = THREE.SRGBColorSpace
const backedObsidianTexture = textureLoader.load('/resources/textures/backedTextures/backedObsidianPortal.jpg')
backedObsidianTexture.flipY = false;
backedObsidianTexture.minFilter = THREE.NearestFilter
backedObsidianTexture.magFilter = THREE.NearestFilter
backedObsidianTexture.generateMipmaps = false;
// backedObsidianTexture.colorSpace = THREE.SRGBColorSpace

const backedBaseStoneTexture = textureLoader.load('/resources/textures/backedTextures/backedBaseStone.jpg')
backedBaseStoneTexture.flipY = false
backedBaseStoneTexture.minFilter = THREE.NearestFilter
backedBaseStoneTexture.magFilter = THREE.NearestFilter
backedBaseStoneTexture.generateMipmaps = false;
// backedBaseStoneTexture.colorSpace = THREE.SRGBColorSpace

const lavaStillTexture = textureLoader.load('/resources/textures/lavaTexture/lava_still.png');
lavaStillTexture.flipY = false;
lavaStillTexture.minFilter = THREE.NearestFilter;
lavaStillTexture.magFilter = THREE.NearestFilter;
lavaStillTexture.generateMipmaps = false;
lavaStillTexture.wrapS = THREE.RepeatWrapping;
lavaStillTexture.wrapT = THREE.RepeatWrapping;

const lavaFlowTexture = textureLoader.load('/resources/textures/lavaTexture/lava_flow.png');
lavaFlowTexture.flipY = false;
lavaFlowTexture.minFilter = THREE.NearestFilter;
lavaFlowTexture.magFilter = THREE.NearestFilter;
lavaFlowTexture.generateMipmaps = false;
lavaFlowTexture.wrapS = THREE.RepeatWrapping;
lavaFlowTexture.wrapT = THREE.RepeatWrapping;



//Materials 

const backedPlantsMaterial = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map:backedPlantsTexture, transparent: true});
backedPlantsMaterial.alphaTest = 0.01;

const backedObsidianMaterial = new THREE.MeshBasicMaterial({map: backedObsidianTexture});

const backedGroundArchMaterial = new THREE.MeshBasicMaterial({map: backedGroundArchTexture });

const backedBaseStoneMaterial = new THREE.MeshBasicMaterial({map: backedBaseStoneTexture});

const lavaStillMaterial = new THREE.MeshBasicMaterial({ map: lavaStillTexture });
const lavaFlowMaterial = new THREE.MeshBasicMaterial({ map: lavaFlowTexture });

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

//Scene 
const scene = new THREE.Scene();

//Camera 
const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height, 0.1, 1000);

//Renderer
const canvas = document.querySelector('.experience')
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);


function initProject(){
  
  
  //Controls 
  const orbitControls = new OrbitControls(camera, canvas);
  orbitControls.enableDamping = true;
  orbitControls.enabled = true;
  orbitControls.target = new THREE.Vector3(0, 7.4, 0)

  
  //Lights
  const ambientLight = new THREE.AmbientLight('#ffffff', 100);
  scene.add(ambientLight)
  
  //Objects
  
  const portalGeometry = new THREE.PlaneGeometry(3, 3, 200, 200);
  
  const portalMesh = new THREE.Mesh(portalGeometry, portalMaterial);
  
  portalMesh.position.set(0 ,7.4, 2.5);
  portalModel.add(portalMesh);
  
  
  //scene.add(new THREE.Mesh(portalGeometry, new THREE.MeshBasicMaterial({ map: portalTexture})))
  
  //Scene Configuration
  
  camera.position.set(-12, 16, -22)
  
  //Gui
  console.log(portalModel)

  //Animate
  const clock = new THREE.Clock();
  let lastTime = 0;

  const tick = ()=>{
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = lastTime - elapsedTime;
    lastTime = elapsedTime;
    
    //Animations 
    portalModel.rotation.y += deltaTime*0.25
    

    //Controls
    orbitControls.update();



    //Update shaders/materials
    portalMaterial.uniforms.uTime.value = elapsedTime;
    lavaStillTexture.offset.y += deltaTime*0.25
    
    //Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  }
  
  console.timeEnd('Threejs')
  tick();
}