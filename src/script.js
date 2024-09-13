import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import { Font, Sky } from 'three/examples/jsm/Addons.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/Addons.js'
import { TextGeometry } from 'three/examples/jsm/Addons.js'

/**
 * Base
 */
// Debug
const gui = new GUI({
    width: 300,
    title: "haunted tweaks",
    closeFolders: true
})
gui.close()
const debugObject = {}
debugObject.graves = {
    count : 30,
}

// Overlay
const overlay = document.querySelector(".overlay")
const counter = document.querySelector(".countCont")
const loadedDisplay = document.querySelector(".loaded")
const totalDisplay = document.querySelector(".total")

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/*
 * Textures
 */
const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = (url, loaded, total) => {
    counter.style.display = "flex";
}

loadingManager.onProgress = (url, loaded, total) => {
    loadedDisplay.innerHTML = loaded
    totalDisplay.innerHTML = total
}

loadingManager.onLoad = () => {
    overlay.style.display = "none";
}

const textureLoader = new THREE.TextureLoader(loadingManager)
const floorAlphaTexture = textureLoader.load("./floor/alpha.jpg")
const floorColorTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp')
const floorARMTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp')
const floorNormalTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp')
const floorDisplacementTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp')

// floor texture

floorColorTexture.repeat.set(8, 8)
floorARMTexture.repeat.set(8, 8)
floorNormalTexture.repeat.set(8, 8)
floorDisplacementTexture.repeat.set(8, 8)

floorColorTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapS = THREE.RepeatWrapping

floorColorTexture.wrapT = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping

floorColorTexture.colorSpace = THREE.SRGBColorSpace

// wall texture

const wallColorTexture = textureLoader.load('./walls/medieval_red_brick_1k/medieval_red_brick_diff_1k.webp')
const wallARMTexture = textureLoader.load('./walls/medieval_red_brick_1k/medieval_red_brick_arm_1k.webp')
const wallNormalTexture = textureLoader.load('./walls/medieval_red_brick_1k/medieval_red_brick_nor_gl_1k.webp')

const wallScale = 0.5

wallColorTexture.repeat.set(wallScale, wallScale)
wallARMTexture.repeat.set(wallScale, wallScale)
wallNormalTexture.repeat.set(wallScale, wallScale)

wallColorTexture.wrapS = THREE.RepeatWrapping
wallARMTexture.wrapS = THREE.RepeatWrapping
wallNormalTexture.wrapS = THREE.RepeatWrapping

wallColorTexture.wrapT = THREE.RepeatWrapping
wallARMTexture.wrapT = THREE.RepeatWrapping
wallNormalTexture.wrapT = THREE.RepeatWrapping

wallColorTexture.colorSpace = THREE.SRGBColorSpace

// roof texture

const roofColorTexture = textureLoader.load('./roof/clay_roof_tiles_03_1k/clay_roof_tiles_03_diff_1k.webp')
const roofARMTexture = textureLoader.load('./roof/clay_roof_tiles_03_1k/clay_roof_tiles_03_arm_1k.webp')
const roofNormalTexture = textureLoader.load('./roof/clay_roof_tiles_03_1k/clay_roof_tiles_03_nor_gl_1k.webp')

roofColorTexture.repeat.set(2, 1)
roofARMTexture.repeat.set(2, 1)
roofNormalTexture.repeat.set(2, 1)

roofColorTexture.wrapS = THREE.RepeatWrapping
roofARMTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping

roofColorTexture.colorSpace = THREE.SRGBColorSpace

// grave texture

const graveColorTexture = textureLoader.load('./graves/rock_face_03_1k/rock_face_03_diff_1k.webp')
const graveARMTexture = textureLoader.load('./graves/rock_face_03_1k/rock_face_03_arm_1k.webp')
const graveNormalTexture = textureLoader.load('./graves/rock_face_03_1k/rock_face_03_nor_gl_1k.webp')

const graveScale = 0.5

graveColorTexture.repeat.set(graveScale, graveScale)
graveARMTexture.repeat.set(graveScale, graveScale)
graveNormalTexture.repeat.set(graveScale, graveScale)

