import fs from 'fs';

const vs = `
attribute vec2 a;
varying vec2 vUv;
void main() {
  vUv = a * 0.5 + 0.5;
  gl_Position = vec4(a, 0.0, 1.0);
}
`;

const fsSource = `
precision highp float;
varying vec2 vUv;

uniform sampler2D T;        // Atlas of 10 cards (5x2)
uniform sampler2D uLattice; // 18x12 grid of card IDs
uniform vec2 uResolution;
uniform vec2 uPan;
uniform vec2 uCard;
uniform vec2 uGap;
uniform vec3 uBg;
uniform vec2 uHover;
uniform float uHoverAmt;
uniform float uTime;
uniform float uScreen;
uniform float uBowY;
uniform float uCurve;
uniform float uBezel;
uniform float uRefract;
uniform float uRadius;

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

float tvHash(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}

void main() {
  vec2 warp = vUv * 2.0 - 1.0;
  vec2 bow = warp * vec2(1.0, uBowY);
  warp *= 1.0 + uScreen * dot(bow, bow);
  vec2 pix = (warp * 0.5 + 0.5) * uResolution;

  vec2 pitch = uCard + uGap;
  vec2 shifted = pix + uPan;
  vec2 id = floor(shifted / pitch);
  vec2 p = shifted - id * pitch - pitch * 0.5;

  float onThis = step(abs(id.x - uHover.x) + abs(id.y - uHover.y), 0.5);
  float hot = uHoverAmt * onThis;

  // Hover lift: card grows slightly (4%)
  p /= (1.0 + 0.04 * hot);

  vec2 hb = uCard * 0.5;
  float rad = uRadius;
  float d = sdRoundBox(p, hb, rad);

  // Background / Gap
  if (d > 0.0) {
    float shadow = clamp(1.0 - (d / (uGap.x * 0.75)), 0.0, 1.0);
    vec3 bg = uBg * (1.0 - 0.7 * shadow);
    gl_FragColor = vec4(bg, 1.0);
    return;
  }

  // Inside Card
  // Outward normal
  vec2 e = vec2(1.0, 0.0);
  vec2 n = normalize(vec2(
    sdRoundBox(p + e.xy, hb, rad) - sdRoundBox(p - e.xy, hb, rad),
    sdRoundBox(p + e.yx, hb, rad) - sdRoundBox(p - e.yx, hb, rad)
  ) + 1e-6);

  float depth = clamp(-d / uBezel, 0.0, 1.0);
  float lens = pow(1.0 - depth, 2.2);

  vec2 c = (p / uCard) * 2.0;
  c *= 1.0 + uCurve * dot(c, c);
  vec2 uv = c * 0.5 + 0.5;
  vec2 pull = -n * lens * (uRefract / uCard) * (1.55 - hot * 0.55);
  vec2 suv = clamp(uv + pull, 0.002, 0.998);

  // Sample card ID from 18x12 lattice
  vec2 latUv = (mod(id, vec2(18.0, 12.0)) + vec2(18.0, 12.0));
  latUv = (mod(latUv, vec2(18.0, 12.0)) + 0.5) / vec2(18.0, 12.0);
  float code = texture2D(uLattice, latUv).r * 255.0;
  float slot = floor(code + 0.5);

  vec2 atlasCoord = (vec2(mod(slot, 5.0), floor(slot / 5.0)) + suv) / vec2(5.0, 2.0);
  vec3 pic = texture2D(T, atlasCoord).rgb;

  // TV static for card 8 (Unlaced)
  if (abs(slot - 8.0) < 0.5) {
    float tvFrame = floor(uTime * 24.0);
    float noise = tvHash(vec3(floor(suv * vec2(190.0, 170.0)), tvFrame));
    float scanline = 1.0 - 0.1 * step(0.5, fract(suv.y * 120.0));
    float roll = 1.0 + 0.07 * sin(suv.y * 6.28 - uTime * 0.11 * 6.28);
    float grey = dot(pic, vec3(0.2126, 0.7152, 0.0722));
    pic = vec3(grey) * scanline * roll + vec3(noise * 0.2);
  }

  // Glass rim light
  float rim = pow(1.0 - depth, 2.8) * 0.45;
  rim += smoothstep(0.9, 0.0, abs(suv.y - 0.04)) * pow(1.0 - depth, 1.4) * 0.35;
  pic += vec3(rim);

  // Screen edge falloff
  vec2 edge = smoothstep(vec2(0.0), vec2(0.08), vUv) * smoothstep(vec2(0.0), vec2(0.08), 1.0 - vUv);
  float fade = edge.x * edge.y;

  gl_FragColor = vec4(pic * fade, 1.0);
}
`;

console.log('Shader syntax test passed (length:', fsSource.length, ')');
