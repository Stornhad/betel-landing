import { useRef, useEffect } from 'react'

const SLIDES = [
  { name: 'Patrimônio',   file: 'patrimonio.png' },
  { name: 'Dashboard',    file: 'dashboard.png' },
  { name: 'Fluxo',        file: 'Fluxo.png' },
  { name: 'Metas',        file: 'metas.png' },
  { name: 'José em ação', file: 'joseemacao.png' },
]
const N        = SLIDES.length
const JOSE_IDX = 4      // único slide com dimensões expandidas
const W        = 480    // largura padrão
const H        = 310    // altura padrão
const W_JOSE   = 620    // largura expandida (José centralizado)
const H_JOSE   = 400    // altura expandida
const X_STEP   = 340
const DRAG_DIV = 380
const HOVER_V  = 0.012

function lerp(a, b, t) { return a + (b - a) * t }

function cardStyle(offset, mobile, isJose) {
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

  // Dimensão dinâmica: José interpola de 620×400 (centro) para 480×310 (offset=1)
  const t_size   = Math.min(abs, 1)
  const cardW    = isJose ? Math.round(lerp(W_JOSE, W, t_size)) : W
  const cardH    = isJose ? Math.round(lerp(H_JOSE, H, t_size)) : H

  return {
    transform:     `${prefix}translateX(${x}px) rotateY(${rotY}deg) scale(${scale})`,
    filter:        `brightness(${brightness})`,
    opacity:       String(fade),
    zIndex:        String(Math.round(10 - abs * 3)),
    boxShadow:     shadow,
    pointerEvents: abs < 1.5 ? 'auto' : 'none',
    width:         `${cardW}px`,
    height:        `${cardH}px`,
    marginLeft:    `${-cardW / 2}px`,
    marginTop:     `${-cardH / 2}px`,
  }
}

export default function CarouselGaleria() {
  const sceneRef    = useRef(null)
  const dotsRef     = useRef(null)
  const progress    = useRef(0)
  const target      = useRef(0)
  const dragging    = useRef(false)
  const dragX0      = useRef(0)
  const dragProg0   = useRef(0)
  const hoverActive = useRef(false)
  const hoverDir    = useRef(0)
  const rafRef      = useRef(null)

  function applyFrame(prog) {
    if (!sceneRef.current) return
    const mobile = window.innerWidth < 768
    sceneRef.current.querySelectorAll('[data-slide]').forEach((el, i) => {
      let off = ((i - prog) % N + N) % N
      if (off > N / 2) off -= N
      Object.assign(el.style, cardStyle(off, mobile, i === JOSE_IDX))
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
      if (hoverActive.current && !dragging.current) {
        target.current = ((target.current + hoverDir.current * HOVER_V) % N + N) % N
      }
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
    if (dragging.current) {
      target.current = dragProg0.current + (e.clientX - dragX0.current) / DRAG_DIV
      return
    }
    const rect = e.currentTarget.getBoundingClientRect()
    hoverDir.current    = e.clientX - rect.left > rect.width / 2 ? 1 : -1
    hoverActive.current = true
  }
  function onMouseUp() {
    if (dragging.current) { dragging.current = false; snap() }
  }
  function onMouseLeave() {
    if (dragging.current) { dragging.current = false; snap() }
    hoverActive.current = false
    hoverDir.current    = 0
    snap()
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

      {/* Cena — altura extra para acomodar José 400px + sombra */}
      <div ref={sceneRef}
           style={{ position: 'relative', height: 460, width: '100%', overflow: 'hidden',
                    cursor: 'grab', userSelect: 'none' }}
           onMouseDown={onMouseDown}
           onMouseMove={onMouseMove}
           onMouseUp={onMouseUp}
           onMouseLeave={onMouseLeave}
           onTouchStart={onTouchStart}
           onTouchMove={onTouchMove}
           onTouchEnd={onTouchEnd}>
        {SLIDES.map(({ name, file }, i) => (
          <div key={name} data-slide={i}
               style={{
                 position: 'absolute', top: '50%', left: '50%',
                 marginLeft: -(W / 2), marginTop: -(H / 2),
                 width: W, height: H,
                 borderRadius: 10, overflow: 'hidden',
                 background: '#0A0A0A',
                 border: '1px solid rgba(185,134,11,0.25)',
                 willChange: 'transform, opacity, filter, width, height',
               }}>
            <img src={`/screenshots/${file}`} alt={name} draggable={false}
                 style={{ display: 'block', width: '100%', height: '100%',
                          objectFit: 'contain', objectPosition: 'center',
                          pointerEvents: 'none' }} />
          </div>
        ))}
      </div>

      {/* Dots — 5 */}
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
        passe o cursor ou arraste para explorar
      </span>
    </div>
  )
}
