import * as THREE from "three"

const createClickableZone = (scene: THREE.Scene, position: [number, number, number]) => {
    const geometry = new THREE.CircleGeometry(0.3, 32)
    const material = new THREE.MeshBasicMaterial({ color: "red", transparent: true, opacity: 0.2, visible: false })
    const circle = new THREE.Mesh(geometry, material)
    
}

export default createClickableZone
