import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
import openSimplexNoise from 'https://cdn.skypack.dev/open-simplex-noise';



let surfTexture = new THREE.TextureLoader().load("/image/others_0001_color_4k.jpg")

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    
    
function unfade(element) {
    var op = 0.1;  // initial opacity
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.css('opacity', op);
        op += op * 0.1;
    }, 100);
}
unfade($('.landingHead'))
unfade($('.landingFoot'))
    
    
    //Setting scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 10000)
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(sizes.width, sizes.height)
    document.body.appendChild(renderer.domElement)
    
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
    
    const controls = new OrbitControls(camera, renderer.domElement)
    
    //Set camera position
    camera.position.z = 250;
    camera.position.y = 80;

    //Creating lights
    const ambL = new THREE.AmbientLight('red', 0.03)
    const spotL = new THREE.SpotLight('red', 1.3, 500, 2, 10)
    const spotL2 = new THREE.SpotLight('red', 0.7, 500, 2, 10)
    const spotLMain = new THREE.SpotLight('white', 1.4, 400, 0.5)
    const pL1 = new THREE.PointLight('white', 1, 50, 10)

    spotL.position.set(250, 250, -105)
    spotL2.position.set(-370, 250, -105)
    spotLMain.position.z = -15
    spotLMain.lookAt(0,20, -100)
    spotLMain.position.y = 200
    spotLMain.castShadow = true;
    spotL.lookAt(0,0,50)
    spotL2.lookAt(0,0,50)
    pL1.position.y = 50
    pL1.position.z = 20
    scene.add(spotL, spotL2, ambL, pL1, spotLMain)
    //Creating the Sphere
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    spotL.castShadow = true;
   
    let gridFr = new THREE.SphereGeometry(100, 10, 32, 16)
    let gridMat = new THREE.MeshPhongMaterial({map: surfTexture})
    let grid = new THREE.Mesh(gridFr, gridMat)

    grid.position.set(0,50,-15)
    grid.castShadow = true;

    //Text
    const loader = new THREE.GLTFLoader();
    loader.load('horrornerdtextshad.glb', function(gltf) {
        scene.add( gltf.scene );
        let text1 = gltf.scene
        text1.position.x = -425
        text1.position.y = -100
        text1.scale.x = 0.8
        text1.scale.z = 1.5
    })
    loader.load('horrornerdawaitannounceshad.glb', function(gltf) {
        scene.add( gltf.scene );
        let text2 = gltf.scene
        text2.position.x = -212
        text2.position.y = -100
        text2.position.z = 100
        text2.scale.x = 0.3
        text2.scale.z = 0.5
    })
    loader.load( 'horrornerdtextfin.glb', function ( gltf ) {
    
        
        scene.add( gltf.scene );
        let text = gltf.scene
        text.castShadow = true;
        text.lookAt(0, -100 , 0)
        text.position.set(-360, 80, -150)
    
    
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );
        

    //Creating Plane for Scene

    let planeFr = new THREE.PlaneGeometry(1000,1000, 1000, 1000)
    let planeMesh = new THREE.MeshPhongMaterial({color: 'white'})
    let plane = new THREE.Mesh(planeFr, planeMesh)
    plane.receiveShadow = true;
    plane.lookAt(0,1,0)
    plane.position.set(0,-100,-100)
    let plane2 = new THREE.Mesh(planeFr, planeMesh)
    let plane3 = new THREE.Mesh(planeFr, planeMesh)
    let plane4 = new THREE.Mesh(planeFr, planeMesh)
    plane2.position.set(0,0,-350)
    plane2.receiveShadow = true;
    plane3.lookAt(-100,0,0)
    plane3.position.x = 350
    plane4.lookAt(100,0,0)
    plane4.position.x = -450
    scene.add(plane, plane2, plane3, plane4)
    //Normalization of Organ
    let nPos = [];
    let v3 = new THREE.Vector3();
    let pos = gridFr.attributes.position;
    for (let i = 0; i < pos.count; i++){
        v3.fromBufferAttribute(pos, i).normalize();
    nPos.push(v3.clone());
    }
    gridFr.userData.nPos = nPos
    
    //Adding to the Scene

    

    //updating animationFrame Function w/ callback
    
    const update = function(){
        requestAnimationFrame(update)
    
    }
    
    //establish renderer.render
    let counter = 0
    let noise = openSimplexNoise.makeNoise4D(Date.now());
    scene.add(grid)
    const animation = function(){
        counter += 0.01

        requestAnimationFrame(animation)
        gridFr.userData.nPos.forEach((p, idx) => {
            let ns = noise(p.x, p.y, p.z, counter)*65;
          v3.copy(p).multiplyScalar(50).addScaledVector(p, ns);
          pos.setXYZ(idx, v3.x, v3.y, v3.z);
        })
        gridFr.computeVertexNormals();
        pos.needsUpdate = true;
        
        grid.rotation.x += 0.001
        grid.rotation.y += 0.002
        grid.rotation.z += 0.003

        
        controls.update();
        update();
        renderer.render(scene, camera)
    }
    
    animation();
    


// Window Width and Height