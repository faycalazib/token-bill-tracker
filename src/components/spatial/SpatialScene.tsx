import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface Props { variant: number; accent: string; motion: boolean }

/** A small, self-contained sculpture: no model downloads or external textures. */
export default function SpatialScene({ variant, accent, motion }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const motionRef = useRef(motion);
  const [available, setAvailable] = useState(true);
  useEffect(() => { motionRef.current = motion; }, [motion]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch {
      setAvailable(false);
      return;
    }
    setAvailable(true);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    element.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
    camera.position.set(0, 0.8, 8.9);
    camera.lookAt(0, 0, 0);
    const room = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    room.dispose();
    pmrem.dispose();

    const key = new THREE.DirectionalLight(0xffffff, 4);
    key.position.set(-3, 5, 4);
    scene.add(key);
    const rim = new THREE.PointLight(accent, 50);
    rim.position.set(2, -1, 2);
    scene.add(rim, new THREE.AmbientLight(0xffffff, 0.5));

    const chrome = new THREE.MeshStandardMaterial({ color: '#b7c4c0', metalness: 1, roughness: 0.19, envMapIntensity: 1.6 });
    const mint = new THREE.MeshPhysicalMaterial({ color: accent, metalness: 0.5, roughness: 0.21, clearcoat: 1, clearcoatRoughness: 0.1 });
    const dark = new THREE.MeshStandardMaterial({ color: '#0a120f', metalness: 0.4, roughness: 0.65, envMapIntensity: 0.12 });
    const lineMaterial = new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.3 });
    const sculpture = new THREE.Group();
    scene.add(sculpture);
    const add = (geometry: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      sculpture.add(mesh);
      return mesh;
    };
    const sphere = (radius: number, material: THREE.Material, x = 0, y = 0, z = 0) =>
      add(new THREE.SphereGeometry(radius, 36, 24), material, x, y, z);
    const ring = (radius: number, tube: number, material: THREE.Material) =>
      add(new THREE.TorusGeometry(radius, tube, 20, 100), material);

    switch (variant) {
      case 0: {
        const knot = add(new THREE.TorusKnotGeometry(1.12, 0.35, 180, 32, 2, 3), chrome);
        knot.rotation.set(0.45, -0.3, -0.4);
        sphere(0.36, mint, 1.65, 0.75, 0.4);
        sphere(0.16, mint, -1.7, -0.95, 0.4);
        break;
      }
      case 1:
        sphere(0.82, chrome, -0.85, 0.2, 0);
        sphere(0.66, mint, 0.75, 0.65, 0.3);
        sphere(0.49, chrome, 0.6, -0.85, 0.7);
        ring(1.8, 0.028, mint).rotation.x = 0.8;
        break;
      case 2:
        for (let i = 0; i < 5; i++) {
          const slab = add(new THREE.BoxGeometry(1.85, 0.23, 1.85), i === 3 ? mint : chrome, 0, (i - 2) * 0.5);
          slab.rotation.y = i * 0.17 + 0.4;
          const edges = new THREE.LineSegments(new THREE.EdgesGeometry(slab.geometry), new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.5 }));
          slab.add(edges);
        }
        sculpture.rotation.x = 0.3;
        break;
      case 3:
        for (let i = 0; i < 4; i++) {
          const link = ring(0.57, 0.19, i === 2 ? mint : chrome);
          link.position.set((i - 1.5) * 0.83, (i - 1.5) * 0.28, 0);
          link.rotation.y = i % 2 ? Math.PI / 2 : 0.15;
        }
        sculpture.rotation.z = 0.3;
        break;
      case 4:
        add(new THREE.IcosahedronGeometry(1.15, 0), chrome).rotation.z = 0.25;
        ring(1.65, 0.04, mint).rotation.x = 0.85;
        ring(1.85, 0.018, mint).rotation.set(-0.5, 0.7, 0);
        sphere(0.2, mint, 1.65, 0, 0);
        break;
      case 5:
        sphere(0.7, mint);
        for (let i = 0; i < 7; i++) {
          const angle = i * Math.PI * 2 / 7;
          sphere(0.24 + (i % 2) * 0.08, chrome, Math.cos(angle) * 1.65, Math.sin(angle) * 1.15, Math.sin(angle * 2) * 0.7);
          const points = [new THREE.Vector3(), new THREE.Vector3(Math.cos(angle) * 1.65, Math.sin(angle) * 1.15, Math.sin(angle * 2) * 0.7)];
          sculpture.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.35 })));
        }
        break;
      case 6:
        for (let i = 0; i < 12; i++) {
          const angle = i / 12 * Math.PI * 2;
          const height = 0.55 + (Math.sin(i * 1.7) + 1) * 0.6;
          add(new THREE.CylinderGeometry(0.12, 0.12, height, 24), i % 3 === 0 ? mint : chrome, Math.cos(angle) * 1.25, height / 2 - 0.5, Math.sin(angle) * 1.25);
        }
        sphere(0.47, mint, 0, 0.7, 0);
        sculpture.rotation.x = 0.3;
        break;
      case 7:
        for (let i = 0; i < 9; i++) {
          const layer = ring(0.95, 0.075, i === 4 ? mint : chrome);
          layer.rotation.set(Math.PI / 2 + 0.14 * Math.sin(i), 0.1 * i, 0);
          layer.position.y = (i - 4) * 0.27;
        }
        sculpture.rotation.z = -0.25;
        break;
      case 9:
        for (let i = 0; i < 7; i++) {
          const fragment = add(new THREE.BoxGeometry(i % 3 === 0 ? 0.76 : 0.48, 0.43, 0.42), i % 3 === 0 ? mint : chrome,
            (i - 3) * 0.59, Math.sin(i * 1.8) * 0.42, Math.cos(i * 1.2) * 0.3);
          fragment.rotation.set(0.12 * i, 0.23 * i, -0.08 * i);
        }
        break;
      default:
        for (let i = 0; i < 5; i++) {
          const height = 0.5 + i * 0.42;
          add(new THREE.CylinderGeometry(0.24, 0.24, height, 40), i === 4 ? mint : chrome, (i - 2) * 0.62, height / 2 - 0.8);
        }
        ring(1.75, 0.025, mint).rotation.set(0.7, 0.35, 0.2);
        break;
    }

    const orbit = ring(2.15, 0.009, lineMaterial);
    orbit.rotation.set(1.1, 0.1, -0.3);
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2, 0.09, 80), dark);
    pedestal.position.y = -1.8;
    scene.add(pedestal);
    const footRing = new THREE.Mesh(new THREE.TorusGeometry(1.87, 0.014, 8, 100), mint);
    footRing.rotation.x = Math.PI / 2;
    footRing.position.y = -1.82;
    scene.add(footRing);

    const initialRotation = sculpture.rotation.clone();
    const pointer = { x: 0, y: 0 };
    let visible = true;
    let lost = false;
    let elapsed = 0;
    let last = 0;
    const render = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (motionRef.current) {
        elapsed += delta;
        sculpture.rotation.y += (initialRotation.y + Math.sin(elapsed * 0.3) * 0.32 + pointer.x * 0.5 - sculpture.rotation.y) * 0.045;
        sculpture.rotation.x += (initialRotation.x + pointer.y * 0.22 - sculpture.rotation.x) * 0.045;
        sculpture.position.y = Math.sin(elapsed * 0.8) * 0.07;
      }
      renderer.render(scene, camera);
    };
    // Stop GPU work offscreen or in a hidden tab. Static mode draws only on resize/change.
    const syncLoop = () => {
      renderer.setAnimationLoop(null);
      if (lost || document.hidden || !visible) return;
      last = performance.now();
      render(last);
      if (motionRef.current) renderer.setAnimationLoop(render);
    };
    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // CSS controls the canvas size; only update its drawing buffer on resize.
      renderer.setSize(width, height, false);
      syncLoop();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const rect = element.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
      pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
    };
    const leave = () => { pointer.x = 0; pointer.y = 0; };
    const contextLost = (event: Event) => { event.preventDefault(); lost = true; renderer.setAnimationLoop(null); setAvailable(false); };
    const contextRestored = () => { lost = false; setAvailable(true); syncLoop(); };
    renderer.domElement.addEventListener('webglcontextlost', contextLost);
    renderer.domElement.addEventListener('webglcontextrestored', contextRestored);
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', syncLoop);
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncLoop(); });
    visibility.observe(element);
    const motionObserver = new MutationObserver(syncLoop);
    motionObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-spatial-motion'] });
    resize();

    return () => {
      renderer.setAnimationLoop(null);
      observer.disconnect(); visibility.disconnect(); motionObserver.disconnect();
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', syncLoop);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', contextRestored);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>([chrome, mint, dark, lineMaterial]);
      scene.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          geometries.add(object.geometry);
          (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
        }
      });
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      environment.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [variant, accent]);

  return <div ref={host} className="spatial-canvas" aria-hidden="true">
    {!available && <div className="spatial-sculpture-fallback"><i /><i /><i /><span /></div>}
  </div>;
}
