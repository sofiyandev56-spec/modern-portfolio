"use client";

import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState, smooth, window01 } from "@/lib/scroll-state";
import { COARSE_OR_NARROW, REDUCED_MOTION, useMediaQuery } from "@/lib/use-media-query";
import pointsVert from "@/shaders/points.vert";
import pointsFrag from "@/shaders/points.frag";

/**
 * The cosmos: one fixed WebGL canvas behind the whole page.
 *
 * Three particle systems share one shader — the mint star, the dusty portal
 * frame the reader flies through, and the background drift. Nothing in here
 * listens to scroll directly; every frame reads the phase progress values in
 * scrollState, works out where the camera and the star should be, and damps
 * towards it, so fast scrolling swings and settles instead of snapping.
 */

const ACCENT = new THREE.Color("#2ee6a0");
const PORTAL_TINT = new THREE.Color("#cfe3dc");
const DUST_TINT = new THREE.Color("#9fb8b0");

const PORTAL_Z = 3.6;
const CAM_HERO = 9;
const CAM_NEAR = 2.55;
/** Half-extent of the star in scene units; ~15% of the hero viewport height. */
const STAR_R = 0.5;

interface Cloud {
  positions: Float32Array;
  scatter: Float32Array;
  sizes: Float32Array;
  seeds: Float32Array;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/** Approximately normal, for soft spreads. */
function gauss() {
  return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
}

/**
 * The star: points filling an astroid (|x|^(2/3) + |y|^(2/3) <= 1), the
 * classic four-point sparkle, stretched a little taller than wide, thicker at
 * the centre than the tips so it reads as a lens when it turns edge-on.
 */
function makeStar(count: number): Cloud {
  const positions = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);
  let i = 0;
  while (i < count) {
    let x = rand(-1, 1);
    let y = rand(-1, 1);
    const t = Math.pow(Math.abs(x), 2 / 3) + Math.pow(Math.abs(y), 2 / 3);
    if (t > 1) continue;
    // A fifth of the points crowd towards the core.
    if (Math.random() < 0.2) {
      const k = Math.pow(Math.random(), 0.6);
      x *= k;
      y *= k;
    }
    const depth = 1 - t;
    const z = gauss() * 0.24 * (0.15 + depth);
    positions[i * 3] = x * 1.05 * STAR_R;
    positions[i * 3 + 1] = y * 1.3 * STAR_R;
    positions[i * 3 + 2] = z * STAR_R;
    // Where it flies to when the star dissolves: a wide ellipsoid shell, so
    // the half-way state is a puff rather than a box, and the end state is
    // the contact section's starfield.
    const u = Math.random() * 2 - 1;
    const phi = Math.random() * Math.PI * 2;
    const rr = Math.sqrt(1 - u * u);
    const radius = 1.5 + 7 * Math.pow(Math.random(), 0.6);
    scatter[i * 3] = rr * Math.cos(phi) * radius * 1.5;
    scatter[i * 3 + 1] = rr * Math.sin(phi) * radius;
    scatter[i * 3 + 2] = u * radius * 0.8 - 1.5;
    sizes[i] = rand(0.7, 1.5) + depth * rand(0, 1.1);
    seeds[i] = Math.random();
    i++;
  }
  return { positions, scatter, sizes, seeds };
}

/** The portal: dust along the edges of a tall rectangle, densest on the line. */
function makePortal(count: number): Cloud {
  const positions = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);
  // Sized to sit inside the hero viewport with margin at the hero distance.
  const w = 0.63;
  const h = 1.64;
  const perimeter = 2 * (w + h) * 2;
  for (let i = 0; i < count; i++) {
    let d = Math.random() * perimeter;
    let x = 0;
    let y = 0;
    if (d < 2 * w) {
      x = -w + d;
      y = h;
    } else if ((d -= 2 * w) < 2 * h) {
      x = w;
      y = h - d;
    } else if ((d -= 2 * h) < 2 * w) {
      x = w - d;
      y = -h;
    } else {
      d -= 2 * w;
      x = -w;
      y = -h + d;
    }
    // Most of the dust hugs the line; some drifts further out.
    const spread = Math.random() < 0.8 ? 0.035 : 0.16;
    x += gauss() * spread;
    y += gauss() * spread;
    const z = PORTAL_Z + gauss() * 0.3;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    scatter[i * 3] = x * 3;
    scatter[i * 3 + 1] = y * 3;
    scatter[i * 3 + 2] = z - 4;
    sizes[i] = Math.random() < 0.12 ? rand(1.8, 3) : rand(0.5, 1.4);
    seeds[i] = Math.random();
  }
  return { positions, scatter, sizes, seeds };
}

