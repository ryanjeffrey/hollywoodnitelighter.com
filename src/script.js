import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import Stats from 'stats.js'

/**
 * Base
 */
// // Stats
// const stats = new Stats()
// stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom)

// // Debug
// const gui = new dat.GUI({
//     width: 400
// })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// GLTF loader
const gltfLoader = new GLTFLoader()

// Texture loader
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load("/textures/particles/4.png");

/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 500;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 200;
  colors[i] = Math.random();
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 4,
  sizeAttenuation: true,
  color: "#FFFFFF",
  alphaMap: particleTexture,
  transparent: true,
  // alphaTest: 0.001,
  // depthTest: false,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: false,
});

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight('#b9d5ff', 200);
// scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight("#ffffff", 1)
// directionalLight.castShadow = true
// directionalLight.position.set(0, 1, 0)
// directionalLight.shadow.mapSize.set(1024, 1024)
// scene.add(directionalLight)

/**
 * Textures
 */
// const bakedTexture = textureLoader.load('baked.007.jpg')
// bakedTexture.flipY = false
// bakedTexture.encoding = THREE.sRGBEncoding

/**
 * Materials
 */
// Baked material
// const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

// Pole light material
// const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })

// // Portal light material
// const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

/**
 * Model
 */
gltfLoader.load(
    'hollywood-lights.glb',
    (gltf) =>
    {
        // gltf.scene.traverse((child) =>
        // {
        //     child.material = bakedMaterial
        // })
        scene.add(gltf.scene)

        // // Get each object
        // const bakedMesh = gltf.scene.children.find((child) => child.name === 'baked')
        // const portalLightMesh = gltf.scene.children.find((child) => child.name === 'portalLight')
        // const poleLightAMesh = gltf.scene.children.find((child) => child.name === 'beam.003')
        // const poleLightBMesh = gltf.scene.children.find((child) => child.name === 'poleLightB')

        // // Apply materials
        // bakedMesh.material = bakedMaterial
        // portalLightMesh.material = portalLightMaterial
        // poleLightAMesh.material = poleLightMaterial
        // poleLightBMesh.material = poleLightMaterial
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Update effect composer
    effectComposer.setSize(sizes.width, sizes.height)
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(22, sizes.width / sizes.height, 0.1, 400)
camera.position.x = 0
camera.position.y = 1
camera.position.z = - 800
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.screenSpacePanning = false;

controls.minDistance = 100;
controls.maxDistance = 175;

controls.autoRotate = true;
controls.autoRotateSpeed = 2.5;

controls.minPolarAngle = Math.PI * 0.5;
controls.maxPolarAngle = Math.PI * 0.5;

/**
 * Photo gallery
 */
// Display gallery on button click
const targetDiv = document.getElementById("target");
const btn = document.getElementById("toggle");

btn.onclick = function () {
  if (targetDiv.style.display !== "flex") {
    targetDiv.style.display = "flex";
  } else {
    targetDiv.style.display = "none";
  }
};

// Image gallery slides
const delay = 3000; //ms

const slides = document.querySelector(".image-gallery-slides");
const slidesCount = slides.childElementCount;
const maxLeft = (slidesCount - 1) * 100 * -1;

let current = 0;

function changeSlide(next = true) {
  if (next) {
    current += current > maxLeft ? -100 : current * -1;
  } else {
    current = current < 0 ? current + 100 : maxLeft;
  }

  slides.style.left = current + "%";
}

let autoChange = setInterval(changeSlide, delay);
const restart = function () {
  clearInterval(autoChange);
  autoChange = setInterval(changeSlide, delay);
};

// Controls
document.querySelector(".next-slide").addEventListener("click", function () {
  changeSlide();
  restart();
});

document.querySelector(".prev-slide").addEventListener("click", function () {
  changeSlide(false);
  restart();
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor("#0B1026")

/**
 * Post processing
 */
const effectComposer = new EffectComposer(renderer)

const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

const unrealBloomPass = new UnrealBloomPass()
unrealBloomPass.strength = 0.5
unrealBloomPass.radius = 1
unrealBloomPass.threshold = 0.4
effectComposer.addPass(unrealBloomPass)

const smaaPass = new SMAAPass()
effectComposer.addPass(smaaPass)

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    // stats.begin()

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)
    effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    // stats.end()
}

tick()