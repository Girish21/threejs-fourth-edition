import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import GUI from 'lil-gui'

export class Sketch {
  private domElement: HTMLElement
  private windowSize: THREE.Vector2
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private clock: THREE.Clock
  private stats: Stats
  private renderer: THREE.WebGLRenderer
  private controls: OrbitControls
  private planeGeometry: THREE.PlaneGeometry | null
  private planeMaterial: THREE.MeshStandardMaterial | null
  private planeMesh: THREE.Mesh | null
  private cubeGeometry: THREE.BoxGeometry | null
  private cubeMaterial: THREE.MeshStandardMaterial | null
  private cubeMesh: THREE.Mesh | null
  private torusKnotGeometry: THREE.TorusKnotGeometry | null
  private torusKnotMaterial: THREE.MeshStandardMaterial | null
  private torusKnotMesh: THREE.Mesh | null

  private gui: GUI

  config = {
    animate: true,
  }

  constructor(el: HTMLElement) {
    this.domElement = el

    this.windowSize = new THREE.Vector2(
      this.domElement.offsetWidth,
      this.domElement.offsetHeight,
    )

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.windowSize.x / this.windowSize.y,
      0.1,
      100,
    )
    this.camera.position.y = 6
    this.camera.position.z = 12
    this.scene.add(this.camera)

    this.stats = Stats()
    this.domElement.append(this.stats.domElement)
    this.clock = new THREE.Clock()

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setClearColor(0xffffff)

    this.domElement.append(this.renderer.domElement)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true

    this.planeGeometry = null
    this.planeMaterial = null
    this.planeMesh = null
    this.cubeGeometry = null
    this.cubeMaterial = null
    this.cubeMesh = null
    this.torusKnotGeometry = null
    this.torusKnotMaterial = null
    this.torusKnotMesh = null

    this.gui = new GUI()

    this.addObject()
    this.addLight()
    this.addGUI()
    this.addEventListener()
    this.resize()
    this.render()
  }

  addObject() {
    this.planeGeometry = new THREE.PlaneGeometry(20, 20)
    this.planeMaterial = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
    })
    this.planeMesh = new THREE.Mesh(this.planeGeometry, this.planeMaterial)
    this.planeMesh.receiveShadow = true
    this.planeMesh.rotation.set(-Math.PI * 0.45, 0, 0)

    this.cubeGeometry = new THREE.BoxGeometry(3, 3, 3)
    this.cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
    this.cubeMesh = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial)
    this.cubeMesh.position.x = -2
    this.cubeMesh.position.y = 1.55
    this.cubeMesh.rotation.set(-Math.PI * 0.45, 0, 0)
    this.cubeMesh.castShadow = true

    this.torusKnotGeometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16)
    this.torusKnotMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff })
    this.torusKnotMesh = new THREE.Mesh(
      this.torusKnotGeometry,
      this.torusKnotMaterial,
    )
    this.torusKnotMesh.position.x = 2
    this.torusKnotMesh.position.y = 1.55
    this.torusKnotMesh.rotation.set(-Math.PI * 0.45, 0, 0)
    this.torusKnotMesh.castShadow = true

    this.scene.add(this.planeMesh)
    this.scene.add(this.cubeMesh)
    this.scene.add(this.torusKnotMesh)
  }

  addLight() {
    const ambientLight = new THREE.AmbientLight(0x666666, 0.5)
    ambientLight.position.set(0, 10, 0)
    ambientLight.lookAt(new THREE.Vector3(0, 0, 0))

    const directionalLight = new THREE.DirectionalLight(0xaaaaaa, 0.5)
    directionalLight.position.set(-5, 5, 0)
    directionalLight.castShadow = true
    directionalLight.lookAt(new THREE.Vector3(0, 0, 0))

    this.scene.add(ambientLight)
    this.scene.add(directionalLight)
  }

  addGUI() {
    this.gui.add(this.config, 'animate').name('Animate')
  }

  resize() {
    this.windowSize.set(
      this.domElement.offsetWidth,
      this.domElement.offsetHeight,
    )

    this.camera.aspect = this.windowSize.x / this.windowSize.y
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.windowSize.x, this.windowSize.y)
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
  }

  addEventListener() {
    window.addEventListener('resize', this.resize.bind(this))
  }

  render() {
    const elapsedTime = this.clock.getElapsedTime()

    this.cubeMesh!.position.y = Math.abs(Math.cos(elapsedTime * 2)) * 2 + 1.5
    this.torusKnotMesh!.rotation.x = elapsedTime * 0.5
    this.torusKnotMesh!.rotation.y = elapsedTime * 0.3

    this.controls.update()
    this.stats.update()

    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.render.bind(this))
  }
}
