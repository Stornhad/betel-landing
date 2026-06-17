const PILLARS = [
  {
    name: 'Casa',
    desc: 'Gestão patrimonial e financeira da família, com visão de longo prazo.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M3 12L12 3l9 9" /><path d="M9 21V12h6v9" /><path d="M3 12v9h18v-9" />
      </svg>
    ),
  },
  {
    name: 'Altar',
    desc: 'Propósito, valores e legado espiritual como fundação de todas as decisões.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M12 2v10M7 7l5-5 5 5" /><rect x="4" y="12" width="16" height="3" rx="1" /><path d="M6 15v5h12v-5" />
      </svg>
    ),
  },
  {
    name: 'Obra',
    desc: 'Construção técnica contínua — sistemas, automações e inteligência operacional.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    name: 'Herança',
    desc: 'Transmissão de conhecimento, metodologia e patrimônio para as próximas gerações.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

const AGENTS = [
  { name: 'JOSÉ',    role: 'Provisão, Legado & Visão de Vida',                   initial: 'J' },
  { name: 'DANIEL',  role: 'Trading Quantitativo & Discernimento de Mercado',    initial: 'D' },
  { name: 'BEZALEL', role: 'Construção Técnica & Desenvolvimento',               initial: 'B' },
  { name: 'CALEB',   role: 'Análise, Discernimento & Mentoria',                  initial: 'C' },
];

const STACK = [
  { name: 'React',        desc: 'Frontend' },
  { name: 'Supabase',     desc: 'Backend & Auth' },
  { name: 'Vercel',       desc: 'Deploy & Edge' },
  { name: 'AWS Bedrock',  desc: 'IA & LLMs' },
];

const Divider = () => (
  <div className="flex items-center gap-4 my-2">
    <div className="flex-1 h-px bg-amber-200" />
    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
    <div className="flex-1 h-px bg-amber-200" />
  </div>
);

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: '#FAFAF6', color: '#1C1A13' }}>

      {/* ── TOPBAR ─────────────────────────────────────────────────── */}
      <header className="border-b" style={{ borderColor: '#EDE8DC' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span
            className="text-xl font-semibold tracking-widest uppercase"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#C09018', letterSpacing: '0.2em' }}
          >
            BETEL
          </span>
          <a
            href="https://betel-patrimonio.vercel.app"
            className="text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 transition-colors"
            style={{ color: '#1C1A13', letterSpacing: '0.1em' }}
          >
            Acessar
          </a>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="pt-24 pb-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: '#C09018', letterSpacing: '0.22em' }}>
            Ecossistema de Agentes de IA
          </p>
          <h1
            className="mb-6 leading-tight"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(3rem, 8vw, 5.5rem)',
              fontWeight: 600,
              color: '#1C1A13',
              letterSpacing: '-0.02em',
            }}
          >
            BETEL
          </h1>
          <p
            className="text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: '#5C5545', fontWeight: 400 }}
          >
            Plataforma de agentes de IA para gestão patrimonial e operacional inteligente
          </p>
          <div className="mt-10 flex flex-col items-center gap-6">
            <div className="w-16 h-px" style={{ background: '#C09018', opacity: 0.5 }} />
            <a
              href="https://betel-patrimonio.vercel.app"
              className="inline-block px-8 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 transition-colors text-sm font-semibold tracking-wider uppercase"
              style={{ color: '#1C1A13', letterSpacing: '0.12em' }}
            >
              Acessar Patrimônio
            </a>
          </div>
        </div>
      </section>

      {/* ── O QUE É ────────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: '#FFFFFF', borderTop: '1px solid #EDE8DC', borderBottom: '1px solid #EDE8DC' }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-10 text-center" style={{ color: '#C09018', letterSpacing: '0.22em' }}>
            O que é
          </p>
          <div className="space-y-5 text-base leading-relaxed" style={{ color: '#5C5545' }}>
            <p>
              BETEL é um ecossistema privado de agentes de inteligência artificial desenvolvido para apoiar decisões patrimoniais, operacionais e estratégicas com profundidade e rastreabilidade.
            </p>
            <p>
              Cada agente opera em um domínio específico — do controle financeiro ao trading quantitativo, do desenvolvimento técnico à análise comercial — trabalhando de forma coordenada sob uma arquitetura unificada de dados e governança.
            </p>
            <p>
              O sistema é construído sobre tecnologia moderna e segura, com dados tratados com privacidade absoluta e decisões documentadas em cada etapa.
            </p>
          </div>
        </div>
      </section>

      {/* ── PILARES ────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-10 text-center" style={{ color: '#C09018', letterSpacing: '0.22em' }}>
            Os Quatro Pilares
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map((p) => (
              <div
                key={p.name}
                className="rounded-xl p-6"
                style={{ background: '#FFFFFF', border: '1px solid #EDE8DC', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <div className="mb-4" style={{ color: '#C09018' }}>{p.icon}</div>
                <h3
                  className="text-xl mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, color: '#1C1A13' }}
                >
                  {p.name}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#8C8070' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGENTES ────────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: '#FFFFFF', borderTop: '1px solid #EDE8DC', borderBottom: '1px solid #EDE8DC' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-10 text-center" style={{ color: '#C09018', letterSpacing: '0.22em' }}>
            Os Agentes
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {AGENTS.map((a) => (
              <div
                key={a.name}
                className="flex items-center gap-4 rounded-xl p-5"
                style={{ background: '#FAFAF6', border: '1px solid #EDE8DC' }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold"
                  style={{ background: '#F3E4B0', color: '#74560E', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.1rem' }}
                >
                  {a.initial}
                </div>
                <div>
                  <div
                    className="text-sm font-semibold tracking-wider"
                    style={{ color: '#1C1A13', letterSpacing: '0.08em' }}
                  >
                    {a.name}
                  </div>
                  <div className="text-xs mt-0.5 leading-relaxed" style={{ color: '#8C8070' }}>{a.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STACK ──────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-10 text-center" style={{ color: '#C09018', letterSpacing: '0.22em' }}>
            Stack Técnica
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {STACK.map((s) => (
              <div
                key={s.name}
                className="rounded-lg px-6 py-4 text-center min-w-[130px]"
                style={{ background: '#FFFFFF', border: '1px solid #EDE8DC', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              >
                <div className="text-sm font-semibold" style={{ color: '#1C1A13' }}>{s.name}</div>
                <div className="text-xs mt-1" style={{ color: '#8C8070' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer
        className="py-10 px-6 text-center"
        style={{ borderTop: '1px solid #EDE8DC', background: '#F5F0E8' }}
      >
        <p className="text-xs tracking-widest uppercase" style={{ color: '#8C8070', letterSpacing: '0.18em' }}>
          Sistema privado — acesso restrito
        </p>
        <p className="text-xs mt-2" style={{ color: '#B0A898' }}>
          © {new Date().getFullYear()} Ecossistema BETEL
        </p>
      </footer>

    </div>
  )
}
