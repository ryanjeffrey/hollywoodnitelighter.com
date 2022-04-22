import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */
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
// Texture loader
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load("/textures/particles/4.png");

/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 1000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 100;
  colors[i] = Math.random();
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 3,
  sizeAttenuation: true,
  color: '#ff88cc',
  alphaMap: particleTexture,
  transparent: true,
  // alphaTest: 0.001,
  // depthTest: false,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#b9d5ff', 2);
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight("#ffffff", 2)
directionalLight.castShadow = true
directionalLight.position.set(0, 1, 0)
directionalLight.shadow.mapSize.set(1024, 1024)
scene.add(directionalLight)

/**
 * Textures
 */
const bakedTexture = textureLoader.load('baked.006.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

// Pole light material
// const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })

// // Portal light material
// const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

/**
 * Model
 */
gltfLoader.load(
    'hollywood-sim.glb',
    (gltf) =>
    {
        gltf.scene.traverse((child) =>
        {
            child.material = bakedMaterial
        })
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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(20, sizes.width / sizes.height, 0.1, 400)
camera.position.x = - 1450
camera.position.y = 400
camera.position.z = - 800
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.screenSpacePanning = false;

controls.minDistance = 100;
controls.maxDistance = 185;

controls.autoRotate = true;
controls.autoRotateSpeed = 1;

controls.minPolarAngle = Math.PI * 0.4;
controls.maxPolarAngle = Math.PI * 0.5;

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
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()