import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
import openSimplexNoise from 'https://cdn.skypack.dev/open-simplex-noise'; 

// Loading Organ Texture

let surfTexture = new THREE.TextureLoader().load("/image/others_0001_color_4k.jpg")

// Sizing Object

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Setting scene, camera, and renderer

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 10000)
const renderer = new THREE.WebGLRenderer();


// Set Render size and append to HTML

renderer.setSize(sizes.width, sizes.height)
document.body.appendChild(renderer.domElement)

// Listen for window resize to adjust scene

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


// OrbitControls
// MAY BE REMOVED IN FUTURE, TBD

const controls = new OrbitControls(camera, renderer.domElement)

//Set camera position

camera.position.z = 250;
camera.position.y = 80;

// Creating lights
// AmbientLight

const ambL = new THREE.AmbientLight('red', 0.03)

// Spotlight Red Room

const spotL = new THREE.SpotLight('red', 1.3, 500, 2, 10)
spotL.position.set(250, 250, -105)
spotL.lookAt(0,0,50)
spotL.castShadow = true;

// Spoltlight 2 Red Room

const spotL2 = new THREE.SpotLight('red', 0.7, 500, 2, 10)
spotL2.position.set(-370, 250, -105)
spotL2.lookAt(0,0,50)


// Spotlight Main White Center

const spotLMain = new THREE.SpotLight('white', 1, 500, 0.7)
spotLMain.position.z = -15
spotLMain.lookAt(0,20, -100)
spotLMain.position.y = 200
spotLMain.castShadow = true;

// PointLight for Detailing Shine on Organ
// Positioned 'within' organ

const pL1 = new THREE.PointLight('white', 1, 50, 10)
pL1.position.y = 50
pL1.position.z = 20

// Adding Lights to Scene

scene.add(spotL, spotL2, ambL, pL1, spotLMain)

// Enable Shadow Mapping

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Creating the Blob
// Frame

let organFr = new THREE.SphereGeometry(150, 501, 32, 16)

// Material

let organMat = new THREE.MeshPhongMaterial({map: surfTexture})

// Mesh

let organ = new THREE.Mesh(organFr, organMat)

// Positioning and Shadow Casting

organ.position.set(30,50,-15)
organ.castShadow = true;


// Text Loader

const loader = new THREE.GLTFLoader();


loader.load('horrornerdtextshad.glb', function(gltf) {
    // Bottom Upper Text

    scene.add( gltf.scene );
    let text1 = gltf.scene

    // Positioning and Scaling
    
    text1.position.x = -425
    text1.position.y = -100
    text1.scale.x = 0.8
    text1.scale.z = 1.5

    // Counter for Animation Trigger

    let textCounter = 0

    // Text 'Glitch' Animation

    function animateText(){
        textCounter += 50
        let textCounterBuffer = Math.ceil(Math.random() * 50)

        if(textCounter%textCounterBuffer == 0){
        text1.children[0].geometry.drawRange.start = 1
        text1.children[0].geometry.drawRange.count = 10000
        } else{
            text1.children[0].geometry.drawRange.start = 0
            text1.children[0].geometry.drawRange.count = 'Infinity'
            textCounter = 0
        }
        requestAnimationFrame(animateText)
    }
    animateText()

})
loader.load('horrornerdawaitannounceshad.glb', function(gltf) {

    // Bottom Lower Text

    scene.add( gltf.scene );
    let text2 = gltf.scene

    // Color Fix for Model

    text2.children[0].material.color = new THREE.Color('black')

    // Positioning and Scaling

    text2.position.x = -212
    text2.position.y = -100
    text2.position.z = 100
    text2.scale.x = 0.3
    text2.scale.z = 0.5

    // Counter for Animation Trigger

    let text2Counter = 0

    // Text 'Glitch' Animation

    function animateText2(){
        text2Counter += 50
        let text2CounterBuffer = Math.ceil(Math.random() * 50)

        if(text2Counter%text2CounterBuffer == 0){
        text2.children[0].geometry.drawRange.start = 1
        text2.children[0].geometry.drawRange.count = 10000
        } else{
            text2.children[0].geometry.drawRange.start = 0
            text2.children[0].geometry.drawRange.count = 'Infinity'
            text2Counter = 0
        }
        requestAnimationFrame(animateText2)
    }
    animateText2()
})
loader.load( 'horrornerdtextfin.glb', function ( gltf ) {

    // Main Text

    scene.add( gltf.scene );
    let text = gltf.scene

    // Positioning

    text.lookAt(0, -100 , 0)
    text.position.set(-360, 80, -150)

}, undefined, function ( error ) {

    // Catch Error

    console.error( error );

} );
    

// Creating Plane for Scene 'Room'
// REDRUM! REDRUM!

// Frame

let planeFr = new THREE.PlaneGeometry(1000,1000, 1000, 1000)

