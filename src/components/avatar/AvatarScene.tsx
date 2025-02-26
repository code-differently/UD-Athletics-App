"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three"; //This is Three.js being imported to handle 3D graphics 
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; //to move around the 3D scene
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import ResetButton from "./ResetButton";
import HelpIcon from "../HelpIcon";

const AvatarScene = () => {
  //These are references to hold objects, camera, and controls 
  const containerRef = useRef<HTMLDivElement>(null);//references the container where the 3D scene will appear
  const [isLoading, setIsLoading] = useState(true); //Tracks whether the avatar is still loading 
  const controlsRef = useRef<OrbitControls | null>(null); //camera controls
  const avatarRef = useRef<THREE.Group | null>(null); //3D avatar model 
  const [resetTrigger, setResetTrigger] = useState(0); //statw to trigger resetting the avatar 
  const [avatarRotation, setAvatarRotation] = useState<number>(0);//track the avatars rotation angle
  const [isHelpVisible, setIsHelpVisible] = useState(false); // For help text visibility

  useEffect(() => {
    if (!containerRef.current) return; //makes sure the container exists before continuing 

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0); //background color of the scene 

    const camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000); 
    camera.position.set(0, 1.5, 3); //the cameras default position 

    // set up the WebGL renderer to display the 3D scene on screen
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(300, 300);//the size of the 3D scene to e 300x300 pixels
    containerRef.current.appendChild(renderer.domElement); //adds the scene to the container

    const light = new THREE.AmbientLight(0xffffff, 0.5); //soft ambient light
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); //strong directional light to highlight the model
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    //Set up camera controls to allow moving the camera around the scene
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controlsRef.current = controls;

    //raycaster to deteck click events on 3D objects
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let avatar: THREE.Group | THREE.Mesh;

    //load the 3D avatar model (football player).
    const loader = new FBXLoader();
    loader.load(
      "/models/UDavatar.fbx", //the path to the model is under the 'public' folder
      (object) => {
        avatarRef.current = object;
        object.scale.set(0.01, 0.01, 0.01);
        scene.add(object);

        object.rotation.y = -Math.PI / 2;
        setAvatarRotation(object.rotation.y);
        scene.add(object);

        // Center the model
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center);
        object.position.y = -center.y;

        // Adjust camera distance based on the avatar's size
        const modelSize = box.getSize(new THREE.Vector3());
        const maxDimension = Math.max(modelSize.x, modelSize.y, modelSize.z);
        const cameraDistance =
          maxDimension / (2 * Math.tan((Math.PI * camera.fov) / 360));
        camera.position.set(0, 0, cameraDistance * 1.5);
        controls.target.set(0, center.y, 0);
        controls.update();
        setIsLoading(false); //Avatar is loaded, so stop showing the loading message 
      },
      undefined,
      (error) => {
        //Handle errors if the avatar fails to load
        console.error("Error loading avatar model:", error);
        setIsLoading(false); // Stop showing the loading message even if there is an error.
      },
    );

    // Event listener for clicks on the 3D scene to interact with the avatar.
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

    //Handle touch events for mobile devices to rotate the avatar.
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

      avatar.rotation.y += deltaX * 0.005; // horizontal rotation 
      avatar.rotation.x -= deltaY * 0.005; // vertical rotation! The numbers are sensitivity 
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

    // Animation loop to keep updating the scene.
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); //update camera controls
      renderer.render(scene, camera); //render the scene
    };
    animate();

    // Cleanup the event listeners and renderer when the component is removed.
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
        containerRef.current.removeEventListener("click", onMouseClick);
      }
    };
  }, [resetTrigger]);

  // Function to reset the avatar's rotation and camera view.
  const resetAvatar = () => {
    if (avatarRef.current && controlsRef.current) {
      avatarRef.current.rotation.set(0, -Math.PI / 2, 0);
      setAvatarRotation(-Math.PI / 2);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
    setResetTrigger((prev) => prev + 1);
  };

  // Help help text visibility 
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
