import { useState } from 'react'

const QUESTIONS = [
  {
    q: 'Como você se descreveria hoje?',
    opts: [
      { label: 'Sou empresário ou sócio de negócio',        frag: 'Sou empresário ou sócio de negócio' },
      { label: 'Sou profissional liberal',                   frag: 'Sou profissional liberal' },
      { label: 'Sou executivo ou assalariado de alta renda', frag: 'Sou executivo ou assalariado de alta renda' },
      { label: 'Sou investidor e vivo de renda',            frag: 'Sou investidor e vivo de renda' },
    ],
  },
  {
    q: 'Você tem pessoas que dependem financeiramente de você?',
    opts: [
      { label: 'Tenho cônjuge e filhos que dependem de mim',  frag: 'tenho cônjuge e filhos que dependem de mim' },
      { label: 'Tenho cônjuge que depende de mim',            frag: 'tenho cônjuge que depende de mim' },
      { label: 'Tenho outros familiares que dependem de mim', frag: 'tenho outros familiares que dependem de mim' },
      { label: 'Não tenho dependentes financeiros',           frag: 'não tenho dependentes financeiros' },
    ],
  },
  {
    q: 'O que mais te preocupa quando pensa no seu patrimônio?',
    opts: [
      { label: 'Se minha família estaria protegida se eu não pudesse trabalhar', frag: 'minha maior preocupação é saber se minha família estaria protegida se eu não pudesse trabalhar' },
      { label: 'Para onde vai meu dinheiro e por que não sobra mais',           frag: 'minha maior preocupação é entender para onde vai meu dinheiro e por que não sobra mais' },
      { label: 'Se estou tomando as decisões patrimoniais certas',              frag: 'minha maior preocupação é saber se estou tomando as decisões patrimoniais certas' },
      { label: 'Ter visibilidade real sobre tudo que tenho',                    frag: 'minha maior preocupação é ter visibilidade real sobre tudo que tenho' },
    ],
  },
  {
    q: 'Como você organiza suas finanças hoje?',
    opts: [
      { label: 'Não tenho nenhuma organização formal',                frag: 'Hoje não tenho nenhuma organização formal.' },
      { label: 'Me viro com planilhas e anotações',                   frag: 'Hoje me viro com planilhas e anotações.' },
      { label: 'Tenho assessor ou contador, mas quero mais controle', frag: 'Tenho assessor ou contador, mas quero mais controle.' },
      { label: 'Já tenho estrutura mas quero centralizar tudo',       frag: 'Já tenho estrutura mas quero centralizar tudo.' },
    ],
  },
]

function buildTemplate(frags) {
  const [p1, p2, p3, p4] = frags
  const p3cap = p3.charAt(0).toUpperCase() + p3.slice(1)
  return `${p1}, ${p2}. ${p3cap}. ${p4}\n\nMe ajude a entender onde estou hoje e o que devo olhar primeiro dentro da minha situação.`
}

/* ── Estilos constantes ─────────────────────────────────────── */
const S = {
  label: {
    fontWeight: 600, fontSize: '11px', textTransform: 'uppercase',
    letterSpacing: '3px', color: '#C9A028', margin: '0 0 12px',
  },
  questionTitle: {
    fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '28px',
    color: '#E8D9A0', margin: '0 0 28px', lineHeight: 1.3,
  },
  optCard: (selected) => ({
    background: selected ? '#1f1a0a' : '#1A1A1A',
    border: `0.5px solid ${selected ? '#C9A028' : '#2C2C2A'}`,
    borderRadius: 8, padding: '14px 18px',
    cursor: 'pointer', textAlign: 'left', width: '100%',
    transition: 'border-color 150ms, background 150ms',
    outline: 'none', color: selected ? '#E8D9A0' : '#8C8070',
    fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 400,
    lineHeight: 1.5,
  }),
  textarea: {
    width: '100%', background: '#1A1A1A', border: '0.5px solid #2C2C2A',
    borderRadius: 8, padding: '12px 16px', color: '#E8D9A0',
    fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.6,
    resize: 'vertical', minHeight: 80, outline: 'none',
    boxSizing: 'border-box', marginTop: 16,
    transition: 'border-color 150ms',
  },
  btnPrimary: (disabled) => ({
    background: disabled ? '#4a3a10' : '#C9A028', color: '#0A0A0A',
    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
    textTransform: 'uppercase', letterSpacing: '2px', borderRadius: 4,
    border: 'none', padding: '14px 32px', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1, transition: 'background 150ms',
  }),
  btnSecondary: {
    background: 'transparent', color: '#6B6B6B',
    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
    textTransform: 'uppercase', letterSpacing: '2px', borderRadius: 4,
    border: '0.5px solid #2C2C2A', padding: '14px 24px', cursor: 'pointer',
    transition: 'color 150ms, border-color 150ms',
  },
  dot: (state) => ({
    width: state === 'active' ? 10 : 8,
    height: state === 'active' ? 10 : 8,
    borderRadius: '50%',
    background: state === 'active' ? '#C9A028' : state === 'done' ? '#854F0B' : '#2C2C2A',
    transition: 'all 200ms',
  }),
}