// Material

let planeMesh = new THREE.MeshPhongMaterial({color: 'white'})

// Mesh

let plane = new THREE.Mesh(planeFr, planeMesh)

// Shadow and Positioning

plane.receiveShadow = true;
plane.lookAt(0,1,0)
plane.position.set(0,-100,-100)

// 'Cloning' (w/o clone()) the Plane Material and Frames for other Meshes

let plane2 = new THREE.Mesh(planeFr, planeMesh)
let plane3 = new THREE.Mesh(planeFr, planeMesh)
let plane4 = new THREE.Mesh(planeFr, planeMesh)

// Positioning Plane2

plane2.position.set(0,0,-350)
plane2.receiveShadow = true;

// Positioning Plane3

plane3.lookAt(-100,0,0)
plane3.position.x = 350

// Positioning Plane4

plane4.lookAt(100,0,0)
plane4.position.x = -450

// Adding Planes to the Scene -> The Red Room is Born!
scene.add(plane, plane2, plane3, plane4)

//Normalization of Organ (Wgat an Odd Sentence)
let nPos = [];

// Need a three.js vector to work with nPos array
let v3 = new THREE.Vector3();

let pos = organFr.attributes.position;

// 1. Takes from Position array and normalizes the position at index i
// 2. Pushes a clone of the normalized vector into the new nPos array

for (let i = 0; i < pos.count; i++){
    v3.fromBufferAttribute(pos, i).normalize();
nPos.push(v3.clone());
}

// Adds the nPos array as an accessible attribute

organFr.userData.nPos = nPos

// The Organ has a name? 

organ.name = 'Theodore'

// Updating AnimationFrame Function w/ Callback

const update = function(){
    requestAnimationFrame(update)
}

// Counter introduced to adjust noise function intensity
// See Main Animation Function for Use

let counter = 0

// OpenSimplexNoise
// NOTE: Date is acting as a unique id as required by the library
// NOTE: Not really 4D, the amorphous organ can't hurt me...

let noise = openSimplexNoise.makeNoise4D(Date.now());

// Adding Theodore, the organ, to the scene

scene.add(organ)

// Create new raycaster

const ray = new THREE.Raycaster();

// Pointer necessary for raycasting

const pointer = new THREE.Vector2();

// Normalization of Mouse Coordinates

function onPointerMove(e) {
    pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
}

// LightTimer and LightFlickerBuffer added for SpotLightMain flicker effect

let lightTimer = 0
let lightFlickerBuffer = 50

// MAIN ANIMATION FUNCTION
// ----------------------------------------------------------------
// The Big One! THEEEEE Animation Function
// Without this function, there is NOTHING... DO NOT DESTROY!!!

const animation = function(){

    // Here's that pesky counter again in case you're looking for it!

    counter += 0.01

    // Similar to the text Buffers used, this controls the freqeuncy of the spotlight flicker
    lightTimer += Math.ceil(Math.random()*50)

    // More Raycasting boilerplate conecting pointer and camera to form cast
    ray.setFromCamera( pointer, camera );

    // Ratcasting is targeting the Organ
    const intersects = ray.intersectObject(scene.children.at(9));


    // Some Animation Control Logic

    if(intersects.length !== 0){

        // Makes Theodore Morph Faster, Stronger... We Can Rebuild Him!

        counter += 0.1

    }

    // Well then WHO was flickering the lights??

    if(lightTimer%lightFlickerBuffer == 0){
        spotLMain.intensity = 0.1
    } else{
        lightTimer = 0
        spotLMain.intensity = 0.8
    }

    // Organ Noise
    // 1. Targets nPos and for each new/normalized position a noise is created
    // 2. A vector is then copied from the original nPos
    // 3. The vector is scaled and another vector is added
    // 4. The added vector calls for two args (vector3D, scalar)
    // 5. The real position (pos) at index i of each vertex is then set for x, y, and z based on the vector

    organFr.userData.nPos.forEach((p, i) => {
        let ns = noise(p.x, p.y, p.z, counter)*165;
        v3.copy(p).multiplyScalar(50).addScaledVector(p, ns);
        pos.setXYZ(i, v3.x, v3.y, v3.z);
    })

    // Theodore needs an update before he can make noise, this is that update

    organFr.computeVertexNormals();
    pos.needsUpdate = true;
    
    // Let's spin the organ around the room ----------------------------- GROSS

    organ.rotation.x += 0.001
    organ.rotation.y += 0.002
    organ.rotation.z += 0.003


    // Other boilerplate to allow the animation to function

    requestAnimationFrame(animation); // We love a callback
    controls.update(); // Ref OrbitControls
    update(); 
    renderer.render(scene, camera); // DO NOT DELETE
}

// Call animation

animation();

// For Raycasting, this grabs the mouse location
window.addEventListener( 'pointermove', onPointerMove );
