"use client";

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"

const AvatarScene = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!containerRef.current) return

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xf0f0f0)

        const camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000)
        camera.position.z = 5

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(300, 300)
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

        const loader = new FBXLoader()
        let avatar: THREE.Group | THREE.Mesh

        loader.load(
            "/models/UDavatar.fbx",
            (object) => {
                avatar = object
                avatar.scale.set(0.01, 0.01, 0.01)
                scene.add(avatar)

                avatar.rotation.y = Math.PI; 
                scene.add(avatar)

                // Center the model
                const box = new THREE.Box3().setFromObject(avatar)
                const center = box.getCenter(new THREE.Vector3())
                avatar.position.sub(center)

                controls.target.copy(avatar.position)

                // Adjust camera distance
                const modelSize = box.getSize(new THREE.Vector3())
                const maxDimension = Math.max(modelSize.x, modelSize.y, modelSize.z)
                const cameraDistance = maxDimension / (2 * Math.tan((Math.PI * camera.fov) / 360))
                camera.position.z = cameraDistance * 1.5

                controls.update()
                setIsLoading(false)
            },
            undefined,
            (error) => {
                console.error("Error loading avatar model:", error)
                setIsLoading(false)
            }
        )

        // Handle click detection
        const onMouseClick = (event: MouseEvent) => {
            if (!containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            mouse.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1
            mouse.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1

            raycaster.setFromCamera(mouse, camera)
            const intersects = raycaster.intersectObjects(scene.children, true)

            if (intersects.length > 0 && intersects[0].object.userData.clickable) {
                alert("Helmet clicked! Displaying info/video...")
            }
        }

        containerRef.current.addEventListener("click", onMouseClick)

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate)
            controls.update()
            renderer.render(scene, camera)
        }
        animate()

        return () => {
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement)
                containerRef.current.removeEventListener("click", onMouseClick)
            }
        }
    }, [])

    return <div ref={containerRef} style={{ width: 300, height: 300 }}>{isLoading && <p>Loading Avatar...</p>}</div>
}

export default AvatarScene
