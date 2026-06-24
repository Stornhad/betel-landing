import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Code-split: Three.js carrega assíncrono, fora do bundle inicial
const ThreeBackground = lazy(() => import('./ThreeBackground'))
import CarouselGaleria from './CarouselGaleria'

gsap.registerPlugin(ScrollTrigger)

/* ── Estilos reutilizáveis ───────────────────────────────────── */
const LABEL = {
  fontWeight: 600,
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '3px',
  color: 'var(--gold-primary)',
  margin: '0 0 16px',
}

const HEADLINE = {
  fontFamily: 'var(--font-display)',
  fontWeight: 400,
  fontSize: '42px',
  color: 'var(--text-primary)',
  margin: '0 0 32px',
  lineHeight: 1.15,
}

const SectionDivider = ({ className = '' }) => (
  <div className={className} style={{ width: 48, height: 1, background: 'var(--gold-primary)', opacity: 0.6, margin: '0 auto 28px' }} />
)

/* ── Dados ───────────────────────────────────────────────────── */
const PILLARS = [
  { name: 'Casa',    weight: 600, desc: 'Gestão patrimonial e financeira da família, com visão de longo prazo.' },
  { name: 'Altar',   weight: 600, desc: 'Propósito, valores e legado espiritual como fundação de todas as decisões.' },
  { name: 'Obra',    weight: 400, desc: 'Construção técnica contínua. Sistemas, automações e inteligência operacional.' },
  { name: 'Herança', weight: 400, desc: 'Transmissão de conhecimento, metodologia e patrimônio para as próximas gerações.' },
]

const AGENTS = [
  { name: 'JOSÉ',    icon: 'ti ti-wheat',  role: 'Provisão e Legado',       desc: 'Governança patrimonial. Autoridade sobre capital, alocação e veto com fundamento registrado.' },
  { name: 'ISAÍAS',  icon: 'ti ti-flame',  role: 'Análise de Teses',        desc: 'Avaliação de mérito independente. Sem autoridade sobre capital. Fundamento e contexto em cada análise.' },
  { name: 'DANIEL',  icon: 'ti ti-crown',  role: 'Trading Quantitativo',    desc: 'Análise quantitativa e discernimento de mercado. Construção de estratégias sistemáticas.' },
  { name: 'BEZALEL', icon: 'ti ti-hammer', role: 'Construção Técnica',      desc: 'Desenvolvimento e infraestrutura de todos os projetos digitais do ecossistema BETEL.' },
]

const GOVERN_CARDS = [
  { agent: 'ISAÍAS',  action: 'Avalia o mérito',   detail: 'Análise independente da tese. Sem autoridade sobre capital.',         dir: 'from-left' },
  { agent: 'JOSÉ',    action: 'Decide e veta',     detail: 'Autoridade sobre capital. Veto registrado com fundamento.',           dir: 'from-bottom' },
  { agent: 'SISTEMA', action: 'Registra com data', detail: 'Fundamento permanente. Rastreabilidade que não pode ser apagada.',    dir: 'from-right' },
]

const PRIVACY_PHRASES = [
  'Nenhuma corretora tem acesso.',
  'Nenhum anúncio usa o que é seu.',
  'Nenhum algoritmo de terceiro aprende com suas decisões.',
]

