import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/*
  Cena 3D do portal BETEL — geometria sagrada.
  - Cubo de Metatron: 13 pontos, 78 arestas (todos os pares conectados)
  - Espiral áurea de Fibonacci: curva visível + trajetória de partículas
  - Câmera avança em Z com leve deriva helicoidal (scrollProgressRef 0..1)
  - Luz pulsa por seção; comportamento dos elementos varia por seção
  Performance: antialias + alpha + high-performance, pixelRatio teto 2,
  partículas ≤ 500, geometria abstrata e sutil.
*/
export default function ThreeBackground({ scrollProgressRef }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let width = window.innerWidth
    let height = window.innerHeight

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0D0B08, 0.032)

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
    camera.position.set(0, 0, 10)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    mount.appendChild(renderer.domElement)

    const disposables = []   // geometrias + materiais para dispose no cleanup

    // ── Luz ──────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xE8D9A0, 0.45)
    scene.add(ambient)
    const keyLight = new THREE.PointLight(0xB8860B, 1.0, 120)
    keyLight.position.set(0, 0, 6)
    scene.add(keyLight)

    // ── Helper de interpolação por seção ─────────────────────
    // stops: [[p0,v0],[p1,v1],...] crescentes em p
    const piecewise = (p, stops) => {
      for (let i = 0; i < stops.length - 1; i++) {
        const [pa, va] = stops[i]
        const [pb, vb] = stops[i + 1]
        if (p <= pb) {
          const f = THREE.MathUtils.clamp((p - pa) / (pb - pa), 0, 1)
          return THREE.MathUtils.lerp(va, vb, f)
        }
      }
      return stops[stops.length - 1][1]
    }

    // ── CUBO DE METATRON ─────────────────────────────────────
    const R1 = 1.15   // hexágono interno
    const R2 = 2.30   // hexágono externo (rotacionado 30°)
    const metatronPoints = [new THREE.Vector3(0, 0, 0)]

    // Hexágono interno — leve projeção em Z para profundidade
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2
      metatronPoints.push(new THREE.Vector3(R1 * Math.cos(angle), R1 * Math.sin(angle), 0.18))
    }
    // Hexágono externo — rotacionado 30°, projetado mais ao fundo
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2 + Math.PI / 6
      metatronPoints.push(new THREE.Vector3(R2 * Math.cos(angle), R2 * Math.sin(angle), -0.18))
    }

    // Arestas: todos os 78 pares (13 × 12 / 2)
    const edgePositions = []
    for (let i = 0; i < metatronPoints.length; i++) {
      for (let j = i + 1; j < metatronPoints.length; j++) {
        edgePositions.push(metatronPoints[i].x, metatronPoints[i].y, metatronPoints[i].z)
        edgePositions.push(metatronPoints[j].x, metatronPoints[j].y, metatronPoints[j].z)
      }
    }
    const edgeGeo = new THREE.BufferGeometry()
    edgeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edgePositions), 3))
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xB8860B, transparent: true, opacity: 0.12 })
    const metatronEdges = new THREE.LineSegments(edgeGeo, edgeMat)
    disposables.push(edgeGeo, edgeMat)

    // Vértices (12 externos) + centro maior, separados
    const vertGeo = new THREE.BufferGeometry()
    const vertArr = new Float32Array((metatronPoints.length - 1) * 3)
    for (let i = 1; i < metatronPoints.length; i++) {
      vertArr[(i - 1) * 3]     = metatronPoints[i].x
      vertArr[(i - 1) * 3 + 1] = metatronPoints[i].y
      vertArr[(i - 1) * 3 + 2] = metatronPoints[i].z
    }
    vertGeo.setAttribute('position', new THREE.BufferAttribute(vertArr, 3))
    const vertMat = new THREE.PointsMaterial({ color: 0xE8D9A0, size: 0.09, transparent: true, opacity: 0.6, sizeAttenuation: true, depthWrite: false })
    const metatronVerts = new THREE.Points(vertGeo, vertMat)
    disposables.push(vertGeo, vertMat)

    const centerGeo = new THREE.BufferGeometry()
    centerGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3))
    const centerMat = new THREE.PointsMaterial({ color: 0xE8D9A0, size: 0.2, transparent: true, opacity: 0.7, sizeAttenuation: true, depthWrite: false })
    const metatronCenter = new THREE.Points(centerGeo, centerMat)
    disposables.push(centerGeo, centerMat)

    const metatronGroup = new THREE.Group()
    metatronGroup.add(metatronEdges, metatronVerts, metatronCenter)
    scene.add(metatronGroup)

    // ── ESPIRAL DE FIBONACCI ─────────────────────────────────
    const phi = 1.618033988749
    const b = Math.log(phi) / (Math.PI / 2)
    const SPIRAL_SCALE = 0.25
    const THETA_MAX = 4 * Math.PI

    const fibonacciPoint = (theta, scale) => {
      const r = scale * Math.exp(b * theta * 0.5)
      return new THREE.Vector3(r * Math.cos(theta), r * Math.sin(theta), theta * 0.8)
    }

    // 1) Curva visível estática
    const curvePts = []
    for (let theta = 0; theta <= THETA_MAX; theta += 0.1) {
      curvePts.push(fibonacciPoint(theta, SPIRAL_SCALE))
    }
    const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePts)
    const curveMat = new THREE.LineBasicMaterial({ color: 0xB8860B, transparent: true, opacity: 0.0 })
    const spiralCurve = new THREE.Line(curveGeo, curveMat)
    disposables.push(curveGeo, curveMat)

    // 2) Trajetória de partículas (≤ 500) ao longo da curva
    const COUNT = 500
    const sPos = new Float32Array(COUNT * 3)
    const sCol = new Float32Array(COUNT * 3)
    const sTheta = new Float32Array(COUNT)
    const baseCol = new THREE.Color(0xC9A028)
    for (let i = 0; i < COUNT; i++) {
      sTheta[i] = Math.random() * THETA_MAX   // distribuição inicial ao longo da espiral
    }
    const spiralPGeo = new THREE.BufferGeometry()
    spiralPGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3))
    spiralPGeo.setAttribute('color', new THREE.BufferAttribute(sCol, 3))
    const spiralPMat = new THREE.PointsMaterial({
      size: 0.07, transparent: true, opacity: 0.85, vertexColors: true,
      sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending,
    })
    const spiralParticles = new THREE.Points(spiralPGeo, spiralPMat)
    disposables.push(spiralPGeo, spiralPMat)

    const spiralGroup = new THREE.Group()
    spiralGroup.add(spiralCurve, spiralParticles)
    spiralGroup.position.x = 3.0
    spiralGroup.rotation.z = -0.3
    scene.add(spiralGroup)

    // ── Loop ─────────────────────────────────────────────────
    const clock = new THREE.Clock()
    let currentZ = 10
    let camX = 0, camY = 0
    let raf

    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      const p = scrollProgressRef.current || 0   // 0..1

      // Câmera avança em Z com deriva helicoidal sutil (φ aplicada de forma leve)
      const targetZ = 10 - p * 32
      currentZ += (targetZ - currentZ) * 0.05
      camera.position.z = currentZ
      camX += (Math.sin(p * Math.PI * 2) * 0.35 - camX) * 0.04
      camY += (Math.cos(p * Math.PI * 2) * 0.22 - camY) * 0.04
      camera.position.x = camX
      camera.position.y = camY

      // Luz: pico na governança, suaviza na privacidade
      keyLight.intensity = 0.7 + Math.sin(p * Math.PI) * 1.3

      // ── Metatron: rotação contínua lenta em múltiplos eixos ──
      metatronGroup.rotation.x += 0.0003
      metatronGroup.rotation.y += 0.0005

      // Comportamento por seção (offset à frente da câmera, opacity, escala, centralização)
      const mOffset  = piecewise(p, [[0, 18], [0.17, 8], [0.33, 12], [0.7, 12], [0.85, 5], [1, 4]])
      const mOpacity = piecewise(p, [[0, 0.08], [0.15, 0.16], [0.7, 0.13], [0.85, 0.18], [1, 0.18]])
      const mScale   = piecewise(p, [[0, 0.9], [0.5, 1.0], [0.85, 1.6], [1, 1.7]])
      const mX       = piecewise(p, [[0, -1.8], [0.3, -1.8], [0.85, 0], [1, 0]])
      metatronGroup.position.set(mX, 0.5, currentZ - mOffset)
      metatronGroup.scale.setScalar(mScale)
      edgeMat.opacity = mOpacity
      vertMat.opacity = mOpacity * 4    // pontos um pouco mais presentes que as linhas
      centerMat.opacity = Math.min(0.7, mOpacity * 5)

      // ── Espiral: acompanha a câmera; visível no pico da governança ──
      spiralGroup.position.z = currentZ - 14
      spiralGroup.rotation.y = t * 0.04
      curveMat.opacity = piecewise(p, [[0, 0.0], [0.17, 0.08], [0.33, 0.3], [0.5, 0.18], [0.7, 0.12], [1, 0.06]])

      // Partículas fluem para fora ao longo da curva; desaceleram na privacidade
      const speed = piecewise(p, [[0, 0.004], [0.33, 0.006], [0.8, 0.005], [0.85, 0.0015], [1, 0.001]])
      for (let i = 0; i < COUNT; i++) {
        sTheta[i] += speed
        if (sTheta[i] > THETA_MAX) sTheta[i] = Math.random() * 0.4   // reset perto do centro
        const v = fibonacciPoint(sTheta[i], SPIRAL_SCALE)
        sPos[i * 3] = v.x; sPos[i * 3 + 1] = v.y; sPos[i * 3 + 2] = v.z
        // brilho cresce com a distância (mais longe = mais opaco)
        const frac = sTheta[i] / THETA_MAX
        const bright = 0.2 + frac * 0.6
        sCol[i * 3] = baseCol.r * bright
        sCol[i * 3 + 1] = baseCol.g * bright
        sCol[i * 3 + 2] = baseCol.b * bright
      }
      spiralPGeo.attributes.position.needsUpdate = true
      spiralPGeo.attributes.color.needsUpdate = true
      spiralPMat.opacity = 0.4 + p * 0.45

      renderer.render(scene, camera)
    }
    animate()

    // ── Resize ───────────────────────────────────────────────
    const onResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', onResize)

    // ── Cleanup ──────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      disposables.forEach(d => d.dispose())
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [scrollProgressRef])

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
