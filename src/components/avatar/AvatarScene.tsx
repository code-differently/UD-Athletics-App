"use client";

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"


const AvatarScene = ({ onRotate, resetTrigger  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const controlsRef = useRef<OrbitControls | null>(null);
    const avatarRef = useRef<THREE.Group | null>(null);
    const [avatarRotation, setAvatarRotation] = useState(-Math.PI / 2);
    let rotationTimeout: NodeJS.Timeout | null = null;
    
    useEffect(() => {         
        if (avatarRef.current && controlsRef.current) {
            avatarRef.current.rotation.set(0, -Math.PI / 2, 0);
            setAvatarRotation(-Math.PI / 2);
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
            onRotate(false);
        }

        if (!containerRef.current) return

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xf0f0f0)

        const camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000)
        camera.position.set(0, 1.5, 3);

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
        controlsRef.current = controls;

        controls.addEventListener("start", () => {
            console.log("Rotation started!");
            onRotate(true); // Hide markers when rotation starts
        });
        controls.addEventListener("end", () => {
            console.log("Rotation ended!");
            setTimeout(() => onRotate(false), 1000); // Delay to prevent flickering
        });
        

        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()

        const loader = new FBXLoader()
        let avatar: THREE.Group | THREE.Mesh

        loader.load(
            "/models/UDavatar.fbx",
            (object) => {
                avatarRef.current = object
                object.scale.set(0.01, 0.01, 0.01)
                scene.add(object)

                object.rotation.y = -Math.PI / 2; 
                setAvatarRotation(object.rotation.y);
                scene.add(object)
                setIsLoading(false);

                // Center the model
                const box = new THREE.Box3().setFromObject(object)
                const center = box.getCenter(new THREE.Vector3())
                object.position.sub(center)
                object.position.y = -center.y 

                // Adjust camera distance
                const modelSize = box.getSize(new THREE.Vector3())
                const maxDimension = Math.max(modelSize.x, modelSize.y, modelSize.z)
                const cameraDistance = maxDimension / (2 * Math.tan((Math.PI * camera.fov) / 360))
                camera.position.set(0,0, cameraDistance * 1.5)
                controls.target.set(0, center.y, 0)
                controls.update()
                setIsLoading(false)

            },
            undefined,
            (error) => {
                console.error("Error loading avatar model:", error)
                setIsLoading(false)
            }
        );


        // Handle click detection
        const onMouseClick = (event: MouseEvent) => {
            if (!containerRef.current ) return
            const rect = containerRef.current.getBoundingClientRect()
            mouse.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1
            mouse.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1

            raycaster.setFromCamera(mouse, camera)
            const intersects = raycaster.intersectObjects(scene.children, true)

        }

    containerRef.current.addEventListener("click", onMouseClick)

            //Mobile rotation here
                let startTouch = { x: 0, y: 0}
                let isTouching = false
        
                const onTouchStart = (event: TouchEvent) => {
                    if (event.touches.length === 1) {
                        startTouch.x = event.touches[0].clientX
                        startTouch.y = event.touches[0].clientY
                        isTouching = true
                    }
                }
        
                const onTouchMove = (event: TouchEvent) => {
                    if (!isTouching || event.touches.length !== 1|| !avatar) return;
        
                    const touch = event.touches[0]
                    const deltaX = touch.clientX - startTouch.x
                    const deltaY = touch.clientY - startTouch.y
        
                    avatar.rotation.y += deltaX * 0.005 // sensitivity here
                    avatar.rotation.x -= deltaY * 0.005 // also sensitivity is here
                    setAvatarRotation(avatar.rotation.y);

                    onRotate(true);
        
                    //This restricts rotation 
                    if (avatar.rotation.x > Math.PI / 2) avatar.rotation.x = Math.PI / 2;
                    if (avatar.rotation.x < -Math.PI / 2) avatar.rotation.x = -Math.PI / 2;
        
                    startTouch.x = touch.clientX
                    startTouch.y = touch.clientY
        
                    event.preventDefault() // Prevent scrolling or other gestures
                }

                const startRotation = () => {
                    onRotate(true); // Notify parent
                    if (rotationTimeout) clearTimeout(rotationTimeout);
                };
        
                const stopRotation = () => {
                    if (rotationTimeout) clearTimeout(rotationTimeout);
                };

                renderer.domElement.addEventListener("mousedown", startRotation);
                renderer.domElement.addEventListener("mousemove", startRotation);
                renderer.domElement.addEventListener("mouseup", stopRotation);
                renderer.domElement.addEventListener("touchstart", startRotation);
                renderer.domElement.addEventListener("touchmove", startRotation);
                renderer.domElement.addEventListener("touchend", stopRotation);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate)
            controls.update()
            renderer.render(scene, camera)
        }
        animate()

        return () => {
            renderer.domElement.addEventListener("mousedown", startRotation);
            renderer.domElement.addEventListener("mousemove", startRotation);
            renderer.domElement.addEventListener("mouseup", stopRotation);
            renderer.domElement.addEventListener("touchstart", startRotation);
            renderer.domElement.addEventListener("touchmove", startRotation);
            renderer.domElement.addEventListener("touchend", stopRotation);
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement)
                containerRef.current.removeEventListener("click", onMouseClick)
            }
        }
    }, [resetTrigger])


    return (
        <div style={{ position: "relative", width: 300, height: 300 }}>
            <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
                {isLoading && <p>Loading Avatar...</p>}
            </div>
        </div>
    )
}
export default AvatarScene
