import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const FRAG = `
uniform float uTime;
uniform vec2  uResolution;
uniform vec3  uAccent;
varying vec2  vUv;

// 2D hash
vec2 hash2(vec2 p) {
  p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
  return fract(sin(p)*43758.5453);
}

// Voronoi
float voronoi(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float d = 8.0;
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
    vec2 g = vec2(float(x),float(y));
    vec2 o = hash2(i+g);
    o = 0.5+0.5*sin(uTime*0.4+6.2831*o);
    vec2 r = g+o-f;
    float dd = dot(r,r);
    d = min(d,dd);
  }
  return sqrt(d);
}

float fbm(vec2 p) {
  float v=0.0, a=0.5;
  for(int i=0;i<5;i++){
    v += a*voronoi(p);
    p  = p*2.1 + vec2(uTime*0.07);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 aspect = vec2(uResolution.x/uResolution.y, 1.0);
  vec2 p = uv * aspect * 2.5;

  float n = fbm(p - vec2(uTime*0.05));

  // Dark background gradient
  vec3 bg = mix(vec3(0.054, 0.054, 0.070), vec3(0.08, 0.07, 0.11), uv.y);

  // Accent glow — top center
  float d = length(uv - vec2(0.5, 0.0));
  float glow = smoothstep(0.9, 0.0, d) * 0.18;
  bg += uAccent * glow;

  // Voronoi shimmer
  float shimmer = smoothstep(0.3, 0.7, n);
  bg += uAccent * shimmer * 0.04;

  // Vignette
  float vig = 1.0 - smoothstep(0.4, 1.4, length((uv - 0.5) * vec2(aspect.x, 1.0)));
  bg *= vig * 0.4 + 0.6;

  gl_FragColor = vec4(bg, 1.0);
}
`

export default function ShaderBackdrop({ fixed = false }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(el.clientWidth, el.clientHeight)
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1

    const uniforms = {
      uTime:       { value: 0 },
      uResolution: { value: new THREE.Vector2(el.clientWidth, el.clientHeight) },
      uAccent:     { value: new THREE.Vector3(0.545, 0.424, 1.0) },
    }

    const geo = new THREE.PlaneGeometry(2, 2)
    const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms })
    scene.add(new THREE.Mesh(geo, mat))

    let raf
    let start = performance.now()
    function animate() {
      raf = requestAnimationFrame(animate)
      uniforms.uTime.value = (performance.now() - start) * 0.001
      renderer.render(scene, camera)
    }
    animate()

    function onResize() {
      renderer.setSize(el.clientWidth, el.clientHeight)
      uniforms.uResolution.value.set(el.clientWidth, el.clientHeight)
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.dispose()
      mat.dispose()
      geo.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className={`shader-backdrop${fixed ? ' shader-backdrop--fixed' : ''}`}
      aria-hidden="true"
    />
  )
}
