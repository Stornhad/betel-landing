import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// GSAP mantido instalado para uso futuro — não ativo no momento
gsap.registerPlugin(ScrollTrigger)

/* ── Estilos reutilizáveis ───────────────────────────────────── */
const SECTION = {
  padding: '120px 60px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
}

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

/* ── Componentes internos ────────────────────────────────────── */
const SectionDivider = () => (
  <div style={{ width: 48, height: 1, background: 'var(--gold-primary)', opacity: 0.6, margin: '0 auto 28px' }} />
)

const PILLARS = [
  { name: 'Casa',    weight: 600, desc: 'Gestão patrimonial e financeira da família, com visão de longo prazo.' },
  { name: 'Altar',   weight: 600, desc: 'Propósito, valores e legado espiritual como fundação de todas as decisões.' },
  { name: 'Obra',    weight: 400, desc: 'Construção técnica contínua. Sistemas, automações e inteligência operacional.' },
  { name: 'Herança', weight: 400, desc: 'Transmissão de conhecimento, metodologia e patrimônio para as próximas gerações.' },
]

const AGENTS = [
  {
    name: 'JOSÉ',
    icon: 'ti ti-wheat',
    role: 'Governança patrimonial',
    desc: 'Governança patrimonial. Autoridade sobre capital, alocação e veto com fundamento registrado.',
  },
  {
    name: 'ISAÍAS',
    icon: 'ti ti-flame',
    role: 'Avaliação independente',
    desc: 'Avaliação de mérito independente. Sem autoridade sobre capital. Fundamento e contexto em cada análise.',
  },
  {
    name: 'DANIEL',
    icon: 'ti ti-crown',
    role: 'Análise quantitativa',
    desc: 'Análise quantitativa e discernimento de mercado. Golden Elephant Project, XAUUSD M2.',
  },
  {
    name: 'BEZALEL',
    icon: 'ti ti-hammer',
    role: 'Construção técnica',
    desc: 'Desenvolvimento e infraestrutura de todos os projetos digitais do ecossistema BETEL.',
  },
]

const GOVERN_CARDS = [
  {
    agent: 'ISAÍAS',
    action: 'Avalia o mérito',
    detail: 'Análise independente da tese. Sem autoridade sobre capital.',
  },
  {
    agent: 'JOSÉ',
    action: 'Decide e veta',
    detail: 'Autoridade sobre capital. Veto registrado com fundamento.',
  },
  {
    agent: 'SISTEMA',
    action: 'Registra com data',
    detail: 'Fundamento permanente. Rastreabilidade que não pode ser apagada.',
  },
]

