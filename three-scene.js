import * as THREE from 'three';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/loaders/GLTFLoader.js';

window.addEventListener('DOMContentLoaded', () => {
    
   const config = [
    { id: 'model1', path: './assets/forma.glb' },
    { id: 'model2', path: './assets/fichas.glb' },
    { id: 'model3', path: './assets/cartas02.glb' } // Agregado perfectamente en la misma cola
];

    function createScene(containerId, modelPath) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const width = 400;
        const height = 400;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
        camera.position.set(0, 0, 5); 

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        /* =================================================== */
        /* ILUMINACIÓN CON MÁS BRILLO Y CLARIDAD               */
        /* =================================================== */
        // Subimos la luz ambiental para aclarar e iluminar las zonas oscuras de las piezas
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        // Potenciamos el foco principal para darle un impacto brillante y nítido a las caras frontales
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
        keyLight.position.set(2, 10, 6);
        scene.add(keyLight);

        let loadedModel = null;
        const loader = new GLTFLoader();

loader.load(modelPath, (gltf) => {

    loadedModel = new THREE.Group(); // Grupo pivote

    const model = gltf.scene;

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Escalado automático
    const maxDim = Math.max(size.x, size.y, size.z);

    if (maxDim > 0) {
        const scaleFactor = 2.6 / maxDim;
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }

    // Recalcular centro tras escalar
    const updatedBox = new THREE.Box3().setFromObject(model);
    const updatedCenter = updatedBox.getCenter(new THREE.Vector3());

    // Centrar el modelo respecto al pivote
    model.position.set(
        -updatedCenter.x,
        -updatedCenter.y,
        -updatedCenter.z
    );

    loadedModel.add(model);

    // Posición en escena
    loadedModel.position.set(-0.5, 0.4, 0);

    // Inclinación inicial
    loadedModel.rotation.x = 0.43;

    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    scene.add(loadedModel);

},
undefined,
(error) => {
    console.error(`Error al cargar el modelo en ${containerId}:`, error);
});

const animate = function () {
    requestAnimationFrame(animate);

    if (loadedModel) {
        loadedModel.rotation.y -= 0.01; // velocidad de giro
    }

    renderer.render(scene, camera);
};

animate();
    }

    config.forEach(item => createScene(item.id, item.path));
});

const container = document.getElementById("fundamento3d");



