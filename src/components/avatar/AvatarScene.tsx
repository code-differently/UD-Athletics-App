"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import ResetButton from "./ResetButton";
import HelpIcon from "../HelpIcon"; // Import the HelpIcon component

const AvatarScene = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const controlsRef = useRef<OrbitControls | null>(null);
    const avatarRef = useRef<THREE.Group | null>(null);
    const [resetTrigger, setResetTrigger] = useState(0);
    const [avatarRotation, setAvatarRotation] = useState<number>(0);   
    const [isHelpVisible, setIsHelpVisible] = useState(false); // For help text visibility

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);

        const camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000);
        camera.position.set(0, 1.5, 3);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(300, 300);
        containerRef.current.appendChild(renderer.domElement);

        const light = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(light);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
        controlsRef.current = controls;

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let avatar: THREE.Group | THREE.Mesh

        const loader = new FBXLoader();
        loader.load(
            "/models/UDavatar.fbx",
            (object) => {
                avatarRef.current = object;
                object.scale.set(0.01, 0.01, 0.01);
                scene.add(object);

                object.rotation.y = -Math.PI / 2; 
                setAvatarRotation(object.rotation.y);
                scene.add(object)

                // Center the model
                const box = new THREE.Box3().setFromObject(object);
                const center = box.getCenter(new THREE.Vector3());
                object.position.sub(center);
                object.position.y = -center.y;

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
                console.error("Error loading avatar model:", error);
                setIsLoading(false);
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
        
                    //This restricts rotation 
                    if (avatar.rotation.x > Math.PI / 2) avatar.rotation.x = Math.PI / 2;
                    if (avatar.rotation.x < -Math.PI / 2) avatar.rotation.x = -Math.PI / 2;
        
                    startTouch.x = touch.clientX
                    startTouch.y = touch.clientY
        
                    event.preventDefault() // Prevent scrolling or other gestures
                }
        
                const onTouchEnd = () => {
                    isTouching = false
                }
        
                containerRef.current.addEventListener("touchstart", onTouchStart, { passive: false })
                containerRef.current.addEventListener("touchmove", onTouchMove, { passive: false })
                containerRef.current.addEventListener("touchend", onTouchEnd) 

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
                containerRef.current.removeEventListener("click", onMouseClick);
            }
        };
    }, [resetTrigger]);

    const resetAvatar = () => {
        if (avatarRef.current && controlsRef.current) {
            avatarRef.current.rotation.set(0, -Math.PI / 2, 0);
            setAvatarRotation(-Math.PI / 2);
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
        }
        setResetTrigger((prev) => prev + 1);
    };

    // Help toggle function
    const toggleHelp = () => {
        setIsHelpVisible(!isHelpVisible);
    };

    // Close the help text
    const closeHelp = () => {
        setIsHelpVisible(false);
    };

    return (
        <div style={{ position: "relative", width: 300, height: 300 }}>
            <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
                {isLoading && <p>Loading Avatar...</p>}
            </div>
            <ResetButton onReset={resetAvatar} />

            {/* Help Icon at the top-left */}
            <HelpIcon onClick={toggleHelp} />

            {/* Help Text */}
            {isHelpVisible && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "10px",
                        background: "rgba(0, 83, 159, 0.8)", // Same background as the Help Icon
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        zIndex: 1000,
                        maxWidth: "250px",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            color: "white",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "bold",
                        }}
                        onClick={closeHelp}
                        data-cy="help-close-btn" 
                    >
                        X
                    </div>
                    <p>
                        This is help text for the avatar scene.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AvatarScene;