/* ── App ─────────────────────────────────────────────────────── */
export default function App() {

  useEffect(() => {
    const sections = document.querySelectorAll('.fade-section')

    // prefers-reduced-motion: tornar todas visíveis imediatamente
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sections.forEach(el => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    sections.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ background: 'var(--cream-base)', color: 'var(--text-primary)', overflowX: 'hidden' }}>

      {/* Noise overlay */}
      <svg
        aria-hidden="true"
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', opacity: 0.03, pointerEvents: 'none', zIndex: 9999 }}
      >
        <filter id="betel-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#betel-noise)" />
      </svg>

      {/* ── 0: NAV ─────────────────────────────────────────────── */}
      <header style={{ borderBottom: '1px solid var(--card-border)', background: 'var(--cream-base)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 60px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '20px', color: 'var(--gold-primary)', letterSpacing: '4px', textTransform: 'uppercase' }}>
            BETEL
          </span>
          <a href="https://betel-patrimonio.vercel.app" className="betel-btn betel-btn-nav">
            Acessar
          </a>
        </div>
      </header>

      {/* ── 1: HERO — sem fade, visível imediatamente ──────────── */}
      <section style={{ ...SECTION, padding: '140px 60px 100px', background: 'linear-gradient(to bottom, var(--cream-base), var(--cream-warm))' }}>
        <p style={LABEL}>Sistema privado de governança patrimonial</p>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 300,
          fontSize: '88px',
          letterSpacing: '12px',
          color: 'var(--text-primary)',
          margin: '0 0 24px',
          lineHeight: 1,
        }}>
          BETEL
        </h1>

        <div style={{ width: 48, height: 1, background: 'var(--gold-primary)', opacity: 0.5, margin: '0 auto 24px' }} />

        <p style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          fontSize: '19px',
          color: 'var(--text-secondary)',
          margin: '0 0 36px',
        }}>
          Seu patrimônio. Seus agentes. Suas decisões, documentadas.
        </p>

        <a href="https://betel-patrimonio.vercel.app" className="betel-btn betel-btn-hero">
          Acessar Patrimônio
        </a>

        <div style={{ marginTop: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--gold-primary)' }}>
            scroll
          </span>
          <span className="betel-scroll-arrow" style={{ color: 'var(--gold-primary)', fontSize: '16px', lineHeight: 1 }}>
            ↓
          </span>
        </div>
      </section>

      {/* ── 2: O QUE É ─────────────────────────────────────────── */}
      <section className="fade-section" style={{ ...SECTION, background: '#FFFFFF' }}>
        <SectionDivider />
        <p style={LABEL}>O que é</p>

        <h2 style={{ ...HEADLINE, fontSize: '46px', maxWidth: 640 }}>
          Uma categoria que não existia.
        </h2>

        <div style={{ maxWidth: 600, textAlign: 'left' }}>
          <p style={{ fontWeight: 400, fontSize: '16px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Apps de gestão patrimonial mostram o que aconteceu.<br />
            O BETEL participa do que vai acontecer.
          </p>
          <p style={{ fontWeight: 400, fontSize: '16px', lineHeight: 1.85, color: 'var(--text-secondary)', margin: 0 }}>
            Agentes especializados com domínios definidos. Decisões documentadas com data e fundamento. Governança que separa quem avalia de quem decide. Seus dados nunca saem do seu controle.
          </p>
        </div>
      </section>

      {/* ── 3: GOVERNANÇA ──────────────────────────────────────── */}
      <section className="fade-section" style={{ ...SECTION, background: 'var(--cream-warm)' }}>
        <SectionDivider />
        <p style={LABEL}>Governança</p>

        <h2 style={{ ...HEADLINE, maxWidth: 560 }}>
          Do insight à alocação, com rastreabilidade completa.
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 760 }}>
          {GOVERN_CARDS.flatMap((c, i) => {
            const card = (
              <div key={c.agent} style={{ background: '#FFFFFF', border: '1px solid var(--card-border)', borderRadius: 8, padding: '22px 14px', minWidth: 190, flex: '1 1 190px', maxWidth: 220 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: 'var(--gold-primary)', margin: '0 0 6px' }}>
                  {c.agent}
                </p>
                <p style={{ fontWeight: 600, fontSize: '11px', color: 'var(--text-primary)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {c.action}
                </p>
                <p style={{ fontWeight: 400, fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {c.detail}
                </p>
              </div>
            )
            const arrow = i < GOVERN_CARDS.length - 1
              ? <span key={`arrow-${i}`} style={{ color: 'var(--gold-primary)', fontSize: '15px', flexShrink: 0 }}>→</span>
              : null
            return arrow ? [card, arrow] : [card]
          })}
        </div>
      </section>

      {/* ── 4: OS QUATRO PILARES ───────────────────────────────── */}
      <section className="fade-section" style={{ ...SECTION, background: '#FFFFFF' }}>
        <SectionDivider />
        <p style={LABEL}>Os quatro pilares</p>

        <h2 style={HEADLINE}>
          Construído sobre fundações.
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, maxWidth: 860, width: '100%' }}>
          {PILLARS.map((p) => {
            const isPrimary = p.name === 'Casa' || p.name === 'Altar'
            return (
              <div
                key={p.name}
                className="pilar-card"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--card-border)',
                  borderLeft: isPrimary ? '2px solid var(--gold-primary)' : '1px solid var(--card-border)',
                  borderRadius: isPrimary ? '0 8px 8px 0' : '8px',
                  minHeight: 120,
                }}
              >
                <div
                  className="pilar-name"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 120, padding: '16px 14px' }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: p.weight, fontSize: '22px', color: 'var(--text-primary)' }}>
                    {p.name}
                  </span>
                </div>
                <div className="pilar-desc">
                  <p style={{ fontWeight: 400, fontSize: '12px', lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>
                    {p.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 5: OS AGENTES ──────────────────────────────────────── */}
      <section className="fade-section" style={{ ...SECTION, background: 'var(--cream-warm)' }}>
        <SectionDivider />
        <p style={LABEL}>Os agentes</p>

        <h2 style={HEADLINE}>
          Cada domínio tem um responsável.
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, maxWidth: 540, width: '100%' }}>
          {AGENTS.map((a) => (
            <div
              key={a.name}
              className="agent-card"
              style={{ background: '#FFFFFF', border: '1px solid var(--card-border)', borderRadius: 8, padding: 22, minHeight: 84 }}
            >
              <div className="agent-content">
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--gold-light)', color: 'var(--gold-dark)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className={a.icon} style={{ fontSize: '20px' }} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-primary)', marginBottom: 2 }}>
                    {a.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {a.role}
                  </div>
                </div>
              </div>
              <div className="agent-desc">
                <p style={{ fontSize: '11px', fontWeight: 400, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {a.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6: PRIVACIDADE ─────────────────────────────────────── */}
      <section className="fade-section" style={{ ...SECTION, background: '#FFFFFF' }}>
        <SectionDivider />
        <p style={LABEL}>Privacidade</p>

        <h2 style={{ ...HEADLINE, maxWidth: 560 }}>
          Seus dados não alimentam nenhum produto.
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {[
            'Nenhuma corretora tem acesso.',
            'Nenhum anúncio usa o que é seu.',
            'Nenhum algoritmo de terceiro aprende com suas decisões.',
          ].map((s) => (
            <p key={s} style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '21px', color: 'var(--text-secondary)', margin: 0 }}>
              {s}
            </p>
          ))}
        </div>

        <p style={{ fontWeight: 400, fontSize: '16px', color: 'var(--text-secondary)', maxWidth: 480, margin: 0 }}>
          O BETEL roda na sua infraestrutura, com suas credenciais, sob suas regras.
        </p>
      </section>

      {/* ── FOOTER — sem fade, sempre visível ──────────────────── */}
      <footer style={{ background: 'var(--text-primary)', padding: '40px 60px', textAlign: 'center' }}>
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
