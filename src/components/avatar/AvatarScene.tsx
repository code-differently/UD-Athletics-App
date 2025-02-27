"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three"; 
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; 
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import ResetButton from "./ResetButton";
import HelpIcon from "../HelpIcon"; 


/**
 * Constants for configuration
 */
const LIGHT_GRAY_HEX = 0xf0f0f0;
const WHITE_HEX = 0xffffff;
const INITIAL_CAMERA_POSITION = { x: 0, y: 1.5, z: 3 };
const SCENE_SIZE = { width: 300, height: 300 };
const AMBIENT_LIGHT_INTENSITY = 0.5;
const DIRECTIONAL_LIGHT_INTENSITY = 0.8;
const ROTATION_Y_INITIAL = -Math.PI / 2;
const TOUCH_SENSITIVITY = 0.005;
const FOV = 75;
const NEAR_CLIP = 0.1;
const FAR_CLIP = 1000;
const HELP_BOX_STYLES = {
  background: "rgba(0, 83, 159, 0.8)",
  color: "white",
  padding: "10px 20px",
  borderRadius: "5px",
  zIndex: 1000,
  maxWidth: "250px",
};

/**
 * This component is where the 3D football avatar is displayed for users to rotate and interact with
 * It also includes a reset button (imported) to reset the view and a help icon for additional guidance 
 */

