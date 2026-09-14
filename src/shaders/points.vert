// Soft particle points: the star, the portal and the dust all use this.
//
// Each particle owns a resting position (`position`), a scattered position
// (`aScatter`) it flies to when the star dissolves, a base size and a seed.
// The seed drives per-particle twinkle so nothing pulses in unison.
//
// Two world-space forces make the star feel soft: particles trail the star's
// own motion by their distance from its centre (uVel), and particles near the
// pointer are drawn towards it (uMouse / uMouseStrength), so the arm facing
// the cursor stretches.

attribute float aSize;
attribute float aSeed;
attribute vec3 aScatter;

uniform float uTime;
uniform float uExplode;
uniform float uPixelRatio;
uniform float uScale;
uniform float uTwinkle;
uniform vec3 uMouse;
uniform float uMouseStrength;
uniform float uMouseRadius;
uniform vec3 uVel;
uniform float uLag;

varying float vAlpha;
varying float vSeed;

void main() {
  // Ease the scatter so the star only loosens at first, then rushes apart.
  float e = pow(uExplode, 2.0);
  vec3 p = mix(position, aScatter, e);

  // A slow breath along the radial direction keeps the star alive at rest.
  float breath = sin(uTime * 0.7 + aSeed * 6.2831) * 0.012 * uTwinkle;
  p += normalize(p + vec3(0.0001)) * breath;

  vec4 wp = modelMatrix * vec4(p, 1.0);

  // Trail: the further from the centre, the more a particle lags behind.
  float fromCentre = length(position);
  wp.xyz -= uVel * uLag * (0.25 + 2.2 * fromCentre) * (1.0 - e);

  // Pull: a gaussian well around the pointer, strongest at its centre.
  vec3 toMouse = uMouse - wp.xyz;
  float md = length(toMouse.xy);
  float well = exp(-(md * md) / (2.0 * uMouseRadius * uMouseRadius));
  wp.xyz += toMouse * well * uMouseStrength * 0.5 * (1.0 - e);

  vec4 mv = viewMatrix * wp;
  gl_Position = projectionMatrix * mv;

  float tw = 0.7 + 0.3 * sin(uTime * (1.2 + aSeed * 2.4) + aSeed * 40.0) * uTwinkle;
  float dist = max(-mv.z, 0.05);
  // aSize is the size in device pixels at the hero camera distance (9 units).
  // Growth with proximity is softened so a close star stays dust, not blobs.
  gl_PointSize = aSize * uPixelRatio * uScale * pow(9.0 / dist, 0.6) * (0.85 + 0.3 * tw);

  // Dissolved particles thin out; very close ones (passing the camera) fade.
  float near = smoothstep(0.15, 0.9, dist);
  vAlpha = tw * (1.0 - 0.45 * e) * near * (1.0 + 0.35 * well * uMouseStrength);
  vSeed = aSeed;
}
