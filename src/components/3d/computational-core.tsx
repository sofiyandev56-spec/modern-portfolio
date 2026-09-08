"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { COARSE_OR_NARROW, useMediaQuery } from "@/lib/use-media-query";
import {
  CanvasErrorBoundary,
  CanvasFallback,
  isWebGLAvailable,
} from "@/components/3d/canvas-fallback";
import {
  useGLTF,
  useAnimations,
  Center,
  Html,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";

// ── Fallback Loader Component ──
function CanvasLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-3 select-none pointer-events-none">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-purple-500/20 border-t-purple-400 animate-spin" />
          <div className="absolute w-6 h-6 rounded-full bg-purple-500/20 blur-sm animate-pulse" />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
          Streaming 3D Core...
        </span>
      </div>
    </Html>
  );
}

// ── Custom Model Renderer with Parallax & Idle Motion ──
function ModelScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/3daily-model.glb");
  const { actions } = useAnimations(animations, groupRef);

  // Play idle skeletal/morph animation if present in GLB
  useEffect(() => {
    if (animations && animations.length > 0 && actions) {
      const firstAnim = Object.values(actions)[0];
      firstAnim?.reset().fadeIn(0.6).play();
    }
  }, [actions, animations]);

  // Adjust material shading slightly to respond richly to studio lights
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.envMapIntensity = 1.2;
          mat.roughness = Math.min(mat.roughness, 0.7);
        }
      }
    });
  }, [scene]);

  // Weighted cursor tracking and organic floating motion
  useFrame((state) => {
    if (!groupRef.current) return;
    const { pointer, clock } = state;
    const t = clock.getElapsedTime();

    // Subtle sinusoidal breathing / levitation
    const floatY = Math.sin(t * 1.6) * 0.06;

    // Interactive cursor parallax rotation
    const targetRotX = -pointer.y * 0.22;
    const targetRotY = pointer.x * 0.35;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      0.06
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      0.06
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      floatY,
      0.06
    );
  });

  return (
    <group ref={groupRef}>
      <Center>
        {/* Normalized scale (4.6 fits centerpiece container heroically without clipping) */}
        <primitive
          object={scene}
          scale={4.6}
          rotation={[0, -Math.PI / 2, 0]}
          dispose={null}
        />
      </Center>
    </group>
  );
}

// ── Main Computational Core Component ──
export function ComputationalCore({ className = "" }: { className?: string }) {
  // Phone GPUs pay real battery and frame-rate cost for antialiasing, shadow
  // maps and a high-performance context, so scale the scene down on touch
  // devices. Decided once on mount: Canvas reads gl/dpr at creation time.
  const isMobile = useMediaQuery(COARSE_OR_NARROW);
  // This component is only ever rendered on the client (dynamic, ssr: false),
  // so the probe can run during the first render without a hydration mismatch.
  const [webGL] = React.useState(isWebGLAvailable);

  if (!webGL) {
    return (
      <div className={`relative w-full h-full select-none ${className}`}>
        <CanvasFallback />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      <CanvasErrorBoundary>
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        dpr={isMobile ? [1, 1.25] : [1, 1.5]}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: isMobile ? "default" : "high-performance",
        }}
        className="w-full h-full"
      >
        {/* ── Studio-Grade Lighting Setup ── */}
        {/* Ambient Fill */}
        <ambientLight intensity={0.8} />

        {/* Warm White Directional Key Light */}
        <directionalLight
          position={[4, 6, 5]}
          intensity={2.0}
          color="#ffffff"
          castShadow={!isMobile}
        />

        {/* Soft Front Fill Light */}
        <directionalLight
          position={[-2, 1, 4]}
          intensity={1.0}
          color="#f4f4f5"
        />

        {/* Rim Light 1: Violet/Magenta Edge Glow */}
        <pointLight
          position={[-4, 2, -2.5]}
          intensity={4.5}
          color="#c084fc"
          distance={14}
        />

        {/* Rim Light 2: Subtle Cyan/White Accent Glow */}
        <pointLight
          position={[4, -1, -2.5]}
          intensity={3.2}
          color="#38bdf8"
          distance={14}
        />

        {/* Ground Soft Contact Shadow with Tint */}
        {!isMobile && (
          <ContactShadows
            position={[0, -1.6, 0]}
            opacity={0.5}
            scale={7}
            blur={2.5}
            far={4}
            color="#7928ca"
          />
        )}

        {/* ── Suspended 3D Model ── */}
        <Suspense fallback={<CanvasLoader />}>
          <ModelScene />
        </Suspense>
      </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}

// Preload the custom model for instantaneous asset availability
useGLTF.preload("/models/3daily-model.glb");

