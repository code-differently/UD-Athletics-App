"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"

const AvatarCustomizer = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredPart, setHoveredPart] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState("#ffffff")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0) // Light gray background

    const camera = new THREE.PerspectiveCamera(
      75,
      300 / 300,
      0.1,
      1000,
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(300, 300)//containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)

    const light = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(light)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(1, 1, 1).normalize()
    scene.add(directionalLight)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = true

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    // Function to create a fallback object
    const createFallbackObject = () => {
      const geometry = new THREE.BoxGeometry(1, 2, 1)
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
      const cube = new THREE.Mesh(geometry, material)
      cube.name = "FallbackAvatar"
      scene.add(cube)
      return cube
    }

    let avatar: THREE.Group | THREE.Mesh
    const loader = new FBXLoader()
    loader.load(
      "/models/UDavatar.fbx",
      (object) => {
        avatar = object
        avatar.scale.set(0.01, 0.01, 0.01) // Adjust scale as needed for FBX models
        scene.add(avatar)

        const box = new THREE.Box3().setFromObject(avatar)
        const center = box.getCenter(new THREE.Vector3())
        avatar.position.sub(center)

        controls.target.set(avatar.position.x, avatar.position.y, avatar.position.z)

        const modelSize = box.getSize(new THREE.Vector3())
        const maxDimension = Math.max(modelSize.x, modelSize.y, modelSize.z)
        const cameraDistance = maxDimension / (2 * Math.tan((Math.PI * camera.fov) / 360))

        camera.position.z = cameraDistance * 1.5
        controls.update()

        avatar.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.userData.originalColor = child.material.color.clone()
          }
        })

        setIsLoading(false)
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
      },
      (error) => {
        console.error("An error happened while loading the model:", error)
        setError("Failed to load the avatar model. Using fallback object.")
        avatar = createFallbackObject()
        setIsLoading(false)
      },
    )

    camera.position.z = 5

    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    window.addEventListener("resize", handleResize)

    containerRef.current.addEventListener("mousemove", onMouseMove)
    containerRef.current.addEventListener("click", onMouseClick)

    function onMouseMove(event: MouseEvent) {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(scene.children, true)

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object
        if (intersectedObject instanceof THREE.Mesh) {
          setHoveredPart(intersectedObject.name)
          intersectedObject.material.emissive.setHex(0x555555)
        }
      } else {
        setHoveredPart(null)
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material.emissive.setHex(0x000000)
          }
        })
      }
    }

    function onMouseClick(event: MouseEvent) {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(scene.children, true)

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object
        if (intersectedObject instanceof THREE.Mesh) {
          intersectedObject.material.color.set(selectedColor)
        }
      }
    }

    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
        containerRef.current.removeEventListener("mousemove", onMouseMove)
        containerRef.current.removeEventListener("click", onMouseClick)
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [selectedColor])

  return (
    <div className="flex h-screen">
      <div ref={containerRef} className="w-3/4 h-full relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75">
            <p className="text-xl font-bold">Loading...</p>
          </div>
        )}
      </div>
      <div className="w-1/4 h-full overflow-y-auto bg-gray-100 p-4">
        <h2 className="text-2xl font-bold mb-4">Avatar Customizer</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <p className="mb-2">Hovered Part: {hoveredPart || "None"}</p>
        <div className="mb-4">
          <label htmlFor="colorPicker" className="block mb-2">
            Select Color:
          </label>
          <input
            type="color"
            id="colorPicker"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-full"
          />
        </div>
        <button
          onClick={() => console.log("Save avatar")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save Avatar
        </button>
      </div>
    </div>
  )
}

export default AvatarCustomizer