graveColorTexture.wrapS = THREE.RepeatWrapping
graveARMTexture.wrapS = THREE.RepeatWrapping
graveNormalTexture.wrapS = THREE.RepeatWrapping

graveColorTexture.wrapT = THREE.RepeatWrapping
graveARMTexture.wrapT = THREE.RepeatWrapping
graveNormalTexture.wrapT = THREE.RepeatWrapping

graveColorTexture.colorSpace = THREE.SRGBColorSpace

// bush texture

const bushColorTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp')
const bushARMTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp')
const bushNormalTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp')

const bushScale = 0.5

bushColorTexture.repeat.set(bushScale, bushScale)
bushARMTexture.repeat.set(bushScale, bushScale)
bushNormalTexture.repeat.set(bushScale, bushScale)

bushColorTexture.wrapS = THREE.RepeatWrapping
bushARMTexture.wrapS = THREE.RepeatWrapping
bushNormalTexture.wrapS = THREE.RepeatWrapping

bushColorTexture.wrapT = THREE.RepeatWrapping
bushARMTexture.wrapT = THREE.RepeatWrapping
bushNormalTexture.wrapT = THREE.RepeatWrapping

bushColorTexture.colorSpace = THREE.SRGBColorSpace

// door texture

const doorColorTexture = textureLoader.load('./door/color.webp')
const doorAoTexture = textureLoader.load('./door/ambientOcclusion.webp')
const doorNormalTexture = textureLoader.load('./door/normal.webp')
const doorMetalnessTexture = textureLoader.load('./door/metalness.webp')
const doorRoughnessTexture = textureLoader.load('./door/roughness.webp')
const doorAlphaTexture = textureLoader.load('./door/alpha.webp')
const doorHeightTexture = textureLoader.load('./door/height.webp')
doorColorTexture.colorSpace = THREE.SRGBColorSpace

/*
 * Fonts
 */
const graveMaterial = new THREE.MeshStandardMaterial({
    color: "grey",
    map: graveColorTexture,
    normalMap: graveNormalTexture,
    roughnessMap: graveARMTexture,
    aoMap: graveARMTexture,
    metalnessMap: graveARMTexture,
})

const fontLoader = new FontLoader(loadingManager)
fontLoader.load(
    "./fonts/helvetiker_regular.typeface.json", 
    (font) => {
        const textGeometry1 = new TextGeometry(
            "SPOOKY",
            {
                font: font,
                size: 0.5,
                depth: 0.1,
                curveSegments: 5,
                bevelSegments: 4,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0
            }
        )
        const text1 = new THREE.Mesh(textGeometry1, graveMaterial)
        const textGeometry2 = new TextGeometry(
            "HOUSE",
            {
                font: font,
                size: 0.5,
                depth: 0.1,
                curveSegments: 5,
                bevelSegments: 4,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0
            }
        )
        textGeometry1.center()
        textGeometry2.center()
        const text2 = new THREE.Mesh(textGeometry2, graveMaterial)

        text1.rotation.y = -Math.PI * 0.5
        text1.position.x = -(2 + 0.05)

        text2.rotation.y = Math.PI * 0.5
        text2.position.x = (2 + 0.05)
       
        text1.position.y = 1
        text2.position.y = 1

        text1.castShadow = true
        text1.receiveShadow = true
        text2.castShadow = true
        text2.receiveShadow = true
        scene.add(text2)
        scene.add(text1)
    }
)
/**
 * House
 */
// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        transparent: true,
        alphaMap: floorAlphaTexture,
        map: floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.3,
        displacementBias: -0.2,
    }),
)

floor.rotation.x = -Math.PI * 0.5
scene.add(floor)

//House Container
const house = new THREE.Group()
scene.add(house)

// walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        normalMap: wallNormalTexture,
        roughnessMap: wallARMTexture,
        aoMap: wallARMTexture,
        metalnessMap: wallARMTexture,
    })
)
walls.position.y = 1.25
house.add(walls)

// roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        normalMap: roofNormalTexture,
        roughnessMap: roofARMTexture,
        aoMap: roofARMTexture,
        metalnessMap: roofARMTexture,
    })
)
roof.position.y = 1.25 + 2.5 - 0.75
roof.rotation.y = Math.PI * 0.25
house.add(roof)

