// Soft disc with a brighter core, tinted by the layer colour.

precision highp float;

uniform vec3 uColor;
uniform float uOpacity;

varying float vAlpha;
varying float vSeed;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;

  float disc = smoothstep(0.5, 0.1, d);
  float core = smoothstep(0.2, 0.0, d);
  vec3 col = mix(uColor, vec3(1.0), core * 0.3 + vSeed * 0.1);

  gl_FragColor = vec4(col, disc * vAlpha * uOpacity);
}
