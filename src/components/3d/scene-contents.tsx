"use client";

import React, { useEffect } from "react";
import { Center, ContactShadows, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * Everything the two canvases have in common: the bust, its material tweaks,
 * the studio lighting and the loader. The inline hero canvas (phones, reduced
 * motion) and the fixed scroll-choreographed scene (desktop) compose these so
 * the model looks identical in both.
 */

export const MODEL_URL = "/models/3daily-model.glb";

/** Primitive scale that fills the 440px hero slot heroically without clipping. */
export const MODEL_SCALE = 4.6;

/** Camera distance and field of view the hero framing was tuned at. */
export const HERO_CAMERA_Z = 4.55;
export const CAMERA_FOV = 45;

/** Where the base of the bust sits below the model's centre, at MODEL_SCALE. */
export const MODEL_BASE_Y = -1.6;

/** Shown in the canvas while the GLB streams in. */
export function CanvasLoader({
  position = [0, 0, 0],
}: {
  position?: [number, number, number];
}) {
  return (
    <Html center position={position}>
      <div className="flex flex-col items-center justify-center gap-3 select-none pointer-events-none">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-accent-line border-t-accent animate-spin" />
          <div className="absolute w-6 h-6 rounded-full bg-accent-soft blur-sm animate-pulse" />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-fg-muted">
          Streaming 3D Core...
        </span>
      </div>
    </Html>
  );
}

/**
 * The scanned bust, centred on its bounding box so the parent group's
 * position is the model's visual centre. Rotation, position and scale are the
 * parent's job; this component never animates itself.
 */
export function Bust({
  ref,
  onReady,
}: {
  ref?: React.Ref<THREE.Group>;
  onReady?: () => void;
}) {
  const { scene } = useGLTF(MODEL_URL);

  // Adjust material shading slightly to respond richly to studio lights
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        // A 380k-triangle mesh is never going to be raycast for pointer
        // events; culling it by bounding sphere is enough.
        mesh.frustumCulled = true;
        if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.envMapIntensity = 1.2;
          mat.roughness = Math.min(mat.roughness, 0.7);
        }
      }
    });
  }, [scene]);

  // Fires once the model is in the scene graph, after Suspense resolves.
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return (
    <group ref={ref}>
      <Center>
        <primitive
          object={scene}
          scale={MODEL_SCALE}
          rotation={[0, -Math.PI / 2, 0]}
          dispose={null}
        />
      </Center>
    </group>
  );
}

/** Light rig values per theme. On paper-white the neon rims read as noise and
 *  the dark model needs more fill to separate from the page. */
export function lightRig(isLight: boolean) {
  return isLight
    ? { ambient: 1.15, fill: 1.25, rimA: 2.6, rimB: 1.6, shadowOpacity: 0.28, shadowColor: "#4c1d95" }
    : { ambient: 0.8, fill: 1.0, rimA: 4.5, rimB: 3.2, shadowOpacity: 0.5, shadowColor: "#7928ca" };
}

export function StudioLights({
  isLight,
  isMobile,
}: {
  isLight: boolean;
  isMobile: boolean;
}) {
  const light = lightRig(isLight);
  return (
    <>
      {/* Ambient Fill */}
      <ambientLight intensity={light.ambient} />

      {/* Warm White Directional Key Light */}
      <directionalLight
        position={[4, 6, 5]}
        intensity={2.0}
        color="#ffffff"
        castShadow={!isMobile}
      />

      {/* Soft Front Fill Light */}
      <directionalLight position={[-2, 1, 4]} intensity={light.fill} color="#f4f4f5" />

      {/* Rim Light 1: Violet/Magenta Edge Glow */}
      <pointLight position={[-4, 2, -2.5]} intensity={light.rimA} color="#c084fc" distance={14} />

      {/* Rim Light 2: Subtle Cyan/White Accent Glow */}
      <pointLight position={[4, -1, -2.5]} intensity={light.rimB} color="#38bdf8" distance={14} />
    </>
  );
}

/**
 * Soft tinted ground shadow under the bust. It renders the whole scene from
 * below into a texture, so it is baked over the first frames rather than every
 * frame: the bust only floats and turns a little, which a blurred blob does not
 * register, and a live bake would cost a second draw of the mesh per frame.
 * Re-bakes when the theme changes the colour.
 */
export function GroundShadow({
  ref,
  isLight,
}: {
  ref?: React.Ref<THREE.Group>;
  isLight: boolean;
}) {
  const light = lightRig(isLight);
  return (
    <group ref={ref} position={[0, MODEL_BASE_Y, 0]}>
      <ContactShadows
        frames={8}
        opacity={light.shadowOpacity}
        scale={7}
        blur={2.5}
        far={4}
        color={light.shadowColor}
      />
    </group>
  );
}

// Preload the custom model for instantaneous asset availability
useGLTF.preload(MODEL_URL);
