import './style.css';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';


import portalVS from '/resources/shaders/portalShader/vertex.glsl'
import portalFS from '/resources/shaders/portalShader/fragment.glsl'

import portalParticlesVS from '/resources/shaders/portalParticlesShader/vertex.glsl'
import portalParticlesFS from '/resources/shaders/portalParticlesShader/fragment.glsl'

import gsap from 'gsap'

THREE.ColorManagement.enabled = false;

const debugObject = {}
let portalParticlesGeometry = null
let portalParticlesMaterial = null
let portalParticlesA = null;
let portalParticlesB = null;
let portalParticles = null;

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
    portalParticlesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
});

//Scene 
const scene = new THREE.Scene();

//Camera 
const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height, 0.1, 1000);  // camera.position.set(12, 16, 22)

//Renderer
const canvas = document.querySelector('.experience')
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
debugObject.clearColor = '#060c0f'
renderer.setClearColor(debugObject.clearColor)

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);


//-------------------------------------------Loaders-------------------------------------------

const loadingManager = new THREE.LoadingManager();

// ----- On load
loadingManager.onLoad = ()=>{
  initProject();

  window.setTimeout(()=>{
    gsap.to(overlayMaterial.uniforms.uAlpha, {duration: 2, value: 0})
    loadingWindow.classList.add('loaded');
    setTimeout(()=>{
      scene.remove(overlayMesh);
    }, 500)
  }, 1000)


  portalModel.traverse((child)=>{
    if(child.name == 'LavaStill' || child.name == 'LavaFlow'){
      child.add(lavaSound)
    }
    lavaSound.play();
  
  })
}

//----- Loading bar

const loadingWindow = document.querySelector('.loading');
const loadingProgress = document.querySelector('.loading-bar__progress');

loadingManager.onProgress = (asset, loaded, toLoad)=>{
  console.log(`${loaded} of ${toLoad} : ${asset}`);
  const progress = (loaded/toLoad)*100;
  console.log(`progress: ${progress}`)
  loadingProgress.style.clipPath = `polygon(${progress}% 0, ${progress}% 100%, 0 100%, 0 0)`

}

const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
  transparent: true,
  side: THREE.DoubleSide,
  uniforms:{
    uAlpha:{value: 1},
  },
  vertexShader: `
    void main(){
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uAlpha;
    void main (){
      gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
    }
  `
})

const overlayMesh = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlayMesh);

const textureLoader = new THREE.TextureLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager);
const dracoLoader = new DRACOLoader(loadingManager);

dracoLoader.setDecoderPath('/draco/');
gltfLoader.setDRACOLoader(dracoLoader);

//Models

let portalModel = null;
gltfLoader.load('./models/portalModel/binary/minecraftPortalModel.glb', (gltf)=>{
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
  scene.add(portalModel);
  
})

//Textures

const backedPlantsTexture = textureLoader.load('./textures/backedTextures/backedPlants.png');
backedPlantsTexture.flipY = false;
backedPlantsTexture.minFilter = THREE.NearestFilter
backedPlantsTexture.magFilter = THREE.NearestFilter
backedPlantsTexture.generateMipmaps = false;
backedPlantsTexture.colorSpace = THREE.SRGBColorSpace;

const backedGroundArchTexture = textureLoader.load('./textures/backedTextures/backedGoundArch.jpg')
backedGroundArchTexture.flipY = false;
backedGroundArchTexture.minFilter = THREE.NearestFilter
backedGroundArchTexture.magFilter = THREE.NearestFilter
backedGroundArchTexture.generateMipmaps = false;
backedGroundArchTexture.colorSpace = THREE.SRGBColorSpace;


const backedObsidianTexture = textureLoader.load('./textures/backedTextures/BackedPortalBlack.jpg')
backedObsidianTexture.flipY = false;
backedObsidianTexture.minFilter = THREE.NearestFilter
backedObsidianTexture.magFilter = THREE.NearestFilter
backedObsidianTexture.generateMipmaps = false;
backedObsidianTexture.colorSpace = THREE.SRGBColorSpace;

const backedBaseStoneTexture = textureLoader.load('./textures/backedTextures/backedBaseStone.jpg')
backedBaseStoneTexture.flipY = false
backedBaseStoneTexture.minFilter = THREE.NearestFilter
backedBaseStoneTexture.magFilter = THREE.NearestFilter
backedBaseStoneTexture.generateMipmaps = false;
backedBaseStoneTexture.colorSpace = THREE.SRGBColorSpace;

const lavaStillTexture = textureLoader.load('./textures/lavaTexture/lavaStill.png');
lavaStillTexture.flipY = false;
lavaStillTexture.minFilter = THREE.NearestFilter;
lavaStillTexture.magFilter = THREE.NearestFilter;
lavaStillTexture.generateMipmaps = false;
lavaStillTexture.wrapS = THREE.RepeatWrapping;
lavaStillTexture.wrapT = THREE.RepeatWrapping;
lavaStillTexture.repeat.x = 1
lavaStillTexture.repeat.y = 0.05
lavaStillTexture.colorSpace = THREE.SRGBColorSpace;