/** Background drift, everywhere, faint. */
function makeDust(count: number): Cloud {
  const positions = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const x = rand(-9, 9);
    const y = rand(-6, 6);
    const z = rand(-6, 6);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    scatter[i * 3] = x;
    scatter[i * 3 + 1] = y;
    scatter[i * 3 + 2] = z;
    sizes[i] = rand(0.4, 1.3);
    seeds[i] = Math.random();
  }
  return { positions, scatter, sizes, seeds };
}

function useCloudGeometry(cloud: Cloud) {
  return useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(cloud.positions, 3));
    g.setAttribute("aScatter", new THREE.BufferAttribute(cloud.scatter, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(cloud.sizes, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(cloud.seeds, 1));
    // The star spreads across the whole scene when it dissolves; never cull it.
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 30);
    return g;
  }, [cloud]);
}

function materialParams(
  color: THREE.Color,
  pixelRatio: number,
  twinkle: number
): THREE.ShaderMaterialParameters {
  return {
    vertexShader: pointsVert,
    fragmentShader: pointsFrag,
    uniforms: {
      uTime: { value: 0 },
      uExplode: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uScale: { value: 1 },
      uTwinkle: { value: twinkle },
      uColor: { value: color },
      uOpacity: { value: 0 },
      uMouse: { value: new THREE.Vector3() },
      uMouseStrength: { value: 0 },
      uHoleR: { value: 0.1 },
      uVel: { value: new THREE.Vector3() },
      uLag: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  };
}

interface Live {
  camZ: number;
  starX: number;
  starY: number;
  rotX: number;
  rotY: number;
  scale: number;
  explode: number;
  portal: number;
  intro: number;
  /** Spring-driven chase of the pointer (hero only), and its velocity. */
  pullX: number;
  pullY: number;
  pullVX: number;
  pullVY: number;
  /** Whether the pointer is present (0..1), damped. */
  mouse: number;
}

const _cursorWorld = new THREE.Vector3();
const _ray = new THREE.Vector3();
const _starWorld = new THREE.Vector3();
const _edgeWorld = new THREE.Vector3();
const _prevStar = new THREE.Vector3();
const _vel = new THREE.Vector3();
const _tmp = new THREE.Vector3();

/** Where a screen point (NDC) lands on the z = 0 plane. */
function cursorOnStarPlane(camera: THREE.Camera, nx: number, ny: number, out: THREE.Vector3) {
  _ray.set(nx, ny, 0.5).unproject(camera).sub(camera.position);
  const t = -camera.position.z / _ray.z;
  out.copy(camera.position).addScaledVector(_ray, t);
  return out;
}

function Scene({ mobile, reduce }: { mobile: boolean; reduce: boolean }) {
  const star = useMemo(() => makeStar(mobile ? 9000 : 22000), [mobile]);
  const portal = useMemo(() => makePortal(mobile ? 1100 : 2400), [mobile]);
  const dust = useMemo(() => makeDust(mobile ? 320 : 700), [mobile]);
  const starGeo = useCloudGeometry(star);
  const portalGeo = useCloudGeometry(portal);
  const dustGeo = useCloudGeometry(dust);

  const gl = useThree((s) => s.gl);
  const pr = Math.min(gl.getPixelRatio(), 2);
  const twinkle = reduce ? 0 : 1;
  // R3F owns the materials (and disposes them); the render loop writes their
  // uniforms through refs.
  const starParams = useMemo(() => materialParams(ACCENT, pr, twinkle), [pr, twinkle]);
  const portalParams = useMemo(() => materialParams(PORTAL_TINT, pr, twinkle), [pr, twinkle]);
  const dustParams = useMemo(() => materialParams(DUST_TINT, pr, twinkle), [pr, twinkle]);
  const starMat = useRef<THREE.ShaderMaterial>(null);
  const portalMat = useRef<THREE.ShaderMaterial>(null);
  const dustMat = useRef<THREE.ShaderMaterial>(null);

  const starRef = useRef<THREE.Points>(null);
  const dustRef = useRef<THREE.Points>(null);
  const time = useRef(0);
  // The live, damped values. Starts far back and small: the loader's reveal
  // is the camera settling into the hero.
  const live = useRef<Live>({
    camZ: CAM_HERO + 3,
    starX: 0,
    starY: 0,
    rotX: 0,
    rotY: 0,
    scale: 0.6,
    explode: 0,
    portal: 0,
    intro: 0,
    pullX: 0,
    pullY: 0,
    pullVX: 0,
    pullVY: 0,
    mouse: 0,
  });
  const size = useThree((s) => s.size);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20);
    if (!reduce) time.current += dt;
    const s = scrollState;
    const L = live.current;

    // ── Targets from scroll ──
    const trav = smooth(s.traverse);
    const projSide = (i: number) => (i % 2 === 0 ? 1.7 : -1.7);
    // Where the star sits during the projects: opposite the card, arriving
    // over the first third of each segment.
    let starX = 0;
    starX += projSide(0) * window01(s.proj1, 0, 0.35);
    starX += (projSide(1) - projSide(0)) * window01(s.proj2, 0, 0.35);
    starX += (projSide(2) - projSide(1)) * window01(s.proj3, 0, 0.35);
    starX += (0 - projSide(2)) * window01(s.tail, 0, 1);
    // Phones centre the cards, so the star stays behind them and shows
    // above and below instead of swinging aside.
    const starY = 0;
    if (mobile) starX *= 0.2;

    const camZ =
      CAM_HERO -
      (CAM_HERO - CAM_NEAR) * trav +
      0.25 * s.projHeader +
      0.6 * smooth(s.outro);

    const rotY =
      0.12 * s.hero +
      0.5 * trav +
      Math.PI * 2.4 * s.about +
      0.6 * s.projHeader +
      0.95 * (s.proj1 + s.proj2 + s.proj3) +
      0.4 * s.tail +
      0.35 * s.outro;
    const rotX = Math.sin(s.about * Math.PI) * 0.35 + 0.12 * (s.proj1 + s.proj3 - s.proj2);

    const scale = (1 - 0.08 * s.projHeader) * (mobile ? 0.95 : 1);
    const explode = smooth(s.outro);
    const portalTarget = 1;
    const intro = s.ready ? 1 : 0;

    // ── Damping ──
    const k = 3;
    L.camZ = THREE.MathUtils.damp(L.camZ, camZ, k, dt);
    L.starX = THREE.MathUtils.damp(L.starX, starX, k, dt);
    L.starY = THREE.MathUtils.damp(L.starY, starY, k, dt);
    L.rotY = THREE.MathUtils.damp(L.rotY, rotY, 2.4, dt);
    L.rotX = THREE.MathUtils.damp(L.rotX, rotX, 2.4, dt);
    L.scale = THREE.MathUtils.damp(L.scale, scale * (0.6 + 0.4 * L.intro), 2.2, dt);
    L.explode = THREE.MathUtils.damp(L.explode, explode, 2.6, dt);
    L.portal = THREE.MathUtils.damp(L.portal, portalTarget, 2, dt);
    L.intro = THREE.MathUtils.damp(L.intro, intro, 1.8, dt);

    // ── Camera ──
    const cam = state.camera;
    const px = reduce ? 0 : s.pointerX;
    const py = reduce ? 0 : s.pointerY;
    cam.position.set(px * 0.28, py * 0.18, L.camZ);
    cam.lookAt(L.starX * 0.25, 0, 0);
    cam.updateMatrixWorld();

    // ── Pointer ──
    // Two things happen. Everywhere, the cursor carves a hole in the particles
    // (see the shader). In the hero the star also chases the cursor, caged
    // inside the portal frame, on a soft spring — "Follow the star."
    const starR = STAR_R * 1.3 * L.scale;
    const hasCursor = !reduce && !mobile && s.cursorX >= 0 && L.explode < 0.5;
    let pullTX = 0;
    let pullTY = 0;
    if (hasCursor) {
      cursorOnStarPlane(cam, s.pointerX, s.pointerY, _cursorWorld);
      const heroW = 1 - smooth(s.traverse * 2.5);
      if (heroW > 0.001) {
        // The portal's frame projected onto the star's plane, minus the
        // star's own size, is the cage.
        const ratio = CAM_HERO / (CAM_HERO - PORTAL_Z);
        const halfW = Math.max(0.05, 0.63 * ratio - STAR_R * 1.05 * L.scale);
        const halfH = Math.max(0.05, 1.64 * ratio - STAR_R * 1.3 * L.scale);
        const tx = THREE.MathUtils.clamp(_cursorWorld.x, -halfW, halfW);
        const ty = THREE.MathUtils.clamp(_cursorWorld.y, -halfH, halfH);
        pullTX = tx * heroW;
        pullTY = ty * heroW;
      }
    }
    L.mouse = THREE.MathUtils.damp(L.mouse, hasCursor ? 1 : 0, 6, dt);
    // A soft, slightly under-damped spring: the star trails the cursor and
    // settles with a small overshoot.
    const stiff = 22;
    const dampF = Math.exp(-5.5 * dt);
    L.pullVX = (L.pullVX + (pullTX - L.pullX) * stiff * dt) * dampF;
    L.pullVY = (L.pullVY + (pullTY - L.pullY) * stiff * dt) * dampF;
    L.pullX += L.pullVX * dt;
    L.pullY += L.pullVY * dt;

    // ── Apply ──
    const star = starRef.current;
    if (star) {
      _prevStar.copy(star.position);
      star.position.set(L.starX + L.pullX, L.starY + L.pullY, 0);
      star.rotation.set(L.rotX, L.rotY, 0);
      star.scale.setScalar(L.scale);
      star.updateMatrixWorld();
      // World velocity of the star, clamped, for the particle trail. The
      // first frame can arrive with dt = 0; never let a NaN reach the GPU.
      if (dt > 1e-4) {
        _vel.copy(star.position).sub(_prevStar).divideScalar(dt);
        const vmax = 6;
        if (!Number.isFinite(_vel.x + _vel.y + _vel.z)) _vel.set(0, 0, 0);
        else if (_vel.length() > vmax) _vel.setLength(vmax);
      }

      // Report where the star is on screen for the letter glow.
      _starWorld.copy(star.position).project(cam);
      _edgeWorld.copy(star.position).add(_tmp.set(starR, 0, 0)).project(cam);
      const { width, height } = size;
      s.starPx = ((_starWorld.x + 1) / 2) * width;
      s.starPy = ((1 - _starWorld.y) / 2) * height;
      s.starRadiusPx = Math.abs(_edgeWorld.x - _starWorld.x) * 0.5 * width;
    }
    if (dustRef.current) {
      dustRef.current.rotation.y = time.current * 0.01;
    }

    const sm = starMat.current;
    if (sm) {
      sm.uniforms.uTime.value = time.current;
      sm.uniforms.uExplode.value = L.explode;
      sm.uniforms.uOpacity.value = 0.7 * L.intro * (1 - 0.3 * L.explode);
      sm.uniforms.uMouse.value.copy(_cursorWorld);
      sm.uniforms.uMouseStrength.value = L.mouse;
      // The hole scales with the star: about a sixth of its half-width, which
      // with the push band reads as roughly a fifth of the star's width.
      sm.uniforms.uHoleR.value = 0.17 * STAR_R * 1.05 * L.scale;
      const vel = sm.uniforms.uVel.value as THREE.Vector3;
      vel.lerp(_vel, 1 - Math.exp(-10 * dt));
      sm.uniforms.uLag.value = reduce ? 0 : 0.05;
    }

    // The portal fades as the camera passes through it, and once the About
    // act begins it is gone for good (the camera drifts back later).
    const pm = portalMat.current;
    if (pm) {
      const passed = 1 - smooth((L.camZ - PORTAL_Z - 0.2) / 1.2);
      const gone = 1 - smooth(s.about * 6);
      pm.uniforms.uTime.value = time.current;
      pm.uniforms.uOpacity.value = L.intro * L.portal * (1 - passed) * gone * 0.95;
    }

    const dm = dustMat.current;
    if (dm) {
      dm.uniforms.uTime.value = time.current;
      dm.uniforms.uOpacity.value = 0.55 * L.intro;
    }
  });

  return (
    <>
      <points ref={starRef} geometry={starGeo} frustumCulled={false}>
        <shaderMaterial ref={starMat} args={[starParams]} />
      </points>
      <points geometry={portalGeo} frustumCulled={false}>
        <shaderMaterial ref={portalMat} args={[portalParams]} />
      </points>
      <points ref={dustRef} geometry={dustGeo} frustumCulled={false}>
        <shaderMaterial ref={dustMat} args={[dustParams]} />
      </points>
    </>
  );
}

