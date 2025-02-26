"use client";

// Importing necessary React features to handle component behavior.
import { useEffect, useRef, useState } from "react";
//This is Three.js being imported to handle 3D graphics 
import * as THREE from "three"; 

// Importing additional Three.js tools:
// - OrbitControls: Lets users rotate, zoom, and move around the 3D scene.
// - FBXLoader: Loads 3D models that use the FBX file format.
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; 
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

// Importing other React components for user interaction.
import ResetButton from "./ResetButton";
import HelpIcon from "../HelpIcon"; // A help button that provides guidance.

// AvatarScene Component
// This component is where the 3D football avatar is displayed for users to rotate and interact with
// It also includes a reset button (imported) to reset the view and a help icon for additional guidance 
const AvatarScene = () => {
  // **References (Think of these as "pointers" to different parts of the 3D scene)**
  const containerRef = useRef<HTMLDivElement>(null); // The space where the 3D model appears.
  const controlsRef = useRef<OrbitControls | null>(null); // Camera controls for rotation and zoom.
  const avatarRef = useRef<THREE.Group | null>(null); // The actual 3D avatar model. 

  
  // **State Variables (Track important information about the avatar)**
  const [isLoading, setIsLoading] = useState(true); // Tracks if the avatar is still loading 
  const [resetTrigger, setResetTrigger] = useState(0); // Used to trigger the avatar reset.
  const [avatarRotation, setAvatarRotation] = useState<number>(0); // Stores the avatar’s rotation angle.
  const [isHelpVisible, setIsHelpVisible] = useState(false); // Controls whether help text is shown.

  // **Runs when the component is first added to the page**
  useEffect(() => {
    if (!containerRef.current) return; // Stop if there's no container to place the 3D model in.
    
    // **Setting up the 3D scene**
    const scene = new THREE.Scene(); // Creates an empty 3D world.
    scene.background = new THREE.Color(0xf0f0f0); //background color of the scene (currently light gray)

    // **Creating the Camera**
    const camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000); // Defines the camera view.
    camera.position.set(0, 1.5, 3); // Places the camera at an angle in front of the avatar.

    // **Setting up the Renderer**
    const renderer = new THREE.WebGLRenderer({ antialias: true }); // Creates a renderer for smooth 3D graphics.
    renderer.setSize(300, 300); // Makes the 3D display area 300x300 pixels.
    containerRef.current.appendChild(renderer.domElement); // Adds the 3D scene to the webpage.

    // **Adding Light Sources**
    const light = new THREE.AmbientLight(0xffffff, 0.5); // A soft, even light.
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // A brighter light from one direction. To highlight the model
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // **Enabling Camera Controls**
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;// Smooth movement.
    controls.dampingFactor = 0.25; // How much damping (slowing down) occurs.
    controls.enableZoom = true; // Allow zooming in and out.
    controlsRef.current = controls; // Store the controls for future use.

    // **Preparing for Mouse Click Detection**
    const raycaster = new THREE.Raycaster(); // Helps detect where users click.
    const mouse = new THREE.Vector2(); // Stores where the mouse is on the screen.
    let avatar: THREE.Group | THREE.Mesh;

   // **Loading the 3D Avatar**
    const loader = new FBXLoader();
    loader.load(
      "/models/UDavatar.fbx", // The 3D model file location.
      (object) => {
        avatarRef.current = object;
        object.scale.set(0.01, 0.01, 0.01); // Shrinks the model to a proper size.
        scene.add(object);

        object.rotation.y = -Math.PI / 2; // Rotates the avatar to face forward.
        setAvatarRotation(object.rotation.y);
        scene.add(object); // Adds the avatar to the scene.

        // **Centering the Model**
        const box = new THREE.Box3().setFromObject(object); // Finds the model’s size.
        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center); // Moves it to the center.
        object.position.y = -center.y; // Adjusts height so it sits correctly.

        // **Adjusting Camera Distance Based on Avatar Size**
        const modelSize = box.getSize(new THREE.Vector3());
        const maxDimension = Math.max(modelSize.x, modelSize.y, modelSize.z);
        const cameraDistance =
          maxDimension / (2 * Math.tan((Math.PI * camera.fov) / 360));
        camera.position.set(0, 0, cameraDistance * 1.5); // Positions the camera at a good distance.
        controls.target.set(0, center.y, 0);
        controls.update();
        setIsLoading(false); // Mark loading as complete.
      },
      undefined,
      (error) => {
        console.error("Error loading avatar model:", error); // Show an error if loading fails.
        setIsLoading(false); // Stop showing the loading message even if there is an error.
      },
    );

    // **Handling Mouse Clicks on the 3D Avatar**
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

    // **Handling Touch Input (For Mobile Devices)**
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

      // When the user drags their finger across the screen, the avatar rotates.
      // Moving left/right rotates it horizontally, and moving up/down rotates it vertically.
      // The small numbers adjust how sensitive the rotation is.
      avatar.rotation.y += deltaX * 0.005; 
      avatar.rotation.x -= deltaY * 0.005; 
      setAvatarRotation(avatar.rotation.y);

      // Limit vertical rotation to avoid flipping the avatar.
      if (avatar.rotation.x > Math.PI / 2) avatar.rotation.x = Math.PI / 2;
      if (avatar.rotation.x < -Math.PI / 2) avatar.rotation.x = -Math.PI / 2;

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

    // **Continuous Animation Loop**
    const animate = () => {
      requestAnimationFrame(animate); // Keep updating the scene.
      controls.update(); 
      renderer.render(scene, camera); 
    };
    animate();

    // When this component is removed from the page, we clean up the 3D scene.
    // This prevents memory leaks and ensures performance stays smooth.
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
        containerRef.current.removeEventListener("click", onMouseClick);
      }
    };
  }, [resetTrigger]);

  // **Reset the Avatar's rotation and Camera view**
  const resetAvatar = () => {
    if (avatarRef.current && controlsRef.current) {
      avatarRef.current.rotation.set(0, -Math.PI / 2, 0);
      setAvatarRotation(-Math.PI / 2);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
    setResetTrigger((prev) => prev + 1);
  };

  // Help text visibility 
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
        {isLoading && <p>Loading Avatar...</p>} {/* Show loading text while avatar is loading */}
      </div>
      <ResetButton onReset={resetAvatar} />

      {/* Help Icon at the top-left */}
      <HelpIcon onClick={toggleHelp} />

      {/* Help Text at the top-left*/}
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
          <p>Touch the dots to learn more about the Blue Hen Edge!</p>
        </div>
      )}
    </div>
  );
};

export default AvatarScene;