const lavaFlowTexture = textureLoader.load('./textures/lavaTexture/lavaFlow.png');
lavaFlowTexture.flipY = false;
lavaFlowTexture.minFilter = THREE.NearestFilter;
lavaFlowTexture.magFilter = THREE.NearestFilter;
lavaFlowTexture.generateMipmaps = false;
lavaFlowTexture.wrapS = THREE.RepeatWrapping;
lavaFlowTexture.wrapT = THREE.RepeatWrapping;
lavaFlowTexture.repeat.x = 0.5
lavaFlowTexture.repeat.y = 0.03125
lavaFlowTexture.colorSpace = THREE.SRGBColorSpace;

const genericParticlesAtlas = textureLoader.load('./textures/genericParticles/genericParticles.png');
genericParticlesAtlas.flipY = false;
genericParticlesAtlas.minFilter = THREE.NearestFilter;
genericParticlesAtlas.magFilter = THREE.NearestFilter;
genericParticlesAtlas.generateMipmaps = false;

const lavaParticle = textureLoader.load('./textures/lavaParticle/lavaParticle.png');

//Environment


textureLoader.load('./textures/envMap/MinecraftNightEnvironment.jpg', (envMap)=>{
  envMap.colorSpace = THREE.SRGBColorSpace;
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = envMap;
  scene.backgroundBlurriness = 0.055;
})

//Audio
const listener = new THREE.AudioListener();
camera.add(listener)

const audioLoader = new THREE.AudioLoader(loadingManager);


const netherPortalSound = new THREE.PositionalAudio(listener);

audioLoader.load('./sounds/portal.ogg', function(buffer){
  netherPortalSound.setBuffer(buffer)
  netherPortalSound.setRefDistance(2)
  netherPortalSound.setLoop(true);
  netherPortalSound.setVolume(0.25);
  netherPortalSound.setLoopStart(2000)
  // netherPortalSound.setLoopEnd(3000)
})

const lavaSound = new THREE.PositionalAudio(listener);

audioLoader.load('./sounds/lava.ogg', (buffer)=>{
  lavaSound.setBuffer(buffer)
  lavaSound.setRefDistance(5)
  lavaSound.setLoop(true);
  lavaSound.setVolume(0.25);
})

// setTimeout(()=>{
//   lavaSound.setVolume(0)
//   netherPortalSound.setVolume(0)
// }, 10000)


//Materials 

const backedPlantsMaterial = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map:backedPlantsTexture});
backedPlantsMaterial.alphaTest = 0.6;
backedPlantsMaterial.alphaToCoverage = true;

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
  
//Controls 
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
orbitControls.enabled = true;
orbitControls.target = new THREE.Vector3(0, 7.5, 0)
orbitControls.maxPolarAngle = Math.PI / 1.75;
orbitControls.minPolarAngle = Math.PI / 8;
orbitControls.maxDistance = 35;
orbitControls.enablePan = false;
camera.position.set(-15, 12, -20);

//Objects 
const portalGeometry = new THREE.PlaneGeometry(3, 3);
  
const portalMesh = new THREE.Mesh(portalGeometry, portalMaterial);

portalMesh.position.set(0, 7.5, 2.5);
scene.add(portalMesh)

portalMesh.add(netherPortalSound);
netherPortalSound.play();


//Particles 
debugObject.portalParcilesCount = 25;
createPortalParticles(debugObject.portalParcilesCount);
portalParticles.position.copy(portalMesh.position);


//Animation

const clock = new THREE.Clock();
let lastTime = 0;

const tick = ()=>{
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = lastTime - elapsedTime;
  lastTime = elapsedTime;    

  
  //Controls
  orbitControls.update();
  //Update shaders/materials
  if(portalMaterial){
    portalMaterial.uniforms.uTime.value = elapsedTime;
    portalParticlesMaterial.uniforms.uTime.value = elapsedTime;
  }

  
  
  //Render
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}
tick();


function initProject(){
  
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
  const intervalID = setInterval(animateLava,  150);

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
      uSize: { value: 150 },
    },
  })

  portalParticlesA = new THREE.Points(portalParticlesGeometry, portalParticlesMaterial);
  portalParticlesB = new THREE.Points(portalParticlesGeometry, portalParticlesMaterial);
  portalParticlesB.rotation.y = Math.PI;
  portalParticles = new THREE.Group();

  portalParticles.add(portalParticlesA);
  portalParticles.add(portalParticlesB);
  
  scene.add(portalParticles);

  scene.add(portalParticles);
}