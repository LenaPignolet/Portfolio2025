import * as THREE from "three";
import { vertexShader, fluidShader, displayShader } from "./shaders.js";

const isMobile = window.innerWidth < 768;
const isLowEnd = navigator.hardwareConcurrency <= 4;

const config = {
    brushSize: isMobile ? 35.0 : 25.0,
    brushStrength: isMobile ? 0.35 : 0.5,
    distortionAmount: isMobile ? 1.0 : 1.5,
    fluidDecay: isMobile ? 0.96 : 0.98,
    trailLength: isMobile ? 0.6 : 0.8,
    stopDecay: isMobile ? 0.80 : 0.85,
    color1: "#010440",
    color2: "#0540F2",
    color3: "#020F59",
    color4: "#3B52D9",
    colorIntensity: 1.0,
    softness: 2.0,
};

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
}

const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const renderer = new THREE.WebGLRenderer({ 
    antialias: !isMobile,
    powerPreference: isMobile ? 'low-power' : 'high-performance',
    alpha: false,
    stencil: false,
    depth: false,
});

const gradientCanvas = document.querySelector('.home__background');

const getResolution = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (isMobile) {
        const divisor = isLowEnd ? 2.5 : 2;
        return {
            width: Math.floor(width / divisor),
            height: Math.floor(height / divisor)
        };
    }
    
    return { width, height };
};

const resolution = getResolution();
renderer.setSize(window.innerWidth, window.innerHeight);

if (isMobile) {
    renderer.setPixelRatio(1);
} else {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

gradientCanvas.appendChild(renderer.domElement);

const fluidTarget1 = new THREE.WebGLRenderTarget(
    resolution.width,
    resolution.height,
    {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: isMobile ? THREE.UnsignedByteType : THREE.HalfFloatType,
    }
);

const fluidTarget2 = new THREE.WebGLRenderTarget(
    resolution.width,
    resolution.height,
    {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: isMobile ? THREE.UnsignedByteType : THREE.HalfFloatType,
    }
);

let currentFluidTarget = fluidTarget1;
let previousFluidTarget = fluidTarget2;
let frameCount = 0;

const fluidMaterial = new THREE.ShaderMaterial({
    uniforms: {
        iTime: { value: 0 },
        iResolution: {
            value: new THREE.Vector2(resolution.width, resolution.height),
        },
        iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
        iFrame: { value: 0 },
        iPreviousFrame: { value: null },
        uBrushSize: { value: config.brushSize },
        uBrushStrength: { value: config.brushStrength },
        uFluidDecay: { value: config.fluidDecay },
        uTrailLength: { value: config.trailLength },
        uStopDecay: { value: config.stopDecay },
    },
    vertexShader: vertexShader,
    fragmentShader: fluidShader,
});

const displayMaterial = new THREE.ShaderMaterial({
    uniforms: {
        iTime: { value: 0 },
        iResolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        iFluid: { value: null },
        uDistortionAmount: { value: config.distortionAmount },
        uColor1: { value: new THREE.Vector3(...hexToRgb(config.color1)) },
        uColor2: { value: new THREE.Vector3(...hexToRgb(config.color2)) },
        uColor3: { value: new THREE.Vector3(...hexToRgb(config.color3)) },
        uColor4: { value: new THREE.Vector3(...hexToRgb(config.color4)) },
        uColorIntensity: { value: config.colorIntensity },
        uSoftness: { value: config.softness },
    },
    vertexShader: vertexShader,
    fragmentShader: displayShader,
});

const geometry = new THREE.PlaneGeometry(2, 2);
const fluidPlane = new THREE.Mesh(geometry, fluidMaterial);
const displayPlane = new THREE.Mesh(geometry, displayMaterial);

let mouseX = 0, mouseY = 0;
let prevMouseX = 0, prevMouseY = 0;
let lastMoveTime = 0;

const handlePointerMove = (e) => {
    const rect = gradientCanvas.getBoundingClientRect();
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    mouseX = clientX - rect.left;
    mouseY = rect.height - (clientY - rect.top);
    lastMoveTime = performance.now();
    
    fluidMaterial.uniforms.iMouse.value.set(
        mouseX,
        mouseY,
        prevMouseX,
        prevMouseY
    );
};

if (isMobile) {
    document.addEventListener('touchmove', handlePointerMove, { passive: true });
    document.addEventListener('touchend', () => {
        fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
    });
} else {
    document.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('mouseleave', () => {
        fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
    });
}

let lastFrameTime = 0;
const targetFPS = isMobile ? 30 : 60;
const frameInterval = 1000 / targetFPS;

function animate(currentTime) {
    requestAnimationFrame(animate);
    
    if (isMobile) {
        const elapsed = currentTime - lastFrameTime;
        if (elapsed < frameInterval) return;
        lastFrameTime = currentTime - (elapsed % frameInterval);
    }

    const time = performance.now() * 0.001;
    fluidMaterial.uniforms.iTime.value = time;
    displayMaterial.uniforms.iTime.value = time;
    fluidMaterial.uniforms.iFrame.value = frameCount;

    if (performance.now() - lastMoveTime > 100) {
        fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
    }

    fluidMaterial.uniforms.iPreviousFrame.value = previousFluidTarget.texture;
    renderer.setRenderTarget(currentFluidTarget);
    renderer.render(fluidPlane, camera);

    displayMaterial.uniforms.iFluid.value = currentFluidTarget.texture;
    renderer.setRenderTarget(null);
    renderer.render(displayPlane, camera);

    const temp = currentFluidTarget;
    currentFluidTarget = previousFluidTarget;
    previousFluidTarget = temp;

    frameCount++;
}

window.addEventListener('resize', () => {
    const newResolution = getResolution();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    fluidMaterial.uniforms.iResolution.value.set(newResolution.width, newResolution.height);
    displayMaterial.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);

    fluidTarget1.setSize(newResolution.width, newResolution.height);
    fluidTarget2.setSize(newResolution.width, newResolution.height);
    frameCount = 0;
});

animate(0);
