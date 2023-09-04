import './style.css';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';


import portalVS from '/resources/shaders/portalShader/vertex.glsl'
import portalFS from '/resources/shaders/portalShader/fragment.glsl'

import portalParticlesVS from '/resources/shaders/portalParticlesShader/vertex.glsl'
import portalParticlesFS from '/resources/shaders/portalParticlesShader/fragment.glsl'


import GUI from 'lil-gui';
import gsap from 'gsap'

THREE.ColorManagement.enabled = false;

const debugObject = {}
let portalParticlesGeometry = null
let portalParticlesMaterial = null
let portalParticles = null

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
    
    //Update shaders
    portalMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
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
      child.material = backedBaseStoneMaterial
    }else if(child.name === 'Obsidian'){
      child.material = backedObsidianMaterial
    }else if(child.name === 'Plants'){
      child.material = backedPlantsMaterial
    }else if(child.name === 'GroundArch'){
      child.material = backedGroundArchMaterial
    }else if (child.name === 'LavaStill'){
      child.material = lavaStillMaterial
    }else if (child.name === 'LavaFlow'){
      child.material = lavaFlowMaterial
    }
  })
  
  portalModel = gltf.scene
  // scene.add(portalModel);
  
})

//Textures

const backedPlantsTexture = textureLoader.load('/resources/textures/backedTextures/backedPlants.png');
backedPlantsTexture.flipY = false;
backedPlantsTexture.minFilter = THREE.NearestFilter
backedPlantsTexture.magFilter = THREE.NearestFilter
backedPlantsTexture.generateMipmaps = false;
backedPlantsTexture.colorSpace = THREE.SRGBColorSpace;

const backedGroundArchTexture = textureLoader.load('/resources/textures/backedTextures/backedGoundArch.jpg')
backedGroundArchTexture.flipY = false;
backedGroundArchTexture.minFilter = THREE.NearestFilter
backedGroundArchTexture.magFilter = THREE.NearestFilter
backedGroundArchTexture.generateMipmaps = false;
backedGroundArchTexture.colorSpace = THREE.SRGBColorSpace;


const backedObsidianTexture = textureLoader.load('/resources/textures/backedTextures/backedObsidianPortal.jpg')
backedObsidianTexture.flipY = false;
backedObsidianTexture.minFilter = THREE.NearestFilter
backedObsidianTexture.magFilter = THREE.NearestFilter
backedObsidianTexture.generateMipmaps = false;
backedObsidianTexture.colorSpace = THREE.SRGBColorSpace;

const backedBaseStoneTexture = textureLoader.load('/resources/textures/backedTextures/backedBaseStone.jpg')
backedBaseStoneTexture.flipY = false
backedBaseStoneTexture.minFilter = THREE.NearestFilter
backedBaseStoneTexture.magFilter = THREE.NearestFilter
backedBaseStoneTexture.generateMipmaps = false;
backedBaseStoneTexture.colorSpace = THREE.SRGBColorSpace;

const lavaStillTexture = textureLoader.load('/resources/textures/lavaTexture/lava_still.png');
lavaStillTexture.flipY = false;
lavaStillTexture.minFilter = THREE.NearestFilter;
lavaStillTexture.magFilter = THREE.NearestFilter;
lavaStillTexture.generateMipmaps = false;
lavaStillTexture.wrapS = THREE.RepeatWrapping;
lavaStillTexture.wrapT = THREE.RepeatWrapping;
lavaStillTexture.repeat.x = 1
lavaStillTexture.repeat.y = 0.05
lavaStillTexture.colorSpace = THREE.SRGBColorSpace;

const lavaFlowTexture = textureLoader.load('/resources/textures/lavaTexture/lava_flow.png');
lavaFlowTexture.flipY = false;
lavaFlowTexture.minFilter = THREE.NearestFilter;
lavaFlowTexture.magFilter = THREE.NearestFilter;
lavaFlowTexture.generateMipmaps = false;
lavaFlowTexture.wrapS = THREE.RepeatWrapping;
lavaFlowTexture.wrapT = THREE.RepeatWrapping;
lavaFlowTexture.repeat.x = 0.5
lavaFlowTexture.repeat.y = 0.03125
lavaFlowTexture.colorSpace = THREE.SRGBColorSpace;

// const genericParticles = [
//   textureLoader.load('/resources/textures/genericParticles/generic_0.png'),
//   textureLoader.load('/resources/textures/genericParticles/generic_1.png'),
//   textureLoader.load('/resources/textures/genericParticles/generic_2.png'),
//   textureLoader.load('/resources/textures/genericParticles/generic_3.png'),
//   textureLoader.load('/resources/textures/genericParticles/generic_4.png'),
//   textureLoader.load('/resources/textures/genericParticles/generic_5.png'),
//   textureLoader.load('/resources/textures/genericParticles/generic_6.png'),
//   textureLoader.load('/resources/textures/genericParticles/generic_7.png'),
// ];

