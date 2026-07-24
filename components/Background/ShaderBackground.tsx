'use client'

import { useEffect, useRef } from 'react'

const vertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragment = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
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

void main() {
  vec2 uv = vUv;

  float t = uTime * 0.05;
  vec2 p = uv * 3.0;

  float n1 = noise(p + t * 0.3);
  float n2 = noise(p * 2.0 - t * 0.2);
  float n3 = noise(p * 4.0 + t * 0.15);

  float wave = sin(uv.x * 4.0 + uTime * 0.3) * 0.5 + 0.5;
  wave += sin(uv.y * 3.0 + uTime * 0.25 + 1.5) * 0.5;
  wave *= 0.3;

  float energy = n1 * 0.4 + n2 * 0.3 + n3 * 0.2 + wave;

  vec3 color = vec3(0.016, 0.016, 0.016);

  vec3 blue = vec3(0.03, 0.12, 0.25);
  vec3 purple = vec3(0.08, 0.04, 0.2);
  vec3 cyan = vec3(0.01, 0.08, 0.12);

  float mouseDist = distance(uv, uMouse);
  float mouseInfluence = 1.0 - smoothstep(0.0, 0.8, mouseDist);

  color += blue * energy * 0.5;
  color += purple * n2 * 0.3;
  color += cyan * n3 * 0.2;
  color += vec3(0.04, 0.1, 0.2) * mouseInfluence * 0.3;

  float vignette = 1.0 - length(uv - 0.5) * 0.7;
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}
`

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null!)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl')
    if (!gl) return

    const resize = () => {
      canvas.width = window.innerWidth * 0.5
      canvas.height = window.innerHeight * 0.5
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

    let animId: number
    const start = Date.now()

    const render = () => {
      const elapsed = (Date.now() - start) / 1000
      gl.uniform1f(uTime, elapsed)
      gl.uniform2f(uRes, canvas.width, canvas.height)

      const mx = 0.3 + 0.4 * Math.sin(elapsed * 0.1)
      const my = 0.3 + 0.4 * Math.cos(elapsed * 0.12)
      gl.uniform2f(uMouse, mx, my)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-9 pointer-events-none w-full h-full"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
