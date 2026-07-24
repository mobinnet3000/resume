'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const vertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragment = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uIdle;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float val = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 6; i++) {
    val += amp * noise(p * freq);
    freq *= 2.0;
    amp *= 0.5;
  }
  return val;
}

float domainWarp(vec2 p) {
  vec2 q = vec2(fbm(p + vec2(0.0, 0.0)), fbm(p + vec2(5.2, 1.3)));
  vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2)), fbm(p + 4.0 * q + vec2(8.3, 2.8)));
  return fbm(p + 4.0 * r);
}

void main() {
  vec2 uv = vUv;
  float t = uTime * 0.03;

  float idleFactor = uIdle;

  vec2 p = uv * 4.0 + t * 0.1;
  float warp = domainWarp(p);

  float energy = sin(uv.x * 5.0 + uv.y * 3.0 + t * 0.5) * 0.5 + 0.5;
  energy = smoothstep(0.0, 1.0, energy);

  float pulse = sin(t * 2.0 + uv.x * 2.0) * 0.02 + 1.0;

  vec3 dark = vec3(0.016, 0.016, 0.016);
  vec3 blue = vec3(0.02, 0.08, 0.2);
  vec3 purple = vec3(0.06, 0.03, 0.16);
  vec3 cyan = vec3(0.01, 0.06, 0.1);
  vec3 accent = vec3(0.04, 0.12, 0.25);

  float mouseDist = distance(uv, uMouse);
  float mouseInfluence = 1.0 - smoothstep(0.0, 0.6, mouseDist);

  vec3 color = dark;

  float w = smoothstep(0.1, 0.6, warp);
  color += mix(blue, purple, w) * (0.4 + 0.1 * energy);
  color += cyan * (1.0 - w) * 0.2;

  float waveMask = sin(uv.x * 8.0 + uv.y * 6.0 + t) * 0.5 + 0.5;
  color += accent * waveMask * 0.15;

  color += vec3(0.03, 0.08, 0.15) * mouseInfluence * 0.4;

  color *= pulse;

  float vignette = 1.0 - length(uv - 0.5) * 0.6;
  color *= vignette;

  float grain = hash(uv + fract(t)) * 0.02;
  color += grain;

  gl_FragColor = vec4(color, 1.0);
}
`

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl')
    if (!gl) return

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * 0.5)
      canvas.height = Math.floor(window.innerHeight * 0.5)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const compile = (src: string, type: number) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }

    const vs = compile(vertex, gl.VERTEX_SHADER)
    const fs = compile(fragment, gl.FRAGMENT_SHADER)
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW)

    const posLoc = gl.getAttribLocation(prog, 'position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uRes = gl.getUniformLocation(prog, 'uResolution')
    const uMouse = gl.getUniformLocation(prog, 'uMouse')
    const uIdle = gl.getUniformLocation(prog, 'uIdle')

    let animId: number
    const start = Date.now()
    let idleTimeout: ReturnType<typeof setTimeout> | null = null
    let isIdle = false

    const setIdle = () => {
      isIdle = true
      gl.uniform1f(uIdle, 1.0)
    }

    const resetIdle = () => {
      isIdle = false
      gl.uniform1f(uIdle, 0.0)
      if (idleTimeout) clearTimeout(idleTimeout)
      idleTimeout = setTimeout(setIdle, 5000)
    }

    window.addEventListener('mousemove', resetIdle)
    resetIdle()

    const render = () => {
      const elapsed = (Date.now() - start) / 1000
      gl.uniform1f(uTime, elapsed)
      gl.uniform2f(uRes, canvas.width, canvas.height)

      const mx = 0.3 + 0.4 * Math.sin(elapsed * 0.08 + (isIdle ? elapsed * 0.01 : 0))
      const my = 0.3 + 0.4 * Math.cos(elapsed * 0.1 + (isIdle ? elapsed * 0.015 : 0))

      if (!isIdle && !reduce) {
        // Use real mouse position when available
      }

      gl.uniform2f(uMouse, mx, my)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', resetIdle)
      if (idleTimeout) clearTimeout(idleTimeout)
    }
  }, [reduce])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-9 pointer-events-none w-full h-full"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
