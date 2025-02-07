import * as THREE from "three"

const createClickableZone = (scene: THREE.Scene, position: [number, number, number]) => {
    const geometry = new THREE.CircleGeometry(0.3, 32)
    const material = new THREE.MeshBasicMaterial({ color: "red", transparent: true, opacity: 0.2, visible: false })
    const circle = new THREE.Mesh(geometry, material)
    circle.position.set(position[0], position[1], position[2])

    circle.userData.clickable = true 

    return circle
}

export default createClickableZone