//door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        transparent: true,
        alphaMap: doorAlphaTexture,
        map: doorColorTexture,
        normalMap: doorNormalTexture,
        roughnessMap: doorRoughnessTexture,
        aoMap: doorAoTexture,
        metalnessMap: doorMetalnessTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.15,
        displacementBias: -0.04,
    })
)
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

// bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: "lightgreen",
    map: bushColorTexture,
    normalMap: bushNormalTexture,
    roughnessMap: bushARMTexture,
    aoMap: bushARMTexture,
    metalnessMap: bushARMTexture,
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(- 0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(- 1, 0.05, 2.6)

bush1.rotation.x = - 0.75
bush2.rotation.x = - 0.75
bush3.rotation.x = - 0.75
bush4.rotation.x = - 0.75

house.add(bush1, bush2, bush3, bush4)


// Graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)

function constructGraves(graveInfo){
    // Dispose and remove all existing graves
    while (graves.children.length > 0) {
        const grave = graves.children[0];
        grave.geometry.dispose();
        graves.remove(grave);
    }
    for(let i = 0; i < graveInfo.count; ++i){
        const angle = Math.random() * Math.PI * 2
        const radius = 3 + (Math.random() * 4)
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius
    
        const grave = new THREE.Mesh(graveGeometry, graveMaterial)
        grave.position.x = x
        grave.position.y = Math.random() * 0.4
        grave.position.z = z
    
        grave.rotation.x = (Math.random() - 0.5) * 0.4
        grave.rotation.y = (Math.random() - 0.5) * 0.4
        grave.rotation.z = (Math.random() - 0.5) * 0.4
    
        graves.add(grave)
    }
}
constructGraves(debugObject.graves)
graves.children.forEach((grave) => grave.castShadow = true)


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

//door light
const doorLight = new THREE.PointLight('#ff7d46', 5)
doorLight.position.set(0, 2.2, 2.5)
house.add(doorLight)

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)
scene.add(ghost1, ghost2, ghost3)

const ghost1Helper = new THREE.PointLightHelper(ghost1, 0.2)
// scene.add(ghost1Helper)

/*
 * GUI
 */

const moonTweaks = gui.addFolder("Moon-tweaks")
moonTweaks.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('Moon shining')
moonTweaks.add(directionalLight, 'intensity').min(0).max(5).step(0.1).name('Moon Light')

const graveTweaks = gui.addFolder("Grave-tweaks")
graveTweaks.add(debugObject.graves, 'count').min(0).max(100).step(1)
.name("Grave Count").onFinishChange(() => {
    constructGraves(debugObject.graves)
})
// gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('floorDisplacementBias')

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxDistance = 10
controls.minDistance = 5
controls.maxAzimuthAngle = Math.PI/2
controls.maxPolarAngle = Math.PI/2.1

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/*
 * Shadows
 */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// cast and recieve
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 20
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10

const directionalLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightShadowHelper)
// console.log(directionalLightShadowHelper)
floor.receiveShadow = true
walls.castShadow = true
walls.receiveShadow = true

roof.castShadow = true

ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

/*
 * Sky
 */

const sky = new Sky()
sky.scale.set(100, 100, 100)
scene.add(sky)

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

/*
 * Fog
 */

scene.fog = new THREE.FogExp2( "#03343f", 0.1)

/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // move ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.sin(ghost1Angle) * 4
    ghost1.position.z = Math.cos(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)

    const ghost2Angle = -elapsedTime * 0.38
    ghost2.position.x = Math.cos(ghost2Angle) * 4
    ghost2.position.z = Math.sin(ghost2Angle) * 4
    ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45)

    const ghost3Angle = elapsedTime * 0.23
    ghost3.position.x = Math.cos(ghost3Angle) * 6
    ghost3.position.z = Math.sin(ghost3Angle) * 6
    ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45)
    
    // flikker door light
    doorLight.intensity = Math.abs(Math.sin(elapsedTime)*Math.sin(elapsedTime*2.34)*Math.sin(elapsedTime*3.45))*5

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()