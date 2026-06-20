import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/*
  Cena 3D do portal BETEL.
  - Câmera avança em Z conforme scrollProgressRef (0..1)
  - Geometria sagrada wireframe dourada (3 meshes)
  - Particle system dourado (500 pontos)
  - Luz pulsa por seção: suave na hero, intensa na governança, suave na privacidade
  Performance: antialias + alpha + high-performance, pixelRatio teto 2.
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

    // ── Luz ──────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xE8D9A0, 0.45)        // dourado claro ambiente
    scene.add(ambient)
    const keyLight = new THREE.PointLight(0xB8860B, 1.0, 120)     // dourado primário
    keyLight.position.set(0, 0, 6)
    scene.add(keyLight)

    // ── Geometria sagrada (3 meshes wireframe) ───────────────
    const geoMat = new THREE.MeshBasicMaterial({ color: 0xB8860B, wireframe: true, transparent: true, opacity: 0.15 })
    const meshes = []

    const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(3, 1), geoMat)
    ico.position.set(0, 0, -6)
    scene.add(ico); meshes.push(ico)

    const hex1 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.035, 6, 6), geoMat)  // anel hexagonal
    hex1.position.set(-2.2, 1.2, -16)
    scene.add(hex1); meshes.push(hex1)

    const hex2 = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.035, 6, 6), geoMat)
    hex2.position.set(2.6, -1.6, -28)
    scene.add(hex2); meshes.push(hex2)

    // ── Partículas (500 pontos) ──────────────────────────────
    const COUNT = 500
    const positions = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 34
      positions[i * 3 + 1] = (Math.random() - 0.5) * 34
      positions[i * 3 + 2] = (Math.random() - 0.5) * 70 - 10
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0xC9A028, size: 0.07, transparent: true, opacity: 0.5,
      sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending,
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // ── Loop ─────────────────────────────────────────────────
    const clock = new THREE.Clock()
    let currentZ = 10
    let raf

    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      const p = scrollProgressRef.current || 0   // 0..1

      // Câmera avança através do ambiente
      const targetZ = 10 - p * 32
      currentZ += (targetZ - currentZ) * 0.05
      camera.position.z = currentZ

      // Intensidade da luz: pico na governança (~p=0.4), suaviza na privacidade
      keyLight.intensity = 0.7 + Math.sin(p * Math.PI) * 1.3

      // Rotação orgânica lenta
      ico.rotation.x = t * 0.05
      ico.rotation.y = t * 0.08
      hex1.rotation.z = t * 0.10
      hex2.rotation.z = -t * 0.08

      // Densidade percebida das partículas aumenta com o scroll
      particles.rotation.y = t * 0.02
      pMat.opacity = 0.3 + p * 0.5

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
      meshes.forEach(m => m.geometry.dispose())
      geoMat.dispose()
      pGeo.dispose()
      pMat.dispose()
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