/* ── App ─────────────────────────────────────────────────────── */
export default function App() {
  const scrollProgressRef = useRef(0)
  const scrollLineRef = useRef(null)
  // Decide modo imersivo: 3D só em desktop sem reduced-motion
  const [immersive] = useState(() =>
    typeof window !== 'undefined' &&
    window.innerWidth >= 768 &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    // Linha de progresso + alimentação do scroll para a cena 3D
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      scrollProgressRef.current = p
      if (scrollLineRef.current) scrollLineRef.current.style.height = (p * 100) + 'vh'
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    const scenes = gsap.utils.toArray('.scene')

    // Sem modo imersivo (mobile / reduced-motion): tudo visível, sem pin
    if (!immersive) {
      scenes.forEach(el => el.classList.add('in'))
      return () => window.removeEventListener('scroll', handleScroll)
    }

    // Modo imersivo: pin por seção + revelação no enter
    const triggers = []
    gsap.utils.toArray('[data-pin]').forEach(section => {
      const isScene = section.classList.contains('scene')
      triggers.push(ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: true,
        onEnter:     () => isScene && section.classList.add('in'),
        onEnterBack: () => isScene && section.classList.add('in'),
      }))
    })

    ScrollTrigger.refresh()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      triggers.forEach(t => t.kill())
    }
  }, [immersive])

  const sectionBase = {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    minHeight: immersive ? '100vh' : 'auto',
    padding: immersive ? '0 60px' : '80px 60px',
  }

  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>

      {/* Cena 3D (desktop) ou gradiente CSS (mobile / reduced-motion) */}
      {immersive ? (
        <Suspense fallback={null}>
          <ThreeBackground scrollProgressRef={scrollProgressRef} />
        </Suspense>
      ) : (
        <div className="mobile-bg" aria-hidden="true" />
      )}

      {/* Linha de progresso vertical */}
      <div
        ref={scrollLineRef}
        style={{
          position: 'fixed', left: 0, top: 0, width: 3, height: 0,
          background: 'linear-gradient(to bottom, transparent, var(--gold-primary), transparent)',
          zIndex: 99, pointerEvents: 'none',
        }}
      />

      {/* ── NAV (fixed) ────────────────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '0.5px solid rgba(184,134,11,0.15)',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 60px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '20px',
            color: 'var(--gold-primary)', letterSpacing: '4px', textTransform: 'uppercase',
            opacity: 0, animation: 'fadeIn 1s 0.5s forwards',
          }}>
            BETEL
          </span>
          <a href="https://betel-patrimonio.vercel.app" className="betel-btn betel-btn-nav" style={{ opacity: 0, animation: 'fadeIn 1s 0.7s forwards' }}>
            Acessar
          </a>
        </div>
      </header>

      {/* ── 1: HERO ────────────────────────────────────────────── */}
      <section data-pin style={sectionBase}>
        <p style={{ ...LABEL, opacity: 0, animation: 'slideUp 0.8s 0.3s forwards' }}>
          Sistema privado de governança patrimonial
        </p>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '96px',
          letterSpacing: '16px', color: 'var(--gold-light)', margin: '0 0 24px', lineHeight: 1,
        }}>
          {'BETEL'.split('').map((letter, i) => (
            <span key={i} style={{ display: 'inline-block', opacity: 0, animation: `letterReveal 0.6s ${0.6 + i * 0.12}s forwards` }}>
              {letter}
            </span>
          ))}
        </h1>

        <div style={{ width: 0, height: 1, background: 'var(--gold-primary)', margin: '0 auto 24px', animation: 'lineExpand 0.8s 1.3s forwards' }} />

        <p style={{
          fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '19px',
          color: 'var(--text-secondary)', margin: '0 0 36px',
          opacity: 0, animation: 'fadeIn 1s 1.6s forwards',
        }}>
          Seu patrimônio. Seus agentes. Suas decisões, documentadas.
        </p>

        <a href="https://betel-patrimonio.vercel.app" className="betel-btn betel-btn-hero" style={{ opacity: 0, animation: 'slideUp 0.8s 1.9s forwards' }}>
          Acessar Patrimônio
        </a>

        <div style={{ marginTop: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0, animation: 'fadeIn 1s 2.4s forwards' }}>
          <span style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--gold-primary)' }}>scroll</span>
          <i className="ti ti-chevron-down betel-scroll-arrow" style={{ color: 'var(--gold-primary)', fontSize: '16px' }} />
        </div>
      </section>

      {/* ── LEGADO — Por que BETEL ─────────────────────────────── */}
      <section data-pin className="scene" style={sectionBase}>
        <SectionDivider className="reveal" />

        <h2
          className="reveal reveal-delay-1"
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(26px, 4vw, 36px)',
            color: '#E8D9A0',
            margin: '0 0 40px',
            lineHeight: 1.3,
            maxWidth: 600,
            textAlign: 'center',
          }}
        >
          "Se algo mudar amanhã, sua família sabe o que fazer com o que você construiu até hoje?"
        </h2>

        <div
          className="reveal reveal-delay-2"
          style={{ maxWidth: 560, textAlign: 'center', fontFamily: 'var(--font-body)' }}
        >
          <p style={{ fontWeight: 300, fontSize: '15px', lineHeight: 1.85, color: 'rgba(232,217,160,0.65)', marginBottom: 20 }}>
            A maioria dos pais cuida bem. Trabalha, provê, planeja. Mas poucos têm clareza real sobre o próprio patrimônio —{' '}
            <span style={{ color: 'rgba(232,217,160,0.90)' }}>
              onde está, o que vence, o que protege, o que vai durar além deles.
            </span>
          </p>
          <p style={{ fontWeight: 300, fontSize: '15px', lineHeight: 1.85, color: 'rgba(232,217,160,0.65)', marginBottom: 20 }}>
            Não por negligência. Por falta de um sistema que pense junto.
          </p>
          <p style={{ fontWeight: 300, fontSize: '15px', lineHeight: 1.85, color: 'rgba(232,217,160,0.65)', marginBottom: 40 }}>
            BETEL é esse sistema. Um ecossistema de agentes com escopo e autoridade definidos, construído sobre quatro pilares: o que você vive, o que você crê, o que você constrói e o que você deixa.
          </p>
        </div>

        <div
          className="reveal reveal-delay-3"
          style={{
            maxWidth: 480,
            textAlign: 'left',
            borderLeft: '2px solid rgba(184,134,11,0.40)',
            paddingLeft: 24,
            margin: '0 auto 40px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: '18px',
              color: '#E8D9A0',
              lineHeight: 1.7,
              margin: '0 0 14px',
            }}
          >
            <span style={{ display: 'block' }}>"Fidelidade no pouco antecede autoridade no muito.</span>
            <span style={{ display: 'block' }}>Gestão do presente determina o futuro."</span>
          </p>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'var(--gold-primary)',
              opacity: 0.6,
              margin: 0,
            }}
          >
            Lucas 16:10
          </p>
        </div>

        <SectionDivider className="reveal reveal-delay-4" />
      </section>

      {/* ── 2: O QUE É ─────────────────────────────────────────── */}
      <section data-pin className="scene" style={sectionBase}>
        <SectionDivider className="reveal" />
        <p className="reveal reveal-delay-1" style={LABEL}>O que é</p>
        <h2 className="reveal reveal-delay-2" style={{ ...HEADLINE, fontSize: '48px', maxWidth: 640 }}>
          Uma categoria que não existia.
        </h2>
        <div className="reveal reveal-delay-3" style={{ maxWidth: 600, textAlign: 'left' }}>
          <p style={{ fontWeight: 400, fontSize: '16px', lineHeight: 1.85, color: 'var(--text-muted)', marginBottom: '20px' }}>
            Apps de gestão patrimonial mostram o que aconteceu.<br />
            O BETEL participa do que vai acontecer.
          </p>
          <p style={{ fontWeight: 400, fontSize: '16px', lineHeight: 1.85, color: 'var(--text-muted)', margin: 0 }}>
            Agentes especializados com domínios definidos. Decisões documentadas com data e fundamento. Governança que separa quem avalia de quem decide. Seus dados nunca saem do seu controle.
          </p>
        </div>
      </section>

      {/* ── 3: GOVERNANÇA ──────────────────────────────────────── */}
      <section data-pin className="scene" style={sectionBase}>
        <SectionDivider className="reveal" />
        <p className="reveal reveal-delay-1" style={LABEL}>Governança</p>
        <h2 className="reveal reveal-delay-2" style={{ ...HEADLINE, maxWidth: 560 }}>
          Do insight à alocação, com rastreabilidade completa.
        </h2>
        <div className="govern-container" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 760 }}>
          {GOVERN_CARDS.flatMap((c, i) => {
            const card = (
              <div key={c.agent} className={`glass-card ${c.dir}`} style={{ padding: '22px 14px', minWidth: 190, flex: '1 1 190px', maxWidth: 220 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '16px', color: 'var(--gold-primary)', margin: '0 0 6px' }}>{c.agent}</p>
                <p style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-primary)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{c.action}</p>
                <p style={{ fontWeight: 400, fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{c.detail}</p>
              </div>
            )
            const arrow = i < GOVERN_CARDS.length - 1
              ? <span key={`arrow-${i}`} className="reveal reveal-delay-3 govern-arrow" style={{ color: 'var(--gold-primary)', fontSize: '15px', flexShrink: 0 }}>→</span>
              : null
            return arrow ? [card, arrow] : [card]
          })}
        </div>
      </section>

      {/* ── 4: OS QUATRO PILARES ───────────────────────────────── */}
      <section data-pin className="scene" style={sectionBase}>
        <SectionDivider className="reveal" />
        <p className="reveal reveal-delay-1" style={LABEL}>Os quatro pilares</p>
        <h2 className="reveal reveal-delay-2" style={HEADLINE}>Construído sobre fundações.</h2>
        <div className="pilar-grid" style={{ display: 'grid', gap: 14, maxWidth: 860, width: '100%' }}>
          {PILLARS.map((p, idx) => {
            const isPrimary = p.name === 'Casa' || p.name === 'Altar'
            return (
              <div
                key={p.name}
                className={`glass-card pilar-card reveal reveal-delay-${idx + 1}`}
                style={{
                  borderLeft: isPrimary ? '2px solid var(--gold-primary)' : '1px solid var(--glass-border)',
                  borderRadius: isPrimary ? '0 8px 8px 0' : '8px',
                  minHeight: 120,
                }}
              >
                <div className="pilar-name" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 120, padding: '16px 14px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: p.weight, fontSize: '22px', color: 'var(--text-primary)' }}>{p.name}</span>
                </div>
                <div className="pilar-desc">
                  <p style={{ fontWeight: 400, fontSize: '12px', lineHeight: 1.65, color: 'var(--text-muted)', margin: 0 }}>{p.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── GALERIA — O sistema por dentro ────────────────────── */}
      <section data-pin className="scene" style={sectionBase}>
        <SectionDivider className="reveal" />
        <h2 className="reveal reveal-delay-1" style={{
          fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 400,
          color: '#C9A028', margin: '0 0 40px', letterSpacing: '0.01em',
        }}>
          O sistema por dentro
        </h2>
        <div className="reveal reveal-delay-2" style={{ width: '100%', maxWidth: 960 }}>
          <CarouselGaleria />
        </div>
        <SectionDivider className="reveal reveal-delay-3" style={{ marginTop: 40 }} />
      </section>

      {/* ── 5: OS AGENTES ──────────────────────────────────────── */}
      <section data-pin className="scene" style={sectionBase}>
        <SectionDivider className="reveal" />
        <p className="reveal reveal-delay-1" style={LABEL}>Os agentes</p>
        <h2 className="reveal reveal-delay-2" style={HEADLINE}>Cada domínio tem um responsável.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, maxWidth: 540, width: '100%' }}>
          {AGENTS.map((a, idx) => (
            <div key={a.name} className={`glass-card agent-card reveal reveal-delay-${idx + 1}`} style={{ padding: 22, minHeight: 84 }}>
              <div className="agent-content">
                <div style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: 'rgba(232,217,160,0.15)', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={a.icon} style={{ fontSize: '20px' }} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-primary)', marginBottom: 2 }}>{a.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{a.role}</div>
                </div>
              </div>
              <div className="agent-desc">
                <p style={{ fontSize: '11px', fontWeight: 400, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6: PRIVACIDADE ─────────────────────────────────────── */}
      <section data-pin className="scene" style={sectionBase}>
        <SectionDivider className="reveal" />
        <p className="reveal reveal-delay-1" style={LABEL}>Privacidade</p>
        <h2 className="reveal reveal-delay-2" style={{ ...HEADLINE, maxWidth: 560 }}>
          Seus dados não alimentam nenhum produto.
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {PRIVACY_PHRASES.map((s) => (
            <p key={s} className="reveal-lateral" style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '22px', color: 'var(--text-muted)', margin: 0 }}>
              {s}
            </p>
          ))}
        </div>
        <p className="reveal reveal-delay-3" style={{ fontWeight: 400, fontSize: '16px', color: 'var(--text-muted)', maxWidth: 480, margin: 0 }}>
          O BETEL roda na sua infraestrutura, com suas credenciais, sob suas regras.
        </p>
      </section>

      {/* ── FOOTER (scroll normal) ─────────────────────────────── */}
      <footer style={{ position: 'relative', zIndex: 1, background: 'var(--bg-top)', padding: '40px 60px', textAlign: 'center' }}>
        <p style={{ fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--gold-light)', margin: '0 0 8px' }}>
          Sistema privado. Acesso restrito.
        </p>
        <p style={{ fontWeight: 400, fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
          &copy; {new Date().getFullYear()} Ecossistema BETEL
        </p>
      </footer>

    </div>
  )
}
