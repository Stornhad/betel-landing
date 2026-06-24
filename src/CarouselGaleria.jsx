import { useRef, useEffect } from 'react'

const SLIDES = [
  { name: 'Dashboard',   file: 'dashboard.png' },
  { name: 'Fluxo',       file: 'Fluxo.png' },
  { name: 'Metas',       file: 'metas.png' },
  { name: 'Vencimentos', file: 'Vencimentos.png' },
]
const N        = SLIDES.length
const W        = 480
const H        = 310
const X_STEP   = 340
const DRAG_DIV = 380

function lerp(a, b, t) { return a + (b - a) * t }

function cardStyle(offset, mobile) {
  const abs = Math.abs(offset)

  if (mobile && abs > 0.7) return { opacity: '0', pointerEvents: 'none' }
  if (!mobile && abs >= 2)  return { opacity: '0', pointerEvents: 'none' }

  const scale      = abs <= 1 ? lerp(1, 0.72, abs) : lerp(0.72, 0.5, abs - 1)
  const brightness = abs <= 1 ? lerp(1, 0.5,  abs) : lerp(0.5,  0.2, abs - 1)
  const fade       = abs >= 1.8 ? lerp(1, 0, (abs - 1.8) / 0.2) : 1
  const x          = offset * X_STEP
  const rotY       = mobile ? 0 : offset * 18
  const shadow     = abs < 0.3 ? '0 8px 40px rgba(185,134,11,0.25)' : 'none'
  const prefix     = mobile ? '' : 'perspective(900px) '

  return {
    transform:     `${prefix}translateX(${x}px) rotateY(${rotY}deg) scale(${scale})`,
    filter:        `brightness(${brightness})`,
    opacity:       String(fade),
    zIndex:        String(Math.round(10 - abs * 3)),
    boxShadow:     shadow,
    pointerEvents: abs < 1.5 ? 'auto' : 'none',
  }
}

export default function CarouselGaleria() {
  const sceneRef  = useRef(null)
  const dotsRef   = useRef(null)
  const progress  = useRef(0)
  const target    = useRef(0)
  const dragging  = useRef(false)
  const dragX0    = useRef(0)
  const dragProg0 = useRef(0)
  const rafRef    = useRef(null)

  function applyFrame(prog) {
    if (!sceneRef.current) return
    const mobile = window.innerWidth < 768
    sceneRef.current.querySelectorAll('[data-slide]').forEach((el, i) => {
      let off = ((i - prog) % N + N) % N
      if (off > N / 2) off -= N
      Object.assign(el.style, cardStyle(off, mobile))
    })
    if (dotsRef.current) {
      const active = ((Math.round(prog) % N) + N) % N
      dotsRef.current.querySelectorAll('[data-dot]').forEach((dot, i) => {
        dot.style.background = i === active ? '#C9A028' : 'rgba(185,134,11,0.3)'
        dot.style.transform  = i === active ? 'scale(1.4)' : 'scale(1)'
      })
    }
  }

  useEffect(() => {
    function frame() {
      // shortest-path lerp com wrap circular
      let diff = target.current - progress.current
      diff = ((diff % N) + N) % N
      if (diff > N / 2) diff -= N
      progress.current = ((progress.current + diff * 0.12) % N + N) % N
      applyFrame(progress.current)
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  function snap() {
    target.current = ((Math.round(target.current) % N) + N) % N
  }

  function onMouseDown(e) {
    dragging.current  = true
    dragX0.current    = e.clientX
    dragProg0.current = target.current
    e.preventDefault()
  }
  function onMouseMove(e) {
    if (!dragging.current) return
    target.current = dragProg0.current + (e.clientX - dragX0.current) / DRAG_DIV
  }
  function onMouseUp() {
    if (dragging.current) { dragging.current = false; snap() }
  }

  function onTouchStart(e) {
    dragging.current  = true
    dragX0.current    = e.touches[0].clientX
    dragProg0.current = target.current
  }
  function onTouchMove(e) {
    if (!dragging.current) return
    target.current = dragProg0.current + (e.touches[0].clientX - dragX0.current) / DRAG_DIV
    e.preventDefault()
  }
  function onTouchEnd() {
    if (dragging.current) { dragging.current = false; snap() }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>

      {/* Cena */}
      <div ref={sceneRef}
           style={{ position: 'relative', height: 400, width: '100%', overflow: 'hidden',
                    cursor: 'grab', userSelect: 'none' }}
           onMouseDown={onMouseDown}
           onMouseMove={onMouseMove}
           onMouseUp={onMouseUp}
           onMouseLeave={onMouseUp}
           onTouchStart={onTouchStart}
           onTouchMove={onTouchMove}
           onTouchEnd={onTouchEnd}>
        {SLIDES.map(({ name, file }, i) => (
          <div key={name} data-slide={i}
               style={{
                 position: 'absolute', top: '50%', left: '50%',
                 marginLeft: -(W / 2), marginTop: -(H / 2),
                 width: W, height: H, borderRadius: 10, overflow: 'hidden',
                 border: '1px solid rgba(185,134,11,0.25)',
                 willChange: 'transform, opacity, filter',
               }}>
            <img src={`/screenshots/${file}`} alt={name} draggable={false}
                 style={{ display: 'block', width: '100%', height: '100%',
                          objectFit: 'cover', objectPosition: 'top', pointerEvents: 'none' }} />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div ref={dotsRef} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {SLIDES.map((_, i) => (
          <div key={i} data-dot={i}
               onClick={() => { target.current = i }}
               style={{
                 width: 7, height: 7, borderRadius: '50%', cursor: 'pointer',
                 background: i === 0 ? '#C9A028' : 'rgba(185,134,11,0.3)',
                 transform: i === 0 ? 'scale(1.4)' : 'scale(1)',
                 transition: 'background 200ms, transform 200ms',
               }} />
        ))}
      </div>

      {/* Hint */}
      <span style={{ color: 'rgba(185,134,11,0.45)', fontSize: 11,
                     fontFamily: 'var(--font-body)', letterSpacing: '0.3px' }}>
        arraste para explorar
      </span>
    </div>
  )
}