const genericParticlesAtlas = textureLoader.load('/resources/textures/genericParticles/genericParticles.png');
genericParticlesAtlas.flipY = false;
genericParticlesAtlas.minFilter = THREE.NearestFilter;
genericParticlesAtlas.magFilter = THREE.NearestFilter;
genericParticlesAtlas.generateMipmaps = false;

const lavaParticle = textureLoader.load('/resources/textures/lavaParticle/lavaParticle.png');


//Materials 

const backedPlantsMaterial = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map:backedPlantsTexture, transparent: true});
backedPlantsMaterial.alphaTest = 0.25;

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
debugObject.clearColor = '#060c0f'
renderer.setClearColor(debugObject.clearColor)
const gui = new GUI
gui.addColor(debugObject, 'clearColor').onChange(()=>{
  renderer.setClearColor(debugObject.clearColor);
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);




function initProject(){
  
  
  //Controls 
  const orbitControls = new OrbitControls(camera, canvas);
  orbitControls.enableDamping = true;
  orbitControls.enabled = true;
  orbitControls.target = new THREE.Vector3(0, 0, 0)

  
  
  
  //Objects
  
  const portalGeometry = new THREE.PlaneGeometry(3, 3, 200, 200);
  
  const portalMesh = new THREE.Mesh(portalGeometry, portalMaterial);

  portalMesh.position.set(0 , 0, 0);
  scene.add(portalMesh)
  // portalModel.add(portalMesh);
  
  
  //scene.add(new THREE.Mesh(portalGeometry, new THREE.MeshBasicMaterial({ map: portalTexture})))
  
  //Scene Configuration
  
  // camera.position.set(12, 16, 22)
  camera.position.set(5, 5, 5)
  
  //Particles 
  debugObject.portalParcilesCount = 100
  createPortalParticles(debugObject.portalParcilesCount);
  portalParticles.position.copy(portalMesh.position)
  gui.add(debugObject, 'portalParcilesCount', 0, 10000).onFinishChange((count)=>{
    createPortalParticles(count);
  })
  gui.add(portalParticlesMaterial.uniforms.uTime, 'value', 0, 10).name('Time');
  //Gui
  
  //Animate

  let lavaUp = true
  function animateLava() {  
      if(lavaUp){
        lavaStillTexture.offset.y+= 0.05
        lavaFlowTexture.offset.y+= 0.03125
        if(lavaStillTexture.offset.y > 0.94){
          lavaUp = false;
        }
      }else{
        lavaStillTexture.offset.y-= 0.05        
        lavaFlowTexture.offset.y+= 0.03125      
        if(lavaStillTexture.offset.y <= 0.05){
          lavaUp = true;
        }
      }
  }
  const intervalID = setInterval(animateLava,  60 * 1000 / 550);



  const clock = new THREE.Clock();
  let lastTime = 0;


  const tick = ()=>{
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = lastTime - elapsedTime;
    lastTime = elapsedTime;
    
    //Animations 

    // portalModel.rotation.y += deltaTime*0.25
    

    //Controls
    orbitControls.update();



    //Update shaders/materials
    portalMaterial.uniforms.uTime.value = elapsedTime;
    portalParticlesMaterial.uniforms.uTime.value = elapsedTime;

    
    
    //Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  }
  tick();
}



function createPortalParticles (count){
  //Destroy previous portalParticles
  if(portalParticles){
    portalParticlesGeometry.dispose();
    portalParticlesMaterial.dispose();
    scene.remove(portalParticles)
  }

  //Create portal geometry
  portalParticlesGeometry = new THREE.BufferGeometry();

  const positions = new Float32Array(count*3)
  const colors = new Float32Array(count*3);
  const randomParticle = new Float32Array(count);
  
  for (let i = 0; i < count*3; i++){
    //positions
    const x = i*3 + 0
    const y = i*3 + 1
    const z = i*3 + 2
    positions[x] = (Math.random()-0.5)*2;
    positions[y] = (Math.random()-0.5)*3;
    positions[z] = (Math.random())*2;

    //colors;
    const h = 276;
    const l = (Math.random()*0.4)+0.05;
    const baseColor = new THREE.Color().setHSL(h*Math.PI/180, 1.0, l);
    colors[x] = baseColor.r
    colors[y] = baseColor.g
    colors[z] = baseColor.b
    
    //particles
    randomParticle[i] = Math.floor(Math.random()*8);

  }
  portalParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  portalParticlesGeometry.setAttribute('aRandomParticle', new THREE.BufferAttribute(randomParticle, 1));
  portalParticlesGeometry.setAttribute('aColors', new THREE.BufferAttribute(colors, 3));

  //Create portal material
  portalParticlesMaterial = new THREE.ShaderMaterial({
    vertexShader: portalParticlesVS,
    fragmentShader: portalParticlesFS,
    depthWrite: false,
    transparent: true,
    uniforms:{
      uPixelRatio : { value: Math.min(window.devicePixelRatio, 2) },
      uParticle: { value: genericParticlesAtlas },
      uTime: { value: 0 },
      uSize: { value: 100 },
    },
  })

  portalParticles = new THREE.Points(portalParticlesGeometry, portalParticlesMaterial)
  scene.add(portalParticles);
}