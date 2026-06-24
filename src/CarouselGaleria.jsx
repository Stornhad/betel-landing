import { useRef, useEffect } from 'react'

const SLIDES = [
  { name: 'Dashboard',   file: 'dashboard.png' },
  { name: 'Fluxo',       file: 'Fluxo.png' },
  { name: 'Metas',       file: 'metas.png' },
  { name: 'Vencimentos', file: 'Vencimentos.png' },
]
const N        = SLIDES.length
const CYCLE_MS = 5000
const W        = 520
const H        = 335
const X_STEP   = 320

function lerp(a, b, t) { return a + (b - a) * t }

function slotStyle(slot) {
  const abs = Math.abs(slot)
  if (abs >= 2) return { opacity: '0', pointerEvents: 'none' }

  let scale, opacity, brightness
  if (abs <= 1) {
    scale      = lerp(1,    0.72, abs)
    opacity    = lerp(1,    0.65, abs)
    brightness = lerp(1,    0.75, abs)
  } else {
    const t    = abs - 1
    scale      = lerp(0.72, 0.55, t)
    opacity    = lerp(0.65, 0,    t)
    brightness = lerp(0.75, 0.5,  t)
  }

  const x    = slot * X_STEP
  const rotY = -slot * 12
  const shadow = abs < 0.5
    ? '0 28px 72px rgba(0,0,0,0.65), 0 0 0 1px rgba(184,134,11,0.25)'
    : '0 12px 36px rgba(0,0,0,0.45), 0 0 0 1px rgba(184,134,11,0.08)'

  return {
    opacity:       String(opacity),
    transform:     `perspective(900px) translateX(${x}px) rotateY(${rotY}deg) scale(${scale})`,
    filter:        `brightness(${brightness})`,
    boxShadow:     shadow,
    zIndex:        String(Math.round(10 - abs * 3)),
    pointerEvents: 'auto',
  }
}

export default function CarouselGaleria() {
  const sceneRef    = useRef(null)
  const progressRef = useRef(0)
  const runningRef  = useRef(false)
  const rafRef      = useRef(null)
  const lastTsRef   = useRef(null)
  const backRafRef  = useRef(null)
  const tickFnRef   = useRef(null)

  function applyFrame(progress) {
    if (!sceneRef.current) return
    sceneRef.current.querySelectorAll('[data-tela]').forEach((el, i) => {
      let slot = ((i - progress * N) % N + N) % N
      if (slot > N / 2) slot -= N
      Object.assign(el.style, slotStyle(slot))
    })
  }

  tickFnRef.current = (ts) => {
    if (!runningRef.current) return
    if (lastTsRef.current === null) lastTsRef.current = ts
    const dt = ts - lastTsRef.current
    lastTsRef.current = ts
    progressRef.current = (progressRef.current + dt / CYCLE_MS) % 1
    applyFrame(progressRef.current)
    rafRef.current = requestAnimationFrame(tickFnRef.current)
  }

  function startLoop() {
    if (runningRef.current) return
    runningRef.current = true
    lastTsRef.current  = null
    rafRef.current = requestAnimationFrame(ts => tickFnRef.current(ts))
  }

  function stopLoop() {
    runningRef.current = false
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    lastTsRef.current = null
  }

  function handleBack() {
    if (backRafRef.current) { cancelAnimationFrame(backRafRef.current); backRafRef.current = null }
    const p0  = progressRef.current
    const p1  = p0 - 0.12
    const t0  = performance.now()
    const dur = 400
    function step(now) {
      const t    = Math.min((now - t0) / dur, 1)
      const ease = 1 - (1 - t) ** 3
      progressRef.current = ((p0 + (p1 - p0) * ease) % 1 + 1) % 1
      applyFrame(progressRef.current)
      if (t < 1) backRafRef.current = requestAnimationFrame(step)
    }
    backRafRef.current = requestAnimationFrame(step)
  }

  useEffect(() => {
    applyFrame(0)
    return () => {
      stopLoop()
      if (backRafRef.current) cancelAnimationFrame(backRafRef.current)
    }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, width: '100%' }}
         onMouseEnter={startLoop}
         onMouseLeave={stopLoop}>

      {/* Desktop: cena 3D */}
      <div ref={sceneRef} className="carousel-scene"
           style={{ position: 'relative', height: 400, width: '100%', overflow: 'hidden' }}>
        {SLIDES.map(({ name, file }, i) => (
          <div key={name} data-tela={i}
               style={{
                 position: 'absolute',
                 top: '50%', left: '50%',
                 marginLeft: -(W / 2),
                 marginTop:  -(H / 2),
                 width: W, height: H,
                 borderRadius: 8, overflow: 'hidden',
                 willChange: 'transform, opacity, filter',
               }}>
            <img src={`/screenshots/${file}`} alt={name} loading="lazy"
                 style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
          </div>
        ))}
      </div>

      {/* Mobile: imagem flat */}
      <div className="carousel-mobile-img">
        <img src="/screenshots/dashboard.png" alt="Dashboard"
             style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 8, objectFit: 'cover' }} />
      </div>

      {/* Botão voltar */}
      <button onClick={handleBack} className="carousel-back-btn">
        ← voltar
      </button>
    </div>
  )
}
