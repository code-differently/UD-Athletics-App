"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import ResetButton from "./ResetButton";
import HelpAffordance from "../HelpAffordance";

const AvatarScene = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const controlsRef = useRef<OrbitControls | null>(null);
    const avatarRef = useRef<THREE.Group | null>(null);
    const [resetTrigger, setResetTrigger] = useState(0);
    const [avatarRotation, setAvatarRotation] = useState<number>(0);
    const [showHelp, setShowHelp] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

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

        const loader = new FBXLoader();
        loader.load(
            "/models/UDavatar.fbx",
            (object) => {
                avatarRef.current = object;
                object.scale.set(0.01, 0.01, 0.01);
                scene.add(object);

                object.rotation.y = -Math.PI / 2;
                setAvatarRotation(object.rotation.y);

                const box = new THREE.Box3().setFromObject(object);
                const center = box.getCenter(new THREE.Vector3());
                object.position.sub(center);
                object.position.y = -center.y;

                const modelSize = box.getSize(new THREE.Vector3());
                const maxDimension = Math.max(modelSize.x, modelSize.y, modelSize.z);
                const cameraDistance = maxDimension / (2 * Math.tan((Math.PI * camera.fov) / 360));
                camera.position.set(0, 0, cameraDistance * 1.5);
                controls.target.set(0, center.y, 0);
                controls.update();
                setIsLoading(false);
            },
            undefined,
            (error) => {
                console.error("Error loading avatar model:", error);
                setIsLoading(false);
            }
        );

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
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

    if (!isClient) return null;

    return (
        <div style={{ position: "relative", width: 300, height: 300 }}>
            <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
                {isLoading && <p>Loading Avatar...</p>}
            </div>

            <ResetButton onReset={resetAvatar} />

            {/* Help text appears at bottom-left when toggled */}
            {showHelp && (
                <div className="absolute bottom-2 left-2 w-[250px] p-2 bg-[#00539f] text-white rounded-md shadow-lg">
                    <p className="text-sm">This is help text for the avatar scene.</p>
                    <button 
                        onClick={() => setShowHelp(false)}
                        className="mt-2 flex items-center justify-center bg-transparent border-none cursor-pointer text-white hover:text-gray-200"
                    >
                        Close
                    </button>
                </div>
            )}

            {/* Help Button at the top-left */}
            {!showHelp && (
                <button 
                    onClick={() => setShowHelp(true)}
                    className="absolute top-2 left-2 bg-[#00539f] text-white w-6 h-6 rounded-full cursor-pointer flex items-center justify-center shadow-md text-base"
                >
                    ?
                </button>
            )}
        </div>
    );
};

export default AvatarScene;