export default function QuizOnboarding() {
  const [step, setStep]           = useState(0)
  const [selections, setSelections] = useState([null, null, null, null])
  const [customs, setCustoms]     = useState(['', '', '', ''])
  const [prompt, setPrompt]       = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [focusedTA, setFocusedTA] = useState(false)

  const currentSel    = selections[step]
  const currentCustom = customs[step]
  const canAdvance    = currentSel !== null || currentCustom.trim() !== ''

  function getFinalFrags() {
    return QUESTIONS.map((q, i) => {
      const custom = customs[i].trim()
      return custom !== '' ? custom : q.opts[selections[i]].frag
    })
  }

  function hasAnyCustom() {
    return customs.some(c => c.trim() !== '')
  }

  async function generatePrompt() {
    const frags = getFinalFrags()

    if (!hasAnyCustom()) {
      const p = buildTemplate(frags)
      localStorage.setItem('betel_onboarding_prompt', p)
      setPrompt(p)
      setStep(4)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res  = await fetch('/api/quiz', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ answers: frags }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro desconhecido')
      localStorage.setItem('betel_onboarding_prompt', data.prompt)
      setPrompt(data.prompt)
      setStep(4)
    } catch {
      setError('Não foi possível gerar seu ponto de partida. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function handleContinue() {
    if (!canAdvance) return
    if (step < 3) {
      setStep(s => s + 1)
    } else {
      generatePrompt()
    }
  }

  function handleBack() {
    if (step > 0) setStep(s => s - 1)
  }

  function handleCTA() {
    const encoded = encodeURIComponent(prompt)
    window.location.href = `https://betel-patrimonio.vercel.app?onboarding_prompt=${encoded}`
  }

  /* ── Tela de resultado ────────────────────────────────────── */
  if (step === 4) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ ...S.label, marginBottom: 20 }}>Sua primeira conversa com o JOSÉ</p>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '32px',
          color: '#E8D9A0', margin: '0 0 32px', lineHeight: 1.3,
        }}>
          Este é o ponto de partida gerado para você
        </h2>

        <div style={{
          background: '#1A1A1A', border: '0.5px solid #2C2C2A',
          borderRadius: 8, padding: '28px 32px', marginBottom: 32, textAlign: 'left',
        }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.85,
            color: '#E8D9A0', margin: 0, whiteSpace: 'pre-wrap',
          }}>
            {prompt}
          </p>
        </div>

        <button
          onClick={handleCTA}
          onMouseEnter={e => e.currentTarget.style.background = '#854F0B'}
          onMouseLeave={e => e.currentTarget.style.background = '#C9A028'}
          style={{ ...S.btnPrimary(false), fontSize: '12px', padding: '18px 48px' }}
        >
          Criar minha conta e começar
        </button>
        <p style={{ fontSize: '12px', color: '#6B6B6B', marginTop: 14 }}>
          7 dias grátis · sem cartão de crédito
        </p>
      </div>
    )
  }

  /* ── Stepper ─────────────────────────────────────────────── */
  const q = QUESTIONS[step]

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>

      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 36 }}>
        {QUESTIONS.map((_, i) => {
          const state = i === step ? 'active' : i < step ? 'done' : 'pending'
          return <span key={i} style={S.dot(state)} />
        })}
      </div>

      {/* Step label */}
      <p style={{ ...S.label, textAlign: 'center' }}>
        Pergunta {step + 1} de {QUESTIONS.length}
      </p>

      {/* Question title */}
      <h2 style={{ ...S.questionTitle, textAlign: 'center' }}>{q.q}</h2>

      {/* Options */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {q.opts.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => {
              const next = [...selections]
              next[step] = idx
              setSelections(next)
            }}
            style={S.optCard(selections[step] === idx)}
            onMouseEnter={e => {
              if (selections[step] !== idx) e.currentTarget.style.borderColor = '#854F0B'
            }}
            onMouseLeave={e => {
              if (selections[step] !== idx) e.currentTarget.style.borderColor = '#2C2C2A'
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Campo livre */}
      <textarea
        placeholder="Prefere descrever com suas palavras?"
        value={currentCustom}
        onChange={e => {
          const next = [...customs]
          next[step] = e.target.value
          setCustoms(next)
        }}
        onFocus={() => setFocusedTA(true)}
        onBlur={() => setFocusedTA(false)}
        style={{
          ...S.textarea,
          borderColor: focusedTA ? '#C9A028' : '#2C2C2A',
        }}
      />

      {/* Error */}
      {error && (
        <p style={{ color: '#c0392b', fontSize: '13px', marginTop: 12, textAlign: 'center' }}>
          {error}
        </p>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, gap: 12 }}>
        <div>
          {step > 0 && (
            <button onClick={handleBack} style={S.btnSecondary}
              onMouseEnter={e => { e.currentTarget.style.color = '#E8D9A0'; e.currentTarget.style.borderColor = '#C9A028' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#6B6B6B'; e.currentTarget.style.borderColor = '#2C2C2A' }}
            >
              Voltar
            </button>
          )}
        </div>

        <button
          onClick={handleContinue}
          disabled={!canAdvance || loading}
          style={S.btnPrimary(!canAdvance || loading)}
          onMouseEnter={e => { if (canAdvance && !loading) e.currentTarget.style.background = '#854F0B' }}
          onMouseLeave={e => { if (canAdvance && !loading) e.currentTarget.style.background = '#C9A028' }}
        >
          {loading ? 'Gerando...' : step < 3 ? 'Continuar' : 'Ver meu resultado'}
        </button>
      </div>
    </div>
  )
}