const AvatarScene = () => {
  // References (Think of these as "pointers" to different parts of the 3D scene)
  const containerRef = useRef<HTMLDivElement>(null); 
  const controlsRef = useRef<OrbitControls | null>(null); 
  const avatarRef = useRef<THREE.Group | null>(null); 

  
  // State Variables (Track important information about the avatar)
  const [isLoading, setIsLoading] = useState(true); 
  const [resetTrigger, setResetTrigger] = useState(0); 
  const [avatarRotation, setAvatarRotation] = useState<number>(0); 
  const [isHelpVisible, setIsHelpVisible] = useState(false); 

  useEffect(() => {
    if (!containerRef.current) return; // Stop if there's no container to place the 3D model in.
    
    // Setting up the 3D scene
    const scene = new THREE.Scene(); // Creates an empty 3D world.
    scene.background = new THREE.Color(LIGHT_GRAY_HEX); 

    // Creating the Camera
    const camera = new THREE.PerspectiveCamera(FOV, SCENE_SIZE.width / SCENE_SIZE.height, NEAR_CLIP, FAR_CLIP); 
    camera.position.set(INITIAL_CAMERA_POSITION.x, INITIAL_CAMERA_POSITION.y, INITIAL_CAMERA_POSITION.z); // Places the camera at an angle in front of the avatar.

    // Setting up the Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true }); // Creates a renderer for smooth 3D graphics.
    renderer.setSize(SCENE_SIZE.width, SCENE_SIZE.height); 
    containerRef.current.appendChild(renderer.domElement); // Adds the 3D scene to the webpage.

    // Adding Light Sources
    const light = new THREE.AmbientLight(WHITE_HEX, AMBIENT_LIGHT_INTENSITY); 
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(WHITE_HEX, DIRECTIONAL_LIGHT_INTENSITY); 
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Enabling Camera Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25; 
    controls.enableZoom = true; 
    controlsRef.current = controls; 

    // Preparing for Mouse Click Detection
    const raycaster = new THREE.Raycaster(); // Helps detect where users click.
    const mouse = new THREE.Vector2(); // Stores where the mouse is on the screen.
    let avatar: THREE.Group | THREE.Mesh;

   // Loading the 3D Avatar
    const loader = new FBXLoader();
    loader.load(
      "/models/UDavatar.fbx", 
      (object) => {
        avatarRef.current = object;
        object.scale.set(0.01, 0.01, 0.01); 
        scene.add(object);

        object.rotation.y = ROTATION_Y_INITIAL; // Rotates the avatar to face forward.
        setAvatarRotation(object.rotation.y);
        scene.add(object); 

        // Centering the Model
        const box = new THREE.Box3().setFromObject(object); // Finds the model’s size.
        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center); 
        object.position.y = -center.y; 

        // Adjusting Camera Distance Based on Avatar Size
        const modelSize = box.getSize(new THREE.Vector3());
        const maxDimension = Math.max(modelSize.x, modelSize.y, modelSize.z);
        const cameraDistance =
          maxDimension / (2 * Math.tan((Math.PI * camera.fov) / 360));
        camera.position.set(0, 0, cameraDistance * 1.5); 
        controls.target.set(0, center.y, 0);
        controls.update();
        setIsLoading(false); 
      },
      undefined,
      (error) => {
        console.error("Error loading avatar model:", error); 
        setIsLoading(false); // Stop showing the loading message even if there is an error.
      },
    );

    // Handling Mouse Clicks on the 3D Avatar
    const onMouseClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x =
        ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 -
        1;
      mouse.y =
        -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 +
        1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
    };

    containerRef.current.addEventListener("click", onMouseClick);

    // Handling Touch Input (For Mobile Devices)
    let startTouch = { x: 0, y: 0 };
    let isTouching = false;

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        startTouch.x = event.touches[0].clientX;
        startTouch.y = event.touches[0].clientY;
        isTouching = true;
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!isTouching || event.touches.length !== 1 || !avatar) return;

      const touch = event.touches[0];
      const deltaX = touch.clientX - startTouch.x;
      const deltaY = touch.clientY - startTouch.y;

      avatar.rotation.y += deltaX * TOUCH_SENSITIVITY; 
      avatar.rotation.x -= deltaY * TOUCH_SENSITIVITY; 
      setAvatarRotation(avatar.rotation.y);

      // Limit vertical rotation to avoid flipping the avatar.
      if (avatar.rotation.x > Math.PI / 2) avatar.rotation.x = Math.PI / 2;
      if (avatar.rotation.x < ROTATION_Y_INITIAL) avatar.rotation.x = ROTATION_Y_INITIAL;

      startTouch.x = touch.clientX;
      startTouch.y = touch.clientY;

      event.preventDefault(); // Prevent scrolling or other gestures
    };

    const onTouchEnd = () => {
      isTouching = false;
    };

    containerRef.current.addEventListener("touchstart", onTouchStart, {
      passive: false,
    });
    containerRef.current.addEventListener("touchmove", onTouchMove, {
      passive: false,
    });
    containerRef.current.addEventListener("touchend", onTouchEnd);

    // Continuous Animation Loop
    const animate = () => {
      requestAnimationFrame(animate); // Keep updating the scene.
      controls.update(); 
      renderer.render(scene, camera); 
    };
    animate();

    // When AvatarScene is removed from the page, we clean up the 3D scene.
    // This prevents memory leaks and ensures performance stays smooth.
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
        containerRef.current.removeEventListener("click", onMouseClick);
      }
    };
  }, [resetTrigger]);

  const resetAvatar = () => {
    if (avatarRef.current && controlsRef.current) {
      avatarRef.current.rotation.set(0, ROTATION_Y_INITIAL, 0);
      setAvatarRotation(ROTATION_Y_INITIAL);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
    setResetTrigger((prev) => prev + 1);
  };

  const toggleHelp = () => {
    setIsHelpVisible(!isHelpVisible);
  };

  const closeHelp = () => {
    setIsHelpVisible(false);
  };

  return (
    <div style={{ position: "relative", width: SCENE_SIZE.width, height: SCENE_SIZE.height }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
        {isLoading && <p>Loading Avatar...</p>} 
      </div>
      <ResetButton onReset={resetAvatar} />

      <HelpIcon onClick={toggleHelp} />

      {isHelpVisible && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            ...HELP_BOX_STYLES
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
          <p>Touch the dots to learn more about the Blue Hen Edge!</p>
        </div>
      )}
    </div>
  );
};

export default AvatarScene;