/** Feature-detects WebGL without keeping the probe context around. */
function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") ?? c.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** A still star for browsers without WebGL. */
function StarFallback() {
  return (
    <svg className="star-fallback" viewBox="-1.2 -1.4 2.4 2.8" aria-hidden="true">
      <defs>
        <radialGradient id="sf" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#bff7e0" />
          <stop offset="55%" stopColor="#2ee6a0" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#2ee6a0" stopOpacity="0.15" />
        </radialGradient>
      </defs>
      <path
        d="M0 -1.3 C0.07 -0.6 0.5 -0.08 1.05 0 C0.5 0.08 0.07 0.6 0 1.3 C-0.07 0.6 -0.5 0.08 -1.05 0 C-0.5 -0.08 -0.07 -0.6 0 -1.3 Z"
        fill="url(#sf)"
      />
    </svg>
  );
}

/** Client-only (see cosmos-client.tsx), so the WebGL probe can run at first render. */
export function Cosmos() {
  const mobile = useMediaQuery(COARSE_OR_NARROW);
  const reduce = useMediaQuery(REDUCED_MOTION);
  const [webgl] = useState(() => webglAvailable());

  return (
    <div className="layer" style={{ zIndex: 2 }} aria-hidden="true">
      {!webgl && <StarFallback />}
      {webgl && (
        <Canvas
          camera={{ fov: 50, near: 0.05, far: 60, position: [0, 0, CAM_HERO + 3] }}
          dpr={[1, mobile ? 1.5 : 2]}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          style={{ pointerEvents: "none" }}
        >
          <Scene mobile={mobile} reduce={reduce} />
        </Canvas>
      )}
    </div>
  );
}
