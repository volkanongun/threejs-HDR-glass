import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'

const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

renderer.shadowMap.enabled = true

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  45, 
  window.innerWidth/window.innerHeight,
  1,
  1000
)
camera.position.set(-10,10,10)

const orbit = new OrbitControls(camera, renderer.domElement)

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 2

const rgbeLoader = new RGBELoader()
rgbeLoader.load('./assets/MR_INT-003_Kitchen_Pierre.hdr', function(texture){
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.environment = texture
  scene.background = texture

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(2, 50, 50),
    new THREE.MeshPhysicalMaterial({
      roughness: 0,
      metalness: 0,
      color: 0xFFEA00,
      transmission: 1,
      ior: 2.33
    })
  )
  scene.add(sphere)

}, (progress)=>{
  console.log(Math.round(progress.loaded / progress.total * 100), " onHDR Progess")
})

function animate(time){
  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', function(){
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const mousePosition = new THREE.Vector2()
window.addEventListener('mousemove', function(e){
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1
  mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1
})