"use client";

import React, { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FluidCardItem, useFluidCards } from "@/lib/fluid-store";
import { getScrollVelocity } from "@/lib/lenis";

const vertexShader = `
varying vec2 vUv;
uniform float uScrollVelocity;

void main() {
  vUv = uv;
  vec3 pos = position;
  pos.z += sin(pos.x * 2.0) * (uScrollVelocity * 0.002);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uHover;
uniform vec2 uMouseVelocity;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float wave = sin(uv.y * 12.0 + uTime * 3.0) * (uHover * 0.02);
  vec2 distortedUv = uv + vec2(wave, wave * 0.5);

  float r = texture2D(uTexture, distortedUv + vec2(uMouseVelocity.x * 0.01, 0.0)).r;
  float g = texture2D(uTexture, distortedUv).g;
  float b = texture2D(uTexture, distortedUv - vec2(uMouseVelocity.x * 0.01, 0.0)).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}
`;

function FluidCardMesh({
  card,
  mouseVelocity,
}: {
  card: FluidCardItem;
  mouseVelocity: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const textureRef = useRef<THREE.Texture | null>(null);

  const viewport = useThree((state) => state.viewport);

  // Initial shader uniforms
  const uniforms = React.useMemo(
    () => ({
      uTexture: { value: new THREE.Texture() },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uMouseVelocity: { value: new THREE.Vector2(0, 0) },
      uScrollVelocity: { value: 0 },
    }),
    []
  );

  // Load and cache texture
  useEffect(() => {
    let active = true;
    const loader = new THREE.TextureLoader();

    loader.load(
      card.imageUrl,
      (tex) => {
        if (!active) {
          tex.dispose();
          return;
        }
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
        textureRef.current = tex;
        if (materialRef.current) {
          materialRef.current.uniforms.uTexture.value = tex;
        }
      },
      undefined,
      (err) => {
        console.warn(`[FluidImagePlane] Failed to load texture: ${card.imageUrl}`, err);
      }
    );

    return () => {
      active = false;
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
    };
  }, [card.imageUrl]);

  // Clean up WebGL material on unmount
  useEffect(() => {
    const mat = materialRef.current;
    return () => {
      mat?.dispose();
    };
  }, []);

  // Sync with DOM element every frame
  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const mat = materialRef.current;
    if (!mesh || !card.element) return;

    const rect = card.element.getBoundingClientRect();
    const isVisibleOnScreen =
      rect.bottom > -50 &&
      rect.top < window.innerHeight + 50 &&
      rect.right > -50 &&
      rect.left < window.innerWidth + 50;

    if (!isVisibleOnScreen) {
      mesh.visible = false;
      return;
    }

    mesh.visible = true;

    // Technical Requirement 2: 1:1 Screen-to-World Units
    // Compute pixel-to-world unit ratio so WebGL mesh quads align 1:1 over DOM cards
    const ratio = viewport.width / window.innerWidth;
    const meshWidth = rect.width * ratio;
    const meshHeight = rect.height * ratio;

    mesh.scale.set(meshWidth, meshHeight, 1);

    const screenCenterX = rect.left + rect.width / 2;
    const screenCenterY = rect.top + rect.height / 2;
    const offsetX = (screenCenterX - window.innerWidth / 2) * ratio;
    const offsetY = (window.innerHeight / 2 - screenCenterY) * ratio;

    mesh.position.set(
      state.camera.position.x + offsetX,
      state.camera.position.y + offsetY,
      0
    );

    // Uniform updates on material instance without React state re-renders
    if (mat) {
      mat.uniforms.uTime.value += delta;
      mat.uniforms.uScrollVelocity.value = getScrollVelocity();
      mat.uniforms.uMouseVelocity.value.set(
        mouseVelocity.current.x,
        mouseVelocity.current.y
      );
      mat.uniforms.uHover.value = THREE.MathUtils.damp(
        mat.uniforms.uHover.value,
        card.isHovered ? 1.0 : 0.0,
        6,
        delta
      );
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
}

export function FluidPlanesScene() {
  const cards = useFluidCards();
  const mouseVelocity = useRef({ x: 0, y: 0 });
  const lastMouse = useRef({ x: 0, y: 0, time: 0 });

  // Mouse velocity tracker
  useEffect(() => {
    lastMouse.current.time = performance.now();

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max((now - lastMouse.current.time) / 1000, 0.016);
      const dx = (e.clientX - lastMouse.current.x) / dt;
      const dy = (e.clientY - lastMouse.current.y) / dt;

      // Dampen to reasonable range
      mouseVelocity.current.x = THREE.MathUtils.clamp(dx / 1000, -2, 2);
      mouseVelocity.current.y = THREE.MathUtils.clamp(dy / 1000, -2, 2);

      lastMouse.current.x = e.clientX;
      lastMouse.current.y = e.clientY;
      lastMouse.current.time = now;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  // Decay mouse velocity on rAF
  useFrame((_, delta) => {
    mouseVelocity.current.x = THREE.MathUtils.damp(
      mouseVelocity.current.x,
      0,
      4,
      delta
    );
    mouseVelocity.current.y = THREE.MathUtils.damp(
      mouseVelocity.current.y,
      0,
      4,
      delta
    );
  });

  if (cards.length === 0) return null;

  return (
    <group>
      {cards.map((card) => (
        <FluidCardMesh
          key={card.id}
          card={card}
          mouseVelocity={mouseVelocity}
        />
      ))}
    </group>
  );
}
